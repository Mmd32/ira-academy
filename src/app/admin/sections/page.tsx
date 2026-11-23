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
        lead="هر بخش از صفحه‌های سایت را می‌شود روشن یا خاموش کرد. تغییر همین لحظه روی سایت اعمال می‌شود. بخش‌های خاموش از صفحه و از نتایج گوگل برداشته می‌شوند."
      />
      <div className="mt-8">
        <SectionsForm items={SECTIONS.map((s) => ({ ...s, on: on[s.key] }))} />
      </div>
    </>
  );
}
