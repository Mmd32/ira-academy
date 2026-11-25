import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { CourseBlurb } from '@/components/CourseBlurb';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, courseListSchema } from '@/lib/seo';
import { fa } from '@/lib/text';
import { getSite, getVisibleCourses } from '@/server/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  description:
    'دوره‌های آموزشی استاندارد آکادمی ریتیل ایران؛ دوره‌های عمومی آکادمی با سرفصل ثابت و ثبت‌نام آزاد.',
  title: 'دوره‌های استاندارد',
  alternates: { canonical: '/programs/standard/' },
};

const registerCta =
  'rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-500';

export default function StandardProgramsPage() {
  const standardCourses = getVisibleCourses().filter((course) => course.model === 'standard');
  const site = getSite();

  return (
    <>
      <JsonLd data={courseListSchema(standardCourses, site)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'خانه', path: '/' },
          { name: 'برنامه‌های آموزشی', path: '/programs/' },
          { name: 'دوره‌های استاندارد', path: '/programs/standard/' },
        ])}
      />

      <PageHeader
        eyebrow="Retail PRO · برنامه‌های آموزشی"
        title="دوره‌های استاندارد"
        lead="دوره‌های عمومی آکادمی ریتیل ایران با سرفصل ثابت و ثبت‌نام آزاد. کنار هر دوره لینک مستقیم ثبت‌نام همان برنامه قرار دارد."
      />

      <section className="section bg-white">
        <div className="container-x">
          {standardCourses.length === 0 ? (
            <Reveal>
              <p className="py-8 text-center text-sm text-ink-mute">
                در حال حاضر دوره‌ای در این بخش فعال نیست.
              </p>
            </Reveal>
          ) : (
            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {standardCourses.map((course, idx) => (
                <Reveal key={course.id} delay={(idx % 3) * 0.06} className="h-full">
                  <div className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift">
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                    <span className="w-fit rounded-full border border-brand/10 bg-brand/5 px-3 py-1 text-[10px] font-bold text-brand-600">
                      {course.audience}
                    </span>
                    <h2 className="mt-3 text-base font-extrabold leading-8 text-ink">
                      {course.title}
                    </h2>
                    <CourseBlurb
                      text={course.blurb}
                      className="mt-2 flex-1 text-sm leading-7 text-ink-soft"
                    />
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <span className="text-xs font-semibold text-ink-mute">
                        {fa(course.sessions)} مبحث · {fa(course.hours)} ساعت
                      </span>
                      <Link href={`/register/?course=${course.id}`} className={registerCta}>
                        ثبت‌نام
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* Notification / Advisor box */}
          <Reveal delay={0.15}>
            <div className="mt-16 overflow-hidden rounded-3xl border border-line bg-paper p-8 text-center sm:p-12">
              <h3 className="text-xl font-black text-ink sm:text-2xl">
                نیاز به راهنمایی برای انتخاب دوره دارید؟
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-ink-soft sm:text-sm">
                با مشاوران آموزش آکادمی ریتیل ایران در ارتباط باشید تا متناسب با جایگاه شغلی و مسیر حرفه‌ای شما، دوره مناسب معرفی شود.
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
