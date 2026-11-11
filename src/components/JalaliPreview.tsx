'use client';

import { useMemo, useState } from 'react';

import { JALALI_MONTHS, jalaliMonthLength, toGregorian, toJalali } from '@/lib/jalali';

/**
 * A date (and optionally time) picked in the Jalali calendar.
 *
 * The three boxes show Persian year, month and day; what the form actually
 * sends is the same Gregorian text the server has always read
 * ("2026-11-11" or "2026-11-11T10:30"), so nothing downstream changes. An
 * incomplete choice sends nothing, which the server reads as "no limit".
 */

const fa = (n: number) => n.toLocaleString('fa-IR', { useGrouping: false });
const two = (n: number) => String(n).padStart(2, '0');

const box =
  'rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-400';

type Parts = { y: number; m: number; d: number; h: number; mi: number };

function parse(value: string): Parts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value.trim());
  if (!m) return null;
  const j = toJalali(Number(m[1]), Number(m[2]), Number(m[3]));
  return { ...j, h: Number(m[4] ?? 0), mi: Number(m[5] ?? 0) };
}

function JalaliPicker({ name, defaultValue, withTime }: { name: string; defaultValue: string; withTime: boolean }) {
  const initial = useMemo(() => parse(defaultValue), [defaultValue]);
  const thisYear = toJalali(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()).y;

  const [y, setY] = useState(initial?.y ?? 0);
  const [m, setM] = useState(initial?.m ?? 0);
  const [d, setD] = useState(initial?.d ?? 0);
  const [h, setH] = useState(initial?.h ?? 0);
  const [mi, setMi] = useState(initial?.mi ?? 0);

  const years = useMemo(() => {
    const from = Math.min(thisYear - 2, initial?.y ?? thisYear);
    const to = Math.max(thisYear + 5, initial?.y ?? thisYear);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [thisYear, initial]);

  const days = y && m ? jalaliMonthLength(y, m) : 31;
  const day = d > days ? days : d;

  let value = '';
  if (y && m && day) {
    const g = toGregorian(y, m, day);
    value = `${g.y}-${two(g.m)}-${two(g.d)}${withTime ? `T${two(h)}:${two(mi)}` : ''}`;
  }

  return (
    <div className="mt-2">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="روز" value={day} onChange={(e) => setD(Number(e.target.value))} className={box}>
          <option value={0}>روز</option>
          {Array.from({ length: days }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {fa(n)}
            </option>
          ))}
        </select>
        <select aria-label="ماه" value={m} onChange={(e) => setM(Number(e.target.value))} className={box}>
          <option value={0}>ماه</option>
          {JALALI_MONTHS.map((label, i) => (
            <option key={label} value={i + 1}>
              {label}
            </option>
          ))}
        </select>
        <select aria-label="سال" value={y} onChange={(e) => setY(Number(e.target.value))} className={box}>
          <option value={0}>سال</option>
          {years.map((n) => (
            <option key={n} value={n}>
              {fa(n)}
            </option>
          ))}
        </select>

        {withTime && (
          <span className="flex items-center gap-1" dir="ltr">
            <select aria-label="دقیقه" value={mi} onChange={(e) => setMi(Number(e.target.value))} className={box}>
              {Array.from({ length: 12 }, (_, i) => i * 5).map((n) => (
                <option key={n} value={n}>
                  {fa(n).padStart(2, '۰')}
                </option>
              ))}
              {mi % 5 !== 0 && <option value={mi}>{fa(mi).padStart(2, '۰')}</option>}
            </select>
            <span aria-hidden>:</span>
            <select aria-label="ساعت" value={h} onChange={(e) => setH(Number(e.target.value))} className={box}>
              {Array.from({ length: 24 }, (_, i) => i).map((n) => (
                <option key={n} value={n}>
                  {fa(n).padStart(2, '۰')}
                </option>
              ))}
            </select>
          </span>
        )}

        {(y || m || d) > 0 && (
          <button
            type="button"
            className="text-xs font-bold text-ink-mute hover:text-red-700"
            onClick={() => {
              setY(0);
              setM(0);
              setD(0);
              setH(0);
              setMi(0);
            }}
          >
            پاک کردن
          </button>
        )}
      </div>
      <p className="mt-1 min-h-[1.25rem] text-xs text-ink-mute">
        {value ? '' : 'انتخاب نشده (بدون محدودیت)'}
        {value && withTime ? 'ساعت به وقت تهران' : ''}
      </p>
    </div>
  );
}

/** Date and time. The value sent is "YYYY-MM-DDTHH:mm" in Tehran time. */
export function JalaliDateTime({ name, defaultValue }: { name: string; defaultValue: string }) {
  return <JalaliPicker name={name} defaultValue={defaultValue} withTime />;
}

/** Date only. The value sent is "YYYY-MM-DD". */
export function JalaliDate({ name, defaultValue }: { name: string; defaultValue: string }) {
  return <JalaliPicker name={name} defaultValue={defaultValue} withTime={false} />;
}
