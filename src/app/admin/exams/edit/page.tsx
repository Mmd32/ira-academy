import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { examGroupIds, getExam } from '@/server/exams';
import { listGroups } from '@/server/students';
import { RESULT_MODES } from '@/lib/exam-shared';
import { toTehranInput } from '@/lib/tehran-time';
import { JalaliDateTime } from '@/components/JalaliPreview';

import { deleteExamAction, saveExamAction } from '../../exam-actions';
import { Field, PageTitle, fieldBox } from '../../ui';
import { DeleteExamButton } from './DeleteExamButton';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string; saved?: string; error?: string } };

export default function EditExamPage({ searchParams }: Props) {
  requireAdmin();
  const exam = searchParams.id ? getExam(Number(searchParams.id)) : undefined;
  const groups = listGroups();
  const selected = new Set(exam ? examGroupIds(exam.id) : []);

  return (
    <>
      <Link href="/admin/exams/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی آزمون‌ها
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow="آزمون" title={exam ? 'تنظیمات آزمون' : 'آزمون جدید'} />
      </div>

      {exam && (
        <div className="mt-4 flex gap-5 text-xs font-bold text-brand">
          <Link href={`/admin/exams/questions/?id=${exam.id}`} className="hover:underline">
            سؤال‌ها
          </Link>
          <Link href={`/admin/exams/results/?id=${exam.id}`} className="hover:underline">
            نمره‌ها
          </Link>
        </div>
      )}

      <form action={saveExamAction} className="mt-8 grid gap-6">
        {exam && <input type="hidden" name="id" value={exam.id} />}

        <section className="card grid gap-5 p-7">
          <Field label="عنوان آزمون">
            <input name="title" defaultValue={exam?.title} required className={fieldBox} />
          </Field>
          <Field label="توضیح برای دانش‌پذیر" hint="قبل از شروع آزمون نمایش داده می‌شود">
            <textarea name="description" rows={3} defaultValue={exam?.description} className={fieldBox} />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={exam?.published ?? false} className="h-4 w-4" />
            منتشر شود (دانش‌پذیران گروه‌های انتخاب‌شده آن را ببینند)
          </label>
        </section>

        <section className="card p-7">
          <h2 className="font-extrabold text-ink">زمان‌بندی</h2>
          <p className="mt-1 text-xs leading-6 text-ink-mute">
            هر سه مورد اختیاری‌اند. خالی بگذارید تا بدون محدودیت باشد. ساعت‌ها به وقت تهران است. اگر هم بازه و هم
            مدت بگذارید، آزمون در هر حال تا پایان بازه تمام می‌شود.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <span className="text-sm font-semibold text-ink">شروع بازه</span>
              <JalaliDateTime name="startAt" defaultValue={toTehranInput(exam?.startAt)} />
            </div>
            <div>
              <span className="text-sm font-semibold text-ink">پایان بازه</span>
              <JalaliDateTime name="endAt" defaultValue={toTehranInput(exam?.endAt)} />
            </div>
            <Field label="مدت آزمون (دقیقه)" hint="خالی = بدون محدودیت مدت">
              <input
                name="durationMin"
                type="number"
                min={1}
                defaultValue={exam?.durationMin ?? ''}
                className={`${fieldBox} ltr`}
              />
            </Field>
          </div>
        </section>

        <section className="card grid gap-5 p-7 sm:grid-cols-2">
          <Field label="تعداد دفعات مجاز شرکت">
            <input
              name="maxAttempts"
              type="number"
              min={1}
              max={20}
              defaultValue={exam?.maxAttempts ?? 1}
              className={`${fieldBox} ltr`}
            />
          </Field>
          <Field label="حدنصاب قبولی (درصد)" hint="اختیاری">
            <input
              name="passPercent"
              type="number"
              min={0}
              max={100}
              defaultValue={exam?.passPercent ?? ''}
              className={`${fieldBox} ltr`}
            />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="shuffleQuestions" defaultChecked={exam?.shuffleQuestions ?? true} className="h-4 w-4" />
            ترتیب سؤال‌ها برای هر نفر تصادفی باشد
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="shuffleOptions" defaultChecked={exam?.shuffleOptions ?? true} className="h-4 w-4" />
            ترتیب گزینه‌ها برای هر نفر تصادفی باشد
          </label>
        </section>

        <section className="card grid gap-5 p-7">
          <h2 className="font-extrabold text-ink">نتیجه برای دانش‌پذیر</h2>
          <Field label="چه زمانی نمره را ببیند؟">
            <select name="resultMode" defaultValue={exam?.resultMode ?? 'immediate'} className={fieldBox}>
              {Object.entries(RESULT_MODES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="showAnswers" defaultChecked={exam?.showAnswers ?? false} className="h-4 w-4" />
            همراه نمره، پاسخ صحیح هر سؤال هم نشان داده شود
          </label>
        </section>

        <section className="card p-7">
          <h2 className="font-extrabold text-ink">گروه‌هایی که این آزمون را می‌بینند</h2>
          {groups.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">
              هنوز گروهی نیست. اول در <Link href="/admin/groups/" className="font-bold text-brand hover:underline">گروه‌ها</Link> یک گروه بسازید.
            </p>
          ) : (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {groups.map((g) => (
                <label key={g.id} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm">
                  <input type="checkbox" name="group" value={g.id} defaultChecked={selected.has(g.id)} className="h-4 w-4" />
                  <span className="font-semibold text-ink">{g.name}</span>
                </label>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-primary !py-2.5 text-xs">
            ذخیره
          </button>
          {searchParams.saved && <span className="text-sm text-emerald-700">ذخیره شد</span>}
          {searchParams.error && <span className="text-sm text-red-700">{searchParams.error}</span>}
        </div>
      </form>

      {exam && (
        <form action={deleteExamAction} className="mt-10">
          <input type="hidden" name="id" value={exam.id} />
          <DeleteExamButton title={exam.title} />
        </form>
      )}
    </>
  );
}
