import Link from 'next/link';

import { requireAdmin } from '@/server/guard';
import { listGroups, listStudents, normalizePhone } from '@/server/students';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';

import { PageTitle } from '../ui';
import { AddStudentForm, ImportForm, StudentRow } from './StudentForms';

export const dynamic = 'force-dynamic';

type Props = { searchParams: { q?: string; group?: string } };

export default function StudentsPage({ searchParams }: Props) {
  requireAdmin();
  const groups = listGroups();
  const groupName = new Map(groups.map((g) => [g.id, g.name]));
  const all = listStudents();

  const q = (searchParams.q ?? '').trim();
  const phoneQ = normalizePhone(q);
  const groupFilter = Number(searchParams.group) || 0;

  const students = all.filter((s) => {
    if (groupFilter && !s.groupIds.includes(groupFilter)) return false;
    if (!q) return true;
    return s.name.includes(q) || (phoneQ.length >= 3 && s.phone.includes(phoneQ));
  });

  return (
    <>
      <PageTitle
        eyebrow="درگاه دانش‌پذیران"
        title="دانش‌پذیران"
        lead="هر دانش‌پذیر با شماره‌ی موبایل و رمزی که شما می‌دهید وارد درگاه می‌شود. حساب‌ها را اینجا بسازید و در «گروه‌ها» دسته‌بندی کنید."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <details className="card p-6" open={all.length === 0}>
          <summary className="cursor-pointer font-extrabold text-ink">افزودن یک دانش‌پذیر</summary>
          <div className="mt-5">
            <AddStudentForm groups={groups.map((g) => ({ id: g.id, name: g.name }))} />
          </div>
        </details>
        <details className="card p-6">
          <summary className="cursor-pointer font-extrabold text-ink">افزودن گروهی (از Excel)</summary>
          <div className="mt-5">
            <ImportForm groups={groups.map((g) => ({ id: g.id, name: g.name }))} />
          </div>
        </details>
      </div>

      <form className="mt-8 flex flex-wrap items-end gap-3" action="/admin/students/">
        <label className="block text-sm">
          <span className="font-semibold text-ink">جستجو</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="نام یا موبایل"
            className="mt-2 w-56 rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-ink">گروه</span>
          <select
            name="group"
            defaultValue={groupFilter || ''}
            className="mt-2 w-56 rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          >
            <option value="">همه</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-secondary !py-2.5 text-xs">
          اعمال
        </button>
        {(q || groupFilter > 0) && (
          <Link href="/admin/students/" className="text-xs font-bold text-brand hover:underline">
            پاک کردن فیلتر
          </Link>
        )}
        <span className="mr-auto text-xs text-ink-mute">
          {fa(students.length)} از {fa(all.length)} دانش‌پذیر
        </span>
      </form>

      {students.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-ink-soft">
          {all.length === 0 ? 'هنوز دانش‌پذیری اضافه نشده است.' : 'موردی با این فیلتر پیدا نشد.'}
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {students.map((s) => (
            <StudentRow
              key={s.id}
              student={{
                id: s.id,
                name: s.name,
                phone: s.phone,
                active: s.active,
                lastLogin: formatFa(s.lastLoginAt),
                groups: s.groupIds.map((id) => groupName.get(id) ?? '').filter(Boolean),
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
