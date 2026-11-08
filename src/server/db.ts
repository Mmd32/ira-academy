import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import Database from 'better-sqlite3';

/**
 * The content and lead store.
 *
 * SQLite because the whole dataset is a few hundred rows of Persian text and
 * one admin account — a database server would be more to operate than to use.
 * Everything here goes through plain SQL with the column names spelled out, so
 * moving to PostgreSQL later is a driver swap in this file, not a rewrite of
 * every caller.
 *
 * The file lives wherever DATABASE_PATH points, so a deployment can put it on
 * a persistent volume rather than inside the build.
 */

const DB_PATH = process.env.DATABASE_PATH ?? 'data/ira.db';

let instance: Database.Database | null = null;

export function db(): Database.Database {
  if (instance) return instance;

  const dir = dirname(DB_PATH);
  if (dir && dir !== '.' && !existsSync(dir)) mkdirSync(dir, { recursive: true });

  instance = new Database(DB_PATH);
  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');
  migrate(instance);
  return instance;
}

/**
 * Schema.
 *
 * Content that the site renders as a list of its own kind — courses, articles,
 * glossary terms, hero slides — gets a table, because the panel has to reorder
 * and switch those one by one. Content that is a page's own bespoke shape
 * (about, corporate, community, contact) is kept as JSON in `pages`: inventing
 * a table per page would buy nothing, since nothing queries inside it.
 */
