import { getSite } from '@/server/content';
import { listHeroSlidesForAdmin } from '@/server/content-write';
import { requireAdmin } from '@/server/guard';

import { saveTextsAction } from '../content-actions';
import { Field, PageTitle, fieldBox } from '../ui';

export const dynamic = 'force-dynamic';

const SITE_FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: 'brand', label: 'نام آکادمی' },
  { key: 'brandEn', label: 'نام انگلیسی' },
  { key: 'tagline', label: 'شعار', hint: 'در توضیحات سئو هم استفاده می‌شود' },
  { key: 'phone', label: 'تلفن ثابت' },
  { key: 'phone2', label: 'تلفن ثابت — خط دوم', hint: 'خالی بگذارید اگر ندارید' },
  { key: 'mobile', label: 'موبایل' },
  { key: 'email', label: 'ایمیل' },
  { key: 'instagram', label: 'اینستاگرام', hint: 'فقط نام کاربری، مثلاً @name' },
  { key: 'linkedin', label: 'لینکدین', hint: 'نشانی کامل صفحه' },
  { key: 'address', label: 'نشانی' },
  { key: 'footerText', label: 'متن پاورقی', hint: 'زیر لوگو در انتهای همه‌ی صفحات' },
];

export default function TextsPage() {
  requireAdmin();
  const site = getSite();
  const slides = listHeroSlidesForAdmin();

  return (
    <>
      <PageTitle
        eyebrow="محتوا"
        title="متن‌های سایت"
        lead="اسلایدهای صفحه‌ی اول و اطلاعات تماس. در عنوان اسلاید، متنی که بین دو ستاره بگذارید طلایی می‌شود و هر خط تازه، یک خط جدا در سایت است."
      />

      <form action={saveTextsAction} className="mt-8 grid gap-8">
        <section className="grid gap-4">
          <h2 className="font-extrabold text-ink">اسلایدهای صفحه‌ی اول</h2>

          {slides.map((s) => (
            <div key={s.id} className="card grid gap-5 p-7">
              <input type="hidden" name="slideId" value={s.id} />

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name={`enabled:${s.id}`}
                  defaultChecked={s.enabled === 1}
                  className="h-4 w-4"
                />
                <span className="font-semibold text-ink">این اسلاید نمایش داده شود</span>
              </label>

              <Field label="بالانویس">
                <input name={`eyebrow:${s.id}`} defaultValue={s.eyebrow} className={fieldBox} />
              </Field>

              <Field label="عنوان" hint="هر خط تازه = یک خط در سایت · *متن طلایی*">
                <textarea
                  name={`title:${s.id}`}
                  rows={3}
                  defaultValue={s.title}
                  className={fieldBox}
                />
              </Field>

              <Field label="توضیح زیر عنوان">
                <textarea name={`lead:${s.id}`} rows={2} defaultValue={s.lead} className={fieldBox} />
              </Field>
            </div>
          ))}
        </section>

        <section className="card grid gap-5 p-7">
          <h2 className="font-extrabold text-ink">اطلاعات آکادمی و تماس</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {SITE_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} hint={f.hint}>
                <input
                  name={`site:${f.key}`}
                  defaultValue={String(site[f.key] ?? '')}
                  className={fieldBox}
                />
              </Field>
            ))}
          </div>
        </section>

        <button type="submit" className="btn-primary w-fit">
          ذخیره
        </button>
      </form>
    </>
  );
}
