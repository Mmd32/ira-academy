import type { Metadata } from 'next';
import { Suspense } from 'react';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { PageHeader } from '@/components/PageHeader';
import { RegisterForm } from '@/components/RegisterForm';
import { getSeminars, getSite, getVisibleCourses } from '@/server/content';

export const metadata: Metadata = {
  description:
    'دوره موردنظر خود را انتخاب کنید و اطلاعات تماس‌تان را بگذارید؛ کارشناسان آکادمی برای تکمیل ثبت‌نام با شما تماس می‌گیرند.',
  title: 'ثبت‌نام',
  alternates: { canonical: '/register/' },
};

export default function RegisterPage() {
  // Everything registrable, in one flat list for the <select>.
  const site = getSite();
  const programs = [
    ...getVisibleCourses().map((c) => ({ id: c.id, label: `دوره: ${c.title}` })),
    ...getSeminars().map((s) => ({ id: s.id, label: `${s.type}: ${s.title}` })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="ثبت‌نام"
        title="ثبت‌نام در برنامه‌های آموزشی"
        lead={`دوره موردنظر خود را انتخاب کنید و اطلاعات تماس‌تان را بگذارید؛\nکارشناسان آکادمی برای تکمیل ثبت‌نام با شما تماس می‌گیرند.`}
      />

      <section className="section bg-white">
        <div className="container-x">
          {/* useSearchParams forces client rendering under `output: export`. */}
          <Suspense>
            <RegisterForm programs={programs} site={{
              email: site.email,
              phone: site.phone,
              phone2: site.phone2,
              address: site.address,
            }} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
