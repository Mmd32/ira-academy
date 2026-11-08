'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { studentSignInAction } from './actions';

const field =
  'mt-2 w-full rounded-full border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-400';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
      {pending ? 'در حال ورود…' : 'ورود به درگاه'}
    </button>
  );
}

export function PortalLogin() {
  const [error, action] = useFormState(studentSignInAction, null);

  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className="block text-sm">
        <span className="font-semibold text-ink">شماره‌ی موبایل</span>
        <input name="phone" inputMode="tel" autoComplete="username" required className={`${field} ltr`} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-ink">رمز عبور</span>
        <input name="password" type="password" autoComplete="current-password" required className={`${field} ltr`} />
      </label>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <Submit />
    </form>
  );
}
