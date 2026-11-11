import { requireAdmin } from '@/server/guard';
import { SECTIONS, getSections } from '@/server/sections';

import { PageTitle } from '../ui';
import { SectionsForm } from './SectionsForm';

export const dynamic = 'force-dynamic';

export default function SectionsPage() {
  requireAdmin();
  const on = getSections();
  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title="نمایش بخش‌ها"
        lead="بخش‌هایی که ساخته شده‌اند ولی تا آماده شدن محتوا روی سایت دیده نمی‌شوند. اول محتوا را در «متن صفحه‌ها» وارد کنید، بعد اینجا روشنش کنید."
      />
      <div className="mt-8">
        <SectionsForm items={SECTIONS.map((s) => ({ ...s, on: on[s.key] }))} />
      </div>
    </>
  );
}
