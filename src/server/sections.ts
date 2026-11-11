import { db, json } from './db';

/**
 * Sections of the public pages that are built but switched off until the
 * academy has real content for them. They used to be constants in the page
 * files, which meant adding the content in the panel changed nothing on the
 * site. Now the switch lives in the panel too.
 */

export type SectionDef = { key: string; page: string; label: string; hint: string };

export const SECTIONS: readonly SectionDef[] = [
  { key: 'about.founders', page: 'معرفی آکادمی', label: 'هیئت مؤسس', hint: 'نام، سمت و عکس را در «متن صفحه‌ها ← معرفی آکادمی» وارد کنید.' },
  { key: 'about.sponsors', page: 'معرفی آکادمی', label: 'حامیان', hint: 'متن آن در «متن صفحه‌ها ← معرفی آکادمی» است.' },
  { key: 'community.albums', page: 'جامعه ARI', label: 'آلبوم رویدادها', hint: 'عنوان و عکس هر آلبوم را در «متن صفحه‌ها ← جامعه ARI» بگذارید.' },
];

export function getSections(): Record<string, boolean> {
  const row = db().prepare(`SELECT value FROM settings WHERE key = 'sections'`).get() as { value: string } | undefined;
  const saved = row ? json.parse<Record<string, boolean>>(row.value, {}) : {};
  return Object.fromEntries(SECTIONS.map((s) => [s.key, saved[s.key] === true]));
}

export function saveSections(on: string[]) {
  const value = Object.fromEntries(SECTIONS.map((s) => [s.key, on.includes(s.key)]));
  db()
    .prepare(`INSERT INTO settings (key, value) VALUES ('sections', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .run(json.stringify(value));
}
