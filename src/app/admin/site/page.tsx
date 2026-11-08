import { requireAdmin } from '@/server/guard';
import { uiAll } from '@/server/ui';
import { UI_ITEMS } from '@/lib/ui-texts';

import { PageTitle } from '../ui';
import { WordingForm } from './WordingForm';

export const dynamic = 'force-dynamic';

export default function SitePage() {
  requireAdmin();
  const current = uiAll();

  const groups: { name: string; items: { key: string; label: string; kind: 'text' | 'long' | 'href'; value: string; def: string }[] }[] = [];
  for (const item of UI_ITEMS) {
    let g = groups.find((x) => x.name === item.group);
    if (!g) groups.push((g = { name: item.group, items: [] }));
    g.items.push({ key: item.key, label: item.label, kind: item.kind, value: current[item.key], def: item.default });
  }

  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title="هدر، فوتر و دکمه‌ها"
        lead="منوی بالا، دکمه‌های هدر، ستون‌های فوتر، عنوان بالای هر صفحه و بخش‌ها و دکمه‌های دعوت به اقدام در صفحه‌ی اول. اسلایدهای هیرو و اطلاعات تماس در «متن‌های سایت» است."
      />
      <div className="mt-8">
        <WordingForm groups={groups} />
      </div>
    </>
  );
}
