import type { Metadata } from 'next';

/**
 * Rendered per request: its content comes from the database, and an editor who
 * saves a change in the panel must see it on the site immediately. At this
 * traffic a SQLite read per request costs microseconds.
 */
export const dynamic = 'force-dynamic';


import { Hero } from '@/components/home/Hero';
import { getHeroAutoplayMs, getHeroSlides, getStats } from '@/server/content';
import {
  CourseMarquee,
  SectionsGrid,
  ArticlesPreview,
  NewsTicker,
  HomeCta,
} from '@/components/home/sections';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero slides={getHeroSlides()} autoplayMs={getHeroAutoplayMs()} stats={getStats()} />
      <CourseMarquee />
      <SectionsGrid />
      <ArticlesPreview />
      <NewsTicker />
      <HomeCta />
    </>
  );
}
