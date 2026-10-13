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
import { getSeminars, getSite, getVisibleCourses, getWorkshops } from '@/server/content';

export const metadata: Metadata = {
  description:
    'ثبت‌نام در دوره‌ها، کارگاه‌ها و سمینارهای آکادمی ریتیل ایران — برنامه را انتخاب کنید، کارشناسان برای تکمیل ثبت‌نام تماس می‌گیرند.',
  title: 'ثبت‌نام',
  alternates: { canonical: '/register/' },
};

export default function RegisterPage() {
  // Everything registrable, in one flat list for the <select>.
  const site = getSite();
  const programs = [
    ...getVisibleCourses().map((c) => ({ id: c.id, label: `دوره: ${c.title}` })),
    ...getWorkshops().map((w) => ({ id: w.id, label: `کارگاه: ${w.title}` })),
    ...getSeminars().map((s) => ({ id: s.id, label: `${s.type}: ${s.title}` })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="ثبت‌نام"
        title="ثبت‌نام در برنامه‌های آموزشی"
        lead="برنامه‌ی موردنظر را انتخاب کنید و اطلاعات تماس‌تان را بگذارید؛ کارشناسان آکادمی برای تکمیل ثبت‌نام تماس می‌گیرند."
      />

      <section className="section bg-white">
        <div className="container-x">
          {/* useSearchParams forces client rendering under `output: export`. */}
          <Suspense>
            <RegisterForm programs={programs} site={{ email: site.email, phone: site.phone }} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
