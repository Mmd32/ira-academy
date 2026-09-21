'use client';

import { useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { LeadForm } from '@/components/LeadForm';
import { portal } from '@/content/pages';
import { site } from '@/content/site';
import { fa } from '@/lib/text';

const myCourses = [
  { title: 'اصول فروش حضوری حرفه‌ای', progress: 'جلسه ۴ از ۶', state: 'در حال برگزاری' },
  { title: 'تجربه و خدمات مشتری', progress: 'تکمیل‌شده', state: 'پایان‌یافته' },
];

const handouts = [
  'جزوه‌ی جلسه ۱ تا ۴ — اصول فروش حضوری',
  'کاربرگ پروژه‌ی فروشگاه',
  'چک‌لیست استاندارد خدمت مشتری',
];

export default function PortalPage() {
  // Demo gate only — any non-empty credentials open the dashboard.
  // Replace with real auth when the backend lands.
  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <PageHeader
        eyebrow="درگاه امور دانش‌پذیران"
        title="درگاه دانش‌پذیران"
        lead="دسترسی دانش‌پذیران آکادمی به دوره‌ها، جزوات، مدرک، مشاوره با کارشناسان و فرصت‌های شغلی — نیازمند نام کاربری و رمز عبور."
      />

      {signedIn ? (
        <section className="section bg-white">
          <div className="container-x grid gap-8 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="card h-full p-7">
                <p className="eyebrow">دوره‌های من</p>
                <div className="mt-5 space-y-4">
                  {myCourses.map((course) => (
                    <div
                      key={course.title}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-5"
                    >
                      <div>
                        <h3 className="font-extrabold text-ink">{course.title}</h3>
                        <span className="text-xs text-ink-mute">{course.progress}</span>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          course.state === 'پایان‌یافته'
                            ? 'bg-gold/15 text-gold'
                            : 'bg-brand/10 text-brand'
                        }`}
                      >
                        {course.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card h-full p-7">
                <p className="eyebrow">جزوات</p>
                <ul className="mt-5 space-y-3">
                  {handouts.map((handout) => (
                    <li
                      key={handout}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink-soft"
                    >
                      {handout}
                      <span className="text-xs font-bold text-brand">دانلود</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="card flex h-full flex-col p-7">
                <p className="eyebrow">مدرک</p>
                <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gold/50 bg-gold/5 p-6 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold">
                    ✓
                  </span>
                  <p className="mt-3 text-sm font-bold text-ink">
                    گواهینامه‌ی «تجربه و خدمات مشتری»
                  </p>
                  <button className="btn-secondary mt-4 !py-2 text-xs">دانلود PDF</button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="card h-full p-7">
                <p className="eyebrow">مشاوره با کارشناسان</p>
                <p className="mb-5 mt-2 text-xs leading-6 text-ink-mute">
                  درخواست بدهید تا کارشناس آموزشی با شما تماس بگیرد — یا مستقیم:{' '}
                  <span className="ltr inline-block font-bold text-brand">{fa(site.phone)}</span>
                </p>
                <LeadForm
                  subject="درخواست مشاوره — درگاه دانش‌پذیران"
                  fields={['name', 'phone', 'note']}
                  cta="درخواست تماس"
                />
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="card h-full p-7">
                <p className="eyebrow">فرصت‌های شغلی</p>
                <ul className="mt-5 space-y-3">
                  {portal.jobs.map((job) => (
                    <li key={job.title} className="rounded-xl border border-line bg-paper px-4 py-3">
                      <div className="text-sm font-bold text-ink">{job.title}</div>
                      <span className="text-xs text-ink-mute">{job.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="section bg-white">
          <div className="container-x">
            <Reveal>
              <div className="mx-auto max-w-md rounded-3xl border border-line bg-paper p-8 shadow-card">
                <h2 className="text-xl font-extrabold text-ink">ورود دانش‌پذیران</h2>
                <p className="mt-2 text-sm leading-7 text-ink-mute">
                  نام کاربری و رمز عبور پس از ثبت‌نام قطعی در دوره، پیامک می‌شود.
                  <span className="mt-1 block text-xs text-gold">
                    (نسخه‌ی نمایشی — با هر مقداری وارد می‌شوید)
                  </span>
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (username && password) setSignedIn(true);
                  }}
                >
                  <input
                    placeholder="نام کاربری"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400"
                  />
                  <input
                    type="password"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400"
                  />
                  <button type="submit" className="btn-primary w-full">
                    ورود به درگاه
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
