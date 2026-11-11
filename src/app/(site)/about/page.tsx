import { ui } from '@/server/ui';
import type { Metadata } from 'next';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { about as aboutSeed } from '@/content/pages';
import { getPage } from '@/server/content';
import { getSections } from '@/server/sections';
import { listPeople } from '@/server/people';
import Link from 'next/link';
import { fa } from '@/lib/text';

export const metadata: Metadata = {
  description:
    'مرجع آموزش‌های تخصصی صنعت ریتیل. نقطه تلاقی دانش آکادمیک، تجربیات عملی و شبکه‌سازی مؤثر.',
  title: 'معرفی آکادمی',
  alternates: { canonical: '/about/' },
};

/**
 * Sections hidden for now. The markup stays in place so each can be switched
 * back on by flipping its flag — nothing has to be rewritten.
 */


export default function AboutPage() {
  const about = getPage('about', aboutSeed as unknown as typeof aboutSeed);
  const sections = getSections();
  const SHOW_FOUNDERS = sections['about.founders'];
  const SHOW_SPONSORS = sections['about.sponsors'];

  const founders = listPeople({ kind: 'founder', onlyVisible: true });
  const managers = listPeople({ kind: 'manager', onlyVisible: true });
  const instructors = listPeople({ kind: 'instructor', onlyVisible: true });
  type Card = { name: string; role: string; label: string; photo: string; slug: string };
  const asCard = (p: (typeof managers)[number]): Card => ({
    name: p.name,
    role: p.role,
    label: p.groupLabel,
    photo: p.photo,
    slug: p.slug,
  });
  // Until the real people are entered, the placeholder list written at the start still shows.
  const facultyGroups: { title: string; people: Card[] }[] =
    managers.length + instructors.length > 0
      ? [
          { title: 'مدیران گروه‌ها', people: managers.map(asCard) },
          { title: 'مدرسین', people: instructors.map(asCard) },
        ].filter((g) => g.people.length > 0)
      : about.faculty.map((g) => ({
          title: g.title,
          people: g.people.map((p) => ({ name: p.name, role: p.role, label: '', photo: '', slug: '' })),
        }));
  const pillars = [
    { label: 'هدف', text: about.goal },
    { label: 'چشم‌انداز', text: about.vision },
  ];
  return (
    <>
      <PageHeader
        eyebrow={ui('page.about.eyebrow')}
        title={ui('page.about.title')}
        lead={ui('page.about.lead')}
      />

      <section className="section bg-white">
        <div className="container-x">
          {/* Text beside a photograph. The photograph sits beside the text rather
              than behind it: text over an image has to fight the image for
              legibility, and the paragraphs here are long. */}
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="space-y-5">
                {about.intro.map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line leading-9 text-ink-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/academy-about.webp"
                alt="شرکت‌کنندگان در یک برنامه‌ی آموزشی آکادمی، در فضایی شبیه فروشگاه"
                width={1400}
                height={788}
                loading="eager"
                className="aspect-[4/3] w-full rounded-3xl border border-line object-cover shadow-lift"
              />
            </Reveal>
          </div>

          {/* Two pillars, so each takes half the row rather than leaving a gap. */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <Reveal key={pillar.label}>
                <div className="card h-full p-8 sm:p-10">
                  <p className="eyebrow">{pillar.label}</p>
                  <p className="mt-5 whitespace-pre-line text-lg leading-9 text-ink-soft">{pillar.text}</p>
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
            <p className="mt-5 max-w-3xl whitespace-pre-line leading-9 text-ink-soft">{about.facultyText}</p>
          </Reveal>

          <div className="mt-10 space-y-10">
            {facultyGroups.map((group) => (
              <div key={group.title}>
                <Reveal>
                  <h3 className="font-extrabold text-brand">{group.title}</h3>
                </Reveal>
                <div className="mt-4 grid auto-rows-fr gap-5 sm:grid-cols-3">
                  {group.people.map((person, i) => {
                    const card = (
                      <div className="card flex h-full items-center gap-4 p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lift">
                        {person.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={person.photo} alt={person.name} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand text-lg font-black text-white">
                            {fa(i + 1)}
                          </span>
                        )}
                        <div>
                          <h4 className="whitespace-pre-line font-extrabold text-ink">{person.name}</h4>
                          {person.role && <p className="mt-1 text-sm text-ink-mute">{person.role}</p>}
                          {person.label && <p className="mt-1 text-xs font-bold text-brand">{person.label}</p>}
                          {person.slug && <span className="mt-1 block text-xs font-bold text-brand">مشاهده‌ی پروفایل ←</span>}
                        </div>
                      </div>
                    );
                    return (
                      <Reveal key={`${person.name}-${i}`} className="h-full">
                        {person.slug ? (
                          <Link href={`/team/${person.slug}/`} className="group block h-full">
                            {card}
                          </Link>
                        ) : (
                          <div className="group h-full">{card}</div>
                        )}
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {SHOW_FOUNDERS && founders.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow">هیئت مؤسس</p>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">بنیان‌گذاران آکادمی</h2>
            </Reveal>
            <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-3">
              {founders.map((person) => (
                <Reveal key={person.id} className="h-full">
                  <Link
                    href={`/team/${person.slug}/`}
                    className="card group flex h-full flex-col items-center p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={person.photo} alt={person.name} className="h-24 w-24 rounded-full border border-gold/40 object-cover" />
                    ) : (
                      <span className="grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-brand/5 text-2xl font-black text-brand">
                        {person.name.trim().charAt(0)}
                      </span>
                    )}
                    <h3 className="mt-4 font-extrabold text-ink">{person.name}</h3>
                    <p className="mt-1 text-sm text-ink-mute">{person.role}</p>
                    <span className="mt-3 text-xs font-bold text-brand">مشاهده‌ی پروفایل ←</span>
                  </Link>
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
              <p className="eyebrow">پارتنرهای آموزشی آکادمی ریتیل ایران</p>
              <div className="mt-5 space-y-3 leading-9 text-ink-soft">
                {about.partnersText.map((line: string) => (
                  <p key={line} className="whitespace-pre-line">{line}</p>
                ))}
              </div>
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
