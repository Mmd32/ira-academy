/**
 * Brings an existing database in line with the copy now in src/content.
 *
 *   npm run sync-copy
 *
 * `npm run seed` refuses to touch a database that already holds content, and
 * `--force` would discard everything edited in the panel. This updates only
 * what a copy round changed — the about, corporate and community pages, the
 * delivery models, which articles are shown, and a few phrases — and leaves
 * the rest alone. It is safe to run twice.
 */
import { db, json } from '../src/server/db';
import { pages } from '../src/content/pages';
import { programModels } from '../src/content/programs';
import { articles } from '../src/content/articles';

const d = db();

// Page bodies that are not editable in the panel take the seed as it stands.
const setPage = d.prepare(`UPDATE pages SET content = ? WHERE slug = ?`);
for (const slug of ['about', 'corporate', 'community'] as const) {
  setPage.run(json.stringify(pages[slug]), slug);
}

// The contact page is partly edited in place; only a phrase changes there.
const contact = d.prepare(`SELECT content FROM pages WHERE slug = 'contact'`).get() as
  | { content: string }
  | undefined;
if (contact) {
  setPage.run(contact.content.replaceAll('جلسه‌ی نیازسنجی', 'جلسه نیازسنجی'), 'contact');
}

d.prepare(
  `INSERT INTO settings (key, value) VALUES ('programModels', ?)
   ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
).run(json.stringify(programModels));

// Which articles are on the site.
const setPublished = d.prepare(`UPDATE articles SET published = ? WHERE slug = ?`);
for (const a of articles) setPublished.run(a.hidden ? 0 : 1, a.slug);

// The hidden corporate slide carries the same phrases as the page.
d.prepare(
  `UPDATE hero_slides
      SET eyebrow = REPLACE(eyebrow, 'Custom-Made', 'ویژه‌سازی‌شده'),
          secondary_label = REPLACE(secondary_label, 'جلسه‌ی نیازسنجی', 'جلسه نیازسنجی'),
          primary_label = REPLACE(primary_label, 'جلسه‌ی نیازسنجی', 'جلسه نیازسنجی')`,
).run();

// Stamp the change so the sitemap reports it.
d.prepare(
  `INSERT INTO settings (key, value) VALUES ('contentUpdatedAt', ?)
   ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
).run(json.stringify(new Date().toISOString()));

const shown = (d.prepare(`SELECT COUNT(*) AS n FROM articles WHERE published = 1`).get() as { n: number }).n;
console.log('محتوا هماهنگ شد.');
console.log(`  مقاله‌های نمایش‌داده‌شده: ${shown}`);
