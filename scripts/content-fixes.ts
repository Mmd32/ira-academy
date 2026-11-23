/**
 * One-off wording corrections for a database that was seeded before they were
 * made. Safe to run twice: each step only changes text that still has the old
 * wording, and anything an editor has already rewritten in the panel is left
 * alone.
 *
 *   npm run content-fixes
 */
import { db, json } from '../src/server/db';
import { pages as seed } from '../src/content/pages';
import { site as siteSeed } from '../src/content/site';

const d = db();
const touched: string[] = [];

function page(slug: string): Record<string, any> | null {
  const row = d.prepare(`SELECT content FROM pages WHERE slug = ?`).get(slug) as { content: string } | undefined;
  return row ? json.parse(row.content, null as unknown as Record<string, any>) : null;
}
function save(slug: string, content: unknown) {
  d.prepare(`UPDATE pages SET content = ? WHERE slug = ?`).run(json.stringify(content), slug);
  touched.push(`pages/${slug}`);
}

const about = page('about');
if (about) {
  let changed = false;
  about.intro = about.intro.map((t: string) => {
    const n = t.replace('اینجا فضاییست', 'اینجا فضایی است');
    if (n !== t) changed = true;
    return n;
  });
  if (typeof about.sponsorsText === 'string' && about.sponsorsText.startsWith('این بخش در آینده ایجاد می‌شود — ')) {
    about.sponsorsText = about.sponsorsText.replace('این بخش در آینده ایجاد می‌شود — ', '');
    changed = true;
  }
  if (changed) save('about', about);
}

const community = page('community');
if (community && Array.isArray(community.perks)) {
  const i = community.perks.indexOf('تخفیف دوره‌ها و کارگاه‌های آکادمی');
  if (i >= 0) {
    community.perks[i] = 'تخفیف برای ثبت‌نام در دوره‌ها و کارگاه‌های آکادمی';
    save('community', community);
  }
}

const contact = page('contact');
if (contact) {
  let changed = false;
  // The FAQ is replaced wholesale only while it still has the first question as shipped.
  if (Array.isArray(contact.faqs) && contact.faqs.some((f: { a: string }) => f.a.startsWith('هر دو.'))) {
    contact.faqs = seed.contact.faqs.map((f) => ({ ...f }));
    changed = true;
  }
  if (typeof contact.teachText === 'string' && contact.teachText.includes('تدریستان')) {
    contact.teachText = contact.teachText.replace('تدریستان را', 'تدریس خود را');
    changed = true;
  }
  if (changed) save('contact', contact);
}

const row = d.prepare(`SELECT value FROM settings WHERE key = 'site'`).get() as { value: string } | undefined;
if (row) {
  const s = json.parse<Record<string, string>>(row.value, {});
  if ((s.footerText ?? '').startsWith('مرجع آموزش‌های تخصصی صنعت فروشگاه‌داری')) {
    s.footerText = siteSeed.footerText;
    d.prepare(`UPDATE settings SET value = ? WHERE key = 'site'`).run(json.stringify(s));
    touched.push('settings/site.footerText');
  }
}

console.log(touched.length ? `updated: ${touched.join(', ')}` : 'nothing to change');
