import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { LeadForm } from '@/components/LeadForm';
import { availability, attemptsFor, canSeeResult, examsForStudent, percentOf } from '@/server/exams';
import { currentStudent } from '@/server/students';
import { formatFa } from '@/lib/tehran-time';
import { fa } from '@/lib/text';

import { ChangePassword, SignOut } from './AccountPanel';
import { PortalLogin } from './PortalLogin';

/**
 * Rendered per request: the student's exams and results are read from the
 * database, and a score must show the moment it is released.
 */
export const dynamic = 'force-dynamic';

const HEADER = {
  eyebrow: 'درگاه امور دانش‌پذیران',
  title: 'درگاه دانش‌پذیران',
  lead: 'ورود دانش‌پذیران آکادمی برای شرکت در آزمون‌ها و دیدن نتیجه‌ها.',
};

export default function PortalPage() {
  const student = currentStudent();

  if (!student) {
    return (
      <>
        <PageHeader {...HEADER} />
        <section className="section bg-white">
          <div className="container-x">
            <Reveal>
              <div className="mx-auto max-w-md rounded-3xl border border-line bg-paper p-8 shadow-card">
                <h2 className="text-xl font-extrabold text-ink">ورود دانش‌پذیران</h2>
                <p className="mt-2 text-sm leading-7 text-ink-mute">
                  نام کاربری شما همان شماره‌ی موبایل است. رمز را آکادمی پس از ثبت‌نام قطعی در دوره به شما می‌دهد.
                </p>
                <PortalLogin />
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  const exams = examsForStudent(student.id);

  return (
    <>
      <PageHeader {...HEADER} />
      <section className="section bg-white">
        <div className="container-x grid gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="card h-full p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow">آزمون‌های من</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-ink">{student.name}</span>
                  <SignOut />
                </div>
              </div>

              {exams.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-dashed border-line bg-paper p-6 text-center text-sm leading-7 text-ink-soft">
                  فعلاً آزمونی برای شما تعریف نشده است. وقتی آکادمی آزمونی برای شما باز کند، اینجا دیده می‌شود.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {exams.map((exam) => {
                    const avail = availability(exam, student.id);
                    const done = attemptsFor(exam.id, student.id).filter((a) => a.submittedAt);
                    const last = done[done.length - 1];
                    const showScore = last && canSeeResult(exam);
                    const percent = last ? percentOf(last) : null;

                    const status =
                      avail.state === 'in-progress'
                        ? { text: 'در حال برگزاری، ادامه دهید', tone: 'bg-gold/15 text-gold' }
                        : avail.state === 'ready'
                          ? { text: 'آماده‌ی شروع', tone: 'bg-brand/10 text-brand' }
                          : avail.state === 'upcoming'
                            ? { text: `شروع: ${formatFa(avail.startAt)}`, tone: 'bg-brand/10 text-brand' }
                            : avail.state === 'closed'
                              ? { text: 'زمان آزمون تمام شده', tone: 'bg-neutral-200 text-neutral-700' }
                              : { text: 'شرکت کردید', tone: 'bg-emerald-100 text-emerald-800' };

                    return (
                      <Link
                        key={exam.id}
                        href={`/portal/exam/${exam.id}/`}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-brand-400/60"
                      >
                        <div>
                          <h3 className="font-extrabold text-ink">{exam.title}</h3>
                          <span className="text-xs text-ink-mute">
                            {exam.durationMin ? `${fa(exam.durationMin)} دقیقه` : 'بدون محدودیت مدت'}
                            {showScore && last.score !== null
                              ? ` · نمره‌ی شما: ${fa(last.score)} از ${fa(last.maxScore ?? 0)}${
                                  percent !== null ? ` (${fa(percent)}٪)` : ''
                                }`
                              : last
                                ? ' · پاسخ‌های شما ثبت شده'
                                : ''}
                          </span>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.tone}`}>{status.text}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card h-full p-7">
              <p className="eyebrow">تغییر رمز</p>
              <div className="mt-5">
                <ChangePassword />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card h-full p-7">
              <p className="eyebrow">مشاوره با کارشناسان</p>
              <p className="mb-5 mt-2 text-xs leading-6 text-ink-mute">
                درخواست بدهید تا کارشناس آموزشی با شما تماس بگیرد.
              </p>
              <LeadForm
                subject="درخواست مشاوره، درگاه دانش‌پذیران"
                fields={['name', 'phone', 'note']}
                cta="درخواست تماس"
              />
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
