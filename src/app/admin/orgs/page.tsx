import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { listOrgs } from '@/server/students';
import { fa } from '@/lib/text';

import { createOrgAction } from '../exam-actions';
import { Field, PageTitle, fieldBox } from '../ui';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { error?: string } };

export default function OrgsPage({ searchParams }: Props) {
  requireAdmin();
  const orgs = listOrgs();

  return (
    <>
      <PageTitle
        eyebrow="درگاه دانش‌پذیران"
        title="سازمان‌ها و کد دانشجویی"
        lead="وقتی دانش‌پذیری از طرف سازمانش شرکت می‌کند، در همان سازمان یک کد دانشجویی می‌گیرد. کد از پیشوند سازمان و یک شماره‌ی ترتیبی ساخته می‌شود، مثل DK-0001. یک نفر با یک حساب می‌تواند در چند سازمان کد داشته باشد."
      />

      <form action={createOrgAction} className="card mt-8 grid gap-4 p-6 sm:grid-cols-[1.2fr_0.6fr_1fr_auto] sm:items-end">
        <Field label="نام سازمان">
          <input name="name" required className={fieldBox} />
        </Field>
        <Field label="پیشوند کد" hint="۲ تا ۵ حرف انگلیسی">
          <input
            name="prefix"
            required
            maxLength={5}
            pattern="[A-Za-z]{2,5}"
            placeholder="DK"
            className={`${fieldBox} ltr uppercase`}
          />
        </Field>
        <Field label="توضیح" hint="اختیاری">
          <input name="note" className={fieldBox} />
        </Field>
        <button type="submit" className="btn-primary !py-2.5 text-xs">
          سازمان جدید
        </button>
      </form>
      {searchParams.error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {searchParams.error}
        </p>
      )}

      {orgs.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-ink-soft">هنوز سازمانی ثبت نشده است.</div>
      ) : (
        <div className="mt-6 grid gap-3">
          {orgs.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orgs/edit/?id=${o.id}`}
              className="card flex flex-wrap items-center justify-between gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="ltr rounded-full bg-brand/10 px-3 py-1 text-xs font-black text-brand">{o.prefix}</span>
                <h2 className="font-extrabold text-ink">{o.name}</h2>
              </div>
              <span className="text-sm text-ink-soft">{fa(o.memberCount)} دانش‌پذیر</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
