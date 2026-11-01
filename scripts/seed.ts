/**
 * Loads the content that currently lives in src/content/*.ts into the database.
 *
 * Run once, when the database is empty: `npm run seed`. It refuses to overwrite
 * a store that already holds content, so it can never wipe edits made in the
 * panel. Pass --force to reseed deliberately.
 *
 * The TypeScript modules stay in the repo after this. They are the record of
 * what the site shipped with, and the only way back if the database is lost
 * before the first backup.
 */
import { db, json } from '../src/server/db';
import { site } from '../src/content/site';
import { hero } from '../src/content/hero';
import { pages } from '../src/content/pages';
import { glossary, news, media, toolkits, library, handoutsArchive } from '../src/content/knowledge';
import { articles } from '../src/content/articles';
import {
  programModels,
  courses,
  featuredCourse,
  workshops,
  seminars,
  pastEvents,
  calendar,
} from '../src/content/programs';

const force = process.argv.includes('--force');
const d = db();

const existing = d.prepare(`SELECT COUNT(*) AS n FROM pages`).get() as { n: number };
if (existing.n > 0 && !force) {
  console.log('دیتابیس از قبل محتوا دارد. برای بازنویسی عمدی: npm run seed -- --force');
  process.exit(0);
}

const setSetting = d.prepare(
  `INSERT INTO settings (key, value) VALUES (?, ?)
   ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
);
const setPage = d.prepare(
  `INSERT INTO pages (slug, content) VALUES (?, ?)
   ON CONFLICT(slug) DO UPDATE SET content = excluded.content`,
);

const seedAll = d.transaction(() => {
  // --- settings: the one-off values and the lists nothing queries into ---
  const { stats, ...siteRest } = site;
  setSetting.run('site', json.stringify(siteRest));
  setSetting.run('stats', json.stringify(stats));
  setSetting.run('programModels', json.stringify(programModels));
  setSetting.run('featuredCourse', json.stringify(featuredCourse));
  setSetting.run('pastEvents', json.stringify(pastEvents));
  setSetting.run('calendar', json.stringify(calendar));
  setSetting.run('heroAutoplayMs', json.stringify(hero.autoplayMs));
  setSetting.run('news', json.stringify(news));
  setSetting.run('media', json.stringify(media));
  setSetting.run('toolkits', json.stringify(toolkits));
  setSetting.run('library', json.stringify(library));
  setSetting.run('handoutsArchive', json.stringify(handoutsArchive));

  // --- pages: each one keeps its own bespoke shape ---
  for (const [slug, content] of Object.entries(pages)) {
    setPage.run(slug, json.stringify(content));
  }

  // --- hero slides ---
  d.prepare(`DELETE FROM hero_slides`).run();
  const insSlide = d.prepare(
    `INSERT INTO hero_slides
       (id, enabled, position, eyebrow, title, lead,
        primary_href, primary_label, secondary_href, secondary_label,
        visual, image, image_badge)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  hero.slides.forEach((s, i) => {
    insSlide.run(
      s.id,
      s.enabled ? 1 : 0,
      i,
      s.eyebrow,
      s.title,
      s.lead,
      s.primary.href,
      s.primary.label,
      s.secondary?.href ?? '',
      s.secondary?.label ?? '',
      s.visual,
      s.image ?? '',
      'imageBadge' in s ? (s.imageBadge as string) : null,
    );
  });

  // --- courses, workshops and seminars share one table, split by `kind` ---
  d.prepare(`DELETE FROM courses`).run();
  const insCourse = d.prepare(
    `INSERT INTO courses
       (id, kind, model, enabled, position, title, blurb, audience,
        sessions, hours, duration, type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  courses.forEach((c, i) => {
    insCourse.run(
      c.id,
      'course',
      c.model,
      'enabled' in c && c.enabled === false ? 0 : 1,
      'order' in c ? (c.order as number) : i,
      c.title,
      c.blurb,
      c.audience,
      c.sessions,
      c.hours,
      '',
      '',
    );
  });
  workshops.forEach((w, i) => {
    insCourse.run(w.id, 'workshop', 'standard', 1, i, w.title, w.blurb, '', 0, 0, w.duration, '');
  });
  seminars.forEach((s, i) => {
    insCourse.run(s.id, 'seminar', 'standard', 1, i, s.title, s.blurb, '', 0, 0, '', s.type);
  });

  // --- articles ---
  d.prepare(`DELETE FROM articles`).run();
  const insArticle = d.prepare(
    `INSERT INTO articles
       (slug, published, position, title, short_title, kind,
        author_name, author_title, published_at, excerpt,
        cover_src, cover_alt, keywords, body)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  articles.forEach((a, i) => {
    insArticle.run(
      a.slug,
      a.hidden ? 0 : 1,
      i,
      a.title,
      a.shortTitle,
      a.kind,
      a.author.name,
      a.author.title,
      a.publishedAt,
      a.excerpt,
      a.cover.src,
      a.cover.alt,
      json.stringify(a.keywords),
      json.stringify(a.body),
    );
  });

  // --- glossary ---
  d.prepare(`DELETE FROM glossary`).run();
  const insTerm = d.prepare(
    `INSERT INTO glossary (id, position, term, definition) VALUES (?, ?, ?, ?)`,
  );
  glossary.forEach((g, i) => insTerm.run(`term-${i + 1}`, i, g.term, g.def));
});

seedAll();

const count = (table: string) =>
  (d.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n;

console.log('محتوا به دیتابیس منتقل شد:');
console.log(`  تنظیمات      ${count('settings')}`);
console.log(`  صفحات        ${count('pages')}`);
console.log(`  اسلاید هیرو  ${count('hero_slides')}`);
console.log(`  دوره و…      ${count('courses')}`);
console.log(`  مقاله        ${count('articles')}`);
console.log(`  واژه‌نامه     ${count('glossary')}`);
