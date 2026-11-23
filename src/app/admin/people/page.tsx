import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { listPeople, PERSON_KINDS } from '@/server/people';

import { PageTitle } from '../ui';

export const dynamic = 'force-dynamic';

export default function PeoplePage() {
  requireAdmin();
  const people = listPeople();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle
          eyebrow="محتوا"
          title="افراد و پروفایل‌ها"
          lead="هیئت مؤسس، مدیران گروه‌ها، مدرسین و نویسنده‌های مقاله. هر نفر یک صفحه‌ی پروفایل دارد (عکس، معرفی‌نامه، لینک‌ها و نوشته‌هایش) که با زدن روی نامش در سایت باز می‌شود."
        />
        <Link href="/admin/people/edit/" className="btn-primary !py-2.5 text-xs">
          شخص جدید
        </Link>
      </div>

      {people.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-ink-soft">هنوز کسی اضافه نشده است.</div>
      ) : (
        Object.entries(PERSON_KINDS).map(([kind, title]) => {
          const group = people.filter((p) => p.kind === kind);
          if (group.length === 0) return null;
          return (
            <section key={kind} className="mt-8">
              <h2 className="font-extrabold text-ink">{title}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {group.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/people/edit/?slug=${p.slug}`}
                    className="card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    {p.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand/10 text-lg font-black text-brand">
                        {p.name.trim().charAt(0)}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-extrabold text-ink">{p.name}</span>
                      <span className="block truncate text-xs text-ink-mute">{p.role || 'بدون سمت'}</span>
                    </span>
                    {!p.visible && <span className="mr-auto rounded-full bg-neutral-200 px-3 py-1 text-[11px] font-black text-neutral-700">پنهان</span>}
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
