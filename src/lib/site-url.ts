/**
 * Canonical origin for absolute URLs (sitemap, robots, Open Graph).
 *
 * Order matters: an explicit NEXT_PUBLIC_SITE_URL always wins, so the real
 * domain can be set once in Vercel. Failing that, Vercel's own
 * VERCEL_PROJECT_PRODUCTION_URL already tracks the production domain — and it
 * follows a custom domain once one is attached, so the sitemap corrects itself
 * without a code change.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

export const siteUrl = resolve();
