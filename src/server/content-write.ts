import { db, json } from './db';

import type { ArticleBlock } from '@/content/articles';

/**
 * Writes for the panel. Reads live in content.ts; keeping the two apart means
 * a page that only renders content cannot accidentally modify it.
 */

export type ArticleInput = {
  slug: string;
  published: boolean;
  title: string;
  shortTitle: string;
  kind: string;
  authorName: string;
  authorTitle: string;
  publishedAt: string;
  excerpt: string;
  coverSrc: string;
  coverAlt: string;
  keywords: string[];
  body: ArticleBlock[];
};

export function upsertArticle(input: ArticleInput, originalSlug?: string) {
  const existing = originalSlug ?? input.slug;
  const row = db().prepare(`SELECT position FROM articles WHERE slug = ?`).get(existing) as
    | { position: number }
    | undefined;

  if (row && originalSlug && originalSlug !== input.slug) {
    db().prepare(`DELETE FROM articles WHERE slug = ?`).run(originalSlug);
  }

  db()
    .prepare(
      `INSERT INTO articles
         (slug, published, position, title, short_title, kind, author_name,
          author_title, published_at, excerpt, cover_src, cover_alt, keywords, body)
       VALUES (@slug, @published, @position, @title, @shortTitle, @kind, @authorName,
               @authorTitle, @publishedAt, @excerpt, @coverSrc, @coverAlt, @keywords, @body)
       ON CONFLICT(slug) DO UPDATE SET
         published = excluded.published, title = excluded.title,
         short_title = excluded.short_title, kind = excluded.kind,
         author_name = excluded.author_name, author_title = excluded.author_title,
         published_at = excluded.published_at, excerpt = excluded.excerpt,
         cover_src = excluded.cover_src, cover_alt = excluded.cover_alt,
         keywords = excluded.keywords, body = excluded.body`,
    )
    .run({
      slug: input.slug,
      published: input.published ? 1 : 0,
      position: row?.position ?? 0,
      title: input.title,
      shortTitle: input.shortTitle || input.title,
      kind: input.kind,
      authorName: input.authorName,
      authorTitle: input.authorTitle,
      publishedAt: input.publishedAt,
      excerpt: input.excerpt,
      coverSrc: input.coverSrc,
      coverAlt: input.coverAlt,
      keywords: json.stringify(input.keywords),
      body: json.stringify(input.body),
    });
}

export function deleteArticle(slug: string) {
  db().prepare(`DELETE FROM articles WHERE slug = ?`).run(slug);
}

export type CourseInput = {
  id: string;
  title: string;
  blurb: string;
  audience: string;
  sessions: number;
  hours: number;
  model: string;
  enabled: boolean;
  position: number;
};

export function upsertCourse(input: CourseInput, originalId?: string) {
  if (originalId && originalId !== input.id) {
    db().prepare(`DELETE FROM courses WHERE id = ?`).run(originalId);
  }

  db()
    .prepare(
      `INSERT INTO courses
         (id, kind, model, enabled, position, title, blurb, audience, sessions, hours, duration, type)
       VALUES (@id, 'course', @model, @enabled, @position, @title, @blurb, @audience, @sessions, @hours, '', '')
       ON CONFLICT(id) DO UPDATE SET
         model = excluded.model, enabled = excluded.enabled, position = excluded.position,
         title = excluded.title, blurb = excluded.blurb, audience = excluded.audience,
         sessions = excluded.sessions, hours = excluded.hours`,
    )
    .run({
      id: input.id,
      model: input.model,
      enabled: input.enabled ? 1 : 0,
      position: input.position,
      title: input.title,
      blurb: input.blurb,
      audience: input.audience,
      sessions: input.sessions,
      hours: input.hours,
    });
}

export function deleteCourse(id: string) {
  db().prepare(`DELETE FROM courses WHERE id = ?`).run(id);
}

/** Replaces the whole glossary: the panel edits it as one list. */
export function replaceGlossary(entries: { term: string; definition: string }[]) {
  const d = db();
  const write = d.transaction(() => {
    d.prepare(`DELETE FROM glossary`).run();
    const ins = d.prepare(
      `INSERT INTO glossary (id, position, term, definition) VALUES (?, ?, ?, ?)`,
    );
    entries
      .filter((e) => e.term.trim())
      .forEach((e, i) => ins.run(`term-${i + 1}`, i, e.term.trim(), e.definition.trim()));
  });
  write();
}

/**
 * Stamps the moment content last changed.
 *
 * The sitemap reports this as each page's lastModified. Sending "now" on every
 * crawl tells search engines the whole site changed every time they look, and
 * they learn to disregard the field entirely.
 */
export function touchContent() {
  db()
    .prepare(
      `INSERT INTO settings (key, value) VALUES ('contentUpdatedAt', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(json.stringify(new Date().toISOString()));
}

export function setSetting(key: string, value: unknown) {
  db()
    .prepare(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(key, json.stringify(value));
}

export function updateHeroSlide(
  id: string,
  patch: { eyebrow: string; title: string; lead: string; enabled: boolean },
) {
  db()
    .prepare(
      `UPDATE hero_slides SET eyebrow = ?, title = ?, lead = ?, enabled = ? WHERE id = ?`,
    )
    .run(patch.eyebrow, patch.title, patch.lead, patch.enabled ? 1 : 0, id);
}

export function listHeroSlidesForAdmin() {
  return db()
    .prepare(`SELECT id, enabled, eyebrow, title, lead FROM hero_slides ORDER BY position ASC`)
    .all() as { id: string; enabled: number; eyebrow: string; title: string; lead: string }[];
}
