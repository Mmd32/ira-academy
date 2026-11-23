/**
 * The "site is being built" gate.
 *
 * While PREVIEW_MODE is on, visitors get the holding page and the team gets
 * the real site after entering a shared password. It is a curtain, not a lock:
 * it keeps the unfinished site out of sight, and nothing behind it is secret.
 * The admin panel is deliberately NOT covered by it — that has real accounts,
 * and putting it behind a short shared password would weaken it.
 */

export const PREVIEW_COOKIE = 'ira_preview';
export const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function gateEnabled(): boolean {
  return (process.env.PREVIEW_MODE ?? '').toLowerCase() === 'on';
}

export function previewPassword(): string {
  return process.env.PREVIEW_PASSWORD ?? '2332';
}

/**
 * The cookie holds this token rather than the password itself, so the password
 * is not sitting in the browser in plain text. Both the middleware (edge) and
 * the route handler (node) compute it with Web Crypto, so they always agree.
 */
export async function previewToken(): Promise<string> {
  const secret = process.env.PREVIEW_SECRET ?? 'ira-preview';
  const data = new TextEncoder().encode(`${previewPassword()}:${secret}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Paths that must answer normally even while the curtain is drawn. */
export function isExempt(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/media/') ||
    pathname.startsWith('/uploads/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/api/') ||
    // The panel has its own sign-in; the curtain must not sit in front of it.
    pathname.startsWith('/admin') ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png' ||
    pathname.startsWith('/soon')
  );
}
