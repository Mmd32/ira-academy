import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  description:
    'دوره‌های آموزشی استاندارد آکادمی ریتیل ایران؛ آموزش‌های مرجع، مهارت‌محور و دانش‌بنیان برای توسعه حرفه‌ای در صنعت ریتیل.',
  title: 'دوره‌های استاندارد',
  alternates: { canonical: '/programs/standard/' },
};

export default function StandardProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="برنامه‌های آموزشی"
        title="دوره‌های استاندارد ریتیل"
        lead="مجموعه دوره‌های آموزشی مرجع و استانداردسازی‌شده آکادمی ریتیل ایران، طراحی‌شده بر اساس جدیدترین متدهای بین‌المللی و نیازهای عملیاتی بازار ایران."
      />

      <section className="section bg-white">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="rounded-full bg-gold/15 px-3.5 py-1 text-xs font-bold text-gold">
                به‌زودی · در حال تدوین نهایی
              </span>
              <h2 className="mt-5 text-2xl font-black text-ink sm:text-3xl lg:text-4xl">
                تقویم و سرفصل دوره‌های استاندارد به‌زودی بارگذاری می‌شود
              </h2>
              <p className="mt-4 text-sm leading-8 text-ink-soft sm:text-base">
                دوره‌های استاندارد شامل آموزش‌های جامع از سطوح پایه تا سرپرستی و مدیریت شعب زنجیره‌ای در حال آماده‌سازی و اعتبارسنجی هستند.
              </p>
            </div>
          </Reveal>

          {/* Planned course cards structure (ready for courses to be added) */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'استانداردهای طلایی فروش و ارتباط با مشتری',
                code: 'Retail STAR Standard',
                level: 'سطح پایه و عملیاتی',
                desc: 'اصول استقبال، نیازسنجی، زبان بدن و تکنیک‌های مکمل فروش در کف فروشگاه.',
              },
              {
                title: 'سرپرستی شیفت و استانداردهای چیدمان و صندوق',
                code: 'Retail ACE Standard',
                level: 'سطح میانی و سرپرستی',
                desc: 'مدیریت عملیات روزمره، نظارت بر پرسنل، انبارگردانی خرد و مغایرت‌گیری نقدینگی.',
              },
              {
                title: 'مدیریت حرفه‌ای فروشگاه و شاخص‌های مالی P&L',
                code: 'Retail PRO Standard',
                level: 'سطح پیشرفته و مدیریتی',
                desc: 'تحلیل داده‌های فروشگاهی، سنجش شاخص‌های KPI و ارتقای حاشیه سودآوری شعب.',
              },
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-paper/50 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:bg-white hover:shadow-lift">
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand">{item.code}</span>
                      <span className="rounded-full bg-gold/15 px-2.5 py-0.5 font-bold text-gold">
                        {item.level}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-black text-ink">{item.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-ink-soft">{item.desc}</p>
                  </div>

                  <div className="mt-6 border-t border-line/70 pt-4">
                    <span className="block text-center text-xs font-bold text-ink-mute">
                      اعلام تاریخ برگزاری به‌زودی
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Notification / Interest lead box */}
          <Reveal delay={0.2}>
            <div className="mt-16 overflow-hidden rounded-3xl border border-line bg-paper p-8 text-center sm:p-12">
              <h3 className="text-xl font-black text-ink sm:text-2xl">
                مایلید از زمان ثبت‌نام دوره‌های استاندارد باخبر شوید؟
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-ink-soft sm:text-sm">
                با کارشناسان آموزش آکادمی ریتیل ایران در ارتباط باشید تا اولویت ثبت‌نام و کاتالوگ جامع سرفصل‌ها برای شما ارسال گردد.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact/#advisors"
                  className="rounded-full bg-brand px-7 py-3 text-xs font-bold text-white shadow-card transition-all duration-300 hover:bg-brand-500 hover:shadow-lift"
                >
                  ارتباط با مشاوران آکادمی
                </Link>
                <Link
                  href="/programs/"
                  className="rounded-full border border-line bg-white px-7 py-3 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  بازگشت به همه برنامه‌ها
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
