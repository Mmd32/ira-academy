import type { Metadata } from 'next';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { LeadForm } from '@/components/LeadForm';
import { contact as contactSeed } from '@/content/pages';
import { getPage } from '@/server/content';
import { getSite } from '@/server/content';
import { fa } from '@/lib/text';

export const metadata: Metadata = {
  title: 'ارتباط با آکادمی',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  const contact = getPage('contact', contactSeed as unknown as typeof contactSeed);
  const site = getSite();
  return (
    <>
      <PageHeader eyebrow="ارتباط با آکادمی" title="در تماس باشیم" />

      <section className="section bg-white">
        <div className="container-x grid gap-8 lg:grid-cols-3">
          <Reveal>
            <div className="card h-full p-7">
              <p className="eyebrow">نشانی دفتر</p>
              <p className="mt-5 text-sm leading-8 text-ink-soft">{site.address}</p>
              <div className="mt-5 grid aspect-video place-items-center rounded-2xl border border-dashed border-line bg-paper text-xs text-ink-mute">
                نقشه (نشان) — به‌زودی
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="card h-full p-7">
              <p className="eyebrow">اطلاعات تماس</p>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <dt className="text-ink-mute">تلفن</dt>
                  <dd className="font-bold text-ink">{fa(site.phone)}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <dt className="text-ink-mute">ایمیل</dt>
                  <dd className="ltr font-bold text-ink">{site.email}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-mute">واتساپ / تلگرام / بله</dt>
                  <dd className="ltr font-bold text-brand">{fa(site.mobile)}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal>
            <div id="advisors" className="card h-full p-7">
              <p className="eyebrow">ارتباط با مشاوران آکادمی</p>
              <p className="mb-5 mt-2 text-xs leading-6 text-ink-mute">
                برای انتخاب دوره‌ مناسب، در کنارتان هستیم.
              </p>
              <LeadForm
                subject="درخواست مشاوره رایگان"
                cta="درخواست مشاوره رایگان"
                email={String(site.email ?? '')}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-y border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">پرسش‌های متداول</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {contact.faqs.map((faq) => (
              <Reveal key={faq.q}>
                <div className="card p-6">
                  <h3 className="font-extrabold text-ink">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div id="teach" className="navy-stage relative overflow-hidden rounded-3xl p-8 text-white">
              <div className="navy-grid absolute inset-0" aria-hidden />
              <div className="relative">
                <p className="eyebrow-light">
                  مدرس آکادمی ریتیل ایران شوید
                </p>
                <h2 className="mt-4 text-2xl text-white">{contact.teachHeading}</h2>
                <p className="mt-3 max-w-md text-sm leading-8 text-white/65">{contact.teachText}</p>
                <a
                  href={`mailto:${site.email}?subject=درخواست تدریس در آکادمی`}
                  className="btn-gold mt-6 !py-2.5 text-xs"
                >
                  ارسال درخواست تدریس
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div id="partner" className="card flex h-full flex-col p-8">
              <p className="eyebrow">مشارکت و همکاری</p>
              <div className="mt-4 flex-1 leading-8 text-ink-soft">
                {contact.partnerLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <a
                href={`mailto:${site.email}?subject=پیشنهاد همکاری`}
                className="btn-primary mt-6 w-fit !py-2.5 text-xs"
              >
                ارسال پیشنهاد همکاری
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
