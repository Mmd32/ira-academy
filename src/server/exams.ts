import { randomInt } from 'node:crypto';

import { db, json } from './db';
import {
  OPTION_COUNT,
  type Exam,
  type Question,
  type ResultMode,
} from '@/lib/exam-shared';

/**
 * Exams, questions, sittings and grading.
 *
 * Two rules shape this file. The paper is frozen when a student starts (the
 * shuffle is stored on the attempt), so a refresh never reshuffles it. And the
 * server is the only judge of time and of the answer key: the browser is sent
 * question text and option text, never which option is right.
 */

type Row = Record<string, unknown>;

/* -------------------------------- exams -------------------------------- */

function toExam(r: Row): Exam {
  return {
    id: Number(r.id),
    title: String(r.title),
    description: String(r.description),
    published: Number(r.published) === 1,
    startAt: r.start_at ? String(r.start_at) : null,
    endAt: r.end_at ? String(r.end_at) : null,
    durationMin: r.duration_min == null ? null : Number(r.duration_min),
    maxAttempts: Number(r.max_attempts),
    shuffleQuestions: Number(r.shuffle_questions) === 1,
    shuffleOptions: Number(r.shuffle_options) === 1,
    resultMode: String(r.result_mode) as ResultMode,
    showAnswers: Number(r.show_answers) === 1,
    passPercent: r.pass_percent == null ? null : Number(r.pass_percent),
    createdAt: String(r.created_at),
  };
}

export function listExams(): Exam[] {
  return (db().prepare(`SELECT * FROM exams ORDER BY created_at DESC, id DESC`).all() as Row[]).map(toExam);
}

export function getExam(id: number): Exam | undefined {
  const row = db().prepare(`SELECT * FROM exams WHERE id = ?`).get(id) as Row | undefined;
  return row ? toExam(row) : undefined;
}

export type ExamInput = Omit<Exam, 'id' | 'createdAt'>;

