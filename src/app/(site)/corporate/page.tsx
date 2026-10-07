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
import { corporate as corporateSeed } from '@/content/pages';
import { getPage } from '@/server/content';
import { getSite } from '@/server/content';
import { fa } from '@/lib/text';

export const metadata: Metadata = {
  title: 'خدمات سازمانی',
  alternates: { canonical: '/corporate/' },
};

export default function CorporatePage() {
  const corporate = getPage('corporate', corporateSeed as unknown as typeof corporateSeed);
  const site = getSite();
  return (
    <>
      <PageHeader
        eyebrow="خدمات سازمانی"
        title="آموزش‌های Custom-Made سازمانی"
        lead="راهکارهای توسعه‌ی سرمایه انسانی برای زنجیره‌ها و برندهای چندشعبه‌ای — نیازسنجی، طراحی برنامه، برگزاری و سنجش اثر."
      />

      <section className="section bg-white">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">ضرورت و مزایا</p>
            <h2 className="mt-5 max-w-2xl text-3xl sm:text-4xl">
              چرا آموزش سازمانیِ ویژه‌سازی‌شده؟
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-ink-soft">{corporate.intro}</p>
          </Reveal>

          <div className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {corporate.benefits.map((benefit, i) => (
              <Reveal key={benefit.title} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <span className="text-2xl font-black text-gold">
                    {fa(String(i + 1).padStart(2, '0'))}
                  </span>
                  <h3 className="mt-3 font-extrabold text-ink">{benefit.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{benefit.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="navy-stage relative overflow-hidden py-24 text-white">
        <div className="navy-grid absolute inset-0" aria-hidden />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow-light flex items-center gap-3">
                تماس با مشاوران آموزش سازمانی
                <span className="h-px w-12 bg-gold/50" />
              </p>
              <h2 className="mt-5 text-3xl text-white sm:text-4xl">جلسه‌ی نیازسنجی رایگان</h2>
              <p className="mt-4 max-w-lg leading-9 text-white/65">
                فرم را ارسال کنید تا مشاوران آکادمی برای هماهنگی جلسه‌ی نیازسنجی تماس بگیرند — یا
                مستقیم تماس بگیرید:
              </p>
              <div className="ltr mt-6 w-fit rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-lg font-black tracking-wide text-gold-soft">
                {fa(site.phone)}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/academy.jpg"
                alt="کارگاه آموزش سازمانی"
                className="mt-8 hidden aspect-video w-full rounded-3xl border border-white/10 object-cover lg:block"
              />
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl bg-white p-8 shadow-lift">
              <h3 className="text-lg font-extrabold text-ink">فرم درخواست</h3>
              <p className="mb-6 mt-1 text-sm text-ink-mute">
                کارشناسان ما حداکثر تا یک روز کاری تماس می‌گیرند.
              </p>
              <LeadForm
                subject="درخواست آموزش سازمانی"
                cta="درخواست جلسه‌ی نیازسنجی"
                fields={['name', 'company', 'phone', 'note']}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
