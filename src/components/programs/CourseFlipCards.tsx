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
  accentBorder: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  syllabus: string[];
  outcomes: string[];
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
    audience: 'فروشندگان، صندوق‌داران، مسئولین خدمات مشتریان و فروشگاه‌های تازه‌تأسیس',
    accentBorder: 'hover:border-[#3f6170]',
    accentBg: 'bg-[#3f6170]/10',
    accentText: 'text-[#3f6170]',
    badgeBg: 'bg-[#3f6170]/15',
    badgeText: 'text-[#2e4752]',
    syllabus: [
      'روانشناسی مشتری، زبان بدن و آغاز حرفه‌ای مکالمه فروش',
      'تکنیک‌های کشف نیاز و پیشنهاد مکمل (Cross-selling & Up-selling)',
      'استانداردهای طلایی استقبال، راهنمایی و بدرقه‌ی خریدار',
      'مدیریت اعتراضات، چانه‌زنی اخلاقی و برخورد با مشتری ناراضی',
      'انضباط در شیفت کاری، حفظ آراستگی فردی و نظم محیطی',
    ],
    outcomes: [
      'افزایش ضریب تبدیل بازدیدکننده به خریدار (Conversion Rate)',
      'ارتقای شاخص رضایت و تکرار مراجعه‌ی مشتریان',
      'تقویت اعتماد‌به‌نفس در تعاملات کلامی و متقاعدسازی حرفه‌ای',
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
    audience: 'سرپرستان شیفت، کمک‌مدیران، مسئولان سالن و صندوق، و فروشندگان آماده ارتقا',
    accentBorder: 'hover:border-slate-500',
    accentBg: 'bg-slate-500/10',
    accentText: 'text-slate-700',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-800',
    syllabus: [
      'مدیریت تحویل شیفت و اجرای چک‌لیست‌های بازگشایی و بستن فروشگاه',
      'نظارت بر ویترین، نورپردازی و اصول ویژوال مرچندایزینگ (VM)',
      'کنترل موجودی، جلوگیری از کسری کالا و انبارداری خرد',
      'مدیریت نقدینگی، کنترل عملیات صندوق و مغایرت‌گیری روزانه',
      'مربی‌گری تیم فروشگاهی و هدایت رفتاری پرسنل در ساعات اوج شلوغی',
    ],
    outcomes: [
      'کاهش مغایرت‌های مالی و کسری کالا به کمینه ممکن',
      'استقرار نظم پایدار و یکپارچه در اجرای استانداردهای فروشگاهی',
      'افزایش بهره‌وری ساعات کاری تیم سالن و تسریع خدمت‌رسانی',
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
    audience: 'مدیران فروشگاه‌ها، مدیران شعب زنجیره‌ای و سرپرستان منطقه (Area Supervisors)',
    accentBorder: 'hover:border-brand',
    accentBg: 'bg-brand/10',
    accentText: 'text-brand',
    badgeBg: 'bg-brand/15',
    badgeText: 'text-brand-700',
    syllabus: [
      'تحلیل شاخص‌های عملکردی کلیدی (ATV, UPT, Footfall, Sales/m²)',
      'مهندسی سود و زیان شعبه (Store P&L) و کنترل هزینه‌های پنهان',
      'طراحی و اجرای کمپین‌های پروموشن و مدیریت تقویم فروش فصلی',
      'فرآیند جذب، مصاحبه شایستگی‌محور و ارزیابی عملکرد پرسنل',
      'مدیریت بحران‌های عملیاتی، نگهداشت نیروهای کلیدی و انگیزش تیم',
    ],
    outcomes: [
      'توانایی بهینه‌سازی فروش و ارتقای حاشیه سود خالص شعبه',
      'تصمیم‌گیری داده‌محور بر پایه داشبوردهای عملکرد فروشگاهی',
      'پرورش تیم پایدار و کاهش نرخ ترک خدمت نیروی انسانی (Turnover)',
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
    audience: 'مالکان برندها، مدیران عامل، مدیران ارشد ریتیل، مدیران توسعه و سرمایه‌گذاران',
    accentBorder: 'hover:border-gold',
    accentBg: 'bg-gold/10',
    accentText: 'text-gold',
    badgeBg: 'bg-gold/20',
    badgeText: 'text-amber-900',
    syllabus: [
      'استراتژی‌های تکثیر شعب: توسعه ارگانیک در برابر مدل‌های فرنچایز',
      'یکپارچه‌سازی اومنی‌چنل (Omnichannel): پیوند فروشگاه فیزیکی و دیجیتال',
      'معماری زنجیره تأمین (Supply Chain) و لجستیک شبکه‌ای',
      'چارچوب قراردادهای فرنچایز، استانداردهای حقوقی و تضمین کیفیت برند',
      'مدیریت مالی کلان، ارزش‌گذاری برند فروشگاهی و جذب سرمایه',
    ],
    outcomes: [
      'تدوین سند استانداردسازی و دفترچه راهنمای عملیات (Operations Manual)',
      'طراحی ساختار شبکه شعب آماده جذب سرمایه‌گذار و توسعه منطقه‌ای',
      'خلق مزیت رقابتی پایدار در بازار خرده‌فروشی مدرن ایران',
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
            <div className="perspective-1000 group/wrapper relative h-[520px] w-full">
              {/* Inner flippable card */}
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.35,1.4,0.65,1)] ${
                  isFlipped ? 'rotate-y-neg-180' : ''
                }`}
              >
                {/* ================= FRONT FACE ================= */}
                <article
                  className={`backface-hidden absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 ${course.accentBorder} group-hover/wrapper:-translate-y-1 group-hover/wrapper:shadow-lift`}
                >
                  {/* Top bar with level badge & flip button */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black ${course.badgeBg} ${course.badgeText}`}
                      >
                        {course.levelBadge}
                      </span>

                      {/* Flip trigger button at top */}
                      <button
                        type="button"
                        onClick={() => toggleFlip(course.id)}
                        className="group/btn flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-bold text-ink-soft transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white"
                        title="مشاهده سرفصل‌ها و جزئیات دوره"
                        aria-label={`مشاهده سرفصل‌های ${course.latinName}`}
                        aria-expanded={isFlipped}
                      >
                        <span>سرفصل‌ها</span>
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:rotate-180"
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

                    {/* Logo stage */}
                    <div className="relative mt-5 flex h-28 w-full items-center justify-center rounded-2xl bg-paper/60 p-4 transition-transform duration-300 group-hover/wrapper:scale-[1.02]">
                      <Image
                        src={course.logo}
                        alt={course.latinName}
                        width={280}
                        height={120}
                        className="max-h-20 w-auto object-contain"
                        priority={idx < 2}
                      />
                    </div>

                    {/* Course Title & Description */}
                    <div className="mt-4">
                      <h3 className="text-base font-extrabold leading-8 text-ink">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-ink-soft line-clamp-3">
                        {course.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats & Flip prompt */}
                  <div className="border-t border-line/80 pt-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-ink-mute">
                      <span>
                        {fa(course.sessions)} مبحث · {fa(course.hours)} ساعت
                      </span>
                      <span className="text-[11px] font-bold text-brand-600">دانش‌محور</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFlip(course.id)}
                        className="w-full rounded-full border border-line bg-paper py-2 text-center text-xs font-extrabold text-brand transition-colors hover:border-brand-400 hover:bg-brand hover:text-white"
                      >
                        سرفصل‌ها و اطلاعات دوره ⤾
                      </button>
                    </div>
                  </div>
                </article>

                {/* ================= BACK FACE ================= */}
                <article
                  className={`backface-hidden rotate-y-180 absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-brand/30 bg-white p-6 shadow-lift`}
                >
                  {/* Top Bar with title & flip back button */}
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
                      <div>
                        <span className="block text-xs font-black text-brand">
                          {course.latinName}
                        </span>
                        <span className="text-[11px] font-semibold text-ink-mute">
                          سرفصل‌ها و جزئیات
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFlip(course.id)}
                        className="group/back flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-[11px] font-bold text-brand transition-all duration-300 hover:bg-brand hover:text-white"
                        title="بازگشت به معرفی دوره"
                        aria-label="بازگشت به روی کارت"
                        aria-expanded={isFlipped}
                      >
                        <span>بازگشت</span>
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

                    {/* Scrollable details list */}
                    <div className="mt-3.5 max-h-[290px] space-y-3 overflow-y-auto pr-1 text-right text-xs leading-6 text-ink-soft scrollbar-thin">
                      <div>
                        <p className="font-extrabold text-ink">مخاطبان دوره:</p>
                        <p className="mt-0.5 text-[11px] leading-5 text-ink-soft">
                          {course.audience}
                        </p>
                      </div>

                      <div className="pt-1">
                        <p className="font-extrabold text-ink">سرفصل‌های آموزشی:</p>
                        <ul className="mt-1.5 space-y-1.5">
                          {course.syllabus.map((item, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5 text-[11px] leading-5">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-1 border-t border-line/60">
                        <p className="font-extrabold text-ink">دستاورد شرکت در دوره:</p>
                        <ul className="mt-1 space-y-1 text-[11px] text-ink-soft">
                          {course.outcomes.map((item, oIdx) => (
                            <li key={oIdx} className="flex items-start gap-1.5">
                              <span className="text-gold font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions at bottom */}
                  <div className="border-t border-line pt-3.5">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/register/?course=${course.id}`}
                        className="rounded-full bg-brand py-2 text-center text-xs font-bold text-white transition-all hover:bg-brand-500 hover:shadow-card"
                      >
                        ثبت‌نام
                      </Link>
                      <Link
                        href="/contact/#advisors"
                        className="rounded-full border border-line bg-white py-2 text-center text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                      >
                        مشاوره +
                      </Link>
                    </div>
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
