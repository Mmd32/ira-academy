import Link from 'next/link';
import { requireAdmin } from '@/server/guard';

import { getAllCourses, getProgramModels } from '@/server/content';

import { saveCourseAction } from '../../content-actions';
import { Field, PageTitle, fieldBox } from '../../ui';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string } };

export default function EditCoursePage({ searchParams }: Props) {
  requireAdmin();
  const all = getAllCourses();
  const course = searchParams.id ? all.find((c) => c.id === searchParams.id) : undefined;
  const models = getProgramModels();

  return (
    <>
      <PageTitle eyebrow="محتوا" title={course ? 'ویرایش دوره' : 'دوره‌ی جدید'} />

      <form action={saveCourseAction} className="mt-8 grid gap-8">
        {course && <input type="hidden" name="originalId" value={course.id} />}

        <section className="card grid gap-5 p-7">
          <Field label="عنوان دوره">
            <input name="title" defaultValue={course?.title} required className={fieldBox} />
          </Field>

          <Field label="توضیح کوتاه" hint="همان متنی که در کارت دوره دیده می‌شود">
            <textarea name="blurb" rows={3} defaultValue={course?.blurb} className={fieldBox} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="شناسه" hint="انگلیسی؛ در نشانی ثبت‌نام می‌آید">
              <input
                name="id"
                defaultValue={course?.id}
                required
                pattern="[a-z0-9-]+"
                className={`${fieldBox} ltr`}
              />
            </Field>
            <Field label="مخاطب" hint="مثلاً مدیران فروشگاه">
              <input name="audience" defaultValue={course?.audience} className={fieldBox} />
            </Field>
            <Field label="تعداد مبحث">
              <input
                name="sessions"
                type="number"
                min={0}
                defaultValue={course?.sessions ?? 0}
                className={`${fieldBox} ltr`}
              />
            </Field>
            <Field label="ساعت">
              <input
                name="hours"
                type="number"
                min={0}
                defaultValue={course?.hours ?? 0}
                className={`${fieldBox} ltr`}
              />
            </Field>
            <Field label="نوع برگزاری">
              <select name="model" defaultValue={course?.model ?? 'standard'} className={fieldBox}>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ترتیب نمایش" hint="عدد کوچک‌تر، بالاتر">
              <input
                name="position"
                type="number"
                defaultValue={course?.order ?? 0}
                className={`${fieldBox} ltr`}
              />
            </Field>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={course ? course.enabled : true}
              className="h-4 w-4"
            />
            <span className="font-semibold text-ink">روی سایت نمایش داده شود</span>
          </label>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-primary">
            ذخیره
          </button>
          <Link href="/admin/courses/" className="text-sm text-ink-mute hover:text-ink">
            انصراف
          </Link>
        </div>
      </form>
    </>
  );
}
