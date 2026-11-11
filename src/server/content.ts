import { db, json } from './db';
import { img } from './images';

import type { Article, ArticleBlock } from '@/content/articles';
import type { Course, CourseModel, ProgramModel, Seminar, Workshop } from '@/content/programs';
import type { HeroSlide } from '@/content/hero';
import type { GlossaryEntry } from '@/content/knowledge';
import type { Stat } from '@/content/site';

/**
 * Reads content out of the database in exactly the shapes the pages already
 * expect. The page components are not told where their data comes from, which
 * is what lets the panel replace the content files without the site changing.
 *
 * The types still come from src/content/*.ts: those modules remain the
 * definition of what a course or an article is, and the seed of what shipped.
 */

type Row = Record<string, unknown>;

function setting<T>(key: string, fallback: T): T {
  const row = db().prepare(`SELECT value FROM settings WHERE key = ?`).get(key) as
    | { value: string }
    | undefined;
  return row ? json.parse<T>(row.value, fallback) : fallback;
}

export function getSite() {
  return setting('site', {} as Record<string, string>);
}

export function getStats(): readonly Stat[] {
  return setting<Stat[]>('stats', []);
}

export function getPage<T>(slug: string, fallback: T): T {
  const row = db().prepare(`SELECT content FROM pages WHERE slug = ?`).get(slug) as
    | { content: string }
    | undefined;
  return row ? json.parse<T>(row.content, fallback) : fallback;
}

/** When content last changed; falls back to now on a fresh database. */
export function getContentUpdatedAt(): Date {
  const iso = setting<string>('contentUpdatedAt', '');
  const date = iso ? new Date(iso) : null;
  return date && !Number.isNaN(date.getTime()) ? date : new Date();
}

export function getProgramModels(): readonly ProgramModel[] {
  return setting<ProgramModel[]>('programModels', []);
}

export function getHeroAutoplayMs(): number {
  return setting<number>('heroAutoplayMs', 7000);
}

/** Enabled slides only, in panel order — what the homepage rotates through. */
export function getHeroSlides(): HeroSlide[] {
  const rows = db()
    .prepare(
      `SELECT * FROM hero_slides WHERE enabled = 1 ORDER BY position ASC`,
    )
    .all() as Row[];

  return rows.map((r) => ({
    id: String(r.id),
    enabled: true,
    eyebrow: String(r.eyebrow),
    title: String(r.title),
    lead: String(r.lead),
    primary: { href: String(r.primary_href), label: String(r.primary_label) },
    secondary: { href: String(r.secondary_href), label: String(r.secondary_label) },
    visual: String(r.visual) as HeroSlide['visual'],
    // A slide with no picture of its own takes the site's default (or, for the 3D scene, the flat emblem).
    image: String(r.image) || (String(r.visual) === 'scene3d' ? img('home.emblem') : img('hero.fallback')),
    ...(r.image_badge ? { imageBadge: String(r.image_badge) } : {}),
  }));
}

function toCourse(r: Row): Course {
  return {
    id: String(r.id),
    title: String(r.title),
    blurb: String(r.blurb),
    audience: String(r.audience),
    sessions: Number(r.sessions),
    hours: Number(r.hours),
    model: String(r.model) as CourseModel,
    enabled: Number(r.enabled) === 1,
    order: Number(r.position),
  };
}

/** Enabled courses, in panel order — the list the site renders. */
export function getVisibleCourses(): readonly Course[] {
  const rows = db()
    .prepare(
      `SELECT * FROM courses WHERE kind = 'course' AND enabled = 1 ORDER BY position ASC`,
    )
    .all() as Row[];
  return rows.map(toCourse);
}

/** Every course including the hidden ones — the panel's list. */
export function getAllCourses(): readonly Course[] {
  const rows = db()
    .prepare(`SELECT * FROM courses WHERE kind = 'course' ORDER BY position ASC`)
    .all() as Row[];
  return rows.map(toCourse);
}

export function getWorkshops(): readonly Workshop[] {
  const rows = db()
    .prepare(`SELECT * FROM courses WHERE kind = 'workshop' AND enabled = 1 ORDER BY position ASC`)
    .all() as Row[];
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    blurb: String(r.blurb),
    duration: String(r.duration),
  }));
}

export function getSeminars(): readonly Seminar[] {
  const rows = db()
    .prepare(`SELECT * FROM courses WHERE kind = 'seminar' AND enabled = 1 ORDER BY position ASC`)
    .all() as Row[];
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    blurb: String(r.blurb),
    type: String(r.type),
  }));
}

function toArticle(r: Row): Article {
  return {
    slug: String(r.slug),
    title: String(r.title),
    shortTitle: String(r.short_title),
    kind: String(r.kind),
    author: {
      name: String(r.author_name),
      title: String(r.author_title),
      slug: r.author_slug ? String(r.author_slug) : undefined,
    },
    publishedAt: String(r.published_at),
    excerpt: String(r.excerpt),
    cover: { src: String(r.cover_src), alt: String(r.cover_alt) },
    hidden: Number(r.published) === 0,
    keywords: json.parse<string[]>(String(r.keywords), []),
    body: json.parse<ArticleBlock[]>(String(r.body), []),
  };
}

/** Published articles, newest first — the order the site lists them in. */
export function getArticles(): readonly Article[] {
  const rows = db()
    .prepare(
      `SELECT * FROM articles WHERE published = 1 ORDER BY published_at DESC, position ASC`,
    )
    .all() as Row[];
  return rows.map(toArticle);
}

/** Every article including drafts — the panel's list. */
export function getAllArticles(): readonly Article[] {
  const rows = db()
    .prepare(`SELECT * FROM articles ORDER BY published_at DESC, position ASC`)
    .all() as Row[];
  return rows.map(toArticle);
}

/**
 * One article by address. Unpublished articles are not returned unless the
 * caller asks for drafts — the public page must not serve an article that has
 * been taken off the site just because someone knows its address.
 */
export function getArticleBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Article | undefined {
  const row = db()
    .prepare(`SELECT * FROM articles WHERE slug = ?${options.includeDrafts ? '' : ' AND published = 1'}`)
    .get(slug) as Row | undefined;
  return row ? toArticle(row) : undefined;
}

export function getGlossary(): readonly GlossaryEntry[] {
  const rows = db()
    .prepare(`SELECT term, definition FROM glossary ORDER BY position ASC`)
    .all() as Row[];
  return rows.map((r) => ({ term: String(r.term), def: String(r.definition) }));
}
