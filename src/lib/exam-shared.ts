/**
 * Exam vocabulary both the panel and the portal need. Kept free of the
 * database driver so client components can import it (see leads-shared.ts).
 */

export const RESULT_MODES = {
  immediate: 'بلافاصله بعد از ارسال',
  after_end: 'بعد از پایان بازه‌ی آزمون',
  hidden: 'نمره به دانش‌پذیر نشان داده نشود',
} as const;

export type ResultMode = keyof typeof RESULT_MODES;

export const OPTION_COUNT = 4;

export type Question = {
  id: number;
  examId: number;
  position: number;
  text: string;
  options: string[];
  /** Index into `options`. Never sent to the browser while an exam is running. */
  correct: number;
  points: number;
};

export type Exam = {
  id: number;
  title: string;
  description: string;
  published: boolean;
  startAt: string | null;
  endAt: string | null;
  durationMin: number | null;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  resultMode: ResultMode;
  showAnswers: boolean;
  passPercent: number | null;
  createdAt: string;
};
