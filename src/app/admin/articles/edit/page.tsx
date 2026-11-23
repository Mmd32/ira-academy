import { getArticleBySlug } from '@/server/content';
import { requireAdmin } from '@/server/guard';
import { listPeople } from '@/server/people';

import { PageTitle } from '../../ui';
import { ArticleEditor } from './ArticleEditor';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { slug?: string } };

export default function EditArticlePage({ searchParams }: Props) {
  requireAdmin();
  const existing = searchParams.slug ? getArticleBySlug(searchParams.slug, { includeDrafts: true }) : undefined;

  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title={existing ? 'ویرایش مقاله' : 'مقاله‌ی جدید'}
        lead="متن مقاله از بلوک ساخته می‌شود: پاراگراف، تیتر، لید، تصویر و یادداشت. ترتیب بلوک‌ها همان ترتیبی است که در سایت دیده می‌شود."
      />
      <div className="mt-8">
        <ArticleEditor
          article={existing}
          people={listPeople().map((p) => ({ slug: p.slug, name: p.name, role: p.role }))}
        />
      </div>
    </>
  );
}
