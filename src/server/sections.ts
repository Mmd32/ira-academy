import { db, json } from './db';

/**
 * Parts of the public pages the panel can switch on and off. Each has a
 * default that matches what the site showed before the switches existed, so
 * nothing changes until someone flips one.
 */

export type SectionDef = { key: string; page: string; label: string; hint: string; default: boolean };

export const SECTIONS: readonly SectionDef[] = [
  // Home
  { key: 'home.marquee', page: 'صفحه‌ی اول', label: 'نوار متحرک دوره‌ها', hint: 'زیر اسلایدر بالای صفحه.', default: true },
  { key: 'home.tiles', page: 'صفحه‌ی اول', label: 'کارت‌های بخش‌های آکادمی', hint: 'هفت کارت لینک به صفحه‌های اصلی.', default: true },
  { key: 'home.articles', page: 'صفحه‌ی اول', label: 'تازه‌ترین مقالات', hint: 'سه مقاله‌ی آخر.', default: true },
  { key: 'home.news', page: 'صفحه‌ی اول', label: 'نوار اخبار و رویدادها', hint: 'نوار باریک قبل از دعوت به اقدام.', default: true },
  { key: 'home.cta', page: 'صفحه‌ی اول', label: 'دعوت به اقدام (CTA) پایین صفحه', hint: '«آماده‌ی شروع هستید؟» با دو دکمه.', default: true },
  // About
  { key: 'about.faculty', page: 'معرفی آکادمی', label: 'کادر علمی', hint: 'مدیران گروه و مدرسین. افراد را در «افراد و پروفایل‌ها» اضافه کنید.', default: true },
  { key: 'about.founders', page: 'معرفی آکادمی', label: 'هیئت مؤسس', hint: 'فقط وقتی دیده می‌شود که دست‌کم یک نفر با نقش «هیئت مؤسس» داشته باشید.', default: true },
  { key: 'about.sponsors', page: 'معرفی آکادمی', label: 'حامیان', hint: 'متن آن در «متن صفحه‌ها ← معرفی آکادمی» است.', default: false },
  // Programs
  { key: 'programs.workshops', page: 'برنامه‌های آموزشی', label: 'کارگاه‌ها', hint: 'محتوای فعلی نمونه است.', default: false },
  { key: 'programs.seminars', page: 'برنامه‌های آموزشی', label: 'سمینارها و وبینارها', hint: 'محتوای فعلی نمونه است.', default: false },
  { key: 'programs.pastEvents', page: 'برنامه‌های آموزشی', label: 'دوره‌های برگزارشده', hint: 'محتوای فعلی نمونه است.', default: false },
  { key: 'programs.mba', page: 'برنامه‌های آموزشی', label: 'MBA و Mini MBA', hint: 'تکراری با «همکاری با دانشگاه‌ها».', default: false },
  { key: 'programs.calendar', page: 'برنامه‌های آموزشی', label: 'تقویم آموزشی', hint: 'هنوز تقویم واقعی ندارد.', default: false },
  // Library
  { key: 'knowledge.news', page: 'کتابخانه', label: 'اخبار صنعت', hint: '', default: true },
  { key: 'knowledge.articles', page: 'کتابخانه', label: 'مقالات و موردکاوی‌ها', hint: '', default: true },
  { key: 'knowledge.media', page: 'کتابخانه', label: 'ویدیو و پادکست', hint: '', default: true },
  { key: 'knowledge.library', page: 'کتابخانه', label: 'معرفی کتاب', hint: '', default: true },
  { key: 'knowledge.tools', page: 'کتابخانه', label: 'ابزارهای کاربردی', hint: '', default: true },
  { key: 'knowledge.glossary', page: 'کتابخانه', label: 'لغت‌نامه', hint: '', default: true },
  { key: 'knowledge.handouts', page: 'کتابخانه', label: 'آرشیو جزوات', hint: '', default: true },
  // Community
  { key: 'community.albums', page: 'جامعه ARI', label: 'آلبوم رویدادها', hint: 'عنوان و عکس آلبوم‌ها در «متن صفحه‌ها ← جامعه ARI».', default: false },
];

function saved(): Record<string, boolean> {
  const row = db().prepare(`SELECT value FROM settings WHERE key = 'sections'`).get() as { value: string } | undefined;
  return row ? json.parse<Record<string, boolean>>(row.value, {}) : {};
}

export function getSections(): Record<string, boolean> {
  const s = saved();
  return Object.fromEntries(SECTIONS.map((d) => [d.key, typeof s[d.key] === 'boolean' ? s[d.key] : d.default]));
}

/** What a page asks: is this section switched on? */
export function isOn(key: string): boolean {
  return getSections()[key] ?? true;
}

export function saveSections(on: string[]) {
  const value = Object.fromEntries(SECTIONS.map((s) => [s.key, on.includes(s.key)]));
  db()
    .prepare(`INSERT INTO settings (key, value) VALUES ('sections', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .run(json.stringify(value));
}
