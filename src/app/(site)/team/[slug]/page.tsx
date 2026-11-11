import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { siteUrl } from '@/lib/site-url';
import { articlesBy, getPerson, PERSON_KINDS } from '@/server/people';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const person = getPerson(params.slug);
  if (!person) return { title: 'صفحه پیدا نشد', robots: { index: false } };
  const description = person.bio ? person.bio.replace(/\s+/g, ' ').slice(0, 155) : `${person.name}، ${person.role || PERSON_KINDS[person.kind]} در آکادمی ریتیل ایران`;
  return {
    title: person.name,
    description,
    alternates: { canonical: `/team/${person.slug}/` },
    openGraph: { title: person.name, description, images: person.photo ? [{ url: person.photo }] : undefined, type: 'profile' },
  };
}

export default function ProfilePage({ params }: Props) {
  const person = getPerson(params.slug);
  if (!person) notFound();

  const posts = articlesBy(person);
  const links = [
    person.website && { label: 'وب‌سایت', href: person.website },
    person.linkedin && { label: 'لینکدین', href: person.linkedin },
    person.instagram && { label: 'اینستاگرام', href: `https://instagram.com/${person.instagram}` },
    person.email && { label: 'ایمیل', href: `mailto:${person.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: person.name,
          jobTitle: person.role || undefined,
          description: person.bio || undefined,
          image: person.photo ? `${siteUrl}${person.photo}` : undefined,
          url: `${siteUrl}/team/${person.slug}/`,
          worksFor: { '@id': `${siteUrl}/#organization` },
          sameAs: [person.linkedin, person.instagram && `https://instagram.com/${person.instagram}`, person.website].filter(Boolean),
        }}
      />

      <PageHeader eyebrow={PERSON_KINDS[person.kind]} title={person.name} lead={person.role || undefined} />

      <section className="section bg-white">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[18rem_1fr]">
          <Reveal>
            <div className="card flex flex-col items-center p-8 text-center">
              {person.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.photo} alt={person.name} className="h-44 w-44 rounded-full border border-gold/40 object-cover shadow-card" />
              ) : (
                <span className="grid h-44 w-44 place-items-center rounded-full border border-gold/40 bg-brand/5 text-5xl font-black text-brand">
                  {person.name.trim().charAt(0)}
                </span>
              )}
              <h2 className="mt-5 text-lg font-extrabold text-ink">{person.name}</h2>
              {person.role && <p className="mt-1 text-sm text-ink-mute">{person.role}</p>}
              {person.groupLabel && <p className="mt-1 text-xs font-bold text-brand">{person.groupLabel}</p>}
              {links.length > 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="rounded-full border border-line px-4 py-1.5 text-xs font-bold text-brand transition-colors hover:border-brand-400"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">درباره‌ی {person.name}</p>
              {person.bio ? (
                <div className="mt-5 space-y-5 whitespace-pre-line leading-9 text-ink-soft">{person.bio}</div>
              ) : (
                <p className="mt-5 text-ink-mute">معرفی‌نامه‌ی این صفحه به‌زودی اضافه می‌شود.</p>
              )}
            </Reveal>

            {posts.length > 0 && (
              <div className="mt-12">
                <Reveal>
                  <p className="eyebrow">نوشته‌ها</p>
                </Reveal>
                <div className="mt-5 grid gap-4">
                  {posts.map((post) => (
                    <Reveal key={post.slug}>
                      <Link
                        href={`/knowledge/${post.slug}/`}
                        className="card block p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                      >
                        <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-black text-gold">{post.kind}</span>
                        <span className="mt-3 block font-extrabold leading-8 text-ink">{post.title}</span>
                        <span className="mt-1 block text-sm leading-7 text-ink-soft">{post.excerpt}</span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
