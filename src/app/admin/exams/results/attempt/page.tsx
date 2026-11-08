import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/server/guard';
import { attemptsFor, getAttempt, getExam, listQuestions, percentOf } from '@/server/exams';
import { getStudent } from '@/server/students';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';

import { deleteAttemptAction } from '../../../exam-actions';
import { PageTitle } from '../../../ui';
import { DeleteAttemptButton } from './DeleteAttemptButton';

export const dynamic = 'force-dynamic';

const LETTERS = ['الف', 'ب', 'ج', 'د'];

type Props = { searchParams: { id?: string } };

export default function AttemptPage({ searchParams }: Props) {
  requireAdmin();
  const attempt = getAttempt(Number(searchParams.id));
  if (!attempt) notFound();
  const exam = getExam(attempt.examId);
  const student = getStudent(attempt.studentId);
  if (!exam || !student) notFound();

  // Re-read through attemptsFor so a lapsed attempt is settled before it is shown.
  const all = attemptsFor(exam.id, student.id);
  const current = all.find((a) => a.id === attempt.id) ?? attempt;
  const questions = new Map(listQuestions(exam.id).map((q) => [q.id, q]));
  const percent = percentOf(current);

  return (
    <>
      <Link href={`/admin/exams/results/?id=${exam.id}`} className="text-xs font-bold text-brand hover:underline">
        ← نمره‌های «{exam.title}»
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow={exam.title} title={student.name} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="card p-5">
          <p className="text-xs text-ink-mute">نمره</p>
          <p className="mt-2 text-xl font-black text-brand">
            {current.score === null ? 'ارسال نشده' : `${fa(current.score)} از ${fa(current.maxScore ?? 0)}`}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-mute">درصد</p>
          <p className="mt-2 text-xl font-black text-brand">{percent === null ? '—' : `${fa(percent)}٪`}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-mute">شروع</p>
          <p className="mt-2 text-sm font-bold text-ink">{formatFa(current.startedAt)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-mute">ارسال</p>
          <p className="mt-2 text-sm font-bold text-ink">{formatFa(current.submittedAt) || 'هنوز نه'}</p>
        </div>
      </div>

      {all.length > 1 && (
        <p className="mt-5 text-xs text-ink-mute">
          دفعات شرکت:{' '}
          {all.map((a, i) => (
            <Link
              key={a.id}
              href={`/admin/exams/results/attempt/?id=${a.id}`}
              className={`ml-3 font-bold ${a.id === current.id ? 'text-ink' : 'text-brand hover:underline'}`}
            >
              {fa(i + 1)}
            </Link>
          ))}
        </p>
      )}

      <div className="mt-8 grid gap-3">
        {current.questionOrder.map((qid, i) => {
          const q = questions.get(qid);
          if (!q) return null;
          const given = current.answers[String(qid)];
          const right = given === q.correct;
          return (
            <article key={qid} className="card p-5">
              <p className="font-bold text-ink">
                {fa(i + 1)}. {q.text}
              </p>
              <ul className="mt-3 grid gap-1 text-sm">
                {q.options.map((opt, oi) => (
                  <li
                    key={oi}
                    className={`rounded-lg px-3 py-1.5 ${
                      oi === q.correct
                        ? 'bg-emerald-50 font-bold text-emerald-800'
                        : oi === given
                          ? 'bg-red-50 text-red-700'
                          : 'text-ink-soft'
                    }`}
                  >
                    {LETTERS[oi]}) {opt}
                    {oi === q.correct && ' ✓'}
                    {oi === given && oi !== q.correct && ' (پاسخ دانش‌پذیر)'}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-mute">
                {given === undefined ? 'بدون پاسخ' : right ? 'درست' : 'نادرست'}
              </p>
            </article>
          );
        })}
      </div>

      <form action={deleteAttemptAction} className="mt-10">
        <input type="hidden" name="id" value={current.id} />
        <input type="hidden" name="examId" value={exam.id} />
        <DeleteAttemptButton />
      </form>
    </>
  );
}