export function saveExam(id: number | null, input: ExamInput): number {
  const d = db();
  const values = [
    input.title.trim().slice(0, 200),
    input.description.trim().slice(0, 4000),
    input.published ? 1 : 0,
    input.startAt,
    input.endAt,
    input.durationMin,
    Math.max(1, input.maxAttempts),
    input.shuffleQuestions ? 1 : 0,
    input.shuffleOptions ? 1 : 0,
    input.resultMode,
    input.showAnswers ? 1 : 0,
    input.passPercent,
  ];

  if (id) {
    d.prepare(
      `UPDATE exams SET title=?, description=?, published=?, start_at=?, end_at=?, duration_min=?,
         max_attempts=?, shuffle_questions=?, shuffle_options=?, result_mode=?, show_answers=?, pass_percent=?
       WHERE id = ?`,
    ).run(...values, id);
    return id;
  }

  const info = d
    .prepare(
      `INSERT INTO exams (title, description, published, start_at, end_at, duration_min,
         max_attempts, shuffle_questions, shuffle_options, result_mode, show_answers, pass_percent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(...values, new Date().toISOString());
  return Number(info.lastInsertRowid);
}

export function deleteExam(id: number) {
  db().prepare(`DELETE FROM exams WHERE id = ?`).run(id);
}

export function examGroupIds(examId: number): number[] {
  return (
    db().prepare(`SELECT group_id FROM exam_groups WHERE exam_id = ?`).all(examId) as {
      group_id: number;
    }[]
  ).map((r) => r.group_id);
}

export function setExamGroups(examId: number, groupIds: number[]) {
  const d = db();
  d.transaction(() => {
    d.prepare(`DELETE FROM exam_groups WHERE exam_id = ?`).run(examId);
    const ins = d.prepare(
      `INSERT OR IGNORE INTO exam_groups (exam_id, group_id)
       SELECT ?, id FROM student_groups WHERE id = ?`,
    );
    for (const g of groupIds) ins.run(examId, g);
  })();
}

/** Students who may sit the exam: members of any group it is assigned to. */
export function assignedStudentIds(examId: number): number[] {
  return (
    db()
      .prepare(
        `SELECT DISTINCT m.student_id FROM group_members m
           JOIN exam_groups g ON g.group_id = m.group_id
          WHERE g.exam_id = ?`,
      )
      .all(examId) as { student_id: number }[]
  ).map((r) => r.student_id);
}

/* ------------------------------ questions ------------------------------ */

function toQuestion(r: Row): Question {
  return {
    id: Number(r.id),
    examId: Number(r.exam_id),
    position: Number(r.position),
    text: String(r.text),
    options: json.parse<string[]>(String(r.options), []),
    correct: Number(r.correct),
    points: Number(r.points),
  };
}

export function listQuestions(examId: number): Question[] {
  return (
    db()
      .prepare(`SELECT * FROM exam_questions WHERE exam_id = ? ORDER BY position, id`)
      .all(examId) as Row[]
  ).map(toQuestion);
}

export type QuestionInput = { text: string; options: string[]; correct: number; points: number };

/** Returns a message when the question is not usable, otherwise null. */
export function validateQuestion(q: QuestionInput): string | null {
  if (!q.text.trim()) return 'متن سؤال خالی است';
  if (q.options.length !== OPTION_COUNT || q.options.some((o) => !o.trim())) {
    return `هر سؤال باید دقیقاً ${OPTION_COUNT} گزینه‌ی پرشده داشته باشد`;
  }
  if (new Set(q.options.map((o) => o.trim())).size !== q.options.length) {
    return 'گزینه‌ها نباید تکراری باشند';
  }
  if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= OPTION_COUNT) {
    return 'گزینه‌ی صحیح مشخص نشده';
  }
  if (!Number.isInteger(q.points) || q.points < 1 || q.points > 100) return 'نمره‌ی سؤال باید بین ۱ تا ۱۰۰ باشد';
  return null;
}

export function saveQuestion(examId: number, id: number | null, q: QuestionInput) {
  const options = json.stringify(q.options.map((o) => o.trim()));
  if (id) {
    db()
      .prepare(
        `UPDATE exam_questions SET text=?, options=?, correct=?, points=? WHERE id=? AND exam_id=?`,
      )
      .run(q.text.trim(), options, q.correct, q.points, id, examId);
    return;
  }
  const next = (
    db().prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS n FROM exam_questions WHERE exam_id = ?`).get(examId) as {
      n: number;
    }
  ).n;
  db()
    .prepare(
      `INSERT INTO exam_questions (exam_id, position, text, options, correct, points) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(examId, next, q.text.trim(), options, q.correct, q.points);
}

export function deleteQuestion(examId: number, id: number) {
  db().prepare(`DELETE FROM exam_questions WHERE id = ? AND exam_id = ?`).run(id, examId);
}

/**
 * Bulk import. One question is a block separated by a blank line:
 *
 *   متن سؤال
 *   الف) گزینه‌ی اول
 *   ب) گزینه‌ی دوم
 *   ج) گزینه‌ی سوم
 *   د) گزینه‌ی چهارم
 *   پاسخ: ب
 *
 * Option labels (الف ب ج د, a b c d, 1 2 3 4) are optional and are stripped.
 */
export function parseQuestionBlocks(text: string): { questions: QuestionInput[]; errors: string[] } {
  const questions: QuestionInput[] = [];
  const errors: string[] = [];
  const blocks = text
    .replace(/\r/g, '')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const letters = ['الف', 'ب', 'ج', 'د'];

  blocks.forEach((block, i) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const answerIdx = lines.findIndex((l) => /^(پاسخ|جواب|answer)\s*[:：]/i.test(l));
    if (answerIdx < 0) {
      errors.push(`سؤال ${i + 1}: خط «پاسخ:» پیدا نشد`);
      return;
    }
    const answerRaw = lines[answerIdx].replace(/^[^:：]*[:：]\s*/, '').trim().toLowerCase();
    const body = lines.filter((_, idx) => idx !== answerIdx);
    if (body.length !== OPTION_COUNT + 1) {
      errors.push(`سؤال ${i + 1}: باید یک خط متن و ${OPTION_COUNT} خط گزینه باشد`);
      return;
    }

    const strip = (l: string) => l.replace(/^(الف|ب|ج|د|[a-dA-D]|[1-4۱-۴])\s*[).:\-ـ]\s*/, '');
    const options = body.slice(1).map(strip);

    const map: Record<string, number> = {
      الف: 0, ب: 1, ج: 2, د: 3,
      a: 0, b: 1, c: 2, d: 3,
      '1': 0, '2': 1, '3': 2, '4': 3,
      '۱': 0, '۲': 1, '۳': 2, '۴': 3,
    };
    const correct = map[answerRaw];
    if (correct === undefined) {
      errors.push(`سؤال ${i + 1}: پاسخ «${answerRaw}» را نشناختم (${letters.join('، ')})`);
      return;
    }

    const q: QuestionInput = { text: body[0], options, correct, points: 1 };
    const problem = validateQuestion(q);
    if (problem) errors.push(`سؤال ${i + 1}: ${problem}`);
    else questions.push(q);
  });

  return { questions, errors };
}

/* ------------------------------- shuffling ------------------------------ */

/** Fisher-Yates with a CSPRNG, so no two papers follow a guessable order. */
function shuffled<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------- attempts ------------------------------- */

export type Attempt = {
  id: number;
  examId: number;
  studentId: number;
  startedAt: string;
  deadlineAt: string | null;
  submittedAt: string | null;
  questionOrder: number[];
  optionOrders: Record<string, number[]>;
  answers: Record<string, number>;
  score: number | null;
  maxScore: number | null;
  correctCount: number | null;
  questionCount: number | null;
  /** The code and organisation the student sat this exam under; may be empty. */
  studentCode: string;
  orgName: string;
};

function toAttempt(r: Row): Attempt {
  return {
    id: Number(r.id),
    examId: Number(r.exam_id),
    studentId: Number(r.student_id),
    startedAt: String(r.started_at),
    deadlineAt: r.deadline_at ? String(r.deadline_at) : null,
    submittedAt: r.submitted_at ? String(r.submitted_at) : null,
    questionOrder: json.parse<number[]>(String(r.question_order), []),
    optionOrders: json.parse<Record<string, number[]>>(String(r.option_orders), {}),
    answers: json.parse<Record<string, number>>(String(r.answers), {}),
    score: r.score == null ? null : Number(r.score),
    maxScore: r.max_score == null ? null : Number(r.max_score),
    correctCount: r.correct_count == null ? null : Number(r.correct_count),
    questionCount: r.question_count == null ? null : Number(r.question_count),
    studentCode: String(r.student_code ?? ''),
    orgName: String(r.org_name ?? ''),
  };
}

/**
 * Which code a student sits an exam under. A group assigned to the exam that
 * sits for an organisation decides it; failing that, a student who belongs to
 * exactly one organisation uses that one; otherwise there is no code.
 */
export function attributionFor(examId: number, studentId: number): { code: string; orgName: string } {
  const viaGroup = db()
    .prepare(
      `SELECT m.code, o.name FROM exam_groups eg
         JOIN student_groups g ON g.id = eg.group_id AND g.org_id IS NOT NULL
         JOIN group_members gm ON gm.group_id = g.id AND gm.student_id = ?
         JOIN student_orgs m ON m.org_id = g.org_id AND m.student_id = gm.student_id
         JOIN organizations o ON o.id = g.org_id
        WHERE eg.exam_id = ? ORDER BY o.name LIMIT 1`,
    )
    .get(studentId, examId) as { code: string; name: string } | undefined;
  if (viaGroup) return { code: viaGroup.code, orgName: viaGroup.name };

  const all = db()
    .prepare(
      `SELECT m.code, o.name FROM student_orgs m JOIN organizations o ON o.id = m.org_id WHERE m.student_id = ?`,
    )
    .all(studentId) as { code: string; name: string }[];
  return all.length === 1 ? { code: all[0].code, orgName: all[0].name } : { code: '', orgName: '' };
}

/** Marks and stores an attempt from whatever answers it holds. */
function grade(attempt: Attempt, submittedAt: string) {
  const questions = listQuestions(attempt.examId);
  let score = 0;
  let max = 0;
  let correctCount = 0;
  for (const q of questions) {
    max += q.points;
    if (attempt.answers[String(q.id)] === q.correct) {
      score += q.points;
      correctCount += 1;
    }
  }
  db()
    .prepare(
      `UPDATE attempts SET submitted_at = ?, score = ?, max_score = ?, correct_count = ?, question_count = ?
        WHERE id = ? AND submitted_at IS NULL`,
    )
    .run(submittedAt, score, max, correctCount, questions.length, attempt.id);
}

/**
 * An attempt whose time ran out is submitted with the answers saved so far,
 * stamped with its deadline. Called wherever attempts are read, so a student
 * who closed the tab still gets a result without anything running in the
 * background.
 */
function settle(attempt: Attempt): Attempt {
  if (attempt.submittedAt || !attempt.deadlineAt) return attempt;
  if (new Date(attempt.deadlineAt).getTime() > Date.now()) return attempt;

  grade(attempt, attempt.deadlineAt);
  return getAttempt(attempt.id) ?? attempt;
}

export function getAttempt(id: number): Attempt | undefined {
  const row = db().prepare(`SELECT * FROM attempts WHERE id = ?`).get(id) as Row | undefined;
  return row ? toAttempt(row) : undefined;
}

export function attemptsFor(examId: number, studentId: number): Attempt[] {
  const rows = db()
    .prepare(`SELECT * FROM attempts WHERE exam_id = ? AND student_id = ? ORDER BY id`)
    .all(examId, studentId) as Row[];
  return rows.map((r) => settle(toAttempt(r)));
}

export function attemptsOfExam(examId: number): Attempt[] {
  const rows = db().prepare(`SELECT * FROM attempts WHERE exam_id = ? ORDER BY id`).all(examId) as Row[];
  return rows.map((r) => settle(toAttempt(r)));
}

export function allAttempts(): Attempt[] {
  const rows = db().prepare(`SELECT * FROM attempts ORDER BY id`).all() as Row[];
  return rows.map((r) => settle(toAttempt(r)));
}

export function deleteAttempt(id: number) {
  db().prepare(`DELETE FROM attempts WHERE id = ?`).run(id);
}

/* --------------------------- what a student can do ---------------------- */

export type Availability =
  | { state: 'not-assigned' }
  | { state: 'upcoming'; startAt: string }
  | { state: 'closed' }
  | { state: 'no-attempts-left' }
  | { state: 'in-progress'; attempt: Attempt }
  | { state: 'ready'; attemptsLeft: number };

export function isAssigned(examId: number, studentId: number): boolean {
  return (
    db()
      .prepare(
        `SELECT 1 FROM exam_groups g JOIN group_members m ON m.group_id = g.group_id
          WHERE g.exam_id = ? AND m.student_id = ? LIMIT 1`,
      )
      .get(examId, studentId) !== undefined
  );
}

export function availability(exam: Exam, studentId: number, now = new Date()): Availability {
  if (!exam.published || !isAssigned(exam.id, studentId)) return { state: 'not-assigned' };

  const attempts = attemptsFor(exam.id, studentId);
  const open = attempts.find((a) => !a.submittedAt);
  if (open) return { state: 'in-progress', attempt: open };

  if (exam.startAt && new Date(exam.startAt) > now) return { state: 'upcoming', startAt: exam.startAt };
  if (exam.endAt && new Date(exam.endAt) <= now) return { state: 'closed' };
  if (attempts.length >= exam.maxAttempts) return { state: 'no-attempts-left' };
  return { state: 'ready', attemptsLeft: exam.maxAttempts - attempts.length };
}

/** Exams a student has been assigned and that are published. */
export function examsForStudent(studentId: number): Exam[] {
  const rows = db()
    .prepare(
      `SELECT DISTINCT e.* FROM exams e
         JOIN exam_groups g ON g.exam_id = e.id
         JOIN group_members m ON m.group_id = g.group_id
        WHERE m.student_id = ? AND e.published = 1
        ORDER BY e.created_at DESC, e.id DESC`,
    )
    .all(studentId) as Row[];
  return rows.map(toExam);
}

export type StartResult = { ok: true; attemptId: number } | { ok: false; error: string };

/** Starts an attempt and freezes this student's shuffle onto it. */
export function startAttempt(exam: Exam, studentId: number): StartResult {
  const avail = availability(exam, studentId);
  if (avail.state === 'in-progress') return { ok: true, attemptId: avail.attempt.id };
  if (avail.state !== 'ready') {
    const why: Record<string, string> = {
      'not-assigned': 'این آزمون برای شما تعریف نشده است.',
      upcoming: 'هنوز زمان آزمون نرسیده است.',
      closed: 'زمان این آزمون تمام شده است.',
      'no-attempts-left': 'تعداد دفعات مجاز شما تمام شده است.',
    };
    return { ok: false, error: why[avail.state] ?? 'امکان شروع نیست.' };
  }

  const questions = listQuestions(exam.id);
  if (questions.length === 0) return { ok: false, error: 'این آزمون هنوز سؤالی ندارد.' };

  const ids = questions.map((q) => q.id);
  const order = exam.shuffleQuestions ? shuffled(ids) : ids;
  const optionOrders: Record<string, number[]> = {};
  for (const q of questions) {
    const idx = q.options.map((_, i) => i);
    optionOrders[String(q.id)] = exam.shuffleOptions ? shuffled(idx) : idx;
  }

  const now = new Date();
  const candidates: number[] = [];
  if (exam.durationMin) candidates.push(now.getTime() + exam.durationMin * 60_000);
  if (exam.endAt) candidates.push(new Date(exam.endAt).getTime());
  const deadline = candidates.length ? new Date(Math.min(...candidates)).toISOString() : null;

  const who = attributionFor(exam.id, studentId);
  const info = db()
    .prepare(
      `INSERT INTO attempts (exam_id, student_id, started_at, deadline_at, question_order, option_orders, student_code, org_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      exam.id,
      studentId,
      now.toISOString(),
      deadline,
      json.stringify(order),
      json.stringify(optionOrders),
      who.code,
      who.orgName,
    );

  return { ok: true, attemptId: Number(info.lastInsertRowid) };
}

