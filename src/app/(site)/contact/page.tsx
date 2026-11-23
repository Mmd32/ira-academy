import { PhoneLinks } from '@/components/PhoneLinks';
import { ui } from '@/server/ui';
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
import { LiteralText } from '@/components/LiteralText';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';
import { contact as contactSeed } from '@/content/pages';
import { getPage } from '@/server/content';
import { getSite } from '@/server/content';
import { fa } from '@/lib/text';

export const metadata: Metadata = {
  description:
    'نشانی دفتر، تلفن، ایمیل و مسیرهای همکاری با آکادمی ریتیل ایران — به‌همراه پاسخ پرسش‌های پرتکرار درباره‌ی دوره‌ها.',
  title: 'ارتباط با آکادمی',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  const contact = getPage('contact', contactSeed as unknown as typeof contactSeed);
  const site = getSite();
  return (
    <>
      <JsonLd data={faqSchema(contact.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'خانه', path: '/' },
          { name: 'ارتباط با آکادمی', path: '/contact/' },
        ])}
      />

      <PageHeader eyebrow={ui('page.contact.eyebrow')} title={ui('page.contact.title')} />

      <section className="section bg-white">
        <div className="container-x grid items-start gap-8 lg:grid-cols-3">
          <Reveal>
            <div className="card p-7">
              <p className="eyebrow">نشانی دفتر آکادمی</p>
              <p className="mt-5 text-sm leading-8 text-ink-soft">{site.address}</p>
              <div className="mt-5 grid aspect-video place-items-center rounded-2xl border border-dashed border-line bg-paper text-xs text-ink-mute">
                نقشه (نشان) — به‌زودی
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="card p-7">
              <p className="eyebrow">اطلاعات تماس</p>
              {/*
                Label above value, both aligned to the right. Pushing the value
                to the opposite edge made the eye jump across the card on every
                row.

                Every value keeps left-to-right direction and is aligned right.
                Alignment and direction are different things here: a phone
                number or an email read left to right whatever the page does,
                and flipping their direction reorders the parts — "021 2842
                9966 و 5" came out as "5 و 9966 2842 021".
              */}
              <dl className="mt-5 space-y-5 text-sm">
                <div className="border-b border-line pb-4">
                  <dt className="text-xs text-ink-mute">تلفن</dt>
                  <dd className="mt-1 space-y-1 text-right">
                    <PhoneLinks numbers={[String(site.phone ?? ''), String(site.phone2 ?? '')]} stacked linkClassName="font-bold text-ink" />
                  </dd>
                </div>
                <div className="border-b border-line pb-4">
                  <dt className="text-xs text-ink-mute">ایمیل</dt>
                  <dd className="ltr mt-1 text-right font-bold text-ink">{site.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-mute">واتساپ / تلگرام / بله</dt>
                  <dd className="mt-1 text-right">
                    <LiteralText value={fa(site.mobile)} className="font-bold text-brand" />
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal>
            <div id="advisors" className="card p-7">
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
          <div className="mx-auto mt-10 grid max-w-3xl gap-3">
            {contact.faqs.map((faq) => (
              <details key={faq.q} className="card group p-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-brand transition-transform duration-300 group-open:rotate-180"
                  >
                    ⌄
                  </span>
                </summary>
                <p className="whitespace-pre-line border-t border-line px-5 pb-5 pt-4 text-sm leading-8 text-ink-soft">{faq.a}</p>
              </details>
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
                <p>{contact.partnerLines.join(' ')}</p>
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
