import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { about } from '@/content/pages';
import { fa } from '@/lib/text';

export const metadata: Metadata = {
  title: 'معرفی آکادمی',
  alternates: { canonical: '/about/' },
};

/**
 * Sections hidden for now. The markup stays in place so each can be switched
 * back on by flipping its flag — nothing has to be rewritten.
 */
const SHOW_FOUNDERS = false;
const SHOW_SPONSORS = false;

const pillars = [
  { label: 'هدف', text: about.goal },
  { label: 'چشم‌انداز', text: about.vision },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="معرفی آکادمی"
        title="آکادمی ریتیل ایران"
        lead="معرفی هویت، اعتبار و فلسفه‌ی آموزشی آکادمی — چرا هستیم، به کجا می‌رویم و چه کسانی این مسیر را می‌سازند."
      />

      <section className="section bg-white">
        <div className="container-x">
          <Reveal>
            <div className="max-w-3xl space-y-5">
              {about.intro.map((paragraph, i) => (
                <p key={i} className="leading-9 text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Two pillars, so each takes half the row rather than leaving a gap. */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <Reveal key={pillar.label}>
                <div className="card h-full p-8 sm:p-10">
                  <p className="eyebrow">{pillar.label}</p>
                  <p className="mt-5 text-lg leading-9 text-ink-soft">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">کادر علمی</p>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">مدیر گروه‌ها و مدرسین</h2>
            <p className="mt-5 max-w-3xl leading-9 text-ink-soft">{about.facultyText}</p>
          </Reveal>
          <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-3">
            {about.faculty.map((person, i) => (
              <Reveal key={i} className="h-full">
                <div className="card flex h-full items-center gap-4 p-6">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand text-lg font-black text-white">
                    {fa(i + 1)}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-ink">{person.name}</h3>
                    <p className="mt-1 text-sm text-ink-mute">{person.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {SHOW_FOUNDERS && (
        <section className="section bg-white">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow">هیئت مؤسس</p>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">بنیان‌گذاران آکادمی</h2>
            </Reveal>
            <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-3">
              {about.founders.map((person, i) => (
                <Reveal key={i} className="h-full">
                  <div className="card flex h-full flex-col items-center p-8 text-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-brand/5 text-2xl font-black text-brand">
                      آ
                    </span>
                    <h3 className="mt-4 font-extrabold text-ink">{person.name}</h3>
                    <p className="mt-1 text-sm text-ink-mute">{person.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className={`container-x grid gap-10 ${SHOW_SPONSORS ? 'lg:grid-cols-2' : ''}`}>
          <Reveal>
            <div className="card h-full p-8 sm:p-10">
              <p className="eyebrow">پارتنرهای آموزشی</p>
              <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">همکاران آموزشی آکادمی</h2>
              <p className="mt-5 leading-9 text-ink-soft">{about.partnersText}</p>
            </div>
          </Reveal>

          {SHOW_SPONSORS && (
            <Reveal>
              <div className="card h-full p-8 sm:p-10">
                <p className="eyebrow">اسپانسرها</p>
                <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">حامیان آکادمی</h2>
                <p className="mt-5 leading-9 text-ink-soft">{about.sponsorsText}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
