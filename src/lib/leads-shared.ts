/**
 * The lead vocabulary that both sides need.
 *
 * Kept apart from src/server/leads.ts on purpose: the panel's row component
 * runs in the browser, and importing it from the server module would drag the
 * database driver into the client bundle, where `fs` does not exist.
 */

export const LEAD_STATUSES = {
  new: 'جدید',
  reached: 'تماس برقرار شد',
  unreachable: 'تماس برقرار نشد',
  enrolled: 'ثبت‌نام کرد',
  not_interested: 'علاقه‌مند نیست',
  call_back: 'تماس بعدی',
} as const;

export type LeadStatus = keyof typeof LEAD_STATUSES;

export type Lead = {
  id: number;
  createdAt: string;
  type: string;
  program: string;
  name: string;
  phone: string;
  company: string;
  note: string;
  status: LeadStatus;
  callNotes: string;
  handledBy: string;
  updatedAt: string | null;
};
