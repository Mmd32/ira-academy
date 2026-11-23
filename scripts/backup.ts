/**
 * Backs up the database: `npm run backup`.
 *
 * Uses SQLite's own backup API rather than copying the file, so a backup taken
 * while the site is serving traffic is still consistent. Keeps the last 30 and
 * deletes the rest.
 *
 * Run it from cron. A backup that stays on the same server is not a backup —
 * copy BACKUP_DIR off the machine as well.
 */
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import { db } from '../src/server/db';

const DIR = process.env.BACKUP_DIR ?? 'backups';
const KEEP = Number(process.env.BACKUP_KEEP ?? 30);

if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const target = join(DIR, `ira-${stamp}.db`);

db()
  .backup(target)
  .then(() => {
    console.log(`بکاپ گرفته شد: ${target} (${(statSync(target).size / 1024).toFixed(0)} کیلوبایت)`);

    const old = readdirSync(DIR)
      .filter((f) => f.startsWith('ira-') && f.endsWith('.db'))
      .sort()
      .reverse()
      .slice(KEEP);

    for (const f of old) {
      unlinkSync(join(DIR, f));
      console.log(`حذف نسخه‌ی قدیمی: ${f}`);
    }
  })
  .catch((err) => {
    console.error('بکاپ شکست خورد:', err);
    process.exit(1);
  });
