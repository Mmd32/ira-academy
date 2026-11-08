'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import {
  createStudentAction,
  deleteStudentAction,
  importStudentsAction,
  resetPasswordAction,
  updateStudentAction,
  type Credential,
  type StudentsState,
} from '../exam-actions';
import { fieldBox } from '../ui';

type GroupOption = { id: number; name: string };

function Submit({ children, pendingText }: { children: string; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
      {pending ? pendingText : children}
    </button>
  );
}

/** The passwords are shown once: they are stored hashed and cannot be read back. */
function CredentialsBox({ list }: { list: Credential[] }) {
  const [copied, setCopied] = useState(false);
  if (list.length === 0) return null;

  const text = list.map((c) => `${c.name}\t${c.phone}\t${c.password}`).join('\n');

  const download = () => {
    const csv = `﻿نام,نام کاربری (موبایل),رمز عبور\n${list
      .map((c) => [c.name, c.phone, c.password].map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
      .join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'اطلاعات-ورود-دانش‌پذیران.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-5 rounded-2xl border border-gold/50 bg-gold/5 p-5">
      <p className="text-sm font-extrabold text-ink">{list.length} حساب ساخته شد</p>
      <p className="mt-1 text-xs leading-6 text-ink-soft">
        رمزها فقط همین یک‌بار نمایش داده می‌شوند. همین حالا کپی یا دانلود کنید و برای دانش‌پذیران بفرستید.
      </p>
      <div className="ltr mt-3 max-h-56 overflow-auto rounded-xl border border-line bg-white p-3 text-xs leading-7">
        {list.map((c) => (
          <div key={c.phone} className="flex flex-wrap gap-x-4">
            <span className="font-bold">{c.phone}</span>
            <span className="font-mono">{c.password}</span>
            <span className="text-ink-mute" dir="rtl">
              {c.name}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          className="btn-secondary !py-2 text-xs"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              /* clipboard blocked: the download below still works */
            }
          }}
        >
          {copied ? 'کپی شد' : 'کپی همه'}
        </button>
        <button type="button" className="btn-secondary !py-2 text-xs" onClick={download}>
          دانلود فایل (CSV برای Excel)
        </button>
      </div>
    </div>
  );
}

function Errors({ list }: { list: string[] }) {
  if (list.length === 0) return null;
  return (
    <ul className="mt-4 space-y-1 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {list.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );
}

function GroupSelect({ groups }: { groups: GroupOption[] }) {
  if (groups.length === 0) return null;
  return (
    <label className="block text-sm">
      <span className="font-semibold text-ink">افزودن به گروه</span>
      <select name="groupId" defaultValue="" className={fieldBox}>
        <option value="">بدون گروه</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AddStudentForm({ groups }: { groups: GroupOption[] }) {
  const [state, action] = useFormState<StudentsState, FormData>(createStudentAction, null);
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-semibold text-ink">نام و نام خانوادگی</span>
          <input name="name" required className={fieldBox} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-ink">موبایل</span>
          <span className="mr-2 text-xs text-ink-mute">نام کاربری ورود</span>
          <input name="phone" required inputMode="tel" className={`${fieldBox} ltr`} placeholder="09121234567" />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-ink">رمز</span>
          <span className="mr-2 text-xs text-ink-mute">خالی = خودکار</span>
          <input name="password" className={`${fieldBox} ltr`} autoComplete="off" />
        </label>
      </div>
      <GroupSelect groups={groups} />
      <div>
        <Submit pendingText="در حال ساخت…">ساخت حساب</Submit>
      </div>
      {state && <Errors list={state.errors} />}
      {state && <CredentialsBox list={state.created} />}
    </form>
  );
}

export function ImportForm({ groups }: { groups: GroupOption[] }) {
  const [state, action] = useFormState<StudentsState, FormData>(importStudentsAction, null);
  return (
    <form action={action} className="grid gap-4">
      <label className="block text-sm">
        <span className="font-semibold text-ink">فهرست دانش‌پذیران</span>
        <span className="mr-2 text-xs text-ink-mute">
          هر خط یک نفر: نام، موبایل و (اختیاری) رمز. از Excel می‌توانید مستقیم کپی کنید.
        </span>
        <textarea
          name="rows"
          rows={7}
          required
          className={`${fieldBox} font-mono`}
          placeholder={'علی رضایی\t09121234567\nمریم احمدی,09351234567'}
        />
      </label>
      <GroupSelect groups={groups} />
      <div>
        <Submit pendingText="در حال ساخت…">ساخت همه‌ی حساب‌ها</Submit>
      </div>
      {state && <Errors list={state.errors} />}
      {state && <CredentialsBox list={state.created} />}
    </form>
  );
}

export type StudentRowData = {
  id: number;
  name: string;
  phone: string;
  active: boolean;
  lastLogin: string;
  groups: string[];
};

export function StudentRow({ student }: { student: StudentRowData }) {
  const [message, update] = useFormState<string | null, FormData>(updateStudentAction, null);
  const [newPassword, reset] = useFormState<string | null, FormData>(resetPasswordAction, null);

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-black ${
                student.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {student.active ? 'فعال' : 'غیرفعال'}
            </span>
            <h2 className="font-extrabold text-ink">{student.name}</h2>
            <span className="ltr text-sm text-ink-soft">{student.phone}</span>
          </div>
          <p className="mt-2 text-xs text-ink-mute">
            {student.groups.length ? student.groups.join('، ') : 'بدون گروه'} ·{' '}
            {student.lastLogin ? `آخرین ورود: ${student.lastLogin}` : 'هنوز وارد نشده'}
          </p>
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-bold text-brand">ویرایش، رمز جدید، حذف</summary>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <form action={update} className="grid gap-3">
            <input type="hidden" name="id" value={student.id} />
            <label className="block text-sm">
              <span className="font-semibold text-ink">نام</span>
              <input name="name" defaultValue={student.name} required className={fieldBox} />
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-ink">موبایل</span>
              <input name="phone" defaultValue={student.phone} required className={`${fieldBox} ltr`} />
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="active" defaultChecked={student.active} className="h-4 w-4" />
              حساب فعال باشد
            </label>
            <div className="flex items-center gap-4">
              <Submit pendingText="…">ذخیره</Submit>
              {message && <span className="text-xs text-ink-soft">{message}</span>}
            </div>
          </form>

          <div className="grid content-start gap-4">
            <form action={reset} className="grid gap-3">
              <input type="hidden" name="id" value={student.id} />
              <label className="block text-sm">
                <span className="font-semibold text-ink">رمز جدید</span>
                <span className="mr-2 text-xs text-ink-mute">خالی = خودکار. وارد بودن دانش‌پذیر پایان می‌یابد.</span>
                <input name="password" className={`${fieldBox} ltr`} autoComplete="off" />
              </label>
              <div>
                <Submit pendingText="…">تعیین رمز جدید</Submit>
              </div>
              {newPassword && (
                <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm">
                  رمز جدید: <span className="ltr inline-block font-mono font-bold">{newPassword}</span>
                  <span className="mr-2 text-xs text-ink-mute">فقط همین‌جا نمایش داده می‌شود.</span>
                </p>
              )}
            </form>

            <form
              action={deleteStudentAction}
              onSubmit={(e) => {
                if (!confirm(`«${student.name}» و همه‌ی نتیجه‌های آزمونش حذف شود؟ این کار برگشت ندارد.`)) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={student.id} />
              <button type="submit" className="text-xs font-bold text-red-700 hover:underline">
                حذف دانش‌پذیر
              </button>
            </form>
          </div>
        </div>
      </details>
    </article>
  );
}
