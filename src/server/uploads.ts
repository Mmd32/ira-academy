import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * Pictures uploaded from the panel. They live next to the database, on the
 * same persistent volume, so a deploy never wipes them. Only three image
 * types are accepted and the type is decided from the file's own first bytes,
 * not from the name or the type the browser claims.
 */

const ROOT = join(dirname(process.env.DATABASE_PATH ?? 'data/ira.db'), 'uploads');
export const MAX_BYTES = 2 * 1024 * 1024;

const TYPES: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' };

function sniff(b: Buffer): 'png' | 'jpg' | 'webp' | null {
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'webp';
  return null;
}

export function saveUpload(data: Buffer): { url: string } | { error: string } {
  if (data.length === 0) return { error: 'فایل خالی است' };
  if (data.length > MAX_BYTES) return { error: 'حجم عکس بیش از ۲ مگابایت است' };
  const ext = sniff(data);
  if (!ext) return { error: 'فقط عکس PNG، JPG یا WebP پذیرفته می‌شود' };

  if (!existsSync(ROOT)) mkdirSync(ROOT, { recursive: true });
  const name = `${randomBytes(12).toString('hex')}.${ext}`;
  writeFileSync(join(ROOT, name), data);
  return { url: `/uploads/${name}` };
}

export function readUpload(name: string): { data: Buffer; type: string } | null {
  const m = /^[a-f0-9]{24}\.(png|jpg|webp)$/.exec(name);
  if (!m) return null;
  const path = join(ROOT, name);
  if (!existsSync(path)) return null;
  return { data: readFileSync(path), type: TYPES[m[1]] };
}
