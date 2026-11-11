import { Analytics } from '@/components/Analytics';
import { ConsultWidget } from '@/components/ConsultWidget';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { uiAll } from '@/server/ui';
import { img } from '@/server/images';

/**
 * The public site's chrome. The admin panel lives outside this group, so it
 * does not inherit the site navigation, footer or the consult widget — a route
 * group changes nothing about the URLs.
 */
/** Header and footer wording comes from the panel, so nothing here may be frozen at build time. */
export const dynamic = 'force-dynamic';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const t = uiAll();
  const navLabels = {
    links: [1, 2, 3, 4, 5, 6, 7]
      .map((i) => ({ label: t[`nav.${i}.label`], href: t[`nav.${i}.href`] }))
      .filter((l) => l.label && l.href),
    cta: { label: t['nav.cta.label'], href: t['nav.cta.href'] },
    login: { label: t['nav.login.label'], href: t['nav.login.href'] },
    mobileLogin: t['nav.mobileLogin'],
    logo: img('site.logo'),
  };

  return (
    <>
      <Nav labels={navLabels} />
      {/*
        The entrance animation tilts each block on the X axis, and a tilted box
        measures a few pixels wider than the flat one. On a 375px screen that
        was enough to give /programs a one-pixel horizontal scroll. The tilt is
        decorative, so it is clipped rather than removed.
      */}
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
      <ConsultWidget />
      <Analytics />
    </>
  );
}
