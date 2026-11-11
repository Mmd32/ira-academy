import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { examSummary, listExams } from '@/server/exams';
import { RESULT_MODES } from '@/lib/exam-shared';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';

import { PageTitle } from '../ui';

export const dynamic = 'force-dynamic';

export default function ExamsPage() {
  requireAdmin();
  const exams = listExams();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle
          eyebrow="درگاه دانش‌پذیران"
          title="آزمون‌ها"
          lead="آزمون چهارگزینه‌ای بسازید، به گروه‌ها بدهید و نمره‌ها را ببینید. ترتیب سؤال‌ها و گزینه‌ها برای هر دانش‌پذیر جدا و تصادفی است."
        />
        <div className="flex gap-3">
          {exams.length > 0 && (
            <a href="/admin/exams/export-all/" className="btn-secondary !py-2.5 text-xs">
              نمره‌ی همه‌ی آزمون‌ها (Excel)
            </a>
          )}
          <Link href="/admin/exams/edit/" className="btn-primary !py-2.5 text-xs">
            آزمون جدید
          </Link>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-ink-soft">هنوز آزمونی ساخته نشده است.</div>
      ) : (
        <div className="mt-8 grid gap-4">
          {exams.map((e) => {
            const s = examSummary(e.id);
            return (
              <article key={e.id} className="card flex flex-wrap items-start justify-between gap-4 p-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-black ${
                        e.published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {e.published ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                    <h2 className="font-extrabold text-ink">{e.title}</h2>
                  </div>
                  <p className="mt-2 text-xs leading-7 text-ink-mute">
                    {fa(s.questions)} سؤال · {fa(s.groups)} گروه · {fa(s.students)} دانش‌پذیر ·{' '}
                    {fa(s.attempts)} شرکت
                    <br />
                    {e.startAt ? `از ${formatFa(e.startAt)}` : 'بدون زمان شروع'}
                    {e.endAt ? ` تا ${formatFa(e.endAt)}` : ' · بدون زمان پایان'}
                    {e.durationMin ? ` · مدت ${fa(e.durationMin)} دقیقه` : ' · بدون محدودیت مدت'}
                    <br />
                    نتیجه: {RESULT_MODES[e.resultMode]}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-4 text-xs font-bold text-brand">
                  <Link href={`/admin/exams/questions/?id=${e.id}`} className="hover:underline">
                    سؤال‌ها
                  </Link>
                  <Link href={`/admin/exams/results/?id=${e.id}`} className="hover:underline">
                    نمره‌ها
                  </Link>
                  <Link href={`/admin/exams/edit/?id=${e.id}`} className="hover:underline">
                    تنظیمات
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
