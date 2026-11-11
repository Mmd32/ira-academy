'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { saveSeoAction } from '../exam-actions';
import { Field, fieldBox } from '../ui';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? '…' : 'ذخیره'}
    </button>
  );
}

type Values = { ga4: string; gtm: string; googleVerification: string; bingVerification: string; clarity: string };

export function SeoForm({ values }: { values: Values }) {
  const [message, action] = useFormState(saveSeoAction, null);
  return (
    <form action={action} className="grid gap-6">
      <section className="card grid gap-5 p-7">
        <h2 className="font-extrabold text-ink">تأیید مالکیت سایت</h2>
        <Field label="Google Search Console" hint="فقط مقدار content در تگ HTML، نه کل تگ">
          <input name="googleVerification" defaultValue={values.googleVerification} className={`${fieldBox} ltr`} />
        </Field>
        <Field label="Bing Webmaster Tools" hint="مقدار msvalidate.01">
          <input name="bingVerification" defaultValue={values.bingVerification} className={`${fieldBox} ltr`} />
        </Field>
      </section>

      <section className="card grid gap-5 p-7">
        <h2 className="font-extrabold text-ink">آنالیتیکس</h2>
        <Field label="Google Analytics 4" hint="مثل G-ABC123XYZ9">
          <input name="ga4" defaultValue={values.ga4} placeholder="G-XXXXXXXXXX" className={`${fieldBox} ltr`} />
        </Field>
        <Field label="Google Tag Manager" hint="اگر پر شود، GA4 را از داخل Tag Manager اضافه کنید">
          <input name="gtm" defaultValue={values.gtm} placeholder="GTM-XXXXXXX" className={`${fieldBox} ltr`} />
        </Field>
        <Field label="Microsoft Clarity" hint="نقشه‌ی حرارتی و ضبط رفتار، اختیاری">
          <input name="clarity" defaultValue={values.clarity} className={`${fieldBox} ltr`} />
        </Field>
      </section>

      <div className="flex items-center gap-4">
        <Submit />
        {message && (
          <span className={`text-sm ${message === 'ذخیره شد' ? 'text-emerald-700' : 'text-red-700'}`} role="status">
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
