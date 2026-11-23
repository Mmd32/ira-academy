'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { ImageInput } from '../ImageInput';
import { saveImagesAction } from '../exam-actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : 'ذخیره'}
    </button>
  );
}

type Slot = { key: string; label: string; hint: string; value: string; original: string };

export function ImagesForm({ slots }: { slots: Slot[] }) {
  const [message, action] = useFormState(saveImagesAction, null);
  return (
    <form action={action} className="grid gap-5">
      {slots.map((s) => (
        <section key={s.key} className="card p-6">
          <h2 className="font-extrabold text-ink">{s.label}</h2>
          <p className="mt-1 text-xs leading-6 text-ink-mute">{s.hint}</p>
          <div className="mt-3 flex flex-wrap items-start gap-6">
            <div>
              <p className="text-[11px] font-bold text-ink-mute">فعلی</p>
              <ImageInput name={`img:${s.key}`} defaultValue={s.value === s.original ? '' : s.value} original={s.original} />
            </div>
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
