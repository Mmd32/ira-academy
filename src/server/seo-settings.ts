import { db, json } from './db';

/**
 * Search and analytics wiring that the owner pastes in from Google's and
 * Bing's dashboards. Kept in the panel rather than the server's environment
 * so connecting a new tool never needs a deploy. Each value is checked
 * against the shape its provider uses before it is ever written into a page,
 * so a mistyped or hostile value cannot inject markup.
 */

export type SeoSettings = {
  ga4: string; // G-XXXXXXXXXX
  gtm: string; // GTM-XXXXXXX
  googleVerification: string;
  bingVerification: string;
  clarity: string;
};

export const SEO_FIELDS: { key: keyof SeoSettings; pattern: RegExp }[] = [
  { key: 'ga4', pattern: /^G-[A-Z0-9]{6,14}$/ },
  { key: 'gtm', pattern: /^GTM-[A-Z0-9]{4,10}$/ },
  { key: 'googleVerification', pattern: /^[A-Za-z0-9_-]{20,100}$/ },
  { key: 'bingVerification', pattern: /^[A-Fa-f0-9]{20,64}$/ },
  { key: 'clarity', pattern: /^[a-z0-9]{6,16}$/ },
];

const EMPTY: SeoSettings = { ga4: '', gtm: '', googleVerification: '', bingVerification: '', clarity: '' };

export function getSeoSettings(): SeoSettings {
  const row = db().prepare(`SELECT value FROM settings WHERE key = 'seo'`).get() as { value: string } | undefined;
  const stored = row ? json.parse<Partial<SeoSettings>>(row.value, {}) : {};
  const merged: SeoSettings = {
    ...EMPTY,
    ...stored,
    // The older environment variable keeps working until the panel sets one.
    googleVerification: stored.googleVerification || process.env.GOOGLE_SITE_VERIFICATION?.trim() || '',
  };
  // Re-validate on read: whatever is stored, only well-formed values reach a page.
  for (const f of SEO_FIELDS) if (merged[f.key] && !f.pattern.test(merged[f.key])) merged[f.key] = '';
  return merged;
}

/** Returns a message per rejected field; valid fields are saved either way. */
export function saveSeoSettings(input: Partial<SeoSettings>): string[] {
  const errors: string[] = [];
  const next: SeoSettings = { ...EMPTY };
  for (const f of SEO_FIELDS) {
    const v = (input[f.key] ?? '').trim();
    if (!v) continue;
    if (f.pattern.test(v)) next[f.key] = v;
    else errors.push(f.key);
  }
  db()
    .prepare(`INSERT INTO settings (key, value) VALUES ('seo', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .run(json.stringify(next));
  return errors;
}
