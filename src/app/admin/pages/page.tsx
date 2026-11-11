import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { EDITABLE_PAGES } from '@/server/pages-write';

import { PageTitle } from '../ui';

export const dynamic = 'force-dynamic';

export default function PagesIndex() {
  requireAdmin();
  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title="متن صفحه‌ها"
        lead="متن اصلی هر صفحه: معرفی، هدف و مأموریت، مزیت‌های خدمات سازمانی، مزایای باشگاه، سؤال‌های متداول و غیره. عنوان بالای هر صفحه در «هدر، فوتر و دکمه‌ها» است."
      />
      <div className="mt-8 grid gap-3">
        {Object.entries(EDITABLE_PAGES).map(([slug, name]) => (
          <Link
            key={slug}
            href={`/admin/pages/edit/?slug=${slug}`}
            className="card flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="font-extrabold text-ink">{name}</span>
            <span className="text-xs font-bold text-brand">ویرایش</span>
          </Link>
        ))}
      </div>
    </>
  );
}
