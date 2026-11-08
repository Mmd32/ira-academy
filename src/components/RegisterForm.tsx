'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Reveal } from '@/components/Reveal';


import { LiteralText } from '@/components/LiteralText';
import { formatLandlines } from '@/lib/text';

/** Everything registrable, in one flat list for the <select>. */
export type RegisterProgram = { id: string; label: string };
export type RegisterContact = { email: string; phone: string; phone2?: string; address?: string };

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

  /** Any edit after a success puts the form back to its ordinary state. */
  const touched = () => setState((cur) => (cur === 'done' ? 'idle' : cur));

  const program = programs.find((p) => p.id === programId);
  const subject = `ثبت‌نام — ${program?.label || 'بدون برنامه'}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Only a request already in flight blocks another: someone who has just
    // enrolled must be able to enrol in the next programme straight away.
    if (state === 'busy') return;

    setState('busy');
    try {
      const res = await fetch(`${API_BASE}/api/lead/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: subject, program: program?.label, name, phone, note }),
      });
      if (!res.ok) throw new Error('lead failed');
      // Ready for the next programme: the name and number stay, since the same
      // person is likely to enrol again; the programme and note do not.
      setProgramId('');
      setNote('');
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

  // The intro is set in two lines, and the second needs about 620px: on a wide
  // screen the text column takes the larger share and the form the rest.
  return (
    <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-[1.6fr_1fr]">
      <Reveal>
        <div>
          <p className="eyebrow">فرم ثبت‌نام</p>
          <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">یک قدم تا شروع</h2>
          <p className="mt-4 whitespace-pre-line leading-8 text-ink-soft">
            {'پس از ارسال فرم، کارشناس ثبت‌نام برای اعلام جزئیات دوره\nمورد نظرتان (زمان‌بندی، شهریه و نحوه پرداخت) با شما تماس می‌گیرد. برای مشاوره فوری:'}
          </p>
          <div className="mt-5 w-fit rounded-full border border-brand/15 bg-brand/5 px-6 py-3 font-black text-brand">
            <LiteralText value={formatLandlines(site.phone, site.phone2)} />
          </div>

          {site.address && (
            <div className="mt-8 max-w-md">
              <p className="text-sm font-extrabold text-ink">نشانی دفتر آکادمی ریتیل ایران</p>
              <p className="mt-2 text-sm leading-8 text-ink-soft">{site.address}</p>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={onSubmit} className="card space-y-4 p-8">
          <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">برنامه‌ی آموزشی</span>
          <select
            required
            value={programId}
            onChange={(e) => {
              setProgramId(e.target.value);
              touched();
            }}
            className="w-full rounded-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-400"
          >
            <option value="">انتخاب برنامه‌ی آموزشی…</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          </label>
          <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">نام و نام خانوادگی</span>
          <input
            required
            autoComplete="name"
            placeholder="نام و نام خانوادگی"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              touched();
            }}
            className="w-full rounded-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-400"
          />
          </label>
          <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">شماره تماس</span>
          <input
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="شماره تماس"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              touched();
            }}
            dir="ltr"
            className="w-full rounded-full border border-line bg-paper px-4 py-3 text-right text-sm outline-none focus:border-brand-400"
          />
          </label>
          <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">توضیحات (اختیاری)</span>
          <textarea
            rows={3}
            placeholder="توضیحات (اختیاری)"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              touched();
            }}
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-400"
          />
          </label>
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