function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pages (
      slug    TEXT PRIMARY KEY,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hero_slides (
      id        TEXT PRIMARY KEY,
      enabled   INTEGER NOT NULL DEFAULT 1,
      position  INTEGER NOT NULL DEFAULT 0,
      eyebrow   TEXT NOT NULL DEFAULT '',
      title     TEXT NOT NULL DEFAULT '',
      lead      TEXT NOT NULL DEFAULT '',
      primary_href  TEXT NOT NULL DEFAULT '',
      primary_label TEXT NOT NULL DEFAULT '',
      secondary_href  TEXT NOT NULL DEFAULT '',
      secondary_label TEXT NOT NULL DEFAULT '',
      visual    TEXT NOT NULL DEFAULT 'image',
      image     TEXT NOT NULL DEFAULT '',
      image_badge TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      id        TEXT PRIMARY KEY,
      kind      TEXT NOT NULL DEFAULT 'course',
      model     TEXT NOT NULL DEFAULT 'standard',
      enabled   INTEGER NOT NULL DEFAULT 1,
      position  INTEGER NOT NULL DEFAULT 0,
      title     TEXT NOT NULL DEFAULT '',
      blurb     TEXT NOT NULL DEFAULT '',
      audience  TEXT NOT NULL DEFAULT '',
      sessions  INTEGER NOT NULL DEFAULT 0,
      hours     INTEGER NOT NULL DEFAULT 0,
      duration  TEXT NOT NULL DEFAULT '',
      type      TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS articles (
      slug        TEXT PRIMARY KEY,
      published   INTEGER NOT NULL DEFAULT 1,
      position    INTEGER NOT NULL DEFAULT 0,
      title       TEXT NOT NULL DEFAULT '',
      short_title TEXT NOT NULL DEFAULT '',
      kind        TEXT NOT NULL DEFAULT '',
      author_name  TEXT NOT NULL DEFAULT '',
      author_title TEXT NOT NULL DEFAULT '',
      published_at TEXT NOT NULL DEFAULT '',
      excerpt      TEXT NOT NULL DEFAULT '',
      cover_src    TEXT NOT NULL DEFAULT '',
      cover_alt    TEXT NOT NULL DEFAULT '',
      keywords     TEXT NOT NULL DEFAULT '[]',
      body         TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS glossary (
      id       TEXT PRIMARY KEY,
      position INTEGER NOT NULL DEFAULT 0,
      term     TEXT NOT NULL DEFAULT '',
      definition TEXT NOT NULL DEFAULT ''
    );

    /* Form submissions. status is the back-office call outcome. */
    CREATE TABLE IF NOT EXISTS leads (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      type       TEXT NOT NULL DEFAULT '',
      program    TEXT NOT NULL DEFAULT '',
      name       TEXT NOT NULL DEFAULT '',
      phone      TEXT NOT NULL DEFAULT '',
      company    TEXT NOT NULL DEFAULT '',
      note       TEXT NOT NULL DEFAULT '',
      status     TEXT NOT NULL DEFAULT 'new',
      call_notes TEXT NOT NULL DEFAULT '',
      handled_by TEXT NOT NULL DEFAULT '',
      updated_at TEXT
    );
    CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at DESC);
    CREATE INDEX IF NOT EXISTS leads_status  ON leads (status);

    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT NOT NULL UNIQUE,
      display_name  TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id);

    /* Student portal. A student is not an admin: separate table, separate cookie. */
    CREATE TABLE IF NOT EXISTS students (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      phone         TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      active        INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS student_sessions (
      token      TEXT PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS student_sessions_student ON student_sessions (student_id);

    CREATE TABLE IF NOT EXISTS student_groups (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL UNIQUE,
      note       TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS group_members (
      group_id   INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      PRIMARY KEY (group_id, student_id)
    );
    CREATE INDEX IF NOT EXISTS group_members_student ON group_members (student_id);

    /*
     * Exams. start_at / end_at bound when a student may begin; duration_min is
     * how long one attempt may take. Each is optional, so an exam can be
     * windowed, timed, both, or open.
     */
    CREATE TABLE IF NOT EXISTS exams (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL DEFAULT '',
      description   TEXT NOT NULL DEFAULT '',
      published     INTEGER NOT NULL DEFAULT 0,
      start_at      TEXT,
      end_at        TEXT,
      duration_min  INTEGER,
      max_attempts  INTEGER NOT NULL DEFAULT 1,
      shuffle_questions INTEGER NOT NULL DEFAULT 1,
      shuffle_options   INTEGER NOT NULL DEFAULT 1,
      result_mode   TEXT NOT NULL DEFAULT 'immediate',
      show_answers  INTEGER NOT NULL DEFAULT 0,
      pass_percent  INTEGER,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exam_questions (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id   INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      position  INTEGER NOT NULL DEFAULT 0,
      text      TEXT NOT NULL DEFAULT '',
      options   TEXT NOT NULL DEFAULT '[]',
      correct   INTEGER NOT NULL DEFAULT 0,
      points    INTEGER NOT NULL DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS exam_questions_exam ON exam_questions (exam_id);

    CREATE TABLE IF NOT EXISTS exam_groups (
      exam_id  INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      group_id INTEGER NOT NULL REFERENCES student_groups(id) ON DELETE CASCADE,
      PRIMARY KEY (exam_id, group_id)
    );

    /*
     * One sitting. question_order and option_orders freeze this student's own
     * shuffle at the moment they start, so a refresh shows the same paper.
     */
    CREATE TABLE IF NOT EXISTS attempts (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id       INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      student_id    INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      started_at    TEXT NOT NULL,
      deadline_at   TEXT,
      submitted_at  TEXT,
      question_order TEXT NOT NULL DEFAULT '[]',
      option_orders  TEXT NOT NULL DEFAULT '{}',
      answers        TEXT NOT NULL DEFAULT '{}',
      score         INTEGER,
      max_score     INTEGER,
      correct_count INTEGER,
      question_count INTEGER
    );
    CREATE INDEX IF NOT EXISTS attempts_exam    ON attempts (exam_id);
    CREATE INDEX IF NOT EXISTS attempts_student ON attempts (student_id);

    /*
     * Organisations a student may take part through. A student keeps one
     * account but gets one code per organisation; the code is PREFIX-0001,
     * counted per organisation and never reused.
     */
    CREATE TABLE IF NOT EXISTS organizations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL UNIQUE,
      prefix     TEXT NOT NULL UNIQUE,
      note       TEXT NOT NULL DEFAULT '',
      next_seq   INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS student_orgs (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      org_id     INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      code       TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      PRIMARY KEY (student_id, org_id)
    );
    CREATE INDEX IF NOT EXISTS student_orgs_org ON student_orgs (org_id);
  `);

  // Columns added after the first release. CREATE TABLE IF NOT EXISTS leaves an
  // existing table as it was, so a new column has to be added explicitly.
  const leadColumns = (d.pragma('table_info(leads)') as { name: string }[]).map((c) => c.name);
  if (!leadColumns.includes('position')) {
    d.exec(`ALTER TABLE leads ADD COLUMN position TEXT NOT NULL DEFAULT ''`);
  }

  const addColumn = (table: string, column: string, definition: string) => {
    const cols = (d.pragma(`table_info(${table})`) as { name: string }[]).map((c) => c.name);
    if (!cols.includes(column)) d.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  };
  // A group may sit for an organisation; its members are enrolled in it.
  addColumn('student_groups', 'org_id', 'INTEGER REFERENCES organizations(id) ON DELETE SET NULL');
  // The code a student sat the exam under, frozen on the attempt so a later
  // change of organisation never rewrites an old result.
  addColumn('attempts', 'student_code', "TEXT NOT NULL DEFAULT ''");
  addColumn('attempts', 'org_name', "TEXT NOT NULL DEFAULT ''");
}

/** True once the content tables have been seeded. */
export function isSeeded(): boolean {
  const row = db().prepare(`SELECT COUNT(*) AS n FROM pages`).get() as { n: number };
  return row.n > 0;
}

export const json = {
  parse<T>(raw: string, fallback: T): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  stringify(value: unknown): string {
    return JSON.stringify(value);
  },
};
