import Link from 'next/link';

import { Reveal } from '@/components/Reveal';
import { featuredCourse } from '@/content/programs';
import { site } from '@/content/site';
import { fa } from '@/lib/text';

/**
 * The flagship programme at the top of /programs — a co-branded course run
 * with a partner academy, so both marks sit together in a logo lockup.
 */
export function FeaturedCourse() {
  const { eyebrow, title, blurb, audience, sessions, hours, partners, highlights } = featuredCourse;

  // 0 means "not published yet" — show a dash rather than a bare zero.
  const stat = (value: number) => (value > 0 ? fa(value) : '—');

  return (
    <section id="featured" className="section bg-white">
      <div className="container-x">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-gold/40 bg-paper shadow-lift lg:grid lg:grid-cols-[1.15fr_1fr]">
            <div className="p-8 sm:p-10">
              <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-black text-gold">
                {eyebrow}
              </span>

              <h2 className="mt-5 text-2xl font-extrabold leading-[1.4] text-ink sm:text-3xl">
                {title}
              </h2>
              <p className="mt-4 max-w-xl leading-8 text-ink-soft">{blurb}</p>

              <ul className="mt-6 space-y-3">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-7 text-ink-soft">
                    <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/10 text-[10px] font-black text-gold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href={`/register/?course=${featuredCourse.id}`} className="btn-gold">
                  ثبت‌نام در دوره
                </Link>
                <Link href="/contact/#advisors" className="btn-secondary">
                  مشاوره‌ی رایگان
                </Link>
              </div>
            </div>

            <div className="navy-stage relative flex flex-col justify-between gap-8 overflow-hidden p-8 text-white sm:p-10">
              <div className="navy-grid absolute inset-0" aria-hidden />

              <div className="relative">
                <p className="text-[11px] font-bold tracking-[0.25em] text-gold-soft">با همکاری</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white px-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/media/logo-mark.png"
                      alt={site.brand}
                      className="max-h-9 w-auto object-contain"
                    />
                  </span>
                  <span className="text-lg font-light text-white/40">×</span>
                  {partners.map((partner) => (
                    <span
                      key={partner.name}
                      className="flex h-14 items-center justify-center rounded-2xl bg-white px-4"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-8 w-auto object-contain"
                      />
                    </span>
                  ))}
                </div>
              </div>

              <dl className="relative grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center">
                <div>
                  <dt className="text-[11px] text-white/50">مباحث</dt>
                  <dd className="mt-1 text-2xl font-black text-gold-soft">{stat(sessions)}</dd>
                </div>
                <div className="border-x border-white/10">
                  <dt className="text-[11px] text-white/50">ساعت</dt>
                  <dd className="mt-1 text-2xl font-black text-gold-soft">{stat(hours)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-white/50">مخاطب</dt>
                  <dd className="mt-1 text-xs font-bold leading-6 text-white/80">{audience}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
