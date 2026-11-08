'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { currentUser } from '@/server/auth';
import {
  addStudentsToGroup,
  createGroup,
  createOrg,
  deleteOrg,
  enroll,
  setOrgMembers,
  updateOrg,
  createStudent,
  deleteGroup,
  deleteStudent,
  normalizePhone,
  resetStudentPassword,
  setGroupMembers,
  updateGroup,
  updateStudent,
} from '@/server/students';
import {
  deleteAttempt,
  deleteExam,
  deleteQuestion,
  parseQuestionBlocks,
  saveExam,
  saveQuestion,
  setExamGroups,
  validateQuestion,
} from '@/server/exams';
import { RESULT_MODES, type ResultMode } from '@/lib/exam-shared';
import { fromTehranInput } from '@/lib/tehran-time';

/** Every action here changes data, so every action starts by checking the admin. */
function requireUser() {
  const user = currentUser();
  if (!user) redirect('/admin/login/');
  return user;
}

const ids = (formData: FormData, key: string) =>
  formData
    .getAll(key)
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);

/* ------------------------------- students ------------------------------- */

export type Credential = { name: string; phone: string; password: string };
export type StudentsState = {
  created: Credential[];
  errors: string[];
} | null;

export async function createStudentAction(_prev: StudentsState, formData: FormData): Promise<StudentsState> {
  requireUser();
  const result = createStudent({
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    password: String(formData.get('password') ?? ''),
  });

  revalidatePath('/admin/students');
  if (!result.ok) return { created: [], errors: [result.error] };

  const groupId = Number(formData.get('groupId'));
  if (groupId) addStudentsToGroup(groupId, [result.id]);
  const orgId = Number(formData.get('orgId'));
  if (orgId) enroll(result.id, orgId);
  return { created: [{ name: result.name, phone: result.phone, password: result.password }], errors: [] };
}

/**
 * Bulk add. One student per line: name, phone, optional password, separated by
 * a tab (pasted from Excel), a comma or a semicolon. Rows that fail are listed
 * and do not stop the others.
 */
export async function importStudentsAction(_prev: StudentsState, formData: FormData): Promise<StudentsState> {
  requireUser();
  const lines = String(formData.get('rows') ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const created: Credential[] = [];
  const errors: string[] = [];
  const newIds: number[] = [];

  lines.forEach((line, i) => {
    const parts = line.split(/\t|;|,|،/).map((p) => p.trim());
    // Accept "name, phone" and "phone, name": whichever part looks like a number is the phone.
    const phoneIdx = parts.findIndex((p) => normalizePhone(p).length >= 10 && /\d/.test(p));
    if (phoneIdx < 0) {
      errors.push(`سطر ${i + 1}: شماره‌ی موبایل پیدا نشد`);
      return;
    }
    const phone = parts[phoneIdx];
    const rest = parts.filter((_, idx) => idx !== phoneIdx);
    const result = createStudent({ name: rest[0] ?? '', phone, password: rest[1] ?? '' });
    if (result.ok) {
      created.push({ name: result.name, phone: result.phone, password: result.password });
      newIds.push(result.id);
    } else {
      errors.push(`سطر ${i + 1} (${result.name || result.phone}): ${result.error}`);
    }
  });

  const groupId = Number(formData.get('groupId'));
  if (groupId && newIds.length) addStudentsToGroup(groupId, newIds);
  const orgId = Number(formData.get('orgId'));
  if (orgId) newIds.forEach((id) => enroll(id, orgId));

  revalidatePath('/admin/students');
  return { created, errors };
}

export async function updateStudentAction(_prev: string | null, formData: FormData): Promise<string | null> {
  requireUser();
  const id = Number(formData.get('id'));
  if (!id) return 'دانش‌پذیر پیدا نشد';

  const error = updateStudent(id, {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    active: formData.get('active') === 'on',
  });
  revalidatePath('/admin/students');
  return error ?? 'ذخیره شد';
}

export async function resetPasswordAction(_prev: string | null, formData: FormData): Promise<string | null> {
  requireUser();
  const id = Number(formData.get('id'));
  if (!id) return null;
  const password = resetStudentPassword(id, String(formData.get('password') ?? ''));
  return password;
}

export async function deleteStudentAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (id) deleteStudent(id);
  revalidatePath('/admin/students');
  revalidatePath('/admin/groups');
}

/* -------------------------------- groups -------------------------------- */

export async function createGroupAction(formData: FormData) {
  requireUser();
  const result = createGroup(
    String(formData.get('name') ?? ''),
    String(formData.get('note') ?? ''),
    Number(formData.get('orgId')) || null,
  );
  if ('error' in result) redirect(`/admin/groups/?error=${encodeURIComponent(result.error)}`);
  redirect(`/admin/groups/edit/?id=${result.id}`);
}

export async function saveGroupAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (!id) redirect('/admin/groups/');

  const error = updateGroup(
    id,
    String(formData.get('name') ?? ''),
    String(formData.get('note') ?? ''),
    Number(formData.get('orgId')) || null,
  );
  if (error) redirect(`/admin/groups/edit/?id=${id}&error=${encodeURIComponent(error)}`);

  setGroupMembers(id, ids(formData, 'member'));
  revalidatePath('/admin/orgs');
  revalidatePath('/admin/groups');
  revalidatePath('/admin/students');
  redirect(`/admin/groups/edit/?id=${id}&saved=1`);
}

export async function deleteGroupAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (id) deleteGroup(id);
  revalidatePath('/admin/groups');
  redirect('/admin/groups/');
}

