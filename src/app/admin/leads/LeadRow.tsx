'use client';

import { useState } from 'react';

import { LEAD_STATUSES, type Lead } from '@/lib/leads-shared';

import { deleteLeadAction, updateLeadAction } from '../actions';

const TONE: Record<string, string> = {
  new: 'bg-gold/15 text-gold',
  reached: 'bg-brand/10 text-brand-600',
  unreachable: 'bg-amber-100 text-amber-800',
  enrolled: 'bg-emerald-100 text-emerald-800',
  not_interested: 'bg-neutral-200 text-neutral-700',
  call_back: 'bg-sky-100 text-sky-800',
};

export function LeadRow({ lead, when }: { lead: Lead; when: string }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-[11px] font-black ${TONE[lead.status]}`}>
              {LEAD_STATUSES[lead.status]}
            </span>
            <h2 className="font-extrabold text-ink">{lead.name}</h2>
            {/* tel: so a click dials on a phone and opens the softphone on a desktop */}
            <a href={`tel:${lead.phone}`} className="ltr font-bold text-brand hover:underline">
              {lead.phone}
            </a>
          </div>

          <p className="mt-2 text-sm leading-7 text-ink-soft">
            {lead.type}
            {lead.program && <span className="text-ink-mute"> — {lead.program}</span>}
          </p>
          {(lead.company || lead.position) && (
            <p className="text-sm text-ink-mute">
              {lead.company && <>سازمان: {lead.company}</>}
              {lead.company && lead.position && ' · '}
              {lead.position && <>سمت: {lead.position}</>}
            </p>
          )}
          {lead.note && (
            <p className="mt-2 rounded-xl bg-paper px-4 py-3 text-sm leading-7 text-ink-soft">
              {lead.note}
            </p>
          )}
        </div>

        <div className="text-left text-xs text-ink-mute">
          <div>{when}</div>
          {lead.handledBy && <div className="mt-1">آخرین اقدام: {lead.handledBy}</div>}
        </div>
      </div>

      {lead.callNotes && !open && (
        <p className="mt-4 border-r-2 border-line pr-4 text-sm leading-7 text-ink-soft">
          {lead.callNotes}
        </p>
      )}

      <div className="mt-5 border-t border-line pt-4">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs font-bold text-brand hover:underline"
          >
            ثبت نتیجه‌ی تماس
          </button>
        ) : (
          <form action={updateLeadAction} className="grid gap-4">
            <input type="hidden" name="id" value={lead.id} />

            <label className="block text-sm">
              <span className="font-semibold text-ink">وضعیت</span>
              <select
                name="status"
                defaultValue={lead.status}
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
              >
                {Object.entries(LEAD_STATUSES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-semibold text-ink">یادداشت تماس</span>
              <textarea
                name="callNotes"
                rows={3}
                defaultValue={lead.callNotes}
                placeholder="چه گفته شد، قرار بعدی چیست…"
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm leading-7"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn-primary !py-2.5 text-xs">
                ذخیره
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-ink-mute hover:text-ink"
              >
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>

      <form
        action={deleteLeadAction}
        className="mt-3"
        onSubmit={(e) => {
          if (!window.confirm(`سرنخ «${lead.name}» حذف شود؟ این کار برگشت‌پذیر نیست.`)) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={lead.id} />
        <button type="submit" className="text-[11px] text-ink-mute hover:text-red-700">
          حذف
        </button>
      </form>
    </article>
  );
}
