'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { changePasswordAction, studentSignOutAction } from './actions';

const field =
  'mt-2 w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-secondary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : 'تغییر رمز'}
    </button>
  );
}

export function ChangePassword() {
  const [message, action] = useFormState(changePasswordAction, null);
  return (
    <form action={action} className="grid gap-3">
      <label className="block text-sm">
        <span className="font-semibold text-ink">رمز فعلی</span>
        <input name="current" type="password" autoComplete="current-password" required className={`${field} ltr`} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-ink">رمز تازه</span>
        <span className="mr-2 text-xs text-ink-mute">حداقل ۶ نویسه</span>
        <input name="next" type="password" autoComplete="new-password" required className={`${field} ltr`} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-ink">تکرار رمز تازه</span>
        <input name="repeat" type="password" autoComplete="new-password" required className={`${field} ltr`} />
      </label>
      <div className="flex items-center gap-4">
        <Submit />
        {message && (
          <span className={`text-xs ${message === 'رمز عوض شد.' ? 'text-emerald-700' : 'text-red-700'}`} role="status">
            {message}
          </span>
        )}
      </div>
    </form>
  );
}

export function SignOut() {
  return (
    <form action={studentSignOutAction}>
      <button type="submit" className="text-xs font-bold text-ink-mute hover:text-brand">
        خروج
      </button>
    </form>
  );
}
