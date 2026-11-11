import { db, json } from './db';
import { UI_DEFAULTS, isSafeHref } from '@/lib/ui-texts';

/**
 * Wording the panel can override. `ui(key)` is what pages call: the saved text
 * when there is one, the shipped default otherwise. Overrides are read once
 * per request.
 */

function overrides(): Record<string, string> {
  const row = db().prepare(`SELECT value FROM settings WHERE key = 'ui'`).get() as { value: string } | undefined;
  return row ? json.parse<Record<string, string>>(row.value, {}) : {};
}

export function uiAll(): Record<string, string> {
  const saved = overrides();
  const out: Record<string, string> = {};
  for (const key of Object.keys(UI_DEFAULTS)) {
    const v = saved[key];
    // A saved link is re-checked on read, so nothing unsafe can reach a page even if the row was edited by hand.
    const usable = typeof v === 'string' && v.trim() !== '' && (!key.endsWith('href') && !key.endsWith('.href') ? true : isSafeHref(v));
    // An earlier build saved line breaks as the two characters \\n; show them as real breaks.
    out[key] = usable ? (v as string).replace(/\\n/g, '\n') : UI_DEFAULTS[key];
  }
  return out;
}

export function ui(key: string): string {
  return uiAll()[key] ?? UI_DEFAULTS[key] ?? '';
}

export function getUiOverrides(): Record<string, string> {
  return overrides();
}

/** Stores only values that differ from the default. Returns the keys that were rejected. */
export function saveUi(values: Record<string, string>): string[] {
  const rejected: string[] = [];
  const keep: Record<string, string> = {};
  for (const [key, def] of Object.entries(UI_DEFAULTS)) {
    const v = (values[key] ?? '').replace(/\r/g, '').trim().slice(0, 1200);
    if (!v || v === def) continue;
    if (key.endsWith('.href') && !isSafeHref(v)) {
      rejected.push(key);
      continue;
    }
    keep[key] = v;
  }
  db()
    .prepare(`INSERT INTO settings (key, value) VALUES ('ui', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .run(json.stringify(keep));
  return rejected;
}
