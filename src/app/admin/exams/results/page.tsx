import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/server/guard';
import { getExam, percentOf, resultRows } from '@/server/exams';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';

import { PageTitle } from '../../ui';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string } };

export default function ResultsPage({ searchParams }: Props) {
  requireAdmin();
  const exam = getExam(Number(searchParams.id));
  if (!exam) notFound();

  const rows = resultRows(exam);
  const sat = rows.filter((r) => r.best);
  const percents = sat.map((r) => percentOf(r.best!)).filter((p): p is number => p !== null);
  const average = percents.length ? Math.round((percents.reduce((a, b) => a + b, 0) / percents.length) * 10) / 10 : null;
  const passed =
    exam.passPercent === null ? null : percents.filter((p) => p >= (exam.passPercent as number)).length;

  return (
    <>
      <Link href="/admin/exams/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی آزمون‌ها
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow={exam.title} title="نمره‌ی دانش‌پذیران" />
        {rows.length > 0 && (
          <a href={`/admin/exams/export/?id=${exam.id}`} className="btn-primary !py-2.5 text-xs">
            دریافت Excel
          </a>
        )}
      </div>
      <div className="mt-4 flex gap-5 text-xs font-bold text-brand">
        <Link href={`/admin/exams/edit/?id=${exam.id}`} className="hover:underline">
          تنظیمات
        </Link>
        <Link href={`/admin/exams/questions/?id=${exam.id}`} className="hover:underline">
          سؤال‌ها
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'دانش‌پذیر تعریف‌شده', value: fa(rows.length) },
          { label: 'شرکت کرده', value: fa(sat.length) },
          { label: 'میانگین درصد', value: average === null ? '—' : fa(average) },
          {
            label: exam.passPercent === null ? 'قبولی' : `قبول (حدنصاب ${fa(exam.passPercent)}٪)`,
            value: passed === null ? 'تعیین نشده' : fa(passed),
          },
        ].map((t) => (
          <div key={t.label} className="card p-5">
            <p className="text-xs font-semibold text-ink-mute">{t.label}</p>
            <p className="mt-2 text-2xl font-black text-brand">{t.value}</p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-ink-soft">
          هنوز دانش‌پذیری برای این آزمون تعریف نشده. در «تنظیمات» گروه را انتخاب کنید.
        </div>
      ) : (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full min-w-[50rem] text-sm">
            <thead>
              <tr className="border-b border-line text-right text-xs text-ink-mute">
                <th className="p-4 font-semibold">نام</th>
                <th className="p-4 font-semibold">کد دانشجویی</th>
                <th className="p-4 font-semibold">کد ملی</th>
                <th className="p-4 font-semibold">گروه</th>
                <th className="p-4 font-semibold">وضعیت</th>
                <th className="p-4 font-semibold">بهترین نمره</th>
                <th className="p-4 font-semibold">درصد</th>
                <th className="p-4 font-semibold">زمان ارسال</th>
                <th className="p-4 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const percent = r.best ? percentOf(r.best) : null;
                const open = r.attempts.some((a) => !a.submittedAt);
                return (
                  <tr key={r.studentId} className="border-b border-line last:border-0">
                    <td className="p-4 font-bold text-ink">{r.name}</td>
                    <td className="p-4 text-xs">
                      <span className="ltr inline-block font-bold text-brand">{r.code}</span>
                      {r.orgName && <span className="block text-ink-mute">{r.orgName}</span>}
                    </td>
                    <td className="ltr p-4 text-ink-soft">{r.nationalId}</td>
                    <td className="p-4 text-xs text-ink-mute">
                      {r.store && <span className="block">{r.store}</span>}
                      {r.groups.join('، ')}
                    </td>
                    <td className="p-4 text-xs">
                      {r.best ? (
                        <span className="text-emerald-700">شرکت کرد ({fa(r.attempts.length)} بار)</span>
                      ) : open ? (
                        <span className="text-gold">در حال آزمون</span>
                      ) : (
                        <span className="text-ink-mute">شرکت نکرد</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-ink">
                      {r.best ? `${fa(r.best.score ?? 0)} از ${fa(r.best.maxScore ?? 0)}` : ''}
                    </td>
                    <td className="p-4">
                      {percent !== null && (
                        <span
                          className={
                            exam.passPercent !== null
                              ? percent >= exam.passPercent
                                ? 'font-bold text-emerald-700'
                                : 'font-bold text-red-700'
                              : 'font-bold text-ink'
                          }
                        >
                          {fa(percent)}٪
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-ink-mute">{r.best ? formatFa(r.best.submittedAt) : ''}</td>
                    <td className="p-4 text-xs">
                      {r.attempts.length > 0 && (
                        <Link
                          href={`/admin/exams/results/attempt/?id=${r.attempts[r.attempts.length - 1].id}`}
                          className="font-bold text-brand hover:underline"
                        >
                          جزئیات
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
