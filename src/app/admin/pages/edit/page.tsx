import Link from 'next/link';
import { notFound } from 'next/navigation';

import { pages as seed } from '@/content/pages';
import { getPage } from '@/server/content';
import { requireAdmin } from '@/server/guard';
import { EDITABLE_PAGES, withImages } from '@/server/pages-write';

import { PageTitle } from '../../ui';
import { PageEditor } from './PageEditor';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { slug?: string } };

export default function EditPage({ searchParams }: Props) {
  requireAdmin();
  const slug = searchParams.slug ?? '';
  if (!(slug in EDITABLE_PAGES)) notFound();

  const content = getPage(slug, (seed as unknown as Record<string, unknown>)[slug]) as Record<string, never>;

  return (
    <>
      <Link href="/admin/pages/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی صفحه‌ها
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow="متن صفحه" title={EDITABLE_PAGES[slug]} />
      </div>
      <div className="mt-8">
        <PageEditor slug={slug} initial={withImages(slug, content)} />
      </div>
    </>
  );
}
