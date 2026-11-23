import { img } from '@/server/images';
import type { Metadata } from 'next';

import { getSite } from '@/server/content';

import { PreviewGate } from './PreviewGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'به‌زودی',
  description: 'وب‌سایت آکادمی ریتیل ایران در حال آماده‌سازی است.',
  // Nothing here should enter search results while the site is unfinished.
  robots: { index: false, follow: false },
};

export default function SoonPage() {
  const site = getSite();
  const brand = String(site.brand ?? 'آکادمی ریتیل ایران');

  return (
    <main className="navy-stage relative grid min-h-screen place-items-center overflow-hidden px-5 py-16 text-white">
      <div className="navy-grid absolute inset-0" aria-hidden />

      <div className="relative w-full max-w-lg text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img('site.logo')}
          alt={brand}
          className="mx-auto h-16 w-auto object-contain"
        />

        <h1 className="mt-10 text-balance text-[1.5rem]/[1.6] text-white sm:text-[1.875rem]/[1.5]">
          وب‌سایت در حال آماده‌سازی است
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-base/8 text-white/65">
          {brand} به‌زودی از همین نشانی در دسترس خواهد بود.
        </p>

        <div
          className="mx-auto mt-10 h-px w-24 bg-gradient-to-l from-transparent via-gold/60 to-transparent"
          aria-hidden
        />

        {String(site.email ?? '') && (
          <p className="mt-10 text-sm text-white/45">
            برای تماس:{' '}
            <span className="ltr font-semibold text-gold-soft">{String(site.email)}</span>
          </p>
        )}

        <div className="mt-14">
          <PreviewGate />
        </div>
      </div>
    </main>
  );
}
