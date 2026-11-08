'use client';

import { useState } from 'react';

/**
 * A datetime-local box that also says the date in the Jalali calendar, so an
 * admin who thinks in Persian dates can check what they picked. The value sent
 * is the box's own, and the server reads it as Tehran time.
 */
export function JalaliDateTime({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);

  let shown = '';
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (m) {
    const [y, mo, d, h, mi] = m.slice(1).map(Number);
    shown = new Date(Date.UTC(y, mo - 1, d, h, mi)).toLocaleString('fa-IR', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div>
      <input
        type="datetime-local"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="ltr mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400"
      />
      <p className="mt-1 min-h-[1.25rem] text-xs text-ink-mute">{shown ? `به تقویم شمسی: ${shown}` : 'بدون محدودیت'}</p>
    </div>
  );
}
