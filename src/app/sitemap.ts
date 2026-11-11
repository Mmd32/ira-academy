import type { MetadataRoute } from 'next';

import { getArticles, getContentUpdatedAt } from '@/server/content';
import { siteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

/**
 * Every public route. Priorities reflect how central a page is to the
 * academy's purpose — enrolling people in courses — not how big it is.
 */
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/programs/', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/register/', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/corporate/', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/knowledge/', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/articles/', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about/', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/community/', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact/', priority: 0.6, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // When the panel last changed anything, not when this was fetched.
  const lastModified = getContentUpdatedAt();

  return [
    ...routes.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    // Each published article is its own indexable page.
    ...getArticles().map((a) => ({
      url: `${siteUrl}/knowledge/${a.slug}/`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
