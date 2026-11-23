import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/server/guard';
import { getOrg, listGroups, listStudents, orgMembers } from '@/server/students';

import { deleteOrgAction, saveOrgAction } from '../../exam-actions';
import { Field, PageTitle, fieldBox } from '../../ui';
import { DeleteOrgButton } from './DeleteOrgButton';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string; saved?: string; error?: string } };

export default function EditOrgPage({ searchParams }: Props) {
  requireAdmin();
  const org = getOrg(Number(searchParams.id));
  if (!org) notFound();

  const codes = new Map(orgMembers(org.id).map((m) => [m.studentId, m.code]));
  const students = listStudents();
  const linkedGroups = listGroups().filter((g) => g.orgId === org.id);

  return (
    <>
      <Link href="/admin/orgs/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی سازمان‌ها
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="سازمان" title={org.name} />
        {codes.size > 0 && (
          <a href={`/admin/orgs/export/?id=${org.id}`} className="btn-secondary !py-2.5 text-xs">
            فهرست کدها (Excel)
          </a>
        )}
      </div>

      <form action={saveOrgAction} className="mt-8 grid gap-6">
        <input type="hidden" name="id" value={org.id} />

        <section className="card grid gap-5 p-7 sm:grid-cols-3">
          <Field label="نام سازمان">
            <input name="name" defaultValue={org.name} required className={fieldBox} />
          </Field>
          <Field label="پیشوند کد" hint={org.memberCount > 0 ? 'بعد از صدور کد ثابت است' : '۲ تا ۵ حرف انگلیسی'}>
            <input
              name="prefix"
              defaultValue={org.prefix}
              readOnly={org.memberCount > 0}
              required
              maxLength={5}
              className={`${fieldBox} ltr uppercase ${org.memberCount > 0 ? 'bg-paper text-ink-mute' : ''}`}
            />
          </Field>
          <Field label="توضیح">
            <input name="note" defaultValue={org.note} className={fieldBox} />
          </Field>
        </section>

        <section className="card p-7">
          <h2 className="font-extrabold text-ink">دانش‌پذیران این سازمان</h2>
          <p className="mt-1 text-xs leading-6 text-ink-mute">
            هر کس را علامت بزنید و ذخیره کنید، همان لحظه کدش ساخته می‌شود (بعدی: {org.prefix}-
            {String(codes.size + 1).padStart(4, '0')} یا بالاتر). کد حذف‌شده دوباره استفاده نمی‌شود.
            {linkedGroups.length > 0 && (
              <> اعضای گروه‌های «{linkedGroups.map((g) => g.name).join('، ')}» خودکار اینجا اضافه می‌شوند.</>
            )}
          </p>
          {students.length === 0 ? (
            <p className="mt-5 text-sm text-ink-soft">هنوز دانش‌پذیری ساخته نشده است.</p>
          ) : (
            <div className="mt-5 grid max-h-[28rem] gap-2 overflow-auto sm:grid-cols-2">
              {students.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm"
                >
                  <input type="checkbox" name="member" value={s.id} defaultChecked={codes.has(s.id)} className="h-4 w-4" />
                  <span className="font-semibold text-ink">{s.name}</span>
                  <span className="ltr mr-auto text-xs font-bold text-brand">{codes.get(s.id) ?? ''}</span>
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

      <form action={deleteOrgAction} className="mt-10">
        <input type="hidden" name="id" value={org.id} />
        <DeleteOrgButton name={org.name} />
      </form>
    </>
  );
}
