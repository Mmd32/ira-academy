'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { saveSiteWordingAction } from '../exam-actions';
import { fieldBox } from '../ui';

type Item = { key: string; label: string; kind: 'text' | 'long' | 'href'; value: string; def: string };
type Group = { name: string; items: Item[] };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : 'ذخیره‌ی همه'}
    </button>
  );
}

export function WordingForm({ groups }: { groups: Group[] }) {
  const [message, action] = useFormState(saveSiteWordingAction, null);

  return (
    <form action={action} className="grid gap-6">
      {groups.map((g) => (
        <details key={g.name} className="card p-6">
          <summary className="cursor-pointer font-extrabold text-ink">{g.name}</summary>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {g.items.map((it) => (
              <label key={it.key} className={`block text-sm ${it.kind === 'long' ? 'sm:col-span-2' : ''}`}>
                <span className="font-semibold text-ink">{it.label}</span>
                {it.kind === 'long' ? (
                  <textarea name={`ui:${it.key}`} defaultValue={it.value} rows={3} className={fieldBox} />
                ) : (
                  <input
                    name={`ui:${it.key}`}
                    defaultValue={it.value}
                    className={`${fieldBox} ${it.kind === 'href' ? 'ltr' : ''}`}
                  />
                )}
              </label>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-mute">
            فیلد را خالی بگذارید تا متن اصلی سایت برگردد. برای حذف یک لینک از منو یا فوتر، عنوانش را پاک نکنید؛ لینک را به
            صفحه‌ی دیگری بدهید.
          </p>
        </details>
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
