import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Reveal } from '@/components/Reveal';
import { StoreLayoutDiagram } from '@/components/articles/StoreLayoutDiagram';
import { articles, getArticle, readingMinutes } from '@/content/articles';
import { site } from '@/content/site';
import { siteUrl } from '@/lib/site-url';
import { fa } from '@/lib/text';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};

  const url = `/knowledge/${article.slug}/`;
  return {
    title: article.title,
    description: article.excerpt,
    keywords: [...article.keywords],
    authors: [{ name: article.author.name }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.excerpt,
      siteName: site.brand,
      locale: 'fa_IR',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [{ url: article.cover.src, alt: article.cover.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.cover.src],
    },
  };
}

const faDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const url = `${siteUrl}/knowledge/${article.slug}/`;

  // Article schema, so search engines can show the author and date.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [`${siteUrl}${article.cover.src}`],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: 'fa-IR',
    author: { '@type': 'Person', name: article.author.name, jobTitle: article.author.title },
    publisher: {
      '@type': 'Organization',
      name: site.brand,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/media/logo-mark.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: article.keywords.join('، '),
  };

  const others = articles.filter((a) => a.slug !== article.slug);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="navy-stage relative overflow-hidden text-white">
        <div className="navy-grid absolute inset-0" aria-hidden />
        <div className="container-x relative pb-14 pt-[calc(var(--nav-h)+3.5rem)]">
          <nav aria-label="مسیر" className="eyebrow-light flex flex-wrap items-center gap-3">
            <Link href="/" className="text-white/50 transition-colors hover:text-gold-soft">
              خانه
            </Link>
            <span className="h-px w-8 bg-gold/50" />
            <Link href="/knowledge/" className="text-white/50 transition-colors hover:text-gold-soft">
              دانشنامه ریتیل
            </Link>
            <span className="h-px w-8 bg-gold/50" />
            {article.kind}
          </nav>

          <h1 className="mt-5 max-w-4xl text-3xl leading-[1.45] text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/65">
            <span className="font-bold text-gold-soft">{article.author.name}</span>
            <span className="text-white/50">{article.author.title}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/45">
            <time dateTime={article.publishedAt}>{faDate(article.publishedAt)}</time>
            <span>{fa(readingMinutes(article))} دقیقه مطالعه</span>
          </div>
        </div>
      </header>

      <article className="section bg-white">
        <div className="container-x">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover.src}
              alt={article.cover.alt}
              className="mx-auto aspect-[16/9] w-full max-w-4xl rounded-3xl object-cover shadow-lift"
              loading="eager"
            />
          </Reveal>

          <div className="mx-auto mt-14 max-w-3xl">
            {article.body.map((block, i) => {
              if (block.type === 'h2') {
                return (
                  <Reveal key={i}>
                    <h2 className="mt-14 text-2xl font-extrabold leading-[1.5] text-ink sm:text-3xl">
                      {block.text}
                    </h2>
                  </Reveal>
                );
              }

              if (block.type === 'lead') {
                return (
                  <Reveal key={i}>
                    <p className="border-r-2 border-gold pr-5 text-lg leading-10 text-ink sm:text-xl">
                      {block.text}
                    </p>
                  </Reveal>
                );
              }

              if (block.type === 'diagram') {
                return (
                  <Reveal key={i}>
                    <StoreLayoutDiagram />
                  </Reveal>
                );
              }

              if (block.type === 'note') {
                return (
                  <Reveal key={i}>
                    <aside className="mt-10 rounded-2xl border border-line bg-paper p-6 text-sm leading-8 text-ink-soft">
                      {block.text}
                    </aside>
                  </Reveal>
                );
              }

              if (block.type === 'image') {
                return (
                  <Reveal key={i}>
                    <figure className="my-12">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={block.src}
                        alt={block.alt}
                        className="w-full rounded-2xl object-cover shadow-card"
                        loading="lazy"
                      />
                      {block.caption && (
                        <figcaption className="mt-3 text-center text-sm leading-7 text-ink-mute">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                );
              }

              return (
                <Reveal key={i}>
                  <p className="mt-6 leading-9 text-ink-soft">{block.text}</p>
                </Reveal>
              );
            })}

            <Reveal>
              <div className="mt-16 border-t border-line pt-8">
                <p className="eyebrow">درباره نویسنده</p>
                <p className="mt-4 text-lg font-extrabold text-ink">{article.author.name}</p>
                <p className="mt-1 leading-8 text-ink-soft">{article.author.title}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      <section className="section border-t border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">ادامه بدهید</p>
                <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                  {others.length > 0 ? 'مقالات دیگر دانشنامه' : 'دوره‌های تخصصی آکادمی'}
                </h2>
              </div>
              <Link href="/knowledge/#articles" className="btn-secondary !py-2.5 text-xs">
                همه مقالات
              </Link>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {others.slice(0, 2).map((other) => (
                <Link
                  key={other.slug}
                  href={`/knowledge/${other.slug}/`}
                  className="card flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="w-fit rounded-full border border-brand/10 bg-brand/5 px-3 py-1 text-[10px] font-bold text-brand-600">
                    {other.kind}
                  </span>
                  <h3 className="mt-4 text-base font-extrabold leading-8 text-ink">{other.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{other.excerpt}</p>
                </Link>
              ))}

              {others.length === 0 && (
                <Link
                  href="/programs/"
                  className="card flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift md:col-span-2"
                >
                  <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-black text-gold">
                    برنامه‌های آموزشی
                  </span>
                  <h3 className="mt-4 text-base font-extrabold leading-8 text-ink">
                    دوره‌های تخصصی ریتیل و فروشگاه‌داری
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">
                    همان مفاهیمی که در این یادداشت خواندید، در دوره‌های آکادمی به‌صورت عملی و
                    پروژه‌محور آموزش داده می‌شود.
                  </p>
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
