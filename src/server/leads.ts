import { db } from './db';
import { LEAD_STATUSES } from '@/lib/leads-shared';
import type { Lead, LeadStatus } from '@/lib/leads-shared';

/**
 * Form submissions and the call outcomes the back office records against them.
 *
 * The shape matches what RegisterForm and LeadForm already send, so the forms
 * on the site did not have to change — they were posting to /api/lead all
 * along, with nothing listening.
 */

export { LEAD_STATUSES };
export type { Lead, LeadStatus } from '@/lib/leads-shared';

export type NewLead = {
  type?: string;
  program?: string;
  name?: string;
  phone?: string;
  company?: string;
  position?: string;
  note?: string;
};

/** Trims and caps each field, so one oversized post cannot fill the table. */
function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function createLead(input: NewLead): number {
  const info = db()
    .prepare(
      `INSERT INTO leads (created_at, type, program, name, phone, company, position, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
    )
    .run(
      new Date().toISOString(),
      clean(input.type, 120),
      clean(input.program, 160),
      clean(input.name, 120),
      clean(input.phone, 40),
      clean(input.company, 120),
      clean(input.position, 120),
      clean(input.note, 2000),
    );
  return Number(info.lastInsertRowid);
}

function toLead(r: Record<string, unknown>): Lead {
  return {
    id: Number(r.id),
    createdAt: String(r.created_at),
    type: String(r.type),
    program: String(r.program),
    name: String(r.name),
    phone: String(r.phone),
    company: String(r.company),
    position: String(r.position ?? ''),
    note: String(r.note),
    status: String(r.status) as LeadStatus,
    callNotes: String(r.call_notes),
    handledBy: String(r.handled_by),
    updatedAt: r.updated_at ? String(r.updated_at) : null,
  };
}

export function listLeads(status?: LeadStatus | 'all'): Lead[] {
  const rows =
    !status || status === 'all'
      ? db().prepare(`SELECT * FROM leads ORDER BY created_at DESC`).all()
      : db().prepare(`SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC`).all(status);
  return (rows as Record<string, unknown>[]).map(toLead);
}

export function getLead(id: number): Lead | undefined {
  const row = db().prepare(`SELECT * FROM leads WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? toLead(row) : undefined;
}

/** Records the outcome of a call. `handledBy` is the admin who did it. */
export function updateLead(
  id: number,
  patch: { status?: LeadStatus; callNotes?: string; handledBy?: string },
) {
  const current = getLead(id);
  if (!current) return;

  db()
    .prepare(
      `UPDATE leads
          SET status = ?, call_notes = ?, handled_by = ?, updated_at = ?
        WHERE id = ?`,
    )
    .run(
      patch.status ?? current.status,
      patch.callNotes ?? current.callNotes,
      patch.handledBy ?? current.handledBy,
      new Date().toISOString(),
      id,
    );
}

export function deleteLead(id: number) {
  db().prepare(`DELETE FROM leads WHERE id = ?`).run(id);
}

/** Counts per status, for the badges on the panel's navigation. */
export function leadCounts(): Record<string, number> {
  const rows = db()
    .prepare(`SELECT status, COUNT(*) AS n FROM leads GROUP BY status`)
    .all() as { status: string; n: number }[];

  const counts: Record<string, number> = { all: 0 };
  for (const key of Object.keys(LEAD_STATUSES)) counts[key] = 0;
  for (const r of rows) {
    counts[r.status] = r.n;
    counts.all += r.n;
  }
  return counts;
}
