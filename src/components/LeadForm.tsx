'use client';

import { useState } from 'react';

export type LeadField = 'name' | 'phone' | 'company' | 'note';

const LABELS: Record<LeadField, string> = {
  name: 'نام و نام خانوادگی',
  phone: 'شماره تماس',
  company: 'نام مجموعه / برند',
  note: 'توضیحات',
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

/**
 * Shared enquiry form. Posts to /api/lead; if that endpoint is unavailable
 * (as on the static build) it falls back to opening a prefilled mailto.
 */
export function LeadForm({
  subject,
  cta = 'ارسال درخواست',
  fields = ['name', 'phone', 'note'],
  // The address the fallback writes to. Passed in rather than written here, so
  // changing it in the panel changes it everywhere.
  email = 'info@academyretailiran.com',
}: {
  subject: string;
  cta?: string;
  fields?: LeadField[];
  email?: string;
}) {
  const [values, setValues] = useState<Partial<Record<LeadField, string>>>({});
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');

  const bind = (field: LeadField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== 'idle') return;

    setState('busy');
    try {
      const res = await fetch(`${API_BASE}/api/lead/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: subject, ...values }),
      });
      if (!res.ok) throw new Error('lead failed');
      setState('done');
    } catch {
      const body = [
        values.name && `نام: ${values.name}`,
        values.company && `مجموعه: ${values.company}`,
        values.phone && `تلفن: ${values.phone}`,
        values.note && `توضیحات: ${values.note}`,
      ]
        .filter(Boolean)
        .join('\n');
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-gold/15 text-xl text-gold">
          ✓
        </span>
        <p className="mt-3 text-sm font-bold text-ink">درخواست شما ثبت شد</p>
        <p className="mt-1 text-xs leading-6 text-ink-soft">
          کارشناسان آکادمی حداکثر تا یک روز کاری با شما تماس می‌گیرند.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) =>
        field === 'note' ? (
          <textarea
            key={field}
            rows={4}
            placeholder={LABELS[field]}
            value={values[field] || ''}
            onChange={bind(field)}
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-brand-400"
          />
        ) : (
          <input
            key={field}
            required={field !== 'company'}
            placeholder={LABELS[field]}
            value={values[field] || ''}
            onChange={bind(field)}
            className={`w-full rounded-full border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-brand-400 ${
              field === 'phone' ? 'ltr text-left' : ''
            }`}
          />
        ),
      )}
      <button type="submit" disabled={state === 'busy'} className="btn-primary w-full disabled:opacity-60">
        {state === 'busy' ? 'در حال ارسال…' : cta}
      </button>
    </form>
  );
}
