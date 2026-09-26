import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader, ComingSoon } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { FeaturedCourse } from '@/components/programs/FeaturedCourse';
import {
  programModels,
  courses,
  workshops,
  seminars,
  pastEvents,
  calendar,
} from '@/content/programs';
import { fa } from '@/lib/text';

export const metadata: Metadata = {
  title: 'برنامه‌های آموزشی',
  alternates: { canonical: '/programs/' },
};

const registerCta =
  'rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-500';

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="برنامه‌های آموزشی"
        title="دوره‌ها، کارگاه‌ها و سمینارها"
        lead="دوره‌های تخصصی دانش‌محور، کارگاه‌های مهارت‌محور و سمینارها و وبینارهای آکادمی — کنار هر برنامه، لینک ثبت‌نام همان برنامه."
      />

      <FeaturedCourse />

      <section id="courses" className="section bg-white">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">۰۱ — دوره‌های تخصصی</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">دانش‌محور، با پروژه‌ی واقعی</h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {programModels.map((model, i) => {
              const modelCourses = courses.filter((course) => course.model === model.id);

              return (
                <Reveal key={model.id}>
                  {/* Collapsible so the four models read as a short menu first.
                      The first group opens by default — a course catalogue that
                      starts fully closed hides everything the page is for. */}
                  <details
                    open={i === 0}
                    className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0">
                        <span className="block text-lg font-extrabold text-brand">
                          {model.title}
                        </span>
                        <span className="mt-1 block text-sm leading-7 text-ink-soft">
                          {model.desc}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-3">
                        <span
                          className={
                            modelCourses.length > 0
                              ? 'rounded-full bg-brand/5 px-3 py-1 text-[11px] font-bold text-brand-600'
                              : 'rounded-full bg-gold/15 px-3 py-1 text-[11px] font-black text-gold'
                          }
                        >
                          {modelCourses.length > 0
                            ? `${fa(modelCourses.length)} دوره`
                            : 'به‌زودی'}
                        </span>
                        <span
                          aria-hidden
                          className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-mute transition-transform duration-300 group-open:rotate-180"
                        >
                          ▾
                        </span>
                      </span>
                    </summary>

                    <div className="border-t border-line bg-paper p-6">
                      {modelCourses.length === 0 ? (
                        <p className="py-4 text-center text-sm text-ink-mute">
                          دوره‌های این بخش به‌زودی اعلام می‌شود.
                        </p>
                      ) : (
                        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
                          {modelCourses.map((course) => (
                            <div
                              key={course.id}
                              className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift"
                            >
                              <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                              <span className="w-fit rounded-full border border-brand/10 bg-brand/5 px-3 py-1 text-[10px] font-bold text-brand-600">
                                {course.audience}
                              </span>
                              <h4 className="mt-3 text-base font-extrabold leading-8 text-ink">
                                {course.title}
                              </h4>
                              <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">
                                {course.blurb}
                              </p>
                              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                                <span className="text-xs font-semibold text-ink-mute">
                                  {fa(course.sessions)} مبحث · {fa(course.hours)} ساعت
                                </span>
                                <Link
                                  href={`/register/?course=${course.id}`}
                                  className={registerCta}
                                >
                                  ثبت‌نام
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workshops" className="section border-y border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">۰۲ — کارگاه‌ها</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">مهارت‌محور و فشرده</h2>
          </Reveal>
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
            {workshops.map((workshop) => (
              <Reveal key={workshop.id} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <h3 className="text-base font-extrabold leading-8 text-ink">{workshop.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{workshop.blurb}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs font-semibold text-ink-mute">{workshop.duration}</span>
                    <Link href={`/register/?course=${workshop.id}`} className={registerCta}>
                      ثبت‌نام
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="seminars" className="section bg-white">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">۰۳ — سمینارها و وبینارها</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">رویدادهای دانشی آکادمی</h2>
          </Reveal>
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-2">
            {seminars.map((seminar) => (
              <Reveal key={seminar.id} className="h-full">
                <div className="card flex h-full items-center justify-between gap-4 p-6">
                  <div>
                    <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-black text-gold">
                      {seminar.type}
                    </span>
                    <h3 className="mt-3 font-extrabold text-ink">{seminar.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-ink-soft">{seminar.blurb}</p>
                  </div>
                  <Link href={`/register/?course=${seminar.id}`} className={registerCta}>
                    ثبت‌نام
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-paper-soft">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <p className="eyebrow">۰۴ — دوره‌های برگزارشده</p>
              <ul className="mt-5 space-y-3">
                {pastEvents.map((event) => (
                  <li key={event} className="flex items-start gap-3 text-sm leading-7 text-ink-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {event}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="card h-full p-8 opacity-80">
              <p className="eyebrow">
                ۰۵ — MBA و Mini MBA تخصصی <ComingSoon />
              </p>
              <p className="mt-4 leading-8 text-ink-soft">
                دوره‌های MBA و Mini MBA تخصصی خرده‌فروشی در آینده ارائه می‌شود. برای اطلاع از زمان
                شروع، در خبرنامه ثبت‌نام کنید یا با مشاوران در تماس باشید.
              </p>
              <Link href="/register/?course=mba" className="btn-secondary mt-6 !py-2.5 text-xs">
                اعلام علاقه‌مندی
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="calendar" className="section border-t border-line bg-white">
        <div className="container-x">
          <Reveal>
            <div className="card p-8">
              <p className="eyebrow">
                ۰۶ — {calendar.title} <ComingSoon />
              </p>
              <p className="mt-4 leading-8 text-ink-soft">{calendar.text}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
