import type { Metadata } from 'next';
import Link from 'next/link';

import { currentUser } from '@/server/auth';
import { leadCounts } from '@/server/leads';

import { SignOutButton } from './SignOutButton';

export const metadata: Metadata = {
  title: 'پنل مدیریت',
  robots: { index: false, follow: false },
};

/** The panel reads the database on every request, so nothing may be cached. */
export const dynamic = 'force-dynamic';

type NavItem = { href: string; label: string; badge?: 'leads' };

/** Grouped by what the person is doing, so fifteen links do not read as one long row. */
const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  { title: '', items: [{ href: '/admin/', label: 'خلاصه' }] },
  {
    title: 'محتوای سایت',
    items: [
      { href: '/admin/articles/', label: 'مقاله‌ها' },
      { href: '/admin/courses/', label: 'دوره‌ها' },
      { href: '/admin/texts/', label: 'متن‌های سایت' },
      { href: '/admin/people/', label: 'افراد و پروفایل‌ها' },
      { href: '/admin/pages/', label: 'متن صفحه‌ها' },
      { href: '/admin/site/', label: 'هدر، فوتر و دکمه‌ها' },
      { href: '/admin/sections/', label: 'نمایش بخش‌ها' },
      { href: '/admin/glossary/', label: 'واژه‌نامه' },
    ],
  },
  {
    title: 'دانش‌پذیران و آزمون',
    items: [
      { href: '/admin/students/', label: 'دانش‌پذیران' },
      { href: '/admin/orgs/', label: 'سازمان‌ها' },
      { href: '/admin/groups/', label: 'گروه‌ها' },
      { href: '/admin/exams/', label: 'آزمون‌ها' },
    ],
  },
  {
    title: 'رشد',
    items: [
      { href: '/admin/leads/', label: 'فرم‌ها و سرنخ‌ها', badge: 'leads' },
      { href: '/admin/seo/', label: 'سئو و آنالیتیکس' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = currentUser();

  // The login page renders inside this layout too, but without the chrome:
  // there is nothing to navigate to until someone has signed in.
  if (!user) return <div className="min-h-screen bg-paper">{children}</div>;

  const counts = leadCounts();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
          <Link href="/admin/" className="font-extrabold text-brand">
            پنل مدیریت
          </Link>

          <nav className="flex flex-1 flex-wrap items-start gap-x-8 gap-y-3 text-sm">
            {NAV_GROUPS.map((group) => (
              <div key={group.title || 'home'}>
                {group.title && <p className="mb-1 text-[11px] font-bold text-ink-mute">{group.title}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-1 text-ink-soft transition-colors hover:text-brand"
                    >
                      {item.label}
                      {item.badge === 'leads' && counts.new > 0 && (
                        <span className="mr-2 rounded-full bg-gold px-2 py-0.5 text-[11px] font-black text-ink">
                          {counts.new}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="text-ink-mute hover:text-brand">
              دیدن سایت ↗
            </Link>
            <span className="text-ink-mute">{user.displayName || user.username}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
