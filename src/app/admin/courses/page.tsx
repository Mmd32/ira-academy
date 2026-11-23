import Link from 'next/link';
import { requireAdmin } from '@/server/guard';

import { getAllCourses, getProgramModels } from '@/server/content';
import { fa } from '@/lib/text';

import { PageTitle } from '../ui';
import { DeleteCourseButton } from './DeleteCourseButton';

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  requireAdmin();
  const courses = getAllCourses();
  const models = getProgramModels();
  const modelTitle = (id: string) => models.find((m) => m.id === id)?.title ?? id;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle
          eyebrow="محتوا"
          title="دوره‌ها"
          lead="دوره‌ی خاموش در سایت دیده نمی‌شود — نه در صفحه‌ی دوره‌ها، نه در نوار متحرک، نه در فهرست ثبت‌نام."
        />
        <Link href="/admin/courses/edit/" className="btn-primary !py-2.5 text-xs">
          دوره‌ی جدید
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {courses.map((c) => (
          <article key={c.id} className="card flex flex-wrap items-start justify-between gap-4 p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-black ${
                    c.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {c.enabled ? 'روی سایت' : 'خاموش'}
                </span>
                <h2 className="font-extrabold text-ink">{c.title}</h2>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">{c.blurb}</p>
              <p className="mt-2 text-xs text-ink-mute">
                {modelTitle(c.model)} · {c.audience || 'بدون مخاطب'} · {fa(c.sessions)} مبحث ·{' '}
                {fa(c.hours)} ساعت
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 text-xs">
              <Link
                href={`/admin/courses/edit/?id=${c.id}`}
                className="font-bold text-brand hover:underline"
              >
                ویرایش
              </Link>
              <DeleteCourseButton id={c.id} title={c.title} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