/** What the browser needs to show a running paper: no answer key. */
export type PaperQuestion = { id: number; text: string; options: { value: number; text: string }[]; points: number };

export function paperFor(attempt: Attempt): PaperQuestion[] {
  const byId = new Map(listQuestions(attempt.examId).map((q) => [q.id, q]));
  const paper: PaperQuestion[] = [];
  for (const id of attempt.questionOrder) {
    const q = byId.get(id);
    if (!q) continue;
    const order = attempt.optionOrders[String(id)] ?? q.options.map((_, i) => i);
    paper.push({
      id,
      text: q.text,
      points: q.points,
      options: order.map((value) => ({ value, text: q.options[value] })),
    });
  }
  return paper;
}

export function saveAnswer(attemptId: number, studentId: number, questionId: number, value: number | null): boolean {
  const attempt = getAttempt(attemptId);
  if (!attempt || attempt.studentId !== studentId || attempt.submittedAt) return false;
  if (attempt.deadlineAt && new Date(attempt.deadlineAt).getTime() <= Date.now()) return false;
  if (!attempt.questionOrder.includes(questionId)) return false;

  const answers = { ...attempt.answers };
  if (value === null) delete answers[String(questionId)];
  else if (Number.isInteger(value) && value >= 0 && value < OPTION_COUNT) answers[String(questionId)] = value;
  else return false;

  db().prepare(`UPDATE attempts SET answers = ? WHERE id = ?`).run(json.stringify(answers), attemptId);
  return true;
}

