import { db, json } from './db';

/**
 * Every picture on the public site that is not tied to an article, a person or
 * a slide. Each has a place in the panel; an empty field means "use the
 * original", so nothing breaks if a replacement is removed.
 */

export type ImageSlot = { key: string; label: string; hint: string; default: string };

export const IMAGE_SLOTS: readonly ImageSlot[] = [
  { key: 'site.logo', label: 'لوگوی آکادمی', hint: 'در هدر، فوتر، صفحه‌ی در حال ساخت، داده‌های گوگل و پیش‌نمایش لینک. مربع و با پس‌زمینه‌ی شفاف.', default: '/media/logo-mark.png' },
  { key: 'about.photo', label: 'تصویر صفحه‌ی معرفی', hint: 'کنار متن «هدف، مأموریت و چشم‌انداز».', default: '/media/academy-about.webp' },
  { key: 'corporate.photo1', label: 'تصویر اول خدمات سازمانی', hint: 'بالای صفحه‌ی خدمات سازمانی.', default: '/media/articles/retail-boutique.webp' },
  { key: 'corporate.photo2', label: 'تصویر دوم خدمات سازمانی', hint: 'کنار شماره‌ی تماس در همان صفحه.', default: '/media/academy.jpg' },
  { key: 'hero.fallback', label: 'تصویر پیش‌فرض اسلایدر', hint: 'وقتی اسلایدی تصویر خودش را ندارد. تصویر هر اسلاید در «متن‌های سایت» است.', default: '/media/academy.jpg' },
  { key: 'home.emblem', label: 'نشان سه‌بعدی صفحه‌ی اول', hint: 'تصویر نشان وقتی مدل سه‌بعدی بارگذاری نمی‌شود.', default: '/media/emblem.png' },
];

/** Only pictures from this site: the built-in ones or what was uploaded in the panel. */
export function isSafeImage(value: string): boolean {
  return /^\/(media|uploads)\/[A-Za-z0-9._/-]+$/.test(value) && !value.includes('..');
}

function saved(): Record<string, string> {
  const row = db().prepare(`SELECT value FROM settings WHERE key = 'images'`).get() as { value: string } | undefined;
  return row ? json.parse<Record<string, string>>(row.value, {}) : {};
}

export function getImages(): Record<string, string> {
  const s = saved();
  return Object.fromEntries(
    IMAGE_SLOTS.map((slot) => [slot.key, typeof s[slot.key] === 'string' && isSafeImage(s[slot.key]) ? s[slot.key] : slot.default]),
  );
}

export function img(key: string): string {
  return getImages()[key] ?? '';
}

/** Stores only replacements; a value equal to the original is the same as none. */
export function saveImages(values: Record<string, string>) {
  const keep: Record<string, string> = {};
  for (const slot of IMAGE_SLOTS) {
    const v = (values[slot.key] ?? '').trim();
    if (v && v !== slot.default && isSafeImage(v)) keep[slot.key] = v;
  }
  db()
    .prepare(`INSERT INTO settings (key, value) VALUES ('images', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .run(json.stringify(keep));
}
