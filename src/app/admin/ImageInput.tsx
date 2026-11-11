'use client';

import { useState } from 'react';

/** Picture picker: shrinks the photo in the browser, uploads it, and keeps only its address. */
export function ImageField({ value, onChange, original }: { value: string; onChange: (next: string) => void; original?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | string>('idle');

  async function pick(file: File) {
    setState('busy');
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('convert'))), 'image/jpeg', 0.85),
      );
      const body = new FormData();
      body.append('file', blob, 'photo.jpg');
      const res = await fetch('/admin/upload/', { method: 'POST', body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'upload');
      onChange(data.url);
      setState('idle');
    } catch (e) {
      setState(e instanceof Error && e.message !== 'upload' && e.message !== 'convert' ? e.message : 'بارگذاری نشد. عکس دیگری امتحان کنید.');
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4">
      {value || original ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value || original} alt="" className="h-24 w-24 rounded-xl border border-line bg-paper object-contain" />
      ) : (
        <span className="grid h-20 w-20 place-items-center rounded-xl border border-dashed border-line text-xs text-ink-mute">بدون عکس</span>
      )}
      <label className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-brand hover:border-brand-400">
        {state === 'busy' ? 'در حال بارگذاری…' : value ? 'تعویض عکس' : original ? 'جایگزین کردن' : 'انتخاب عکس'}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={state === 'busy'}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            e.target.value = '';
          }}
        />
      </label>
      {value && (
        <button type="button" className="text-xs font-bold text-red-700 hover:underline" onClick={() => onChange('')}>
          {original ? 'برگرداندن تصویر اصلی' : 'حذف عکس'}
        </button>
      )}
      {state !== 'idle' && state !== 'busy' && <span className="text-xs text-red-700">{state}</span>}
    </div>
  );
}

/** The same picker for ordinary forms: remembers its address in a hidden field of the given name. */
export function ImageInput({ name, defaultValue = '', original }: { name: string; defaultValue?: string; original?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <ImageField value={value} onChange={setValue} original={original} />
    </>
  );
}
