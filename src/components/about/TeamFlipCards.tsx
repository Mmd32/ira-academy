'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export type TeamFlipCardData = {
  id: string;
  name: string;
  role?: string;
  label?: string;
  photo?: string;
  bio?: string;
  slug?: string;
};

type Props = {
  items: readonly TeamFlipCardData[];
  fallbackBadge?: string;
  columns?: 3 | 4;
};

export function TeamFlipCards({ items, fallbackBadge = 'آکادمی ریتیل ایران', columns = 3 }: Props) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const gridClass =
    columns === 4
      ? 'mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
      : 'mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={gridClass}>
      {items.map((person, idx) => {
        const isFlipped = Boolean(flipped[person.id]);
        const badgeText = person.label || person.role || fallbackBadge;
        const bioText =
          person.bio?.trim() || 'معرفی‌نامه و سوابق تخصصی این عضو هیئت علمی به‌زودی تکمیل می‌شود.';
        const initial = person.name.trim().charAt(0) || 'آ';

        return (
          <Reveal key={person.id} delay={idx * 0.08} className="h-full">
            <div className="perspective-1000 group/wrapper relative aspect-square w-full">
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.35,1.4,0.65,1)] ${
                  isFlipped ? 'rotate-y-neg-180' : ''
                }`}
              >
                {/* ================= FRONT FACE (SQUARE · PORTRAIT + NAME) ================= */}
                <article
                  onClick={() => toggleFlip(person.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFlip(person.id);
                    }
                  }}
                  aria-label={`مشاهده معرفی ${person.name}`}
                  className="backface-hidden group/card absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift text-center"
                >
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(person.id);
                      }}
                      className="group/btn flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold focus:outline-none"
                      title="چرخش کارت و مشاهده معرفی"
                      aria-label={`چرخش کارت ${person.name}`}
                      aria-expanded={isFlipped}
                    >
                      <svg
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-500 group-hover/btn:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border border-gold/40 object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    ) : (
                      <span className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full border border-gold/40 bg-brand/5 text-2xl sm:text-3xl font-black text-brand transition-transform duration-500 group-hover/card:scale-105">
                        {initial}
                      </span>
                    )}
                    <h4 className="mt-4 whitespace-pre-line text-base sm:text-lg font-black leading-snug text-ink">
                      {person.name}
                    </h4>
                    {(person.role || person.label) && (
                      <p className="mt-1 text-xs sm:text-sm font-medium text-ink-mute">
                        {person.role || person.label}
                      </p>
                    )}
                  </div>
                </article>

                {/* ================= BACK FACE (SQUARE · BIO & PROFILE CTA) ================= */}
                <article className="backface-hidden rotate-y-180 group/backcard absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-brand/30 bg-white p-4 sm:p-5 shadow-lift text-right">
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold to-transparent" />

                  <div className="flex items-center justify-between gap-2 border-b border-line/70 pb-2">
                    <span className="inline-flex max-w-[75%] truncate items-center rounded-full border border-brand/10 bg-brand/5 px-2.5 py-0.5 text-[11px] font-bold text-brand">
                      {badgeText}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleFlip(person.id)}
                      className="group/back flex h-7.5 w-7.5 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white focus:outline-none"
                      title="بازگشت به روی کارت"
                      aria-label="بازگشت به روی کارت"
                      aria-expanded={isFlipped}
                    >
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-500 group-hover/back:-rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="my-auto py-1 text-right">
                    <h4 className="text-base font-black leading-tight text-ink sm:text-lg">
                      {person.name}
                    </h4>
                    <p className="mt-2 line-clamp-4 text-xs sm:text-[13px] leading-5 sm:leading-6 text-ink-soft text-right [text-align:right!important] [text-justify:none!important] [text-wrap:pretty]">
                      {bioText}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-line/70 pt-2.5 sm:pt-3">
                    {person.slug ? (
                      <Link
                        href={`/team/${person.slug}/`}
                        className="group/cta flex h-10 w-full items-center justify-center gap-2 rounded-full border border-brand bg-brand px-4 text-center text-xs sm:text-sm font-bold text-white shadow-card transition-all duration-300 hover:border-brand-500 hover:bg-brand-500 hover:shadow-lift"
                      >
                        <span>مشاهده‌ی پروفایل</span>
                        <span
                          aria-hidden="true"
                          className="text-xs transition-transform duration-300 group-hover/cta:-translate-x-1"
                        >
                          ←
                        </span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full border border-line/80 bg-paper/90 px-4 text-center text-xs sm:text-sm font-bold text-ink-mute/70 opacity-60 select-none"
                      >
                        <span>به‌زودی</span>
                      </span>
                    )}
                  </div>
                </article>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