/** The student pressed submit (or the clock ran out in their browser). */
export function submitAttempt(attemptId: number, studentId: number, answers?: Record<string, number>) {
  const attempt = getAttempt(attemptId);
  if (!attempt || attempt.studentId !== studentId || attempt.submittedAt) return;

  const now = new Date();
  // Past the deadline the stored answers stand and the stamp is the deadline.
  const late = attempt.deadlineAt && new Date(attempt.deadlineAt) <= now;
  if (!late && answers) {
    const clean: Record<string, number> = {};
    for (const id of attempt.questionOrder) {
      const v = answers[String(id)];
      if (Number.isInteger(v) && v >= 0 && v < OPTION_COUNT) clean[String(id)] = v;
    }
    attempt.answers = clean;
    db().prepare(`UPDATE attempts SET answers = ? WHERE id = ?`).run(json.stringify(clean), attemptId);
  }
  grade(attempt, late && attempt.deadlineAt ? attempt.deadlineAt : now.toISOString());
}

/* -------------------------------- results ------------------------------- */

export function percentOf(a: Pick<Attempt, 'score' | 'maxScore'>): number | null {
  if (a.score == null || !a.maxScore) return null;
  return Math.round((a.score / a.maxScore) * 1000) / 10;
}

/** May this student see the score for this exam right now? */
export function canSeeResult(exam: Exam, now = new Date()): boolean {
  if (exam.resultMode === 'hidden') return false;
  if (exam.resultMode === 'after_end') return !exam.endAt || new Date(exam.endAt) <= now;
  return true;
}

