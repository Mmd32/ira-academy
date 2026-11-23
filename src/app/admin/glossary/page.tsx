import { getGlossary } from '@/server/content';
import { requireAdmin } from '@/server/guard';

import { PageTitle } from '../ui';
import { GlossaryEditor } from './GlossaryEditor';

export const dynamic = 'force-dynamic';

export default function GlossaryPage() {
  requireAdmin();
  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title="واژه‌نامه‌ی ریتیل"
        lead="اصطلاح‌هایی که در صفحه‌ی دانشنامه نشان داده می‌شوند. ردیف خالی ذخیره نمی‌شود."
      />
      <div className="mt-8">
        <GlossaryEditor entries={getGlossary().map((g) => ({ term: g.term, definition: g.def }))} />
      </div>
    </>
  );
}
