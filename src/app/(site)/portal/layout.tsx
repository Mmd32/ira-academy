import type { Metadata } from 'next';

/**
 * The portal page itself is a client component, so its metadata lives here.
 * Without this it would inherit the site-wide default title.
 */
export const metadata: Metadata = {
  description:
    'درگاه دانش‌پذیران آکادمی ریتیل ایران — دسترسی به دوره‌ها، جزوه‌ها و پیگیری وضعیت ثبت‌نام.',
  title: 'درگاه دانش‌پذیران',
  alternates: { canonical: '/portal/' },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
