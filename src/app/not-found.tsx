import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'صفحه پیدا نشد',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-center">
      <div>
        <p className="eyebrow justify-center">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">این صفحه پیدا نشد</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">شاید نشانی تغییر کرده یا اشتباه نوشته شده باشد.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary !py-2.5 text-xs">
            صفحه‌ی اول
          </Link>
          <Link href="/programs/" className="btn-secondary !py-2.5 text-xs">
            برنامه‌های آموزشی
          </Link>
        </div>
      </div>
    </main>
  );
}
