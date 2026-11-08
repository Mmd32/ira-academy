import { randomBytes, randomInt } from 'node:crypto';

import { cookies } from 'next/headers';

import { hashPassword, verifyPassword } from './auth';
import { db } from './db';

/**
 * Student accounts, their sign-in, and the groups exams are assigned to.
 *
 * Students sign in with their mobile number and a password an admin gave
 * them. The session is its own cookie and its own table, so a student's
 * session can never be mistaken for an admin's.
 */

const COOKIE = 'ira_student';
const SESSION_DAYS = 30;

export type Student = {
  id: number;
  phone: string;
  name: string;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  groupIds: number[];
};

export type Group = {
  id: number;
  name: string;
  note: string;
  createdAt: string;
  memberCount: number;
};

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** "۰۹۱۲ ۱۲۳-۴۵۶۷" and "+98 912 123 4567" both become "09121234567". */
export function normalizePhone(raw: string): string {
  let digits = '';
  for (const ch of raw) {
    const p = PERSIAN_DIGITS.indexOf(ch);
    const a = ARABIC_DIGITS.indexOf(ch);
    if (p >= 0) digits += String(p);
    else if (a >= 0) digits += String(a);
    else if (ch >= '0' && ch <= '9') digits += ch;
  }
  if (digits.startsWith('0098')) digits = digits.slice(4);
  else if (digits.startsWith('98') && digits.length >= 12) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('9')) digits = `0${digits}`;
  return digits;
}