export type ResultRow = {
  studentId: number;
  name: string;
  nationalId: string;
  store: string;
  phone: string;
  groups: string[];
  code: string;
  orgName: string;
  attempts: Attempt[];
  best: Attempt | null;
};

/** One row per assigned student, whether or not they sat the exam. */
export function resultRows(exam: Exam): ResultRow[] {
  const ids = new Set(assignedStudentIds(exam.id));
  const attempts = attemptsOfExam(exam.id);
  // A student removed from the group after sitting still keeps their result.
  attempts.forEach((a) => ids.add(a.studentId));
  if (ids.size === 0) return [];

  const idList = Array.from(ids);
  const students = db()
    .prepare(`SELECT id, name, phone, national_id, store FROM students WHERE id IN (${idList.map(() => '?').join(',')})`)
    .all(...idList) as { id: number; name: string; phone: string | null; national_id: string | null; store: string }[];

  const groupRows = db()
    .prepare(
      `SELECT m.student_id, g.name FROM group_members m
         JOIN student_groups g ON g.id = m.group_id
         JOIN exam_groups eg ON eg.group_id = g.id
        WHERE eg.exam_id = ?`,
    )
    .all(exam.id) as { student_id: number; name: string }[];

  return students
    .map((s) => {
      const mine = attempts.filter((a) => a.studentId === s.id);
      const done = mine.filter((a) => a.submittedAt && a.score != null);
      const best = done.length ? done.reduce((x, y) => ((y.score ?? 0) > (x.score ?? 0) ? y : x)) : null;
      // What the student actually sat under wins; before they sit, what they would sit under.
      const sat = best ?? mine[mine.length - 1];
      const who = sat?.studentCode ? { code: sat.studentCode, orgName: sat.orgName } : attributionFor(exam.id, s.id);
      return {
        code: who.code,
        orgName: who.orgName,
        studentId: s.id,
        name: s.name,
        nationalId: s.national_id ?? '',
        store: s.store,
        phone: s.phone ?? '',
        groups: groupRows.filter((g) => g.student_id === s.id).map((g) => g.name),
        attempts: mine,
        best,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'fa'));
}

export function examSummary(examId: number) {
  const d = db();
  const questions = (d.prepare(`SELECT COUNT(*) AS n FROM exam_questions WHERE exam_id = ?`).get(examId) as { n: number }).n;
  const groups = (d.prepare(`SELECT COUNT(*) AS n FROM exam_groups WHERE exam_id = ?`).get(examId) as { n: number }).n;
  const attempts = (d.prepare(`SELECT COUNT(*) AS n FROM attempts WHERE exam_id = ?`).get(examId) as { n: number }).n;
  return { questions, groups, attempts, students: assignedStudentIds(examId).length };
}
