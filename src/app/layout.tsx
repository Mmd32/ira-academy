import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';

import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ConsultWidget } from '@/components/ConsultWidget';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'آکادمی ریتیل ایران | آموزش تخصصی فروش و مدیریت فروشگاه',
    template: '%s | آکادمی ریتیل ایران',
  },
  description:
    'مرجع آموزش تخصصی خرده‌فروشی در ایران — دوره‌های حرفه‌ای فروش، مدیریت فروشگاه، ویزوال مرچندایزینگ و تجربه‌ی مشتری برای فروشگاه‌داران و برندهای زنجیره‌ای.',
  keywords: [
    'آموزش خرده‌فروشی',
    'مدیریت فروشگاه',
    'آموزش فروش',
    'ویزوال مرچندایزینگ',
    'آموزش سازمانی',
    'آکادمی ریتیل ایران',
  ],
  openGraph: {
    title: 'آکادمی ریتیل ایران',
    description:
      'آموزش تخصصی فروش، مدیریت فروشگاه و تجربه‌ی مشتری — برای فروشگاه‌داران و برندهای زنجیره‌ای.',
    siteName: 'آکادمی ریتیل ایران',
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'آکادمی ریتیل ایران',
    description:
      'آموزش تخصصی فروش، مدیریت فروشگاه و تجربه‌ی مشتری — برای فروشگاه‌داران و برندهای زنجیره‌ای.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <ConsultWidget />
      </body>
    </html>
  );
}
