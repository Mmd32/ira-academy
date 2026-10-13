import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { siteUrl } from '@/lib/site-url';
import { organizationSchema, verification, websiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { getSite } from '@/server/content';
import './globals.css';

/**
 * Lahzeh FaNum — the academy's corporate typeface.
 *
 * Only the six weights the site actually uses are declared: Next preloads
 * every declared file, so shipping Thin/ExtraLight/Light would cost three
 * downloads per visit for nothing. The unused .woff2 files stay in src/fonts/
 * if a future design needs them.
 *
 * Weights come from the file names, not the files' own metadata — several
 * of them report the wrong usWeightClass (SemiBold and ExtraBold both say 400).
 */
const lahzeh = localFont({
  src: [
    { path: '../fonts/Lahzeh-FaNum-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Lahzeh-FaNum-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Lahzeh-FaNum-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Lahzeh-FaNum-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Lahzeh-FaNum-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../fonts/Lahzeh-FaNum-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-brand',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  // Without this, Open Graph and canonical URLs stay relative and break when shared.
  metadataBase: new URL(siteUrl),
  title: {
    default: 'آکادمی ریتیل ایران | آموزش تخصصی فروش و مدیریت فروشگاه',
    template: '%s | آکادمی ریتیل ایران',
  },
  description:
    'مرجع آموزش تخصصی ریتیل در ایران — دوره‌های حرفه‌ای فروش، مدیریت فروشگاه، ویژوال مرچندایزینگ و تجربه‌ی مشتری برای فروشگاه‌داران و برندهای زنجیره‌ای.',
  verification: verification(),
  keywords: [
    'آموزش ریتیل',
    'مدیریت فروشگاه',
    'آموزش فروش',
    'ویژوال مرچندایزینگ',
    'آموزش سازمانی',
    'آکادمی ریتیل ایران',
  ],
  openGraph: {
    url: '/',
    title: 'آکادمی ریتیل ایران',
    description:
      'آموزش تخصصی فروش، مدیریت فروشگاه و تجربه‌ی مشتری — برای فروشگاه‌داران و برندهای زنجیره‌ای.',
    siteName: 'آکادمی ریتیل ایران',
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: '/media/logo-mark.png', width: 512, height: 512, alt: 'آکادمی ریتیل ایران' }],
  },
  twitter: {
    card: 'summary',
    title: 'آکادمی ریتیل ایران',
    images: ['/media/logo-mark.png'],
    description:
      'آموزش تخصصی فروش، مدیریت فروشگاه و تجربه‌ی مشتری — برای فروشگاه‌داران و برندهای زنجیره‌ای.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();

  return (
    <html lang="fa" dir="rtl" className={lahzeh.variable}>
      <body>
        <JsonLd data={organizationSchema(site)} />
        <JsonLd data={websiteSchema(site)} />
        {children}
      </body>
    </html>
  );
}
