import Link from 'next/link';

import { currentUser } from '@/server/auth';
import { getAllArticles, getAllCourses, getGlossary } from '@/server/content';
import { leadCounts } from '@/server/leads';
import { fa } from '@/lib/text';

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminHome() {
  const user = currentUser();
  if (!user) redirect('/admin/login/');

  const counts = leadCounts();
  const courses = getAllCourses();
  const articles = getAllArticles();

  const tiles = [
    {
      href: '/admin/leads/',
      label: 'سرنخ‌های جدید',
      value: counts.new,
      note: `${fa(counts.all)} مورد در مجموع`,
      urgent: counts.new > 0,
    },
    {
      href: '/admin/articles/',
      label: 'مقاله‌ها',
      value: articles.length,
      note: `${fa(articles.filter((a) => a.body.length > 0).length)} منتشرشده`,
    },
    {
      href: '/admin/courses/',
      label: 'دوره‌ها',
      value: courses.length,
      note: `${fa(courses.filter((c) => c.enabled).length)} فعال روی سایت`,
    },
    {
      href: '/admin/glossary/',
      label: 'واژه‌نامه',
      value: getGlossary().length,
      note: 'اصطلاح',
    },
  ];

  return (
    <>
      <p className="eyebrow">خوش آمدید</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">{user.displayName || user.username}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
              tile.urgent ? 'border-gold' : ''
            }`}
          >
            <p className="text-xs font-semibold text-ink-mute">{tile.label}</p>
            <p className={`mt-2 text-3xl font-black ${tile.urgent ? 'text-gold' : 'text-brand'}`}>
              {fa(tile.value)}
            </p>
            <p className="mt-1 text-xs text-ink-mute">{tile.note}</p>
          </Link>
        ))}
      </div>

      {counts.new > 0 && (
        <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/5 p-6">
          <p className="font-extrabold text-ink">
            {fa(counts.new)} نفر منتظر تماس هستند
          </p>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            این‌ها فرم پر کرده‌اند و هنوز کسی وضعیتشان را ثبت نکرده است.
          </p>
          <Link href="/admin/leads/?status=new" className="btn-primary mt-5 !py-2.5 text-xs">
            دیدن فهرست
          </Link>
        </div>
      )}
    </>
  );
}
