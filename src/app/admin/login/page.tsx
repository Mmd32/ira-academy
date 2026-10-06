import { redirect } from 'next/navigation';

import { currentUser } from '@/server/auth';

import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  if (currentUser()) redirect('/admin/');

  return (
    <div className="grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center">آکادمی ریتیل ایران</p>
        <h1 className="mt-4 text-center text-2xl font-extrabold text-ink">ورود به پنل مدیریت</h1>
        <div className="card mt-8 p-7">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
