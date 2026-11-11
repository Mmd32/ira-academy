'use client';

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

export function SectionsForm({ items }: { items: Item[] }) {
  const [message, action] = useFormState(saveSectionsAction, null);
  return (
    <form action={action} className="grid gap-4">
      {items.map((it) => (
        <label key={it.key} className="card flex items-start gap-4 p-5">
          <input type="checkbox" name="on" value={it.key} defaultChecked={it.on} className="mt-1.5 h-4 w-4" />
          <span>
            <span className="block font-extrabold text-ink">
              {it.label} <span className="text-xs font-normal text-ink-mute">· صفحه‌ی {it.page}</span>
            </span>
            <span className="mt-1 block text-xs leading-6 text-ink-soft">{it.hint}</span>
          </span>
        </label>
      ))}
      <div className="flex items-center gap-4">
        <Submit />
        {message && <span className="text-sm text-emerald-700" role="status">{message}</span>}
      </div>
    </form>
  );
}
