import type { Metadata } from 'next';

/**
 * The portal page itself is a client component, so its metadata lives here.
 * Without this it would inherit the site-wide default title.
 */
export const metadata: Metadata = {
  description:
    'درگاه دانش‌پذیران آکادمی ریتیل ایران — دسترسی به دوره‌ها، جزوه‌ها و پیگیری وضعیت ثبت‌نام.',
  title: 'درگاه دانش‌پذیران',
  // A sign-in page has nothing to offer a search result.
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
