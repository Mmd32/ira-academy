import { portal as portalSeed } from '@/content/pages';
import { getPage, getSite } from '@/server/content';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { PortalClient } from './PortalClient';

/**
 * The portal screen is interactive, so it lives in a client component. This
 * page reads its content on the server and hands it over — importing the store
 * from a client component would pull the database driver into the browser
 * bundle, where node's `fs` does not exist.
 */
export default function PortalPage() {
  const site = getSite();

  return (
    <PortalClient
      portal={getPage('portal', portalSeed as unknown as typeof portalSeed)}
      site={{ email: String(site.email ?? ''), phone: String(site.phone ?? '') }}
    />
  );
}