export function isValidPhone(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

// No 0/O/1/l/I, so a password read over the phone is not misheard.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

export function generatePassword(length = 8): string {
  let out = '';
  for (let i = 0; i < length; i += 1) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

function toStudent(r: Record<string, unknown>, groupIds: number[]): Student {
  return {
    id: Number(r.id),
    phone: String(r.phone),
    name: String(r.name),
    active: Number(r.active) === 1,
    createdAt: String(r.created_at),
    lastLoginAt: r.last_login_at ? String(r.last_login_at) : null,
    groupIds,
  };
}

function groupIdsByStudent(): Map<number, number[]> {
  const rows = db().prepare(`SELECT group_id, student_id FROM group_members`).all() as {
    group_id: number;
    student_id: number;
  }[];
  const map = new Map<number, number[]>();
  for (const r of rows) map.set(r.student_id, [...(map.get(r.student_id) ?? []), r.group_id]);
  return map;
}

export function listStudents(): Student[] {
  const rows = db().prepare(`SELECT * FROM students ORDER BY created_at DESC, id DESC`).all() as Record<
    string,
    unknown
  >[];
  const groups = groupIdsByStudent();
  return rows.map((r) => toStudent(r, groups.get(Number(r.id)) ?? []));
}

export function getStudent(id: number): Student | undefined {
  const row = db().prepare(`SELECT * FROM students WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined;
  if (!row) return undefined;
  const ids = db().prepare(`SELECT group_id FROM group_members WHERE student_id = ?`).all(id) as {
    group_id: number;
  }[];
  return toStudent(row, ids.map((g) => g.group_id));
}

export type CreateResult =
  | { ok: true; id: number; phone: string; name: string; password: string }
  | { ok: false; phone: string; name: string; error: string };

/** Creates one student. A blank password is generated and returned once. */
export function createStudent(input: {
  phone: string;
  name: string;
  password?: string;
}): CreateResult {
  const phone = normalizePhone(input.phone);
  const name = input.name.trim().slice(0, 120);

  if (!isValidPhone(phone)) {
    return { ok: false, phone: input.phone, name, error: 'شماره‌ی موبایل درست نیست' };
  }
  if (!name) return { ok: false, phone, name, error: 'نام خالی است' };

  const exists = db().prepare(`SELECT id FROM students WHERE phone = ?`).get(phone);
  if (exists) return { ok: false, phone, name, error: 'این شماره قبلاً ثبت شده' };

  const password = (input.password ?? '').trim() || generatePassword();
  if (password.length < 6) return { ok: false, phone, name, error: 'رمز باید حداقل ۶ نویسه باشد' };

  const info = db()
    .prepare(
      `INSERT INTO students (phone, name, password_hash, active, created_at) VALUES (?, ?, ?, 1, ?)`,
    )
    .run(phone, name, hashPassword(password), new Date().toISOString());

  return { ok: true, id: Number(info.lastInsertRowid), phone, name, password };
}

export function updateStudent(id: number, patch: { name: string; phone: string; active: boolean }) {
  const phone = normalizePhone(patch.phone);
  if (!isValidPhone(phone)) return 'شماره‌ی موبایل درست نیست';
  if (!patch.name.trim()) return 'نام خالی است';

  const clash = db().prepare(`SELECT id FROM students WHERE phone = ? AND id <> ?`).get(phone, id);
  if (clash) return 'این شماره برای دانش‌پذیر دیگری ثبت شده';

  db()
    .prepare(`UPDATE students SET name = ?, phone = ?, active = ? WHERE id = ?`)
    .run(patch.name.trim().slice(0, 120), phone, patch.active ? 1 : 0, id);

  if (!patch.active) db().prepare(`DELETE FROM student_sessions WHERE student_id = ?`).run(id);
  return null;
}

/** Sets a new password and ends every session the student had. */
export function resetStudentPassword(id: number, password?: string): string {
  const next = (password ?? '').trim() || generatePassword();
  db().prepare(`UPDATE students SET password_hash = ? WHERE id = ?`).run(hashPassword(next), id);
  db().prepare(`DELETE FROM student_sessions WHERE student_id = ?`).run(id);
  return next;
}

export function deleteStudent(id: number) {
  db().prepare(`DELETE FROM students WHERE id = ?`).run(id);
}

/* ------------------------------- sign-in ------------------------------- */

/**
 * Failed-attempt limiter. In memory, which is enough for one server process:
 * it only has to make guessing a 6-character password impractical.
 */
const WINDOW_MS = 15 * 60_000;
const MAX_FAILURES = 8;
const failures = new Map<string, number[]>();

function tooManyFailures(key: string): boolean {
  const now = Date.now();
  const recent = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(key, recent);
  return recent.length >= MAX_FAILURES;
}

function noteFailure(key: string) {
  failures.set(key, [...(failures.get(key) ?? []), Date.now()]);
  if (failures.size > 2000) {
    const now = Date.now();
    failures.forEach((times, k) => {
      if (times.every((t) => now - t >= WINDOW_MS)) failures.delete(k);
    });
  }
}

export type SignInResult = { ok: true } | { ok: false; error: string };

export function studentSignIn(phoneRaw: string, password: string, ip: string): SignInResult {
  const phone = normalizePhone(phoneRaw);
  const key = `${phone}|${ip}`;
  const keyPhone = `phone|${phone}`;

  if (tooManyFailures(key) || tooManyFailures(keyPhone)) {
    return { ok: false, error: 'تلاش‌های ناموفق زیاد بود. ۱۵ دقیقه بعد دوباره امتحان کنید.' };
  }

  const row = db().prepare(`SELECT * FROM students WHERE phone = ?`).get(phone) as
    | { id: number; password_hash: string; active: number }
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    noteFailure(key);
    noteFailure(keyPhone);
    return { ok: false, error: 'شماره یا رمز درست نیست.' };
  }
  if (row.active !== 1) {
    return { ok: false, error: 'این حساب غیرفعال است. با آکادمی تماس بگیرید.' };
  }

  const token = randomBytes(32).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);

  db()
    .prepare(`INSERT INTO student_sessions (token, student_id, created_at, expires_at) VALUES (?, ?, ?, ?)`)
    .run(token, row.id, now.toISOString(), expires.toISOString());
  db().prepare(`UPDATE students SET last_login_at = ? WHERE id = ?`).run(now.toISOString(), row.id);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
  return { ok: true };
}

export function studentSignOut() {
  const token = cookies().get(COOKIE)?.value;
  if (token) db().prepare(`DELETE FROM student_sessions WHERE token = ?`).run(token);
  cookies().delete(COOKIE);
}

/** The signed-in student, or null. */
export function currentStudent(): Student | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;

  const row = db()
    .prepare(
      `SELECT s.*, t.expires_at AS session_expires
         FROM student_sessions t JOIN students s ON s.id = t.student_id
        WHERE t.token = ?`,
    )
    .get(token) as (Record<string, unknown> & { session_expires: string }) | undefined;

  if (!row) return null;
  if (new Date(row.session_expires) < new Date() || Number(row.active) !== 1) {
    db().prepare(`DELETE FROM student_sessions WHERE token = ?`).run(token);
    return null;
  }
  return toStudent(row, []);
}

export function changeOwnPassword(id: number, current: string, next: string): string | null {
  const row = db().prepare(`SELECT password_hash FROM students WHERE id = ?`).get(id) as
    | { password_hash: string }
    | undefined;
  if (!row || !verifyPassword(current, row.password_hash)) return 'رمز فعلی درست نیست.';
  if (next.length < 6) return 'رمز تازه باید حداقل ۶ نویسه باشد.';

  db().prepare(`UPDATE students SET password_hash = ? WHERE id = ?`).run(hashPassword(next), id);
  return null;
}

export function pruneStudentSessions() {
  db().prepare(`DELETE FROM student_sessions WHERE expires_at < ?`).run(new Date().toISOString());
}

/* -------------------------------- groups -------------------------------- */

export function listGroups(): Group[] {
  const rows = db()
    .prepare(
      `SELECT g.*, (SELECT COUNT(*) FROM group_members m WHERE m.group_id = g.id) AS member_count
         FROM student_groups g ORDER BY g.name`,
    )
    .all() as Record<string, unknown>[];
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    note: String(r.note),
    createdAt: String(r.created_at),
    memberCount: Number(r.member_count),
  }));
}

export function getGroup(id: number): Group | undefined {
  return listGroups().find((g) => g.id === id);
}

export function createGroup(name: string, note = ''): { id: number } | { error: string } {
  const clean = name.trim().slice(0, 120);
  if (!clean) return { error: 'نام گروه خالی است' };
  if (db().prepare(`SELECT id FROM student_groups WHERE name = ?`).get(clean)) {
    return { error: 'گروهی با این نام هست' };
  }
  const info = db()
    .prepare(`INSERT INTO student_groups (name, note, created_at) VALUES (?, ?, ?)`)
    .run(clean, note.trim().slice(0, 500), new Date().toISOString());
  return { id: Number(info.lastInsertRowid) };
}

export function updateGroup(id: number, name: string, note: string): string | null {
  const clean = name.trim().slice(0, 120);
  if (!clean) return 'نام گروه خالی است';
  if (db().prepare(`SELECT id FROM student_groups WHERE name = ? AND id <> ?`).get(clean, id)) {
    return 'گروهی با این نام هست';
  }
  db()
    .prepare(`UPDATE student_groups SET name = ?, note = ? WHERE id = ?`)
    .run(clean, note.trim().slice(0, 500), id);
  return null;
}

export function deleteGroup(id: number) {
  db().prepare(`DELETE FROM student_groups WHERE id = ?`).run(id);
}

export function groupMemberIds(groupId: number): number[] {
  return (
    db().prepare(`SELECT student_id FROM group_members WHERE group_id = ?`).all(groupId) as {
      student_id: number;
    }[]
  ).map((r) => r.student_id);
}

/** Replaces a group's members with exactly this list. */
export function setGroupMembers(groupId: number, studentIds: number[]) {
  const d = db();
  d.transaction(() => {
    d.prepare(`DELETE FROM group_members WHERE group_id = ?`).run(groupId);
    const ins = d.prepare(
      `INSERT OR IGNORE INTO group_members (group_id, student_id)
       SELECT ?, id FROM students WHERE id = ?`,
    );
    for (const id of studentIds) ins.run(groupId, id);
  })();
}

export function addStudentsToGroup(groupId: number, studentIds: number[]) {
  const ins = db().prepare(
    `INSERT OR IGNORE INTO group_members (group_id, student_id)
     SELECT ?, id FROM students WHERE id = ?`,
  );
  db().transaction(() => studentIds.forEach((id) => ins.run(groupId, id)))();
}
