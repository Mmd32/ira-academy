'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { fa } from '@/lib/text';

export type FlipCourseData = {
  id: string;
  code: string;
  levelBadge: string;
  title: string;
  latinName: string;
  logo: string;
  tagline: string;
  sessions: number;
  hours: number;
  audience: string;
  syllabus: string[];
};

export const COURSES_DATA: readonly FlipCourseData[] = [
  {
    id: 'retail-star',
    code: 'STAR',
    levelBadge: 'سطح ۱ · پایه',
    title: 'اصول فروش حضوری و ارتباط با مشتری',
    latinName: 'Retail STAR',
    logo: '/media/courses/retail-star.png',
    tagline: 'تسلط بر روانشناسی فروش، فنون گفت‌وگو، شناخت نیاز خریدار و خلق تجربه‌ی وفادارساز.',
    sessions: 6,
    hours: 18,
    audience: 'فروشندگان، صندوق‌داران و مسئولین خدمات مشتریان',
    syllabus: [
      'روانشناسی مشتری و آغاز حرفه‌ای مکالمه فروش',
      'تکنیک‌های کشف نیاز و پیشنهاد مکمل (Cross/Up-selling)',
      'استانداردهای طلایی استقبال، راهنمایی و بدرقه',
    ],
  },
  {
    id: 'retail-ace',
    code: 'ACE',
    levelBadge: 'سطح ۲ · میانی',
    title: 'سرپرستی شیفت و استانداردهای عملیاتی',
    latinName: 'Retail ACE',
    logo: '/media/courses/retail-ace.png',
    tagline: 'انضباط اجرایی، هدایت پرسنل سالن، کنترل روزانه‌ی صندوق، انبارگردانی خرد و نظارت کیفی.',
    sessions: 9,
    hours: 22,
    audience: 'سرپرستان شیفت، کمک‌مدیران و مسئولان سالن',
    syllabus: [
      'مدیریت تحویل شیفت و چک‌لیست‌های بازگشایی و بستن',
      'نظارت بر ویترین، نورپردازی و اصول ویژوال مرچندایزینگ',
      'کنترل موجودی، پیشگیری از کسری کالا و انبارداری خرد',
    ],
  },
  {
    id: 'retail-pro',
    code: 'PRO',
    levelBadge: 'سطح ۳ · پیشرفته',
    title: 'مدیریت حرفه‌ای فروشگاه و شاخص‌های تجاری',
    latinName: 'Retail PRO',
    logo: '/media/courses/retail-pro.png',
    tagline: 'تحلیل داده‌های فروشگاهی، سنجش شاخص‌های KPI، مدیریت سود و زیان (P&L) و رهبری تیم.',
    sessions: 12,
    hours: 30,
    audience: 'مدیران فروشگاه‌ها، شعب زنجیره‌ای و سرپرستان منطقه',
    syllabus: [
      'تحلیل شاخص‌های کلیدی (ATV, UPT, Footfall, Sales/m²)',
      'مهندسی سود و زیان شعبه (Store P&L) و هزینه‌های پنهان',
      'طراحی و اجرای کمپین‌های پروموشن و تقویم فصلی',
    ],
  },
  {
    id: 'retail-expert',
    code: 'EXPERT',
    levelBadge: 'سطح ۴ · ارشد',
    title: 'معماری زنجیره‌ای، فرنچایز و توسعه بازار',
    latinName: 'Retail EXPERT',
    logo: '/media/courses/retail-expert.png',
    tagline: 'سیستم‌سازی مقیاس‌پذیر، تکثیر شعب، استراتژی اومنی‌چنل، قراردادهای فرنچایز و سرمایه‌گذاری.',
    sessions: 16,
    hours: 40,
    audience: 'مالکان برندها، مدیران عامل، مدیران ارشد و سرمایه‌گذاران',
    syllabus: [
      'استراتژی‌های تکثیر شعب و مدل‌های اعطای نمایندگی',
      'یکپارچه‌سازی اومنی‌چنل: پیوند فروشگاه فیزیکی و آنلاین',
      'معماری زنجیره تأمین و چارچوب قراردادهای فرنچایز',
    ],
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
                {/* ================= FRONT FACE (SQUARE · ONLY LOGO + FLIP ARROW) ================= */}
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
                  aria-label={`مشاهده مشخصات ${course.latinName}`}
                  className="backface-hidden group/card absolute inset-0 flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift"
                >
                  {/* Subtle top gold highlight line on hover */}
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                  {/* Top Bar with flip arrow button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(course.id);
                      }}
                      className="group/btn flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold focus:outline-none"
                      title="چرخش کارت و مشاهده اطلاعات دوره"
                      aria-label={`چرخش کارت ${course.latinName}`}
                      aria-expanded={isFlipped}
                    >
                      <svg
                        className="h-4 w-4 transition-transform duration-500 group-hover/btn:rotate-180"
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

                  {/* Centered Logo Stage - PURE LOGO centered in the square */}
                  <div className="flex flex-1 items-center justify-center p-2">
                    <Image
                      src={course.logo}
                      alt={course.latinName}
                      width={300}
                      height={180}
                      className="max-h-[82%] max-w-[88%] w-auto object-contain transition-transform duration-500 group-hover/card:scale-105"
                      priority={idx < 2}
                    />
                  </div>

                  {/* Bottom breathing space */}
                  <div className="h-2 w-full" aria-hidden="true" />
                </article>

                {/* ================= BACK FACE (SQUARE · COURSE DATA + CTA) ================= */}
                <article
                  className="backface-hidden rotate-y-180 group/backcard absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-brand/40 bg-white p-3.5 sm:p-4.5 shadow-lift"
                >
                  {/* Subtle top gold highlight */}
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold to-transparent" />

                  {/* Top Bar with level badge & flip back arrow */}
                  <div className="flex items-center justify-between gap-1 border-b border-line pb-1.5">
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-black text-gold">
                      {course.levelBadge}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleFlip(course.id)}
                      className="group/back flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper text-ink-mute transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white focus:outline-none"
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

                  {/* Middle Section: Title, Meta, Audience & Syllabus */}
                  <div className="flex flex-1 flex-col justify-evenly py-1">
                    {/* Course Title */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-black leading-snug text-ink">
                        {course.title}
                      </h3>
                      <div className="mt-0.5 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-ink-mute">
                        <span className="font-bold text-brand">{course.latinName}</span>
                        <span>
                          {fa(course.sessions)} مبحث · {fa(course.hours)} ساعت
                        </span>
                      </div>
                    </div>

                    {/* Audience Box */}
                    <div className="rounded-md bg-paper px-2 py-1">
                      <p className="text-[11px] sm:text-xs leading-snug text-ink-soft">
                        <span className="font-bold text-ink">مخاطبان: </span>
                        {course.audience}
                      </p>
                    </div>

                    {/* Key Syllabus list */}
                    <ul className="space-y-0.5">
                      {course.syllabus.map((item, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-center gap-1.5 text-[11px] sm:text-xs text-ink-soft"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions: CTA "مشاهده دوره‌ها" */}
                  <div className="border-t border-line pt-1.5 sm:pt-2">
                    <Link
                      href={`/register/?course=${course.id}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand py-1.5 sm:py-2 text-center text-xs font-bold text-white shadow-card transition-all duration-300 hover:bg-brand-500 hover:shadow-lift"
                    >
                      <span>مشاهده دوره‌ها</span>
                      <span aria-hidden="true">←</span>
                    </Link>
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
