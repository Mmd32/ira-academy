'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { currentUser } from '@/server/auth';
import {
  deleteArticle,
  deleteCourse,
  replaceGlossary,
  updateHeroSlide,
  upsertArticle,
  upsertCourse,
  setSetting,
} from '@/server/content-write';

import type { ArticleBlock } from '@/content/articles';

function requireUser() {
  if (!currentUser()) redirect('/admin/login/');
}

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const num = (f: FormData, k: string) => Number(f.get(k) ?? 0) || 0;
const on = (f: FormData, k: string) => f.get(k) === 'on';

/** Rebuilds the body from the repeated block rows the form submits. */
function readBlocks(f: FormData): ArticleBlock[] {
  const types = f.getAll('blockType').map(String);
  const texts = f.getAll('blockText').map(String);
  const extras = f.getAll('blockExtra').map(String);

  const blocks: ArticleBlock[] = [];
  types.forEach((type, i) => {
    const text = (texts[i] ?? '').trim();
    const extra = (extras[i] ?? '').trim();

    if (type === 'image') {
      if (text) blocks.push({ type: 'image', src: text, alt: extra || '', caption: extra || undefined });
      return;
    }
    if (type === 'diagram') {
      blocks.push({ type: 'diagram', name: 'store-layout' });
      return;
    }
    if (!text) return;
    if (type === 'h2' || type === 'lead' || type === 'note' || type === 'p') {
      blocks.push({ type, text });
    }
  });
  return blocks;
}

export async function saveArticleAction(formData: FormData) {
  requireUser();

  const slug = str(formData, 'slug');
  if (!slug) return;

  upsertArticle(
    {
      slug,
      published: on(formData, 'published'),
      title: str(formData, 'title'),
      shortTitle: str(formData, 'shortTitle'),
      kind: str(formData, 'kind'),
      authorName: str(formData, 'authorName'),
      authorTitle: str(formData, 'authorTitle'),
      publishedAt: str(formData, 'publishedAt'),
      excerpt: str(formData, 'excerpt'),
      coverSrc: str(formData, 'coverSrc'),
      coverAlt: str(formData, 'coverAlt'),
      keywords: str(formData, 'keywords')
        .split('،')
        .map((k) => k.trim())
        .filter(Boolean),
      body: readBlocks(formData),
    },
    str(formData, 'originalSlug') || undefined,
  );

  revalidatePath('/admin/articles');
  revalidatePath('/knowledge');
  revalidatePath(`/knowledge/${slug}`);
  redirect('/admin/articles/');
}

export async function deleteArticleAction(formData: FormData) {
  requireUser();
  const slug = str(formData, 'slug');
  if (slug) deleteArticle(slug);
  revalidatePath('/admin/articles');
  revalidatePath('/knowledge');
}

export async function saveCourseAction(formData: FormData) {
  requireUser();

  const id = str(formData, 'id');
  if (!id) return;

  upsertCourse(
    {
      id,
      title: str(formData, 'title'),
      blurb: str(formData, 'blurb'),
      audience: str(formData, 'audience'),
      sessions: num(formData, 'sessions'),
      hours: num(formData, 'hours'),
      model: str(formData, 'model') || 'standard',
      enabled: on(formData, 'enabled'),
      position: num(formData, 'position'),
    },
    str(formData, 'originalId') || undefined,
  );

  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  revalidatePath('/');
  redirect('/admin/courses/');
}

export async function deleteCourseAction(formData: FormData) {
  requireUser();
  const id = str(formData, 'id');
  if (id) deleteCourse(id);
  revalidatePath('/admin/courses');
  revalidatePath('/programs');
}

export async function saveGlossaryAction(formData: FormData) {
  requireUser();

  const terms = formData.getAll('term').map(String);
  const defs = formData.getAll('definition').map(String);

  replaceGlossary(terms.map((term, i) => ({ term, definition: defs[i] ?? '' })));

  revalidatePath('/admin/glossary');
  revalidatePath('/knowledge');
}

export async function saveTextsAction(formData: FormData) {
  requireUser();

  // Hero slides, one group of fields per slide id.
  for (const id of formData.getAll('slideId').map(String)) {
    updateHeroSlide(id, {
      eyebrow: str(formData, `eyebrow:${id}`),
      title: str(formData, `title:${id}`),
      lead: str(formData, `lead:${id}`),
      enabled: on(formData, `enabled:${id}`),
    });
  }

  // Contact details and the footer blurb.
  const site: Record<string, string> = {};
  for (const key of ['brand', 'brandEn', 'tagline', 'phone', 'mobile', 'email', 'instagram', 'address', 'footerText']) {
    site[key] = str(formData, `site:${key}`);
  }
  setSetting('site', site);

  revalidatePath('/admin/texts');
  revalidatePath('/', 'layout');
}
