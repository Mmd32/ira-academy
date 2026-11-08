'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/about/', label: 'معرفی' },
  { href: '/programs/', label: 'برنامه‌های آموزشی' },
  { href: '/corporate/', label: 'خدمات سازمانی' },
  { href: '/community/', label: 'جامعه ARI' },
  { href: '/knowledge/', label: 'کتابخانه' },
  { href: '/knowledge/#articles', label: 'مقالات' },
  { href: '/contact/', label: 'تماس' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Transparent (over the navy hero) only at the very top with the menu closed.
  const overHero = !scrolled && !open;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-line bg-paper/95 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/logo-mark.png"
              alt="آکادمی ریتیل ایران"
              className={`h-full w-full object-contain transition-[filter] duration-300 ${
                overHero ? 'brightness-0 invert' : ''
              }`}
            />
          </span>
          <span
            className={`truncate text-[13px] font-extrabold transition-colors duration-300 sm:text-sm ${
              overHero ? 'text-white' : 'text-ink'
            }`}
          >
            آکادمی ریتیل ایران
          </span>
        </Link>

        <nav
          className={`hidden items-center gap-7 text-[13px] font-medium lg:flex xl:gap-9 ${
            overHero ? 'text-white/70' : 'text-ink-soft'
          }`}
        >
          {links.map((link) => {
            const active = pathname?.startsWith(link.href.replace(/\/$/, ''));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${overHero ? 'hover:text-gold-soft' : 'hover:text-brand'} ${
                  active ? (overHero ? 'text-gold-soft' : 'text-brand font-bold') : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Two actions, one control: enrol on the right, sign in on the left. */}
          <div
            className={`flex items-center overflow-hidden rounded-full ${
              overHero ? 'bg-gold text-ink' : 'bg-brand text-white'
            }`}
          >
            <Link href="/register/" className="flex min-h-11 items-center px-3.5 text-xs font-bold transition-opacity hover:opacity-85 sm:px-5">
              ثبت‌نام
            </Link>
            <span className={`h-4 w-px ${overHero ? 'bg-ink/25' : 'bg-white/30'}`} aria-hidden />
            <Link
              href="/portal/"
              className="flex min-h-11 items-center px-3.5 text-xs font-bold transition-opacity hover:opacity-85 sm:px-5"
              title="ورود دانش‌پذیران"
            >
              ورود
            </Link>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="منو"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border lg:hidden ${
              overHero ? 'border-white/25 text-white' : 'border-line text-ink'
            }`}
          >
            <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <div className="container-x flex flex-col py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-line/60 py-3.5 text-sm font-medium text-ink-soft"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/portal/"
                className="py-3.5 text-sm font-bold text-brand"
              >
                ورود دانش‌پذیران
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
