import type { MetadataRoute } from 'next';

import { gateEnabled } from '@/lib/preview-gate';
import { siteUrl } from '@/lib/site-url';

/** Follows the holding page, so it has to be read per request. */
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  // While the holding page is up, every public route answers 503. There is
  // nothing to index, so crawlers are turned away rather than sent to spend
  // their crawl budget on a wall. Switching PREVIEW_MODE off opens this again.
  if (gateEnabled()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/portal'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
