'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Reveal } from '@/components/Reveal';


import { fa } from '@/lib/text';

/** Everything registrable, in one flat list for the <select>. */
export type RegisterProgram = { id: string; label: string };
export type RegisterContact = { email: string; phone: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export function RegisterForm({
  programs,
  site,
}: {
  programs: RegisterProgram[];
  site: RegisterContact;
}) {
  // ?course=<id> preselects a program, but only if it is a real one.
  const requested = useSearchParams().get('course') || '';
  const initial = useMemo(
    () => (programs.some((p) => p.id === requested) ? requested : ''),
    [requested, programs],
  );

  const [programId, setProgramId] = useState(initial);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');

  const program = programs.find((p) => p.id === programId);
  const subject = `ثبت‌نام — ${program?.label || 'بدون برنامه'}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== 'idle') return;

    setState('busy');
    try {
      const res = await fetch(`${API_BASE}/api/lead/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: subject, program: program?.label, name, phone, note }),
      });
      if (!res.ok) throw new Error('lead failed');
      setState('done');
    } catch {
      const body = [
        `برنامه: ${program?.label || '-'}`,
        `نام: ${name}`,
        `تلفن: ${phone}`,
        note && `توضیحات: ${note}`,
      ]
        .filter(Boolean)
        .join('\n');
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setState('idle');
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <Reveal>
        <div>
          <p className="eyebrow">فرم ثبت‌نام</p>
          <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">یک قدم تا شروع</h2>
          <p className="mt-4 max-w-md leading-8 text-ink-soft">
            پس از ارسال فرم، کارشناس ثبت‌نام برای اعلام جزئیات (زمان‌بندی، شهریه و نحوه‌ی پرداخت) با
            شما تماس می‌گیرد. برای مشاوره‌ی فوری:
          </p>
          <div className="ltr mt-5 w-fit rounded-full border border-brand/15 bg-brand/5 px-6 py-3 font-black tracking-wide text-brand">
            {fa(site.phone)}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={onSubmit} className="card space-y-4 p-8">
          <select
            required
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full rounded-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-400"
          >
            <option value="">انتخاب برنامه‌ی آموزشی…</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="نام و نام خانوادگی"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-400"
          />
          <input
            required
            placeholder="شماره تماس"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="ltr w-full rounded-full border border-line bg-paper px-4 py-3 text-left text-sm outline-none focus:border-brand-400"
          />
          <textarea
            rows={3}
            placeholder="توضیحات (اختیاری)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-400"
          />
          <button type="submit" disabled={state === 'busy'} className="btn-primary w-full disabled:opacity-60">
            {state === 'busy' ? 'در حال ارسال…' : 'ارسال درخواست ثبت‌نام'}
          </button>
          {state === 'done' && (
            <p className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-center text-sm font-bold text-ink">
              ✓ درخواست ثبت‌نام شما ثبت شد؛ کارشناس آکادمی تماس می‌گیرد.
            </p>
          )}
        </form>
      </Reveal>
    </div>
  );
}
