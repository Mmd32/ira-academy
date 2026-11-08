'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { savePageAction } from '../../exam-actions';
import { fieldBox } from '../../ui';

type Json = string | Json[] | { [key: string]: Json };

/** Plain-language names for the keys the content pages use. */
const NAMES: Record<string, string> = {
  intro: 'متن آغازین',
  goal: 'هدف',
  mission: 'مأموریت',
  vision: 'چشم‌انداز',
  founders: 'هیئت مؤسس',
  faculty: 'کادر علمی',
  facultyText: 'متن کادر علمی',
  partnersText: 'متن همکاران آموزشی',
  sponsorsText: 'متن حامیان',
  benefits: 'مزیت‌ها',
  clubIntro: 'معرفی باشگاه',
  perks: 'مزایای عضویت',
  albums: 'آلبوم‌ها',
  faqs: 'سؤال‌های متداول',
  teachHeading: 'عنوان «مدرس شوید»',
  teachText: 'متن «مدرس شوید»',
  partnerLines: 'متن همکاری',
  name: 'نام',
  role: 'سمت',
  title: 'عنوان',
  desc: 'توضیح',
  people: 'افراد',
  image: 'نشانی تصویر',
  q: 'پرسش',
  a: 'پاسخ',
};
const HIDDEN = new Set(['tone']);

const label = (key: string) => NAMES[key] ?? key;
const isLong = (v: string) => v.length > 70 || v.includes('\n');

/** An empty copy of an item, so "add" gives a row with the same fields. */
function blank(model: Json | undefined): Json {
  if (typeof model === 'string' || model === undefined) return '';
  if (Array.isArray(model)) return [];
  return Object.fromEntries(Object.entries(model).map(([k, v]) => [k, HIDDEN.has(k) ? v : blank(v)]));
}

function Node({
  value,
  name,
  onChange,
  depth,
}: {
  value: Json;
  name: string;
  onChange: (next: Json) => void;
  depth: number;
}) {
  if (typeof value === 'string') {
    return isLong(value) ? (
      <textarea value={value} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 70)))} onChange={(e) => onChange(e.target.value)} className={fieldBox} aria-label={name} />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} className={fieldBox} aria-label={name} />
    );
  }

  if (Array.isArray(value)) {
    const model = value[0];
    return (
      <div className="mt-2 grid gap-3">
        {value.map((item, i) => (
          <div key={i} className={`rounded-xl border border-line p-4 ${depth % 2 ? 'bg-white' : 'bg-paper'}`}>
            <Node
              value={item}
              name={`${name} ${i + 1}`}
              depth={depth + 1}
              onChange={(next) => onChange(value.map((x, j) => (j === i ? next : x)))}
            />
            <button
              type="button"
              className="mt-3 text-xs font-bold text-red-700 hover:underline"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              حذف این مورد
            </button>
          </div>
        ))}
        <button
          type="button"
          className="justify-self-start rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-brand hover:border-brand-400"
          onClick={() => onChange([...value, blank(model)])}
        >
          + افزودن
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {Object.entries(value).map(([k, v]) =>
        HIDDEN.has(k) ? null : (
          <div key={k}>
            <span className="text-sm font-semibold text-ink">{label(k)}</span>
            <Node value={v} name={label(k)} depth={depth + 1} onChange={(next) => onChange({ ...value, [k]: next })} />
          </div>
        ),
      )}
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : 'ذخیره'}
    </button>
  );
}

export function PageEditor({ slug, initial }: { slug: string; initial: { [key: string]: Json } }) {
  const [content, setContent] = useState<{ [key: string]: Json }>(initial);
  const [message, action] = useFormState(savePageAction, null);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      {Object.entries(content).map(([k, v]) => (
        <section key={k} className="card p-7">
          <h2 className="font-extrabold text-ink">{label(k)}</h2>
          <div className="mt-4">
            <Node value={v} name={label(k)} depth={0} onChange={(next) => setContent({ ...content, [k]: next })} />
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 z-10 flex items-center gap-4 rounded-2xl border border-line bg-white/95 p-4 shadow-card">
        <Submit />
        {message && (
          <span className={`text-sm ${message.startsWith('ذخیره') ? 'text-emerald-700' : 'text-red-700'}`} role="status">
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
