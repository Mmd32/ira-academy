import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';

import { db } from './db';

/**
 * Admin sign-in.
 *
 * Passwords are hashed with scrypt from node's own crypto, so there is no
 * dependency to keep patched. Sessions are a random token in an httpOnly
 * cookie with the server holding the record, which means signing someone out
 * is a DELETE rather than waiting for a token to expire.
 */

const COOKIE = 'ira_session';
const SESSION_DAYS = 14;
const SCRYPT_KEYLEN = 64;

export type AdminUser = { id: number; username: string; displayName: string };

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  // Compared byte by byte in constant time, so a wrong password cannot be
  // narrowed down by how long the answer took.
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createUser(username: string, password: string, displayName: string) {
  db()
    .prepare(
      `INSERT INTO users (username, display_name, password_hash, created_at)
       VALUES (?, ?, ?, ?)`,
    )
    .run(username.trim().toLowerCase(), displayName, hashPassword(password), new Date().toISOString());
}

export function countUsers(): number {
  return (db().prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number }).n;
}

/** Checks the credentials and, when they match, starts a session. */
export function signIn(username: string, password: string): AdminUser | null {
  const row = db()
    .prepare(`SELECT id, username, display_name, password_hash FROM users WHERE username = ?`)
    .get(username.trim().toLowerCase()) as
    | { id: number; username: string; display_name: string; password_hash: string }
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) return null;

  const token = randomBytes(32).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);

  db()
    .prepare(
      `INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`,
    )
    .run(token, row.id, now.toISOString(), expires.toISOString());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });

  return { id: row.id, username: row.username, displayName: row.display_name };
}

export function signOut() {
  const token = cookies().get(COOKIE)?.value;
  if (token) db().prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
  cookies().delete(COOKIE);
}

/** The signed-in admin, or null. Every admin page and action calls this. */
export function currentUser(): AdminUser | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;

  const row = db()
    .prepare(
      `SELECT u.id, u.username, u.display_name, s.expires_at
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ?`,
    )
    .get(token) as
    | { id: number; username: string; display_name: string; expires_at: string }
    | undefined;

  if (!row) return null;

  if (new Date(row.expires_at) < new Date()) {
    db().prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
    return null;
  }

  return { id: row.id, username: row.username, displayName: row.display_name };
}

/** Clears sessions that have run out, so the table does not grow forever. */
export function pruneSessions() {
  db().prepare(`DELETE FROM sessions WHERE expires_at < ?`).run(new Date().toISOString());
}
