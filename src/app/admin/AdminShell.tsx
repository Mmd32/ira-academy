'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SignOutButton } from './SignOutButton';

export type NavItem = { href: string; label: string; badge?: number };
export type NavGroup = { title: string; items: NavItem[] };

/**
 * The panel's frame: a sidebar on wide screens, a drawer on phones. The
 * current section is highlighted, and the link groups stay in view while the
 * page scrolls, so nothing has to be hunted for in a long header row.
 */
export function AdminShell({
  groups,
  userName,
  children,
}: {
  groups: NavGroup[];
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === '/admin/' ? pathname === '/admin/' || pathname === '/admin' : pathname.startsWith(href.replace(/\/$/, '')));

  const nav = (
    <nav aria-label="بخش‌های پنل" className="grid gap-6 text-sm">
      {groups.map((group) => (
        <div key={group.title || 'home'}>
          {group.title && <p className="mb-2 px-3 text-[11px] font-black tracking-wide text-ink-mute">{group.title}</p>}
          <div className="grid gap-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 font-semibold transition-colors ${
                    active ? 'bg-brand text-white' : 'text-ink-soft hover:bg-brand/5 hover:text-brand'
                  }`}
                >
                  {item.label}
                  {item.badge ? (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-black text-ink">{item.badge}</span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="grid gap-3 border-t border-line pt-4 text-xs">
      <Link href="/" target="_blank" className="font-semibold text-ink-soft hover:text-brand">
        دیدن سایت ↗
      </Link>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate font-bold text-ink">{userName}</span>
        <SignOutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Phones: a slim bar that opens the drawer. */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Link href="/admin/" className="font-extrabold text-brand">
          پنل مدیریت
        </Link>
        <button
          type="button"
          aria-label="منو"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-lg"
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-20 lg:hidden" role="dialog" aria-modal="true">
          <button type="button" aria-label="بستن" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[17rem] max-w-[85vw] flex-col gap-6 overflow-y-auto bg-white p-5 pt-20 shadow-lift">
            {nav}
            <div className="mt-auto">{footer}</div>
          </aside>
        </div>
      )}

      {/* Wide screens: a fixed sidebar. */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 overflow-y-auto border-l border-line bg-white p-5 lg:flex">
        <Link href="/admin/" className="flex items-center gap-3 px-3 pt-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-sm font-black text-white">ا</span>
          <span>
            <span className="block text-sm font-extrabold leading-5 text-ink">پنل مدیریت</span>
            <span className="block text-[11px] text-ink-mute">آکادمی ریتیل ایران</span>
          </span>
        </Link>
        {nav}
        <div className="mt-auto">{footer}</div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
