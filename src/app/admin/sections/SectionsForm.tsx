'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { saveSectionsAction } from '../exam-actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : 'ذخیره'}
    </button>
  );
}

type Item = { key: string; page: string; label: string; hint: string; on: boolean };

function Row({ it }: { it: Item }) {
  const [on, setOn] = useState(it.on);
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-bold text-ink">{it.label}</span>
        {it.hint && <span className="mt-0.5 block text-xs leading-6 text-ink-mute">{it.hint}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <span className={`w-12 text-left text-xs font-black ${on ? 'text-emerald-700' : 'text-ink-mute'}`}>{on ? 'روشن' : 'خاموش'}</span>
        <span className="relative">
          <input
            type="checkbox"
            name="on"
            value={it.key}
            checked={on}
            onChange={(e) => setOn(e.target.checked)}
            className="peer sr-only"
          />
          <span className="block h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400" />
          <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:-translate-x-5" />
        </span>
      </span>
    </label>
  );
}

export function SectionsForm({ items }: { items: Item[] }) {
  const [message, action] = useFormState(saveSectionsAction, null);
  const pages = Array.from(new Set(items.map((i) => i.page)));

  return (
    <form action={action} className="grid gap-6">
      {pages.map((page) => (
        <section key={page} className="card p-6">
          <h2 className="font-extrabold text-ink">{page}</h2>
          <div className="mt-4 divide-y divide-line">
            {items
              .filter((i) => i.page === page)
              .map((it) => <Row key={it.key} it={it} />              )}
          </div>
        </section>
      ))}
      <div className="sticky bottom-4 z-10 flex items-center gap-4 rounded-2xl border border-line bg-white/95 p-4 shadow-card">
        <Submit />
        {message && <span className="text-sm text-emerald-700" role="status">{message}</span>}
      </div>
    </form>
  );
}
