import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { getArticles } from '@/server/content';
import { ui } from '@/server/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'مقالات',
  description: 'مقالات، موردکاوی‌ها و گزارش‌های تخصصی صنعت ریتیل و فروشگاه‌داری.',
  alternates: { canonical: '/articles/' },
};

/** Only the articles: the library page carries news, media and tools as well. */
export default function ArticlesPage() {
  const posts = getArticles();

  return (
    <>
      <PageHeader eyebrow={ui('page.articles.eyebrow')} title={ui('page.articles.title')} lead={ui('page.articles.lead')} />

      <section className="section bg-white">
        <div className="container-x">
          <div className="grid auto-rows-fr gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <Reveal key={post.slug} className="h-full">
                <Link
                  href={`/knowledge/${post.slug}/`}
                  className="group card flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover.src} alt={post.cover.alt} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  <span className="flex flex-1 flex-col p-6">
                    <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-black text-gold">{post.kind}</span>
                    <span className="mt-4 block text-base font-extrabold leading-8 text-ink">{post.title}</span>
                    <span className="mt-2 block flex-1 text-sm leading-7 text-ink-soft">{post.excerpt}</span>
                    <span className="mt-4 text-xs font-bold text-brand transition-colors group-hover:text-gold-soft">
                      {ui('home.articles.read')}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
