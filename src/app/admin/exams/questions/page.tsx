import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/server/guard';
import { getExam, listQuestions } from '@/server/exams';
import { fa } from '@/lib/text';

import { PageTitle } from '../../ui';
import { DeleteQuestion, ImportQuestions, QuestionForm } from './QuestionForms';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string } };

export default function QuestionsPage({ searchParams }: Props) {
  requireAdmin();
  const exam = getExam(Number(searchParams.id));
  if (!exam) notFound();
  const questions = listQuestions(exam.id);
  const total = questions.reduce((n, q) => n + q.points, 0);

  return (
    <>
      <Link href="/admin/exams/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی آزمون‌ها
      </Link>
      <div className="mt-3">
        <PageTitle
          eyebrow={exam.title}
          title="سؤال‌های آزمون"
          lead={`${fa(questions.length)} سؤال، جمع نمره ${fa(total)}. ترتیب نمایش برای هر دانش‌پذیر جدا و تصادفی است، پس ترتیبی که اینجا می‌بینید ترتیب آزمون نیست.`}
        />
      </div>
      <div className="mt-4 flex gap-5 text-xs font-bold text-brand">
        <Link href={`/admin/exams/edit/?id=${exam.id}`} className="hover:underline">
          تنظیمات
        </Link>
        <Link href={`/admin/exams/results/?id=${exam.id}`} className="hover:underline">
          نمره‌ها
        </Link>
      </div>

      {exam.published && questions.some(() => true) && (
        <p className="mt-6 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3 text-sm leading-7 text-ink-soft">
          این آزمون منتشر شده است. تغییر سؤال‌ها بعد از شروع آزمون روی نمره‌ی کسانی که قبلاً شرکت کرده‌اند اثر
          می‌گذارد (نمره‌ی ثبت‌شده عوض نمی‌شود، ولی پاسخ صحیحِ نمایش‌داده‌شده تغییر می‌کند).
        </p>
      )}

      <details className="card mt-8 p-6" open={questions.length === 0}>
        <summary className="cursor-pointer font-extrabold text-ink">سؤال جدید</summary>
        <div className="mt-5">
          <QuestionForm examId={exam.id} />
        </div>
      </details>

      <details className="card mt-4 p-6">
        <summary className="cursor-pointer font-extrabold text-ink">افزودن چند سؤال با هم (از Word یا Excel)</summary>
        <div className="mt-5">
          <ImportQuestions examId={exam.id} />
        </div>
      </details>

      <div className="mt-8 grid gap-3">
        {questions.map((q, i) => (
          <details key={q.id} className="card p-5">
            <summary className="cursor-pointer">
              <span className="font-extrabold text-ink">
                {fa(i + 1)}. {q.text}
              </span>
              <span className="mr-3 text-xs text-ink-mute">
                پاسخ: {['الف', 'ب', 'ج', 'د'][q.correct]} · {fa(q.points)} نمره
              </span>
            </summary>
            <div className="mt-5 grid gap-4">
              <QuestionForm examId={exam.id} question={q} />
              <DeleteQuestion examId={exam.id} id={q.id} />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
