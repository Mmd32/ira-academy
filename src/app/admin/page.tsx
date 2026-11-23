import Link from 'next/link';
import { requireAdmin } from '@/server/guard';

import { getAllArticles, getAllCourses, getGlossary } from '@/server/content';
import { leadCounts, listLeads } from '@/server/leads';
import { listExams } from '@/server/exams';
import { listPeople } from '@/server/people';
import { listStudents } from '@/server/students';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';


export const dynamic = 'force-dynamic';

export default function AdminHome() {
  const user = requireAdmin();

  const counts = leadCounts();
  const courses = getAllCourses();
  const articles = getAllArticles();
  const students = listStudents();
  const exams = listExams();
  const people = listPeople();
  const recent = listLeads('new').slice(0, 5);
  const now = new Date();
  const openExams = exams.filter(
    (e) => e.published && (!e.startAt || new Date(e.startAt) <= now) && (!e.endAt || new Date(e.endAt) > now),
  );

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
      href: '/admin/students/',
      label: 'دانش‌پذیران',
      value: students.length,
      note: `${fa(students.filter((x) => x.active).length)} حساب فعال`,
    },
    {
      href: '/admin/exams/',
      label: 'آزمون‌ها',
      value: exams.length,
      note: `${fa(openExams.length)} باز در همین لحظه`,
    },
    {
      href: '/admin/people/',
      label: 'افراد و پروفایل‌ها',
      value: people.length,
      note: 'مؤسس، مدیر، مدرس، نویسنده',
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-ink">آخرین سرنخ‌های جدید</h2>
            <Link href="/admin/leads/" className="text-xs font-bold text-brand hover:underline">
              همه ←
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-mute">سرنخ بی‌پاسخی نیست.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recent.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span>
                    <span className="font-bold text-ink">{l.name || 'بدون نام'}</span>
                    <span className="ltr mr-3 text-xs text-ink-soft">{l.phone}</span>
                  </span>
                  <span className="text-xs text-ink-mute">
                    {l.type} · {formatFa(l.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <h2 className="font-extrabold text-ink">کارهای پرتکرار</h2>
          <div className="mt-4 grid gap-2 text-sm">
            {[
              ['/admin/exams/edit/', 'ساخت آزمون جدید'],
              ['/admin/students/', 'افزودن دانش‌پذیر'],
              ['/admin/articles/edit/', 'نوشتن مقاله'],
              ['/admin/people/edit/', 'افزودن شخص (مؤسس، مدرس، نویسنده)'],
              ['/admin/pages/', 'ویرایش متن صفحه‌ها'],
              ['/admin/seo/', 'کدهای گوگل و آنالیتیکس'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-xl border border-line bg-paper px-4 py-2.5 font-semibold text-ink-soft transition-colors hover:border-brand-400 hover:text-brand">
                {label}
              </Link>
            ))}
          </div>
        </section>
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
