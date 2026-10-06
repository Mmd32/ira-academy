'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { currentUser, pruneSessions, signIn, signOut } from '@/server/auth';
import { deleteLead, updateLead } from '@/server/leads';
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads-shared';

/** Every action that changes something calls this first. */
function requireUser() {
  const user = currentUser();
  if (!user) redirect('/admin/login/');
  return user;
}

export async function signInAction(_prev: string | null, formData: FormData): Promise<string | null> {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!username || !password) return 'نام کاربری و رمز را وارد کنید.';

  pruneSessions();
  const user = signIn(username, password);
  if (!user) return 'نام کاربری یا رمز درست نیست.';

  redirect('/admin/');
}

export async function signOutAction() {
  signOut();
  redirect('/admin/login/');
}

export async function updateLeadAction(formData: FormData) {
  const user = requireUser();

  const id = Number(formData.get('id'));
  const status = String(formData.get('status') ?? '') as LeadStatus;
  const callNotes = String(formData.get('callNotes') ?? '');

  if (!id || !(status in LEAD_STATUSES)) return;

  updateLead(id, { status, callNotes, handledBy: user.displayName || user.username });
  revalidatePath('/admin/leads');
}

export async function deleteLeadAction(formData: FormData) {
  requireUser();
  const id = Number(formData.get('id'));
  if (id) deleteLead(id);
  revalidatePath('/admin/leads');
}
