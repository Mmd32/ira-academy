import Link from 'next/link';
import { requireAdmin } from '@/server/guard';

import { leadCounts, listLeads } from '@/server/leads';
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads-shared';

import { LeadRow } from './LeadRow';

export const dynamic = 'force-dynamic';

const faDateTime = (iso: string) =>
  new Date(iso).toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

type Props = { searchParams: { status?: string } };

export default function LeadsPage({ searchParams }: Props) {
  requireAdmin();
  const filter = (searchParams.status ?? 'all') as LeadStatus | 'all';
  const leads = listLeads(filter);
  const counts = leadCounts();

  const tabs: { key: LeadStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'همه' },
    ...Object.entries(LEAD_STATUSES).map(([key, label]) => ({
      key: key as LeadStatus,
      label,
    })),
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">بک‌آفیس</p>
          <h1 className="mt-4 text-2xl font-extrabold text-ink">فرم‌ها و سرنخ‌ها</h1>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            هر کسی که در سایت فرم پر کرده اینجاست. بعد از تماس، وضعیت را ثبت کنید تا کسی دو بار
            تماس نگیرد.
          </p>
        </div>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === 'all' ? '/admin/leads/' : `/admin/leads/?status=${tab.key}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-white text-ink-soft hover:border-brand-400'
              }`}
            >
              {tab.label}
              <span className={`mr-2 ${active ? 'text-white/70' : 'text-ink-mute'}`}>
                {counts[tab.key] ?? 0}
              </span>
            </Link>
          );
        })}
      </nav>

      {leads.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-ink-soft">
            {filter === 'all'
              ? 'هنوز هیچ فرمی ثبت نشده است.'
              : 'در این وضعیت موردی نیست.'}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} when={faDateTime(lead.createdAt)} />
          ))}
        </div>
      )}
    </>
  );
}
