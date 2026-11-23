'use client';

import { useState } from 'react';

/**
 * The team's way in. Kept deliberately quiet — a visitor has no reason to
 * notice it, and it opens only when someone goes looking.
 */
export function PreviewGate() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'busy') return;

    setState('busy');
    try {
      const res = await fetch('/api/preview/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('rejected');
      // Full reload so the middleware sees the new cookie.
      window.location.href = '/';
    } catch {
      setState('error');
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-white/30 underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
      >
        ورود عوامل سایت
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-xs flex-col items-center gap-3">
      <label htmlFor="preview-password" className="text-xs text-white/50">
        رمز پیش‌نمایش
      </label>
      <input
        id="preview-password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (state === 'error') setState('idle');
        }}
        autoFocus
        autoComplete="off"
        className="ltr w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-center text-sm text-white outline-none transition-colors focus:border-gold/60"
      />

      {state === 'error' && (
        <p className="text-xs text-red-300" role="alert">
          رمز درست نیست.
        </p>
      )}

      <button type="submit" disabled={state === 'busy'} className="btn-gold !py-2.5 text-xs disabled:opacity-60">
        {state === 'busy' ? 'در حال بررسی…' : 'ورود'}
      </button>
    </form>
  );
}
