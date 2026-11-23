import { requireAdmin } from '@/server/guard';
import { getSeoSettings } from '@/server/seo-settings';
import { gateEnabled } from '@/lib/preview-gate';
import { siteUrl } from '@/lib/site-url';

import { PageTitle } from '../ui';
import { SeoForm } from './SeoForm';

export const dynamic = 'force-dynamic';

export default function SeoPage() {
  requireAdmin();
  const seo = getSeoSettings();
  const gate = gateEnabled();
  const local = siteUrl.includes('localhost');

  const checks = [
    {
      ok: !gate,
      text: gate
        ? 'سایت هنوز پشت صفحه‌ی «در حال ساخت» است و robots.txt همه‌ی موتورهای جستجو را بیرون می‌گذارد. تا آن را برنداریم، گوگل چیزی ثبت نمی‌کند.'
        : 'سایت برای موتورهای جستجو باز است.',
    },
    {
      ok: !local,
      text: local ? 'آدرس اصلی سایت (NEXT_PUBLIC_SITE_URL) روی سرور تنظیم نشده و نقشه‌ی سایت آدرس اشتباه می‌دهد.' : `آدرس اصلی سایت: ${siteUrl}`,
    },
    { ok: !!seo.googleVerification, text: 'کد تأیید Google Search Console ثبت شده' },
    { ok: !!(seo.ga4 || seo.gtm), text: 'Google Analytics یا Tag Manager وصل است' },
  ];

  return (
    <>
      <PageTitle
        eyebrow="رشد"
        title="سئو و آنالیتیکس"
        lead="کدهایی را که Google و Bing به شما می‌دهند اینجا بگذارید. بدون دست زدن به کد، همان لحظه روی همه‌ی صفحه‌های عمومی اعمال می‌شود."
      />

      <section className="card mt-8 p-7">
        <h2 className="font-extrabold text-ink">وضعیت</h2>
        <ul className="mt-4 grid gap-2 text-sm">
          {checks.map((c) => (
            <li key={c.text} className={`flex gap-3 ${c.ok ? 'text-ink-soft' : 'font-bold text-red-700'}`}>
              <span aria-hidden>{c.ok ? '✓' : '✕'}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-7 text-ink-mute">
          نقشه‌ی سایت: <span className="ltr inline-block">{siteUrl}/sitemap.xml</span> و فایل robots:{' '}
          <span className="ltr inline-block">{siteUrl}/robots.txt</span>. آدرس نقشه را در Search Console بخش Sitemaps ثبت کنید.
        </p>
      </section>

      <div className="mt-6">
        <SeoForm values={seo} />
      </div>
    </>
  );
}
