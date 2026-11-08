import { db } from './db';
import {
  allAttempts,
  getExam,
  listExams,
  percentOf,
  resultRows,
  type Attempt,
} from './exams';
import { formatJalaliPlain } from '@/lib/tehran-time';
import { buildXlsx, type Cell } from './xlsx';
import type { Exam } from '@/lib/exam-shared';

/**
 * The score sheets. Dates are written as Jalali text with Latin digits so
 * Excel keeps them as they are; scores are real numbers so the admin can sort
 * and average them.
 */

function minutes(a: Attempt): number | '' {
  if (!a.submittedAt) return '';
  return Math.round(((new Date(a.submittedAt).getTime() - new Date(a.startedAt).getTime()) / 60_000) * 10) / 10;
}

function verdict(exam: Exam, percent: number | null): string {
  if (percent === null || exam.passPercent === null) return '';
  return percent >= exam.passPercent ? 'قبول' : 'مردود';
}

const safeName = (s: string) => s.replace(/[\\/:*?"<>|]/g, ' ').trim().slice(0, 60) || 'exam';

export function examWorkbook(examId: number): { filename: string; data: Buffer } | null {
  const exam = getExam(examId);
  if (!exam) return null;

  const rows = resultRows(exam);

  const summary: Cell[][] = [
    ['ردیف', 'نام', 'موبایل', 'گروه', 'وضعیت', 'تعداد دفعات شرکت', 'بهترین نمره', 'نمره‌ی کل', 'درصد', 'نتیجه', 'زمان شروع', 'زمان ارسال', 'مدت (دقیقه)'],
  ];
  rows.forEach((r, i) => {
    const percent = r.best ? percentOf(r.best) : null;
    const status = r.best ? 'شرکت کرد' : r.attempts.length ? 'در حال آزمون' : 'شرکت نکرد';
    summary.push([
      i + 1,
      r.name,
      r.phone,
      r.groups.join('، '),
      status,
      r.attempts.length,
      r.best?.score ?? '',
      r.best?.maxScore ?? '',
      percent ?? '',
      verdict(exam, percent),
      r.best ? formatJalaliPlain(r.best.startedAt) : '',
      r.best ? formatJalaliPlain(r.best.submittedAt) : '',
      r.best ? minutes(r.best) : '',
    ]);
  });

  const detail: Cell[][] = [
    ['نام', 'موبایل', 'تلاش', 'زمان شروع', 'زمان ارسال', 'مدت (دقیقه)', 'پاسخ صحیح', 'تعداد سؤال', 'نمره', 'نمره‌ی کل', 'درصد', 'نتیجه'],
  ];
  for (const r of rows) {
    r.attempts.forEach((a, i) => {
      const percent = percentOf(a);
      detail.push([
        r.name,
        r.phone,
        i + 1,
        formatJalaliPlain(a.startedAt),
        formatJalaliPlain(a.submittedAt),
        minutes(a),
        a.correctCount ?? '',
        a.questionCount ?? '',
        a.score ?? '',
        a.maxScore ?? '',
        percent ?? '',
        a.submittedAt ? verdict(exam, percent) : 'ارسال نشده',
      ]);
    });
  }

  const data = buildXlsx([
    { name: 'نمرات', rows: summary, widths: [6, 24, 16, 22, 14, 12, 12, 12, 10, 10, 18, 18, 12] },
    { name: 'همه‌ی تلاش‌ها', rows: detail, widths: [24, 16, 8, 18, 18, 12, 12, 12, 10, 10, 10, 12] },
  ]);

  return { filename: `${safeName(exam.title)}-نمرات.xlsx`, data };
}

/** Every exam, every attempt, one sheet: the whole academy's results. */
export function allResultsWorkbook(): { filename: string; data: Buffer } {
  const exams = new Map(listExams().map((e) => [e.id, e]));
  const students = new Map(
    (db().prepare(`SELECT id, name, phone FROM students`).all() as { id: number; name: string; phone: string }[]).map(
      (s) => [s.id, s],
    ),
  );

  const rows: Cell[][] = [
    ['آزمون', 'نام', 'موبایل', 'زمان شروع', 'زمان ارسال', 'مدت (دقیقه)', 'پاسخ صحیح', 'تعداد سؤال', 'نمره', 'نمره‌ی کل', 'درصد', 'نتیجه'],
  ];
  for (const a of allAttempts()) {
    const exam = exams.get(a.examId);
    const student = students.get(a.studentId);
    if (!exam || !student) continue;
    const percent = percentOf(a);
    rows.push([
      exam.title,
      student.name,
      student.phone,
      formatJalaliPlain(a.startedAt),
      formatJalaliPlain(a.submittedAt),
      minutes(a),
      a.correctCount ?? '',
      a.questionCount ?? '',
      a.score ?? '',
      a.maxScore ?? '',
      percent ?? '',
      a.submittedAt ? verdict(exam, percent) : 'ارسال نشده',
    ]);
  }

  return {
    filename: 'نمرات-همه-آزمون‌ها.xlsx',
    data: buildXlsx([{ name: 'نمرات', rows, widths: [28, 24, 16, 18, 18, 12, 12, 12, 10, 10, 10, 12] }]),
  };
}
