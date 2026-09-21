import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { RegisterForm } from '@/components/RegisterForm';

export const metadata: Metadata = { title: 'ثبت‌نام' };

export default function RegisterPage() {
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
            <RegisterForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
