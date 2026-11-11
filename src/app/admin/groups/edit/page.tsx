import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/server/guard';
import { getGroup, groupMemberIds, listOrgs, listStudents } from '@/server/students';

import { deleteGroupAction, saveGroupAction } from '../../exam-actions';
import { Field, PageTitle, fieldBox } from '../../ui';
import { DeleteButton } from './DeleteButton';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { id?: string; saved?: string; error?: string } };

export default function EditGroupPage({ searchParams }: Props) {
  requireAdmin();
  const group = getGroup(Number(searchParams.id));
  if (!group) notFound();

  const members = new Set(groupMemberIds(group.id));
  const students = listStudents();
  const orgs = listOrgs();

  return (
    <>
      <Link href="/admin/groups/" className="text-xs font-bold text-brand hover:underline">
        ← همه‌ی گروه‌ها
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow="گروه" title={group.name} />
      </div>

      <form action={saveGroupAction} className="mt-8 grid gap-6">
        <input type="hidden" name="id" value={group.id} />

        <section className="card grid gap-5 p-7 sm:grid-cols-3">
          <Field label="نام گروه">
            <input name="name" defaultValue={group.name} required className={fieldBox} />
          </Field>
          <Field label="توضیح">
            <input name="note" defaultValue={group.note} className={fieldBox} />
          </Field>
          <Field label="سازمان" hint="اعضا در این سازمان کد می‌گیرند">
            <select name="orgId" defaultValue={group.orgId ?? ''} className={fieldBox}>
              <option value="">بدون سازمان</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </Field>
        </section>

        <section className="card p-7">
          <h2 className="font-extrabold text-ink">اعضای گروه</h2>
          <p className="mt-1 text-xs text-ink-mute">
            کسانی را که علامت بزنید عضو گروه می‌شوند. دانش‌پذیر جدید را اول در «دانش‌پذیران» بسازید.
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
                  <input type="checkbox" name="member" value={s.id} defaultChecked={members.has(s.id)} className="h-4 w-4" />
                  <span className="font-semibold text-ink">{s.name}</span>
                  <span className="ltr mr-auto text-xs text-ink-mute">{s.nationalId || s.phone}</span>
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

      <form action={deleteGroupAction} className="mt-10">
        <input type="hidden" name="id" value={group.id} />
        <DeleteButton name={group.name} />
      </form>
    </>
  );
}
