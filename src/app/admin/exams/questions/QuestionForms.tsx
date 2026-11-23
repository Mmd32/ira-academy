'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import {
  deleteQuestionAction,
  importQuestionsAction,
  saveQuestionAction,
  type QuestionState,
} from '../../exam-actions';
import { fieldBox } from '../../ui';

const LETTERS = ['الف', 'ب', 'ج', 'د'];

function Submit({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : children}
    </button>
  );
}

function Feedback({ state }: { state: QuestionState }) {
  if (!state) return null;
  return (
    <p
      className={`whitespace-pre-line text-sm ${state.ok ? 'text-emerald-700' : 'text-red-700'}`}
      role={state.ok ? 'status' : 'alert'}
    >
      {state.message}
    </p>
  );
}

export type QuestionData = {
  id?: number;
  text: string;
  options: string[];
  correct: number;
  points: number;
};

export function QuestionForm({ examId, question }: { examId: number; question?: QuestionData }) {
  const [state, action] = useFormState<QuestionState, FormData>(saveQuestionAction, null);
  const isNew = !question;
  const [formKey, setFormKey] = useState(0);

  // A saved new question clears the form so the next one can be typed straight away.
  useEffect(() => {
    if (isNew && state?.ok) setFormKey((k) => k + 1);
  }, [isNew, state]);

  return (
    <form action={action} key={formKey} className="grid gap-4">
      <input type="hidden" name="examId" value={examId} />
      {question?.id && <input type="hidden" name="id" value={question.id} />}

      <label className="block text-sm">
        <span className="font-semibold text-ink">متن سؤال</span>
        <textarea name="text" rows={2} defaultValue={question?.text} required className={fieldBox} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {LETTERS.map((letter, i) => (
          <label key={letter} className="flex items-start gap-3 text-sm">
            <input
              type="radio"
              name="correct"
              value={i}
              defaultChecked={question ? question.correct === i : i === 0}
              className="mt-4 h-4 w-4 shrink-0"
              aria-label={`گزینه‌ی ${letter} صحیح است`}
            />
            <span className="block flex-1">
              <span className="text-xs font-semibold text-ink-soft">گزینه‌ی {letter}</span>
              <input name={`option${i}`} defaultValue={question?.options[i]} required className={fieldBox} />
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-ink-mute">دکمه‌ی رادیوی کنار هر گزینه، پاسخ صحیح را مشخص می‌کند.</p>

      <div className="flex flex-wrap items-end gap-4">
        <label className="block text-sm">
          <span className="font-semibold text-ink">نمره</span>
          <input
            name="points"
            type="number"
            min={1}
            max={100}
            defaultValue={question?.points ?? 1}
            className={`${fieldBox} ltr w-24`}
          />
        </label>
        <Submit>{isNew ? 'افزودن سؤال' : 'ذخیره'}</Submit>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function DeleteQuestion({ examId, id }: { examId: number; id: number }) {
  return (
    <form
      action={deleteQuestionAction}
      onSubmit={(e) => {
        if (!confirm('این سؤال حذف شود؟')) e.preventDefault();
      }}
    >
      <input type="hidden" name="examId" value={examId} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-bold text-red-700 hover:underline">
        حذف سؤال
      </button>
    </form>
  );
}

export function ImportQuestions({ examId }: { examId: number }) {
  const [state, action] = useFormState<QuestionState, FormData>(importQuestionsAction, null);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="examId" value={examId} />
      <label className="block text-sm">
        <span className="font-semibold text-ink">سؤال‌ها</span>
        <textarea
          name="blocks"
          rows={12}
          required
          className={`${fieldBox} font-mono`}
          placeholder={'متن سؤال اول\nالف) گزینه‌ی اول\nب) گزینه‌ی دوم\nج) گزینه‌ی سوم\nد) گزینه‌ی چهارم\nپاسخ: ب\n\nمتن سؤال دوم\n...'}
        />
      </label>
      <p className="text-xs leading-6 text-ink-mute">
        هر سؤال یک بلوک است و بین بلوک‌ها یک خط خالی می‌گذارید. خط اول متن سؤال، چهار خط بعد گزینه‌ها و آخر خط
        «پاسخ:» با حرف گزینه (الف، ب، ج، د). اگر یک سؤال ایراد داشته باشد هیچ‌کدام اضافه نمی‌شود و خطاها نشان
        داده می‌شود.
      </p>
      <div className="flex flex-wrap items-start gap-4">
        <Submit>افزودن همه</Submit>
        <Feedback state={state} />
      </div>
    </form>
  );
}
