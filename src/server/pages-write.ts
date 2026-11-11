import { db, json } from './db';
import { touchContent } from './content-write';

export const EDITABLE_PAGES: Record<string, string> = {
  about: 'معرفی آکادمی',
  corporate: 'خدمات سازمانی',
  community: 'جامعه ARI',
  contact: 'تماس (سؤال‌های متداول و همکاری)',
};

/**
 * People and albums can carry a picture. Pages stored before pictures existed
 * have no `image` key on them, so the key is added (empty) before the page is
 * edited or compared, and the editor always has somewhere to put one.
 */
export function withImages(slug: string, content: any): any {
  const copy = JSON.parse(JSON.stringify(content));
  const ensure = (list: any) => {
    if (Array.isArray(list)) for (const item of list) if (item && typeof item === 'object' && !('image' in item)) item.image = '';
  };
  if (slug === 'about') {
    ensure(copy.founders);
    if (Array.isArray(copy.faculty)) copy.faculty.forEach((g: any) => ensure(g.people));
  }
  return copy;
}

/** Walks a value and says whether it has the same shape as the one it replaces: same keys, same types, strings bounded. */
function sameShape(next: unknown, current: unknown, depth = 0): boolean {
  if (depth > 6) return false;
  if (typeof current === 'string') return typeof next === 'string' && next.length <= 6000;
  if (Array.isArray(current)) {
    if (!Array.isArray(next) || next.length > 60) return false;
    // New rows are modelled on the first existing one; an empty array accepts strings only.
    const model = current[0];
    return next.every((n) => (model === undefined ? typeof n === 'string' && n.length <= 6000 : sameShape(n, model, depth + 1)));
  }
  if (current && typeof current === 'object') {
    if (!next || typeof next !== 'object' || Array.isArray(next)) return false;
    const a = Object.keys(current as object).sort().join('|');
    const b = Object.keys(next as object).sort().join('|');
    if (a !== b) return false;
    return Object.keys(current as object).every((k) =>
      sameShape((next as Record<string, unknown>)[k], (current as Record<string, unknown>)[k], depth + 1),
    );
  }
  return false;
}

export function savePage(slug: string, current: unknown, raw: string): string | null {
  if (!(slug in EDITABLE_PAGES)) return 'صفحه‌ی نامعتبر';
  if (raw.length > 200_000) return 'متن بیش از حد بزرگ است';
  let next: unknown;
  try {
    next = JSON.parse(raw);
  } catch {
    return 'اطلاعات ارسالی خوانده نشد';
  }
  if (!sameShape(next, withImages(slug, current))) return 'ساختار صفحه تغییر کرده و ذخیره نشد. صفحه را دوباره باز کنید.';

  db()
    .prepare(`INSERT INTO pages (slug, content) VALUES (?, ?) ON CONFLICT(slug) DO UPDATE SET content = excluded.content`)
    .run(slug, json.stringify(next));
  touchContent();
  return null;
}
