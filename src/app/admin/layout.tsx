import type { Metadata } from 'next';

import { currentUser } from '@/server/auth';
import { leadCounts } from '@/server/leads';

import { AdminShell } from './AdminShell';

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
      { href: '/admin/images/', label: 'تصاویر سایت' },
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
  const groups = NAV_GROUPS.map((g) => ({
    title: g.title,
    items: g.items.map((i) => ({ href: i.href, label: i.label, badge: i.badge === 'leads' ? counts.new : undefined })),
  }));

  return (
    <AdminShell groups={groups} userName={user.displayName || user.username}>
      {children}
    </AdminShell>
  );
}
