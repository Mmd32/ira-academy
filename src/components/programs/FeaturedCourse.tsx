import Link from 'next/link';

import { Reveal } from '@/components/Reveal';
import { featuredCourse } from '@/content/programs';
import { getSite } from '@/server/content';
import { fa } from '@/lib/text';

/**
 * The flagship programme at the top of /programs. It is deliberately built from
 * the same parts as an ordinary course card — audience chip, title, blurb,
 * "x مبحث · y ساعت" meta — just larger, so it reads as the same family.
 * The one thing it adds is the co-brand plate: both academies on a single
 * white plate, which is what makes a partnership look official.
 */
export function FeaturedCourse() {
  const site = getSite();
  const { eyebrow, title, blurb, audience, sessions, hours, partners, highlights } = featuredCourse;

  // 0 means "not published yet" — show a dash rather than a bare zero.
  const stat = (value: number) => (value > 0 ? fa(value) : '—');

  return (
    <section id="featured" className="section bg-white">
      <div className="container-x">
        <Reveal>
          <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift lg:grid lg:grid-cols-[1fr_24rem]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-black text-gold">
                  {eyebrow}
                </span>
                <span className="rounded-full border border-brand/10 bg-brand/5 px-3 py-1 text-[10px] font-bold text-brand-600">
                  {audience}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-extrabold leading-[1.45] text-ink sm:text-3xl">
                {title}
              </h2>
              <p className="mt-4 max-w-2xl leading-8 text-ink-soft">{blurb}</p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-7 text-ink-soft">
                    <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/10 text-[10px] font-black text-gold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-line pt-6">
                <span className="text-sm font-semibold text-ink-mute">
                  {stat(sessions)} مبحث · {stat(hours)} ساعت
                </span>
                <span className="flex flex-wrap items-center gap-3">
                  <Link href={`/register/?course=${featuredCourse.id}`} className="btn-gold">
                    ثبت‌نام در دوره
                  </Link>
                  <Link href="/contact/#advisors" className="btn-secondary">
                    مشاوره +
                  </Link>
                </span>
              </div>
            </div>

            {/* Co-brand plate — the one loud element, so everything else stays quiet. */}
            <div className="navy-stage relative grid place-items-center gap-6 p-10">
              <div className="navy-grid absolute inset-0" aria-hidden />

              <div className="relative text-center">
                <p className="eyebrow-light">با همکاری</p>

                <div className="mt-6 inline-flex items-center gap-6 rounded-2xl bg-white px-8 py-5 shadow-lift">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/media/logo-mark.png"
                    alt={site.brand}
                    className="h-12 w-auto object-contain"
                  />
                  <span className="h-12 w-px shrink-0 bg-line" aria-hidden />
                  {partners.map((partner) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={partner.name}
                      src={partner.logo}
                      alt={partner.name}
                      className="h-10 w-auto object-contain"
                    />
                  ))}
                </div>

                <p className="mt-6 text-sm leading-7 text-white/65">
                  {site.brand}
                  <span className="mx-2 text-white/30">×</span>
                  {partners.map((p) => p.name).join('، ')}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
