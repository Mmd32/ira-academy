import Link from 'next/link';
import { requireAdmin } from '@/server/guard';

import { getAllArticles } from '@/server/content';
import { fa } from '@/lib/text';

import { PageTitle } from '../ui';
import { DeleteArticleButton } from './DeleteArticleButton';

export const dynamic = 'force-dynamic';

const faDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function ArticlesPage() {
  requireAdmin();
  const articles = getAllArticles();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle
          eyebrow="محتوا"
          title="مقاله‌ها"
          lead="مقاله‌های دانشنامه. مقاله‌ی منتشرنشده در سایت دیده نمی‌شود ولی اینجا می‌ماند."
        />
        <Link href="/admin/articles/edit/" className="btn-primary !py-2.5 text-xs">
          مقاله‌ی جدید
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {articles.map((a) => (
          <article key={a.slug} className="card flex flex-wrap items-start justify-between gap-4 p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-black ${
                    a.body.length > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {a.kind}
                </span>
                {a.hidden && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-800">
                    پنهان از سایت
                  </span>
                )}
                <h2 className="font-extrabold text-ink">{a.title}</h2>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">{a.excerpt}</p>
              <p className="mt-2 text-xs text-ink-mute">
                {faDate(a.publishedAt)} · {fa(a.body.length)} بلوک متنی · {a.author.name}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 text-xs">
              <Link
                href={`/knowledge/${a.slug}/`}
                target="_blank"
                className="text-ink-mute hover:text-brand"
              >
                دیدن ↗
              </Link>
              <Link
                href={`/admin/articles/edit/?slug=${a.slug}`}
                className="font-bold text-brand hover:underline"
              >
                ویرایش
              </Link>
              <DeleteArticleButton slug={a.slug} title={a.title} />
            </div>
          </article>
        ))}

        {articles.length === 0 && (
          <div className="card p-10 text-center text-ink-soft">هنوز مقاله‌ای ثبت نشده است.</div>
        )}
      </div>
    </>
  );
}
