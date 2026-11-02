import Link from 'next/link';

import { Reveal } from '@/components/Reveal';
import { Marquee } from '@/components/Marquee';

import { news } from '@/content/knowledge';
import { getArticles, getVisibleCourses } from '@/server/content';
import { fa } from '@/lib/text';

export function CourseMarquee() {
  const visibleCourses = getVisibleCourses();
  return (
    <section className="border-b border-line bg-white py-6">
      <Marquee speed={55}>
        {visibleCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-3 rounded-full border border-line bg-paper py-2 pl-2 pr-5"
          >
            <span className="text-sm font-bold text-ink">{course.title}</span>
            <span className="text-xs text-ink-mute">{fa(course.sessions)} جلسه</span>
            <Link
              href={`/register/?course=${course.id}`}
              className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-500"
            >
              ثبت‌نام
            </Link>
          </div>
        ))}
      </Marquee>
    </section>
  );
}

const sections = [
  {
    href: '/about/',
    num: '۰۱',
    title: 'معرفی آکادمی',
    desc: 'هویت، مأموریت و چشم‌انداز، هیئت مؤسس، کادر علمی و پارتنرهای آموزشی.',
  },
  {
    href: '/programs/',
    num: '۰۲',
    title: 'برنامه‌های آموزشی',
    desc: 'دوره‌های تخصصی، کارگاه‌ها، سمینارها و وبینارها — با ثبت‌نام آنلاین.',
  },
  {
    href: '/corporate/',
    num: '۰۳',
    title: 'خدمات سازمانی',
    desc: 'آموزش‌های ویژه‌سازی‌شده، مشاوره و طراحی برنامه‌ی آموزشی برای سازمان‌ها.',
  },
  {
    href: '/community/',
    num: '۰۴',
    title: 'جامعه حرفه‌ای ARI',
    desc: 'باشگاه اعضا، رویدادها و شبکه‌ای پویا از دانش‌پذیران و متخصصان صنعت.',
  },
  {
    href: '/knowledge/',
    num: '۰۵',
    title: 'کتابخانه ریتیل',
    desc: 'اخبار، مقالات و مورد کاوی، ویدیو و پادکست، ابزارهای کاربردی و لغت‌نامه.',
  },
  {
    href: '/portal/',
    num: '۰۶',
    title: 'درگاه امور دانش‌پذیران',
    desc: 'دوره‌های من، جزوات، مدرک، مشاوره با کارشناسان و فرصت‌های شغلی.',
  },
  {
    href: '/contact/',
    num: '۰۷',
    title: 'ارتباط با آکادمی',
    desc: 'تماس، نشانی دفتر، درخواست مشاوره و مسیرهای همکاری با آکادمی.',
  },
];

export function SectionsGrid() {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">بخش‌های آکادمی</p>
          <h2 className="mt-5 max-w-2xl text-3xl sm:text-4xl">
            هر آنچه برای رشد فروشگاه و تیم‌تان لازم دارید
          </h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <Reveal key={section.href} delay={(i % 3) * 0.08} className="h-full">
              <Link
                href={section.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="text-2xl font-black text-brand/15 transition-colors duration-300 group-hover:text-gold">
                  {section.num}
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-ink">{section.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{section.desc}</p>
                <span className="mt-4 text-xs font-bold text-brand transition-colors group-hover:text-gold-soft">
                  مشاهده ←
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticlesPreview() {
  const posts = getArticles();
  return (
    <section className="section border-y border-line bg-paper-soft">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">کتابخانه ریتیل</p>
              <h2 className="mt-5 text-3xl sm:text-4xl">تازه‌ترین مقالات</h2>
            </div>
            <Link href="/knowledge/#articles" className="btn-secondary !py-2.5 text-xs">
              همه‌ی مقالات
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={0.08 * i} className="h-full">
              <Link
                href={`/knowledge/${post.slug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
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
                    ادامه مطلب ←
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsTicker() {
  return (
    <section className="border-b border-line bg-white py-5">
      <div className="container-x mb-3 flex items-center gap-3">
        <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-black text-gold">
          اخبار و رویدادها
        </span>
      </div>
      <Marquee speed={45}>
        {news.map((item) => (
          <Link
            key={item.id}
            href="/knowledge/"
            className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-2 text-sm text-ink-soft transition-colors hover:border-brand-400/50"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="font-bold text-ink">{item.title}</span>
            <span className="text-xs text-ink-mute">({item.scope})</span>
          </Link>
        ))}
      </Marquee>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className="navy-stage relative overflow-hidden py-20 text-white">
      <div className="navy-grid absolute inset-0" aria-hidden />
      <div className="container-x relative grid items-center gap-8 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl text-white sm:text-4xl">آماده‌ی شروع هستید؟</h2>
          <p className="mt-4 max-w-lg leading-9 text-white/65">
            در دوره‌ی مناسب ثبت‌نام کنید، یا اگر دانش‌پذیر آکادمی هستید، از درگاه دانش‌پذیران به
            دوره‌ها، جزوات و فرصت‌های شغلی دسترسی پیدا کنید.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <Link href="/register/" className="btn-gold">
              ثبت‌نام در دوره‌ها
            </Link>
            <Link href="/portal/" className="btn-ghost-light">
              فرصت‌های شغلی (ویژه‌ی دانش‌پذیران)
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
