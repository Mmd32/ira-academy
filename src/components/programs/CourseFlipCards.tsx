'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal';

export type FlipCourseData = {
  id: string;
  badge: string;
  title: string;
  logo: string;
  desc: string;
  ctaText: string;
  ctaHref?: string;
  ctaDisabled?: boolean;
};

export const COURSES_DATA: readonly FlipCourseData[] = [
  {
    id: 'retail-pro',
    badge: 'Retail PRO',
    title: 'دوره‌های استاندارد',
    logo: '/media/courses/retail-pro.png',
    desc: 'دوره‌های عمومی آکادمی با سرفصل ثابت و ثبت‌نام\u00A0آزاد.',
    ctaText: 'مشاهده',
    ctaHref: '/programs/standard/',
    ctaDisabled: false,
  },
  {
    id: 'retail-star',
    badge: 'Retail STAR',
    title: 'سازمانی',
    logo: '/media/courses/retail-star.png',
    desc: 'این دوره‌ها بر اساس نیاز برندها شخصی‌سازی و در محل آن سازمان برگزار\u00A0می‌شود.',
    ctaText: 'مشاهده',
    ctaHref: '/corporate/',
    ctaDisabled: false,
  },
  {
    id: 'retail-ace',
    badge: 'Retail ACE',
    title: 'همکاری با مؤسسات آموزشی',
    logo: '/media/courses/retail-ace.png',
    desc: 'دوره‌های مشترک با مراکز آموزشی\u00A0تخصصی.',
    ctaText: 'به‌زودی',
    ctaDisabled: true,
  },
  {
    id: 'retail-expert',
    badge: 'Retail EXPERT',
    title: 'همکاری با دانشگاه‌ها',
    logo: '/media/courses/retail-expert.png',
    desc: 'دوره‌های مشترک با دانشگاه‌ها و مراکز آموزش\u00A0عالی.',
    ctaText: 'به‌زودی',
    ctaDisabled: true,
  },
];

export function CourseFlipCards() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {COURSES_DATA.map((course, idx) => {
        const isFlipped = Boolean(flipped[course.id]);

        return (
          <Reveal key={course.id} delay={idx * 0.08} className="h-full">
            {/* Square aspect ratio card container */}
            <div className="perspective-1000 group/wrapper relative aspect-square w-full">
              {/* Inner flippable card */}
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.35,1.4,0.65,1)] ${
                  isFlipped ? 'rotate-y-neg-180' : ''
                }`}
              >
                {/* ================= FRONT FACE (SQUARE · PURE LOGO + FLIP ARROW) ================= */}
                <article
                  onClick={() => toggleFlip(course.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFlip(course.id);
                    }
                  }}
                  aria-label={`مشاهده مشخصات ${course.title} (${course.badge})`}
                  className="backface-hidden group/card absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift"
                >
                  {/* Subtle top gold highlight line on hover */}
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                  {/* Top-left flip button (aligned symmetrically with back face) */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(course.id);
                      }}
                      className="group/btn flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold focus:outline-none"
                      title="چرخش کارت و مشاهده اطلاعات دوره"
                      aria-label={`چرخش کارت ${course.badge}`}
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

                  {/* Centered Logo Stage - PURE LOGO prominent and bold in the square */}
                  <div className="flex h-full w-full items-center justify-center p-2">
                    <Image
                      src={course.logo}
                      alt={course.badge}
                      width={400}
                      height={275}
                      className="max-h-[74%] max-w-[82%] w-auto object-contain transition-transform duration-500 group-hover/card:scale-105"
                      priority={idx < 2}
                    />
                  </div>
                </article>

                {/* ================= BACK FACE (SQUARE · CLEAN, NATURAL TYPOGRAPHY) ================= */}
                <article
                  className="backface-hidden rotate-y-180 group/backcard absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-brand/30 bg-white p-4 sm:p-5 shadow-lift text-right"
                >
                  {/* Subtle top gold highlight */}
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold to-transparent" />

                  {/* Top Bar with English badge & flip back arrow */}
                  <div className="flex items-center justify-between gap-1 border-b border-line/70 pb-2">
                    <span className="inline-flex items-center rounded-full border border-brand/10 bg-brand/5 px-2.5 py-0.5 font-mono text-[11px] font-bold text-brand tracking-wider">
                      {course.badge}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleFlip(course.id)}
                      className="group/back flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white focus:outline-none"
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

                  {/* Middle Section: Title & Natural Unjustified Description */}
                  <div className="my-auto py-1 text-right">
                    <h3 className="text-base font-black text-ink sm:text-lg leading-tight">
                      {course.title}
                    </h3>
                    <div className="mt-2 text-xs sm:text-[13px] leading-5 sm:leading-6 text-ink-soft text-right [text-align:right!important] [text-justify:none!important] [text-wrap:pretty] tracking-normal">
                      {course.desc}
                    </div>
                  </div>

                  {/* Actions: CTA Button (strictly identical dimensions, height, font, and bottom alignment across all 4 cards) */}
                  <div className="mt-auto border-t border-line/70 pt-2.5 sm:pt-3">
                    {course.ctaDisabled ? (
                      <span
                        aria-disabled="true"
                        className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full border border-line/80 bg-paper/90 px-4 text-center text-xs sm:text-sm font-bold text-ink-mute/70 opacity-60 select-none"
                      >
                        <span>{course.ctaText}</span>
                      </span>
                    ) : (
                      <Link
                        href={course.ctaHref || '#'}
                        className="group/cta flex h-10 w-full items-center justify-center gap-2 rounded-full border border-brand bg-brand px-4 text-center text-xs sm:text-sm font-bold text-white shadow-card transition-all duration-300 hover:border-brand-500 hover:bg-brand-500 hover:shadow-lift"
                      >
                        <span>{course.ctaText}</span>
                        <span aria-hidden="true" className="text-xs transition-transform duration-300 group-hover/cta:-translate-x-1">←</span>
                      </Link>
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
