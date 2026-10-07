'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

import { saveArticleAction } from '../../content-actions';
import { Field, fieldBox } from '../../ui';

import type { Article, ArticleBlock } from '@/content/articles';

const BLOCK_LABELS: Record<string, string> = {
  p: 'پاراگراف',
  h2: 'تیتر',
  lead: 'لید (پاراگراف شاخص ابتدای مقاله)',
  note: 'یادداشت (کادر خاکستری)',
  image: 'تصویر',
  diagram: 'نمودار چیدمان فروشگاه',
};

type Row = { key: number; type: string; text: string; extra: string };

function toRows(body: readonly ArticleBlock[]): Row[] {
  return body.map((b, i) => {
    if (b.type === 'image') return { key: i, type: 'image', text: b.src, extra: b.caption ?? b.alt };
    if (b.type === 'diagram') return { key: i, type: 'diagram', text: '', extra: '' };
    return { key: i, type: b.type, text: b.text, extra: '' };
  });
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'در حال ذخیره…' : 'ذخیره'}
    </button>
  );
}

export function ArticleEditor({ article }: { article?: Article }) {
  const [rows, setRows] = useState<Row[]>(
    article ? toRows(article.body) : [{ key: 0, type: 'lead', text: '', extra: '' }],
  );
  const [nextKey, setNextKey] = useState(rows.length);

  const addRow = (type: string) => {
    setRows((r) => [...r, { key: nextKey, type, text: '', extra: '' }]);
    setNextKey((k) => k + 1);
  };
  const move = (i: number, dir: -1 | 1) =>
    setRows((r) => {
      const next = [...r];
      const j = i + dir;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <form action={saveArticleAction} className="grid gap-8">
      {article && <input type="hidden" name="originalSlug" value={article.slug} />}

      <section className="card grid gap-5 p-7">
        <h2 className="font-extrabold text-ink">مشخصات</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان">
            <input name="title" defaultValue={article?.title} required className={fieldBox} />
          </Field>
          <Field label="عنوان کوتاه" hint="برای کارت‌ها">
            <input name="shortTitle" defaultValue={article?.shortTitle} className={fieldBox} />
          </Field>
          <Field label="نشانی مقاله" hint="انگلیسی، با خط تیره">
            <input
              name="slug"
              defaultValue={article?.slug}
              required
              pattern="[a-z0-9-]+"
              className={`${fieldBox} ltr`}
            />
          </Field>
          <Field label="نوع" hint="مثلاً مقاله، مورد کاوی">
            <input name="kind" defaultValue={article?.kind ?? 'مقاله'} className={fieldBox} />
          </Field>
          <Field label="نویسنده">
            <input name="authorName" defaultValue={article?.author.name} className={fieldBox} />
          </Field>
          <Field label="سمت نویسنده">
            <input name="authorTitle" defaultValue={article?.author.title} className={fieldBox} />
          </Field>
          <Field label="تاریخ انتشار" hint="میلادی">
            <input
              name="publishedAt"
              type="date"
              defaultValue={article?.publishedAt ?? new Date().toISOString().slice(0, 10)}
              className={`${fieldBox} ltr`}
            />
          </Field>
          <Field label="کلیدواژه‌های سئو" hint="با «،» جدا کنید">
            <input
              name="keywords"
              defaultValue={article?.keywords.join('، ')}
              className={fieldBox}
            />
          </Field>
        </div>

        <Field label="خلاصه" hint="همین متن در گوگل و کارت مقاله دیده می‌شود — حدود ۱۵۵ حرف">
          <textarea name="excerpt" rows={2} defaultValue={article?.excerpt} className={fieldBox} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="تصویر کاور" hint="مثلاً /media/articles/name.webp">
            <input name="coverSrc" defaultValue={article?.cover.src} className={`${fieldBox} ltr`} />
          </Field>
          <Field label="توضیح تصویر کاور" hint="برای نابینایان و گوگل">
            <input name="coverAlt" defaultValue={article?.cover.alt} className={fieldBox} />
          </Field>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={article ? true : true}
            className="h-4 w-4"
          />
          <span className="font-semibold text-ink">در سایت منتشر شود</span>
        </label>
      </section>

      <section className="card grid gap-5 p-7">
        <h2 className="font-extrabold text-ink">متن مقاله</h2>

        {rows.map((row, i) => (
          <div key={row.key} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-brand">{BLOCK_LABELS[row.type]}</span>
              <div className="flex items-center gap-3 text-xs text-ink-mute">
                <button type="button" onClick={() => move(i, -1)} className="hover:text-brand">
                  ↑ بالا
                </button>
                <button type="button" onClick={() => move(i, 1)} className="hover:text-brand">
                  ↓ پایین
                </button>
                <button
                  type="button"
                  onClick={() => setRows((r) => r.filter((x) => x.key !== row.key))}
                  className="hover:text-red-700"
                >
                  حذف
                </button>
              </div>
            </div>

            <input type="hidden" name="blockType" value={row.type} />

            {row.type === 'diagram' ? (
              <p className="mt-3 text-xs text-ink-mute">
                این بلوک نمودار آماده‌ی «قبل و بعد چیدمان فروشگاه» را نشان می‌دهد و متن ندارد.
              </p>
            ) : row.type === 'image' ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  name="blockText"
                  defaultValue={row.text}
                  placeholder="/media/articles/name.webp"
                  className={`${fieldBox} ltr !mt-0`}
                />
                <input
                  name="blockExtra"
                  defaultValue={row.extra}
                  placeholder="توضیح زیر تصویر"
                  className={`${fieldBox} !mt-0`}
                />
              </div>
            ) : (
              <>
                <textarea
                  name="blockText"
                  defaultValue={row.text}
                  rows={row.type === 'h2' ? 1 : 4}
                  className={`${fieldBox} !mt-3`}
                />
                <input type="hidden" name="blockExtra" value="" />
              </>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          {Object.entries(BLOCK_LABELS).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => addRow(type)}
              className="rounded-full border border-line bg-white px-4 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-brand-400 hover:text-brand"
            >
              + {label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Submit />
        <Link href="/admin/articles/" className="text-sm text-ink-mute hover:text-ink">
          انصراف
        </Link>
      </div>
    </form>
  );
}
