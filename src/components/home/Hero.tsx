'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

import { heroSlides, heroAutoplayMs, type HeroSlide } from '@/content/hero';
import { stats } from '@/content/site';
import { fa, splitTitle } from '@/lib/text';
import { Emblem3D } from './Emblem3D';

/** Slide 1 — the emblem floating in a parallax 3D stage. */
function Scene3D() {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [8, -8]), { stiffness: 60, damping: 20 });
  const rotateX = useSpring(useTransform(py, [0, 1], [-6, 6]), { stiffness: 60, damping: 20 });

  return (
    <div
      className="scene relative mx-auto h-[380px] w-full max-w-[460px] select-none sm:h-[440px]"
      onMouseMove={(e) => {
        if (reduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      aria-hidden
    >
      <motion.div
        className="preserve-3d relative h-full w-full"
        style={reduced ? undefined : { rotateX, rotateY }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            transform: 'translate(-50%,-50%) translateZ(-40px)',
            background:
              'radial-gradient(circle, rgba(194,165,108,0.22) 0%, rgba(61,85,184,0.18) 45%, transparent 70%)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[320px] w-[320px] rounded-full border border-gold/40 sm:h-[370px] sm:w-[370px]"
          style={{ transform: 'translate(-50%,-50%) translateZ(10px)' }}
        />
        <div className="absolute inset-4" style={{ transform: 'translateZ(50px)' }}>
          <Emblem3D />
        </div>

        <div
          className="glass-navy absolute -right-1 top-6 w-40 animate-float-slow p-4 sm:right-0"
          style={{ transform: 'translateZ(110px)' }}
        >
          <div className="text-[10px] font-bold tracking-widest text-white/50">رشد فروش</div>
          <div className="mt-1 text-2xl font-black text-gold-soft">{fa('34')}٪+</div>
          <div className="mt-2 flex items-end gap-1">
            {[8, 14, 11, 18, 24, 30].map((h, i) => (
              <div key={i} className="w-2.5 rounded-sm bg-gold/70" style={{ height: h }} />
            ))}
          </div>
        </div>

        <div
          className="glass-navy absolute -left-1 bottom-8 flex w-44 animate-float-slow items-center gap-3 p-4 sm:left-2"
          style={{ transform: 'translateZ(90px)', animationDelay: '1.2s' }}
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold-soft">
            ✓
          </div>
          <div className="text-xs font-bold leading-6 text-white">
            مدرک تخصصی
            <br />
            آکادمی ریتیل ایران
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Slide 2 — photo with an optional multi-line badge (\n in the content). */
function ImageVisual({ slide }: { slide: HeroSlide }) {
  const badgeLines = (slide.imageBadge || '').split('\n').filter(Boolean);

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.image || '/media/academy.jpg'}
        alt={slide.eyebrow}
        className="aspect-[4/3] w-full rounded-3xl border border-white/10 object-cover shadow-lift"
      />
      {badgeLines.length > 0 && (
        <div className="glass-navy absolute -bottom-5 right-6 flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold-soft">
            ✓
          </span>
          <span className="text-xs font-bold text-white">
            {badgeLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

/** Slide 4 — a scripted preview of the consult widget. */
function ChatDemo() {
  const turns = [
    { who: 'شما', text: 'بوتیک پوشاک دارم؛ مشتری می‌آید ولی نمی‌خرد.' },
    {
      who: 'مشاور هوشمند',
      text: 'پس گلوگاه، مرحله‌ی فروش است. دوره‌ی «اصول فروش حضوری» و «تجربه‌ی مشتری» را پیشنهاد می‌کنم.',
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-[420px] gap-3">
      {turns.map((turn, i) => (
        <div
          key={i}
          className={`glass-navy max-w-[85%] p-4 text-sm leading-7 text-white ${
            i % 2 ? 'ml-auto border-gold/30' : 'mr-auto'
          }`}
        >
          <div className="mb-1 text-[10px] font-bold tracking-widest text-gold-soft">{turn.who}</div>
          {turn.text}
        </div>
      ))}
      <div className="mt-1 text-center text-xs text-white/50">
        ← از دکمه‌ی «مشاور هوشمند» پایین صفحه امتحان کنید
      </div>
    </div>
  );
}

function SlideVisual({ slide }: { slide: HeroSlide }) {
  switch (slide.visual) {
    case 'scene3d':
      return <Scene3D />;
    case 'chat-demo':
      return <ChatDemo />;
    case 'image':
      return <ImageVisual slide={slide} />;
    default:
      return slide.image ? <ImageVisual slide={slide} /> : null;
  }
}

/** The stats strip under the hero. Flip to true to bring it back. */
const SHOW_STATS = false;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length),
    [],
  );

  useEffect(() => {
    if (reduced || paused) return;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      heroAutoplayMs,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, paused]);

  const slide = heroSlides[index];

  return (
    <section
      id="top"
      className="navy-stage relative overflow-hidden text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="navy-grid absolute inset-0" aria-hidden />

      <div className="container-x relative pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="relative min-h-[560px] sm:min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: reduced ? 0 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduced ? 0 : 40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-10 pb-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14"
            >
              <div>
                <p className="eyebrow-light flex items-center gap-3">
                  {slide.eyebrow}
                  <span className="h-px w-10 shrink-0 bg-gold/50" />
                </p>
                <h1 className="mt-4 text-[1.375rem]/[1.5] text-white sm:text-4xl lg:text-3xl">
                  {splitTitle(slide.title).map((part, i) => (
                    <span key={i} className={part.gold ? 'text-gold-soft' : undefined}>
                      {/* A newline in the content is a deliberate line break. */}
                      {part.text.split('\n').map((line, j) => (
                        <span key={j}>
                          {j > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </span>
                  ))}
                </h1>
                <p className="mt-5 max-w-2xl text-base/8 text-white/65 sm:text-lg/9 lg:text-base/8">
                  {slide.lead}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {/* Matched widths, so the two labels sit centred against each other. */}
                  <Link href={slide.primary.href} className="btn-gold min-w-[9.5rem]">
                    {slide.primary.label}
                  </Link>
                  {slide.secondary?.href && (
                    <Link href={slide.secondary.href} className="btn-ghost-light min-w-[9.5rem]">
                      {slide.secondary.label}
                    </Link>
                  )}
                </div>
              </div>

              <div className="pb-4">
                <SlideVisual slide={slide} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pb-8">
          <div className="flex items-center gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`اسلاید ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-gold' : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* RTL: ‹ advances, › goes back. */}
            <button
              onClick={() => goTo(index + 1)}
              aria-label="اسلاید بعدی"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold-soft"
            >
              ‹
            </button>
            <button
              onClick={() => goTo(index - 1)}
              aria-label="اسلاید قبلی"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold-soft"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {SHOW_STATS && (
      <div className="relative border-t border-white/10">
        <div className="container-x grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 * i }}
              className="border-l border-white/10 px-6 py-8 text-center last:border-l-0 md:py-9"
            >
              <div className="text-3xl font-black text-gold-soft sm:text-4xl">{stat.value}</div>
              <div className="mt-2 text-sm text-white/55">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      )}
    </section>
  );
}