/* ----------------------------- organisations ---------------------------- */

export async function createOrgAction(formData: FormData) {
  requireUser();
  const result = createOrg({
    name: String(formData.get('name') ?? ''),
    prefix: String(formData.get('prefix') ?? ''),
    note: String(formData.get('note') ?? ''),
  });
  if ('error' in result) redirect(`/admin/orgs/?error=${encodeURIComponent(result.error)}`);
  redirect(`/admin/orgs/edit/?id=${result.id}`);
}

export async function saveOrgAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (!id) redirect('/admin/orgs/');

  const error = updateOrg(id, {
    name: String(formData.get('name') ?? ''),
    prefix: String(formData.get('prefix') ?? ''),
    note: String(formData.get('note') ?? ''),
  });
  if (error) redirect(`/admin/orgs/edit/?id=${id}&error=${encodeURIComponent(error)}`);

  setOrgMembers(id, ids(formData, 'member'));
  revalidatePath('/admin/orgs');
  revalidatePath('/admin/students');
  redirect(`/admin/orgs/edit/?id=${id}&saved=1`);
}

export async function deleteOrgAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (id) deleteOrg(id);
  revalidatePath('/admin/orgs');
  redirect('/admin/orgs/');
}

/* --------------------------------- exams -------------------------------- */

export async function saveExamAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id')) || null;

  const title = String(formData.get('title') ?? '').trim();
  if (!title) redirect(`/admin/exams/edit/${id ? `?id=${id}&` : '?'}error=${encodeURIComponent('عنوان آزمون خالی است')}`);

  const mode = String(formData.get('resultMode') ?? 'immediate');
  const resultMode = (mode in RESULT_MODES ? mode : 'immediate') as ResultMode;

  const startAt = fromTehranInput(String(formData.get('startAt') ?? ''));
  const endAt = fromTehranInput(String(formData.get('endAt') ?? ''));
  if (startAt && endAt && new Date(endAt) <= new Date(startAt)) {
    redirect(
      `/admin/exams/edit/${id ? `?id=${id}&` : '?'}error=${encodeURIComponent('پایان بازه باید بعد از شروع باشد')}`,
    );
  }

  const duration = Number(formData.get('durationMin'));
  const pass = String(formData.get('passPercent') ?? '').trim();

  const examId = saveExam(id, {
    title,
    description: String(formData.get('description') ?? ''),
    published: formData.get('published') === 'on',
    startAt,
    endAt,
    durationMin: Number.isInteger(duration) && duration > 0 ? duration : null,
    maxAttempts: Math.max(1, Math.min(20, Number(formData.get('maxAttempts')) || 1)),
    shuffleQuestions: formData.get('shuffleQuestions') === 'on',
    shuffleOptions: formData.get('shuffleOptions') === 'on',
    resultMode,
    showAnswers: formData.get('showAnswers') === 'on',
    passPercent: pass && Number(pass) >= 0 && Number(pass) <= 100 ? Math.round(Number(pass)) : null,
  });

  setExamGroups(examId, ids(formData, 'group'));
  revalidatePath('/admin/exams');
  redirect(`/admin/exams/edit/?id=${examId}&saved=1`);
}

export async function deleteExamAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (id) deleteExam(id);
  revalidatePath('/admin/exams');
  redirect('/admin/exams/');
}

export type QuestionState = { ok: boolean; message: string } | null;

export async function saveQuestionAction(_prev: QuestionState, formData: FormData): Promise<QuestionState> {
  requireUser();
  const examId = Number(formData.get('examId'));
  const id = Number(formData.get('id')) || null;
  if (!examId) return { ok: false, message: 'آزمون پیدا نشد' };

  const q = {
    text: String(formData.get('text') ?? ''),
    options: [0, 1, 2, 3].map((i) => String(formData.get(`option${i}`) ?? '')),
    correct: Number(formData.get('correct')),
    points: Number(formData.get('points') || 1),
  };
  const problem = validateQuestion(q);
  if (problem) return { ok: false, message: problem };

  saveQuestion(examId, id, q);
  revalidatePath('/admin/exams/questions');
  return { ok: true, message: id ? 'ذخیره شد' : 'سؤال اضافه شد' };
}

export async function deleteQuestionAction(formData: FormData) {
  requireUser();
  const examId = Number(formData.get('examId'));
  const id = Number(formData.get('id'));
  if (examId && id) deleteQuestion(examId, id);
  revalidatePath('/admin/exams/questions');
}

export async function importQuestionsAction(_prev: QuestionState, formData: FormData): Promise<QuestionState> {
  requireUser();
  const examId = Number(formData.get('examId'));
  if (!examId) return { ok: false, message: 'آزمون پیدا نشد' };

  const { questions, errors } = parseQuestionBlocks(String(formData.get('blocks') ?? ''));
  // All or nothing: a half-imported paper is harder to fix than a rejected one.
  if (errors.length) return { ok: false, message: errors.join('\n') };
  if (questions.length === 0) return { ok: false, message: 'سؤالی پیدا نشد' };

  for (const q of questions) saveQuestion(examId, null, q);
  revalidatePath('/admin/exams/questions');
  return { ok: true, message: `${questions.length} سؤال اضافه شد` };
}

export async function deleteAttemptAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  const examId = Number(formData.get('examId'));
  if (id) deleteAttempt(id);
  revalidatePath('/admin/exams/results');
  if (examId) redirect(`/admin/exams/results/?id=${examId}`);
}
