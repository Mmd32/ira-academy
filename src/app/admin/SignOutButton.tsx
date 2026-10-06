'use client';

import { signOutAction } from './actions';

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="text-ink-mute transition-colors hover:text-brand">
        خروج
      </button>
    </form>
  );
}
