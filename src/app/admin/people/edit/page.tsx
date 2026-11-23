import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/server/guard';
import { articlesBy, getPerson, PERSON_KINDS } from '@/server/people';

import { ImageInput } from '../../ImageInput';
import { Field, PageTitle, fieldBox } from '../../ui';
import { deletePersonAction, savePersonAction } from '../../exam-actions';
import { DeletePersonButton } from './DeletePersonButton';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { slug?: string; saved?: string; error?: string } };

export default function EditPersonPage({ searchParams }: Props) {
  requireAdmin();
  const person = searchParams.slug ? getPerson(searchParams.slug, { includeHidden: true }) : undefined;
  if (searchParams.slug && !person) notFound();
  const posts = person ? articlesBy(person) : [];

  return (
    <>
      <Link href="/admin/people/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی افراد
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow="پروفایل" title={person ? person.name : 'شخص جدید'} />
      </div>
      {person && (
        <p className="mt-3 text-xs text-ink-mute">
          صفحه‌ی عمومی: <a href={`/team/${person.slug}/`} target="_blank" className="ltr inline-block font-bold text-brand hover:underline">/team/{person.slug}/</a>
          {posts.length > 0 && ` · ${posts.length} مقاله به او نسبت داده شده`}
        </p>
      )}

      <form action={savePersonAction} className="mt-8 grid gap-6">
        {person && <input type="hidden" name="originalSlug" value={person.slug} />}

        <section className="card grid gap-5 p-7 sm:grid-cols-2">
          <Field label="نام و نام خانوادگی">
            <input name="name" defaultValue={person?.name} required className={fieldBox} />
          </Field>
          <Field label="نقش در سایت" hint="تعیین می‌کند در کدام بخش دیده شود">
            <select name="kind" defaultValue={person?.kind ?? 'instructor'} className={fieldBox}>
              {Object.entries(PERSON_KINDS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="سمت" hint="مثلاً مدیرعامل، مدرس مدیریت فروشگاه">
            <input name="role" defaultValue={person?.role} className={fieldBox} />
          </Field>
          <Field label="گروه یا حوزه" hint="برای مدیر گروه‌ها، مثلاً «گروه پوشاک»">
            <input name="groupLabel" defaultValue={person?.groupLabel} className={fieldBox} />
          </Field>
          <Field label="نشانی صفحه" hint="انگلیسی با خط تیره؛ خالی بگذارید تا خودکار ساخته شود">
            <input
              name="slug"
              defaultValue={person?.slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="ali-rezaei"
              className={`${fieldBox} ltr`}
            />
          </Field>
          <Field label="ترتیب نمایش" hint="عدد کوچک‌تر، بالاتر">
            <input name="position" type="number" defaultValue={person?.position ?? 0} className={`${fieldBox} ltr`} />
          </Field>
        </section>

        <section className="card p-7">
          <h2 className="font-extrabold text-ink">عکس</h2>
          <p className="mt-1 text-xs text-ink-mute">عکس چهره، ترجیحاً مربع. به‌طور خودکار کوچک می‌شود.</p>
          <ImageInput name="photo" defaultValue={person?.photo} />
        </section>

        <section className="card grid gap-5 p-7">
          <h2 className="font-extrabold text-ink">معرفی‌نامه (بیو)</h2>
          <textarea
            name="bio"
            rows={9}
            defaultValue={person?.bio}
            aria-label="معرفی‌نامه"
            placeholder="سابقه، تخصص و آنچه می‌خواهید خواننده بداند. هر پاراگراف را با یک خط خالی جدا کنید."
            className={fieldBox}
          />
        </section>

        <section className="card grid gap-5 p-7 sm:grid-cols-2">
          <h2 className="font-extrabold text-ink sm:col-span-2">لینک‌ها (اختیاری)</h2>
          <Field label="لینکدین" hint="نشانی کامل با https://">
            <input name="linkedin" defaultValue={person?.linkedin} className={`${fieldBox} ltr`} />
          </Field>
          <Field label="اینستاگرام" hint="فقط نام کاربری">
            <input name="instagram" defaultValue={person?.instagram} className={`${fieldBox} ltr`} />
          </Field>
          <Field label="وب‌سایت" hint="نشانی کامل با https://">
            <input name="website" defaultValue={person?.website} className={`${fieldBox} ltr`} />
          </Field>
          <Field label="ایمیل">
            <input name="email" type="email" defaultValue={person?.email} className={`${fieldBox} ltr`} />
          </Field>
        </section>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="visible" defaultChecked={person?.visible ?? true} className="h-4 w-4" />
          <span className="font-semibold text-ink">در سایت دیده شود</span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-primary !py-2.5 text-xs">
            ذخیره
          </button>
          {searchParams.saved && <span className="text-sm text-emerald-700">ذخیره شد</span>}
          {searchParams.error && <span className="text-sm text-red-700">{searchParams.error}</span>}
        </div>
      </form>

      {person && (
        <form action={deletePersonAction} className="mt-10">
          <input type="hidden" name="slug" value={person.slug} />
          <DeletePersonButton name={person.name} />
        </form>
      )}
    </>
  );
}
