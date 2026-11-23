'use client';

import { signOutAction } from './actions';

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="font-semibold text-ink-mute transition-colors hover:text-red-700">
        خروج
      </button>
    </form>
  );
}
