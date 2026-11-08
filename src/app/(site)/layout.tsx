import { Analytics } from '@/components/Analytics';
import { ConsultWidget } from '@/components/ConsultWidget';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';

/**
 * The public site's chrome. The admin panel lives outside this group, so it
 * does not inherit the site navigation, footer or the consult widget — a route
 * group changes nothing about the URLs.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
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
