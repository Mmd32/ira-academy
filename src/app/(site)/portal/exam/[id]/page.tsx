import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { PageHeader } from '@/components/PageHeader';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';
import {
  attemptsFor,
  availability,
  canSeeResult,
  getExam,
  listQuestions,
  paperFor,
  percentOf,
} from '@/server/exams';
import { currentStudent } from '@/server/students';

import { startExamAction } from '../../actions';
import { ExamRunner } from './ExamRunner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'آزمون',
  robots: { index: false, follow: false },
};

const LETTERS = ['الف', 'ب', 'ج', 'د'];

type Props = { params: { id: string }; searchParams: { error?: string } };

export default function ExamPage({ params, searchParams }: Props) {
  const student = currentStudent();
  if (!student) redirect('/portal/');

  const exam = getExam(Number(params.id));
  if (!exam) notFound();

  const avail = availability(exam, student.id);
  if (avail.state === 'not-assigned') notFound();

  const header = { eyebrow: 'آزمون', title: exam.title, lead: exam.description || undefined };

  /* A paper in progress takes the whole page. */
  if (avail.state === 'in-progress') {
    const attempt = avail.attempt;
    return (
      <>
        <PageHeader {...header} />
        <section className="section bg-white">
          <div className="container-x max-w-3xl">
            <ExamRunner
              attemptId={attempt.id}
              paper={paperFor(attempt)}
              initialAnswers={attempt.answers}
              deadlineAt={attempt.deadlineAt}
              serverNow={Date.now()}
            />
          </div>
        </section>
      </>
    );
  }

  const done = attemptsFor(exam.id, student.id).filter((a) => a.submittedAt);
  const visible = canSeeResult(exam);
  const questions = new Map(listQuestions(exam.id).map((q) => [q.id, q]));

  return (
    <>
      <PageHeader {...header} />
      <section className="section bg-white">
        <div className="container-x max-w-3xl space-y-6">
          <Link href="/portal/" className="text-xs font-bold text-brand hover:underline">
            ← بازگشت به درگاه
          </Link>

          {searchParams.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {searchParams.error}
            </p>
          )}

          <div className="card p-7">
            <h2 className="font-extrabold text-ink">مشخصات آزمون</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-ink-soft">
              <li>تعداد سؤال: {fa(questions.size)}</li>
              <li>{exam.durationMin ? `مدت پاسخ‌گویی: ${fa(exam.durationMin)} دقیقه از لحظه‌ی شروع` : 'محدودیت مدت ندارد'}</li>
              {exam.startAt && <li>شروع: {formatFa(exam.startAt)}</li>}
              {exam.endAt && <li>پایان: {formatFa(exam.endAt)}</li>}
              <li>تعداد دفعات مجاز: {fa(exam.maxAttempts)}</li>
              <li>ترتیب سؤال‌ها برای هر نفر متفاوت است.</li>
            </ul>

            {avail.state === 'ready' && (
              <form action={startExamAction} className="mt-6">
                <input type="hidden" name="examId" value={exam.id} />
                <button type="submit" className="btn-primary">
                  شروع آزمون
                </button>
                <p className="mt-3 text-xs leading-6 text-ink-mute">
                  با زدن این دکمه زمان شما شروع می‌شود. اگر مدت داشته باشد، بستن صفحه آن را متوقف نمی‌کند. پاسخ‌ها
                  همان لحظه ذخیره می‌شوند.
                </p>
              </form>
            )}
            {avail.state === 'upcoming' && (
              <p className="mt-6 rounded-xl bg-brand/5 px-4 py-3 text-sm text-ink-soft">
                آزمون از {formatFa(avail.startAt)} باز می‌شود.
              </p>
            )}
            {avail.state === 'closed' && (
              <p className="mt-6 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-ink-soft">زمان این آزمون تمام شده است.</p>
            )}
            {avail.state === 'no-attempts-left' && (
              <p className="mt-6 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-ink-soft">
                تعداد دفعات مجاز شما تمام شده است.
              </p>
            )}
          </div>

          {done.map((attempt, i) => {
            const percent = percentOf(attempt);
            const passed = exam.passPercent !== null && percent !== null ? percent >= exam.passPercent : null;
            return (
              <div key={attempt.id} className="card p-7">
                <h2 className="font-extrabold text-ink">
                  {done.length > 1 ? `نتیجه‌ی دفعه‌ی ${fa(i + 1)}` : 'نتیجه'}
                </h2>
                <p className="mt-1 text-xs text-ink-mute">ارسال: {formatFa(attempt.submittedAt)}</p>

                {!visible ? (
                  <p className="mt-4 rounded-xl bg-brand/5 px-4 py-3 text-sm leading-7 text-ink-soft">
                    {exam.resultMode === 'after_end' && exam.endAt
                      ? `پاسخ‌های شما ثبت شد. نمره بعد از ${formatFa(exam.endAt)} نمایش داده می‌شود.`
                      : 'پاسخ‌های شما ثبت شد. نمره توسط آکادمی اعلام می‌شود.'}
                  </p>
                ) : (
                  <>
                    <p className="mt-4 text-3xl font-black text-brand">
                      {fa(attempt.score ?? 0)} از {fa(attempt.maxScore ?? 0)}
                      {percent !== null && <span className="mr-3 text-lg text-ink-soft">({fa(percent)}٪)</span>}
                    </p>
                    <p className="mt-2 text-sm text-ink-soft">
                      {fa(attempt.correctCount ?? 0)} پاسخ درست از {fa(attempt.questionCount ?? 0)} سؤال
                      {passed === true && <span className="mr-3 font-bold text-emerald-700">قبول</span>}
                      {passed === false && <span className="mr-3 font-bold text-red-700">مردود</span>}
                    </p>

                    {exam.showAnswers && (
                      <ol className="mt-6 space-y-4">
                        {attempt.questionOrder.map((qid, qi) => {
                          const q = questions.get(qid);
                          if (!q) return null;
                          const given = attempt.answers[String(qid)];
                          return (
                            <li key={qid} className="rounded-xl border border-line bg-paper p-4 text-sm">
                              <p className="font-bold text-ink">
                                {fa(qi + 1)}. {q.text}
                              </p>
                              <ul className="mt-2 grid gap-1">
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
                                    {oi === given && oi !== q.correct && ' (پاسخ شما)'}
                                  </li>
                                ))}
                              </ul>
                              {given === undefined && <p className="mt-2 text-xs text-ink-mute">بدون پاسخ</p>}
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </>
                )}
              </div>
            );
          })}

        </div>
      </section>
    </>
  );
}
