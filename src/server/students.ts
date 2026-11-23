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
  /** What the student signs in with. */
  nationalId: string;
  /** Optional contact number; may be empty. */
  phone: string;
  store: string;
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
  orgId: number | null;
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

/** Digits only, Latin: "۰۱۵۱ ۰۸۱۰۲۶" → "0151081026". */
export function toLatinDigits(raw: string): string {
  let out = '';
  for (const ch of raw) {
    const p = PERSIAN_DIGITS.indexOf(ch);
    const a = ARABIC_DIGITS.indexOf(ch);
    if (p >= 0) out += String(p);
    else if (a >= 0) out += String(a);
    else if (ch >= '0' && ch <= '9') out += ch;
  }
  return out;
}

/** An Iranian national ID: ten digits whose last is the check digit of the first nine. */
export function isValidNationalId(id: string): boolean {
  if (!/^\d{10}$/.test(id) || /^(\d)\1{9}$/.test(id)) return false;
  const sum = id
    .slice(0, 9)
    .split('')
    .reduce((n, d, i) => n + Number(d) * (10 - i), 0);
  const r = sum % 11;
  const check = Number(id[9]);
  return r < 2 ? check === r : check === 11 - r;
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
    nationalId: String(r.national_id ?? ''),
    phone: String(r.phone ?? ''),
    store: String(r.store ?? ''),
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
  | { ok: true; id: number; nationalId: string; name: string; password: string }
  | { ok: false; nationalId: string; name: string; error: string };

/** Creates one student. A blank password is generated and returned once. */
export function createStudent(input: {
  nationalId: string;
  name: string;
  phone?: string;
  store?: string;
  password?: string;
}): CreateResult {
  const nationalId = toLatinDigits(input.nationalId);
  const name = input.name.trim().slice(0, 120);
  const fail = (error: string): CreateResult => ({ ok: false, nationalId: input.nationalId.trim(), name, error });

  if (!isValidNationalId(nationalId)) return fail('کد ملی درست نیست');
  if (!name) return fail('نام خالی است');

  const phoneRaw = (input.phone ?? '').trim();
  const phone = phoneRaw ? normalizePhone(phoneRaw) : '';
  if (phone && !isValidPhone(phone)) return fail('شماره‌ی موبایل درست نیست');

  if (db().prepare(`SELECT id FROM students WHERE national_id = ?`).get(nationalId)) return fail('این کد ملی قبلاً ثبت شده');
  if (phone && db().prepare(`SELECT id FROM students WHERE phone = ?`).get(phone)) return fail('این موبایل قبلاً ثبت شده');

  const password = (input.password ?? '').trim() || generatePassword();
  if (password.length < 6) return fail('رمز باید حداقل ۶ نویسه باشد');

  const info = db()
    .prepare(
      `INSERT INTO students (national_id, phone, name, store, password_hash, active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
    )
    .run(nationalId, phone || null, name, (input.store ?? '').trim().slice(0, 120), hashPassword(password), new Date().toISOString());

  return { ok: true, id: Number(info.lastInsertRowid), nationalId, name, password };
}

export function updateStudent(
  id: number,
  patch: { name: string; nationalId: string; phone: string; store: string; active: boolean },
) {
  const nationalId = toLatinDigits(patch.nationalId);
  if (!isValidNationalId(nationalId)) return 'کد ملی درست نیست';
  if (!patch.name.trim()) return 'نام خالی است';
  const phone = patch.phone.trim() ? normalizePhone(patch.phone) : '';
  if (phone && !isValidPhone(phone)) return 'شماره‌ی موبایل درست نیست';

  if (db().prepare(`SELECT id FROM students WHERE national_id = ? AND id <> ?`).get(nationalId, id)) {
    return 'این کد ملی برای دانش‌پذیر دیگری ثبت شده';
  }
  if (phone && db().prepare(`SELECT id FROM students WHERE phone = ? AND id <> ?`).get(phone, id)) {
    return 'این موبایل برای دانش‌پذیر دیگری ثبت شده';
  }

  db()
    .prepare(`UPDATE students SET name = ?, national_id = ?, phone = ?, store = ?, active = ? WHERE id = ?`)
    .run(patch.name.trim().slice(0, 120), nationalId, phone || null, patch.store.trim().slice(0, 120), patch.active ? 1 : 0, id);

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

/** Signs in by national ID; a mobile number set on the account works too. */
export function studentSignIn(identifier: string, password: string, ip: string): SignInResult {
  const digits = toLatinDigits(identifier);
  const phone = normalizePhone(identifier);
  const key = `${digits}|${ip}`;
  const keyPhone = `id|${digits}`;

  if (tooManyFailures(key) || tooManyFailures(keyPhone)) {
    return { ok: false, error: 'تلاش‌های ناموفق زیاد بود. ۱۵ دقیقه بعد دوباره امتحان کنید.' };
  }

  const row = db()
    .prepare(`SELECT * FROM students WHERE national_id = ? OR (phone IS NOT NULL AND phone = ?)`)
    .get(digits, phone) as
    | { id: number; password_hash: string; active: number }
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    noteFailure(key);
    noteFailure(keyPhone);
    return { ok: false, error: 'کد ملی یا رمز درست نیست.' };
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
    orgId: r.org_id == null ? null : Number(r.org_id),
  }));
}

export function getGroup(id: number): Group | undefined {
  return listGroups().find((g) => g.id === id);
}

export function createGroup(name: string, note = '', orgId: number | null = null): { id: number } | { error: string } {
  const clean = name.trim().slice(0, 120);
  if (!clean) return { error: 'نام گروه خالی است' };
  if (db().prepare(`SELECT id FROM student_groups WHERE name = ?`).get(clean)) {
    return { error: 'گروهی با این نام هست' };
  }
  const info = db()
    .prepare(`INSERT INTO student_groups (name, note, org_id, created_at) VALUES (?, ?, ?, ?)`)
    .run(clean, note.trim().slice(0, 500), orgId, new Date().toISOString());
  return { id: Number(info.lastInsertRowid) };
}

export function updateGroup(id: number, name: string, note: string, orgId: number | null): string | null {
  const clean = name.trim().slice(0, 120);
  if (!clean) return 'نام گروه خالی است';
  if (db().prepare(`SELECT id FROM student_groups WHERE name = ? AND id <> ?`).get(clean, id)) {
    return 'گروهی با این نام هست';
  }
  db()
    .prepare(`UPDATE student_groups SET name = ?, note = ?, org_id = ? WHERE id = ?`)
    .run(clean, note.trim().slice(0, 500), orgId, id);
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
  enrollGroupMembers(groupId);
}

export function addStudentsToGroup(groupId: number, studentIds: number[]) {
  const ins = db().prepare(
    `INSERT OR IGNORE INTO group_members (group_id, student_id)
     SELECT ?, id FROM students WHERE id = ?`,
  );
  db().transaction(() => studentIds.forEach((id) => ins.run(groupId, id)))();
  enrollGroupMembers(groupId);
}

/* ----------------------------- organisations ---------------------------- */

export type Org = {
  id: number;
  name: string;
  prefix: string;
  note: string;
  createdAt: string;
  memberCount: number;
};

export type StudentCode = { orgId: number; orgName: string; code: string };

/** 2 to 5 Latin letters, stored upper-case: the front of every code. */
export function normalizePrefix(raw: string): string {
  return raw.trim().toUpperCase();
}

export function isValidPrefix(prefix: string): boolean {
  return /^[A-Z]{2,5}$/.test(prefix);
}

export function formatCode(prefix: string, seq: number): string {
  return `${prefix}-${String(seq).padStart(4, '0')}`;
}

function toOrg(r: Record<string, unknown>): Org {
  return {
    id: Number(r.id),
    name: String(r.name),
    prefix: String(r.prefix),
    note: String(r.note),
    createdAt: String(r.created_at),
    memberCount: Number(r.member_count),
  };
}

export function listOrgs(): Org[] {
  return (
    db()
      .prepare(
        `SELECT o.*, (SELECT COUNT(*) FROM student_orgs m WHERE m.org_id = o.id) AS member_count
           FROM organizations o ORDER BY o.name`,
      )
      .all() as Record<string, unknown>[]
  ).map(toOrg);
}

export function getOrg(id: number): Org | undefined {
  return listOrgs().find((o) => o.id === id);
}

export function createOrg(input: { name: string; prefix: string; note?: string }): { id: number } | { error: string } {
  const name = input.name.trim().slice(0, 120);
  const prefix = normalizePrefix(input.prefix);
  if (!name) return { error: 'نام سازمان خالی است' };
  if (!isValidPrefix(prefix)) return { error: 'پیشوند باید ۲ تا ۵ حرف انگلیسی باشد، مثلاً DK' };
  if (db().prepare(`SELECT 1 FROM organizations WHERE name = ?`).get(name)) return { error: 'سازمانی با این نام هست' };
  if (db().prepare(`SELECT 1 FROM organizations WHERE prefix = ?`).get(prefix)) {
    return { error: `پیشوند ${prefix} برای سازمان دیگری است` };
  }
  const info = db()
    .prepare(`INSERT INTO organizations (name, prefix, note, next_seq, created_at) VALUES (?, ?, ?, 1, ?)`)
    .run(name, prefix, (input.note ?? '').trim().slice(0, 500), new Date().toISOString());
  return { id: Number(info.lastInsertRowid) };
}

/**
 * The prefix is part of every code already handed out, so it can only change
 * while nobody holds one.
 */
export function updateOrg(id: number, input: { name: string; prefix: string; note: string }): string | null {
  const current = getOrg(id);
  if (!current) return 'سازمان پیدا نشد';
  const name = input.name.trim().slice(0, 120);
  const prefix = normalizePrefix(input.prefix);
  if (!name) return 'نام سازمان خالی است';
  if (db().prepare(`SELECT 1 FROM organizations WHERE name = ? AND id <> ?`).get(name, id)) return 'سازمانی با این نام هست';

  if (prefix !== current.prefix) {
    if (current.memberCount > 0) return 'پیشوند بعد از صدور کد قابل تغییر نیست';
    if (!isValidPrefix(prefix)) return 'پیشوند باید ۲ تا ۵ حرف انگلیسی باشد';
    if (db().prepare(`SELECT 1 FROM organizations WHERE prefix = ? AND id <> ?`).get(prefix, id)) {
      return `پیشوند ${prefix} برای سازمان دیگری است`;
    }
  }
  db()
    .prepare(`UPDATE organizations SET name = ?, prefix = ?, note = ? WHERE id = ?`)
    .run(name, current.memberCount > 0 ? current.prefix : prefix, input.note.trim().slice(0, 500), id);
  return null;
}

export function deleteOrg(id: number) {
  db().prepare(`DELETE FROM organizations WHERE id = ?`).run(id);
}

/** Gives the student a code in the organisation, or returns the one they have. */
export function enroll(studentId: number, orgId: number): string | null {
  const d = db();
  return d.transaction(() => {
    const have = d.prepare(`SELECT code FROM student_orgs WHERE student_id = ? AND org_id = ?`).get(studentId, orgId) as
      | { code: string }
      | undefined;
    if (have) return have.code;

    const org = d.prepare(`SELECT prefix, next_seq FROM organizations WHERE id = ?`).get(orgId) as
      | { prefix: string; next_seq: number }
      | undefined;
    if (!org || !d.prepare(`SELECT 1 FROM students WHERE id = ?`).get(studentId)) return null;

    const code = formatCode(org.prefix, org.next_seq);
    d.prepare(`UPDATE organizations SET next_seq = next_seq + 1 WHERE id = ?`).run(orgId);
    d.prepare(`INSERT INTO student_orgs (student_id, org_id, code, created_at) VALUES (?, ?, ?, ?)`).run(
      studentId,
      orgId,
      code,
      new Date().toISOString(),
    );
    return code;
  })();
}

export function orgMembers(orgId: number): { studentId: number; code: string }[] {
  return (
    db().prepare(`SELECT student_id, code FROM student_orgs WHERE org_id = ? ORDER BY code`).all(orgId) as {
      student_id: number;
      code: string;
    }[]
  ).map((r) => ({ studentId: r.student_id, code: r.code }));
}

/** Makes exactly these students members: new ones get codes, removed ones lose theirs. */
export function setOrgMembers(orgId: number, studentIds: number[]) {
  const d = db();
  const keep = new Set(studentIds);
  d.transaction(() => {
    for (const m of orgMembers(orgId)) {
      if (!keep.has(m.studentId)) d.prepare(`DELETE FROM student_orgs WHERE student_id = ? AND org_id = ?`).run(m.studentId, orgId);
    }
    for (const id of studentIds) enroll(id, orgId);
  })();
}

/** Every member of a group that sits for an organisation holds a code in it. */
export function enrollGroupMembers(groupId: number) {
  const g = db().prepare(`SELECT org_id FROM student_groups WHERE id = ?`).get(groupId) as
    | { org_id: number | null }
    | undefined;
  if (!g || g.org_id == null) return;
  for (const id of groupMemberIds(groupId)) enroll(id, g.org_id);
}

export function codesByStudent(): Map<number, StudentCode[]> {
  const rows = db()
    .prepare(
      `SELECT m.student_id, m.org_id, m.code, o.name FROM student_orgs m
         JOIN organizations o ON o.id = m.org_id ORDER BY o.name`,
    )
    .all() as { student_id: number; org_id: number; code: string; name: string }[];
  const map = new Map<number, StudentCode[]>();
  for (const r of rows) {
    map.set(r.student_id, [...(map.get(r.student_id) ?? []), { orgId: r.org_id, orgName: r.name, code: r.code }]);
  }
  return map;
}

export function codesOf(studentId: number): StudentCode[] {
  return codesByStudent().get(studentId) ?? [];
}
