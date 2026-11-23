'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

import { saveGlossaryAction } from '../content-actions';
import { fieldBox } from '../ui';

type Entry = { key: number; term: string; definition: string };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'در حال ذخیره…' : 'ذخیره‌ی واژه‌نامه'}
    </button>
  );
}

export function GlossaryEditor({ entries }: { entries: { term: string; definition: string }[] }) {
  const [rows, setRows] = useState<Entry[]>(entries.map((e, i) => ({ key: i, ...e })));
  const [nextKey, setNextKey] = useState(entries.length);

  return (
    <form action={saveGlossaryAction} className="grid gap-5">
      <div className="card grid gap-4 p-7">
        {rows.map((row, i) => (
          <div key={row.key} className="grid gap-3 sm:grid-cols-[14rem_1fr_auto] sm:items-start">
            <input
              name="term"
              defaultValue={row.term}
              placeholder="اصطلاح"
              className={`${fieldBox} !mt-0 font-semibold`}
            />
            <input
              name="definition"
              defaultValue={row.definition}
              placeholder="تعریف کوتاه"
              className={`${fieldBox} !mt-0`}
            />
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((x) => x.key !== row.key))}
              className="justify-self-start pt-2 text-xs text-ink-mute hover:text-red-700"
              aria-label={`حذف ${row.term || `ردیف ${i + 1}`}`}
            >
              حذف
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            setRows((r) => [...r, { key: nextKey, term: '', definition: '' }]);
            setNextKey((k) => k + 1);
          }}
          className="w-fit rounded-full border border-line bg-white px-4 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-brand-400 hover:text-brand"
        >
          + اصطلاح تازه
        </button>
      </div>

      <Submit />
    </form>
  );
}
