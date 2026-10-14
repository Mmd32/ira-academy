import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { PageHeader, ComingSoon } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { BilingualTerm } from '@/components/BilingualTerm';
import { getArticles, getGlossary } from '@/server/content';
import {
  news,
  media,
  toolkits,
  library,
  handoutsArchive,
} from '@/content/knowledge';

export const metadata: Metadata = {
  description:
    'مرجع تخصصی دانش ریتیل — اخبار، مقالات و مورد کاوی، ویدیو و پادکست، ابزارهای کاربردی و واژه‌نامه‌ی ریتیل.',
  title: 'دانشنامه ریتیل',
  alternates: { canonical: '/knowledge/' },
};

export default function KnowledgePage() {
  const posts = getArticles();
  const glossary = getGlossary();
  return (
    <>
      <PageHeader
        eyebrow="دانشنامه ریتیل"
        title="دانشنامه ریتیل و فروشگاه‌داری"
        lead="مرجع تخصصی و قابل اتکای دانش ریتیل — اخبار، مقالات و مورد کاوی، ویدیو و پادکست، ابزارهای کاربردی و لغت‌نامه."
      />

      <section id="news" className="section bg-white">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">اخبار روز — جهان و ایران</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">تازه‌های ریتیل</h2>
          </Reveal>
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
            {news.map((item) => (
              <Reveal key={item.id} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-black text-gold">
                      {item.scope}
                    </span>
                    <span className="text-xs text-ink-mute">{item.date}</span>
                  </div>
                  <h3 className="mt-4 flex-1 text-base font-extrabold leading-8 text-ink">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="articles" className="section border-y border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">مقالات + مورد کاوی + گزارشات برندها</p>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl">خواندنی‌های عمیق‌تر</h2>
          </Reveal>

          {/* Published articles first, then the ones still being written. */}
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <Reveal key={post.slug} className="h-full">
                <Link
                  href={`/knowledge/${post.slug}/`}
                  className="group card flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover.src}
                    alt={post.cover.alt}
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="flex flex-1 flex-col p-6">
                    <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-black text-gold">
                      {post.kind}
                    </span>
                    <span className="mt-4 block text-base font-extrabold leading-8 text-ink">
                      {post.title}
                    </span>
                    <span className="mt-2 block flex-1 text-sm leading-7 text-ink-soft">
                      {post.excerpt}
                    </span>
                    <span className="mt-4 text-xs font-bold text-brand transition-colors group-hover:text-gold-soft">
                      ادامه‌ی مطلب ←
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}

          </div>
        </div>
      </section>

      <section id="media" className="section bg-white">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">ویدیو و پادکست</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">ببینید و بشنوید</h2>
          </Reveal>
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
            {media.map((item) => (
              <Reveal key={item.id} className="h-full">
                <div className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:border-brand-400/50 hover:shadow-card">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors group-hover:bg-gold group-hover:text-ink">
                    ▶
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold leading-7 text-ink">{item.title}</h3>
                    <span className="text-xs text-ink-mute">
                      {item.kind} · {item.length}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      <section id="library" className="section border-y border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <div className="card p-8">
              <p className="eyebrow">
                {library.title} <ComingSoon />
              </p>
              <p className="mt-4 leading-8 text-ink-soft">{library.text}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="tools" className="section border-y border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">ابزارهای کاربردی</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">دانلود ابزار و قالب</h2>
          </Reveal>
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
            {toolkits.map((kit) => (
              <Reveal key={kit.id} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <h3 className="font-extrabold text-brand">{kit.title}</h3>
                  <ul className="mt-4 flex-1 space-y-3">
                    {kit.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-7 text-ink-soft"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <BilingualTerm term={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="glossary" className="section bg-white">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">لغت‌نامه ریتیل</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">واژه‌ها را دقیق بشناسیم</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {glossary.map((entry) => (
              <Reveal key={entry.term}>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper p-5">
                  <span className="shrink-0 rounded-full bg-brand px-4 py-1.5 text-center text-xs font-bold text-white">
                    <BilingualTerm
                      term={entry.term}
                      latinClassName="mt-0.5 block text-[10px] font-normal text-white/70"
                    />
                  </span>
                  <p className="text-sm leading-7 text-ink-soft">{entry.def}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="handouts" className="section border-t border-line bg-paper-soft">
        <div className="container-x">
          <Reveal>
            <div className="card p-8">
              <p className="eyebrow">
                {handoutsArchive.title} <ComingSoon />
              </p>
              <p className="mt-4 leading-8 text-ink-soft">{handoutsArchive.text}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
