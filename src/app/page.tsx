import { Hero } from '@/components/home/Hero';
import {
  CourseMarquee,
  SectionsGrid,
  ArticlesPreview,
  NewsTicker,
  HomeCta,
} from '@/components/home/sections';

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
