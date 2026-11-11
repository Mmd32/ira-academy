'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  changeOwnPassword,
  currentStudent,
  pruneStudentSessions,
  studentSignIn,
  studentSignOut,
} from '@/server/students';
import { getExam, saveAnswer, startAttempt, submitAttempt } from '@/server/exams';

function requireStudent() {
  const student = currentStudent();
  if (!student) redirect('/portal/');
  return student;
}

export async function studentSignInAction(_prev: string | null, formData: FormData): Promise<string | null> {
  const phone = String(formData.get('identifier') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!phone.trim() || !password) return 'کد ملی و رمز را وارد کنید.';

  const h = headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';

  pruneStudentSessions();
  const result = studentSignIn(phone, password, ip);
  if (!result.ok) return result.error;

  redirect('/portal/');
}

export async function studentSignOutAction() {
  studentSignOut();
  redirect('/portal/');
}

export async function changePasswordAction(_prev: string | null, formData: FormData): Promise<string | null> {
  const student = requireStudent();
  const next = String(formData.get('next') ?? '');
  if (next !== String(formData.get('repeat') ?? '')) return 'تکرار رمز با رمز تازه یکی نیست.';

  const error = changeOwnPassword(student.id, String(formData.get('current') ?? ''), next);
  return error ?? 'رمز عوض شد.';
}

export async function startExamAction(formData: FormData) {
  const student = requireStudent();
  const exam = getExam(Number(formData.get('examId')));
  if (!exam) redirect('/portal/');

  const result = startAttempt(exam, student.id);
  revalidatePath(`/portal/exam/${exam.id}`);
  if (!result.ok) redirect(`/portal/exam/${exam.id}/?error=${encodeURIComponent(result.error)}`);
  redirect(`/portal/exam/${exam.id}/`);
}

/** Called as the student picks an option, so a closed tab loses nothing. */
export async function saveAnswerAction(attemptId: number, questionId: number, value: number | null) {
  const student = currentStudent();
  if (!student) return false;
  return saveAnswer(attemptId, student.id, questionId, value);
}

export async function submitExamAction(attemptId: number, answers: Record<string, number>) {
  const student = requireStudent();
  submitAttempt(attemptId, student.id, answers);
  revalidatePath('/portal/exam');
  revalidatePath('/portal');
}
