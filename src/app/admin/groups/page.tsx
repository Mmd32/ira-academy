import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { listGroups, listOrgs } from '@/server/students';
import { fa } from '@/lib/text';

import { createGroupAction } from '../exam-actions';
import { Field, PageTitle, fieldBox } from '../ui';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { error?: string } };

export default function GroupsPage({ searchParams }: Props) {
  requireAdmin();
  const groups = listGroups();
  const orgs = listOrgs();
  const orgName = new Map(orgs.map((o) => [o.id, o.name]));

  return (
    <>
      <PageTitle
        eyebrow="درگاه دانش‌پذیران"
        title="گروه‌های دانش‌پذیران"
        lead="گروه، فهرستی از دانش‌پذیران است، مثلاً «دوره‌ی اصول فروش، پاییز ۱۴۰۵». آزمون را به گروه می‌دهید و همه‌ی اعضا آن را در درگاه می‌بینند."
      />

      <form action={createGroupAction} className="card mt-8 grid gap-4 p-6 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
        <Field label="نام گروه">
          <input name="name" required className={fieldBox} />
        </Field>
        <Field label="توضیح" hint="اختیاری">
          <input name="note" className={fieldBox} />
        </Field>
        <Field label="سازمان" hint="اختیاری">
          <select name="orgId" defaultValue="" className={fieldBox}>
            <option value="">بدون سازمان</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </Field>
        <button type="submit" className="btn-primary !py-2.5 text-xs">
          گروه جدید
        </button>
      </form>
      {searchParams.error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {searchParams.error}
        </p>
      )}

      {groups.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-ink-soft">هنوز گروهی ساخته نشده است.</div>
      ) : (
        <div className="mt-6 grid gap-3">
          {groups.map((g) => (
            <Link
              key={g.id}
              href={`/admin/groups/edit/?id=${g.id}`}
              className="card flex flex-wrap items-center justify-between gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div>
                <h2 className="font-extrabold text-ink">{g.name}</h2>
                {g.note && <p className="mt-1 text-xs text-ink-mute">{g.note}</p>}
                {g.orgId && <p className="mt-1 text-xs text-brand">سازمان: {orgName.get(g.orgId)}</p>}
              </div>
              <span className="text-sm text-ink-soft">{fa(g.memberCount)} عضو</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
