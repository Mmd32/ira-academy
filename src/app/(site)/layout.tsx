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
      <main>{children}</main>
      <Footer />
      <ConsultWidget />
    </>
  );
}
