import type { Metadata } from 'next';

import { Hero } from '@/components/home/Hero';
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
      <Hero />
      <CourseMarquee />
      <SectionsGrid />
      <ArticlesPreview />
      <NewsTicker />
      <HomeCta />
    </>
  );
}
