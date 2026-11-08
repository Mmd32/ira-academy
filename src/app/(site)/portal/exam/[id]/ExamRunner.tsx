'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { fa } from '@/lib/text';

import { saveAnswerAction, submitExamAction } from '../../actions';

type PaperQuestion = {
  id: number;
  text: string;
  points: number;
  options: { value: number; text: string }[];
};

const clock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${two(h)}:${two(m)}:${two(s)}` : `${two(m)}:${two(s)}`;
};

/**
 * The running paper. The questions arrive already in this student's own order,
 * and every pick is saved as it is made, so a dropped connection or a closed
 * tab loses at most the last click. The clock is the server's: the browser only
 * shows it, and the server refuses answers after the deadline.
 */
export function ExamRunner({
  attemptId,
  paper,
  initialAnswers,
  deadlineAt,
  serverNow,
}: {
  attemptId: number;
  paper: PaperQuestion[];
  initialAnswers: Record<string, number>;
  deadlineAt: string | null;
  serverNow: number;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [saveFailed, setSaveFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  // Server time minus browser time, so a wrong phone clock does not move the deadline.
  const offset = useRef(serverNow - Date.now());
  const deadline = deadlineAt ? new Date(deadlineAt).getTime() : null;
  const [left, setLeft] = useState<number | null>(deadline ? deadline - (Date.now() + offset.current) : null);

  const answeredCount = useMemo(() => paper.filter((q) => answers[String(q.id)] !== undefined).length, [answers, paper]);

  const finish = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    startTransition(async () => {
      await submitExamAction(attemptId, answers);
      window.location.reload();
    });
  }, [answers, attemptId, submitting]);

  // Always the newest finish, so the timer below never submits stale answers.
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (deadline === null) return undefined;
    const tick = () => {
      const remaining = deadline - (Date.now() + offset.current);
      setLeft(remaining);
      if (remaining <= 0) finishRef.current();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const pick = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
    saveAnswerAction(attemptId, questionId, value)
      .then((ok) => setSaveFailed(!ok))
      .catch(() => setSaveFailed(true));
  };

  const urgent = left !== null && left < 5 * 60_000;

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur-none sm:mx-0 sm:rounded-2xl sm:border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-ink">
            {fa(answeredCount)} از {fa(paper.length)} سؤال پاسخ داده شد
          </span>
          {left !== null ? (
            <span
              className={`ltr rounded-full px-4 py-1.5 font-mono text-sm font-black ${
                urgent ? 'bg-red-100 text-red-700' : 'bg-brand/10 text-brand'
              }`}
              aria-live="off"
            >
              {clock(left)}
            </span>
          ) : (
            <span className="text-xs text-ink-mute">بدون محدودیت زمان</span>
          )}
        </div>
        {saveFailed && (
          <p className="mt-2 text-xs text-red-700" role="alert">
            پاسخ آخر ذخیره نشد. اتصال اینترنت را بررسی کنید و دوباره انتخاب کنید.
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-5">
        {paper.map((q, i) => (
          <li key={q.id} className="card p-6">
            <p className="font-extrabold leading-8 text-ink">
              {fa(i + 1)}. {q.text}
            </p>
            <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`سؤال ${i + 1}`}>
              {q.options.map((opt) => {
                const chosen = answers[String(q.id)] === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-7 transition-colors ${
                      chosen ? 'border-brand bg-brand/5 font-bold text-ink' : 'border-line bg-paper text-ink-soft hover:border-brand-400/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={chosen}
                      onChange={() => pick(q.id, opt.value)}
                      className="mt-1.5 h-4 w-4 shrink-0"
                    />
                    <span>{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={submitting || pending}
          className="btn-primary disabled:opacity-60"
          onClick={() => {
            const missing = paper.length - answeredCount;
            const note = missing > 0 ? `${fa(missing)} سؤال بدون پاسخ است. ` : '';
            if (confirm(`${note}آزمون را پایان می‌دهید؟ بعد از ارسال امکان تغییر نیست.`)) finish();
          }}
        >
          {submitting ? 'در حال ارسال…' : 'پایان و ارسال آزمون'}
        </button>
      </div>
    </div>
  );
}
