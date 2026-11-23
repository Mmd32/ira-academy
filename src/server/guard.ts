import { redirect } from 'next/navigation';

import { currentUser, type AdminUser } from './auth';

/**
 * Called at the top of every panel page.
 *
 * The layout alone is not enough: a layout and the page beneath it render
 * together, so a page that does not check for itself can do its work before
 * the layout's redirect is honoured. Each page asks on its own behalf.
 */
export function requireAdmin(): AdminUser {
  const user = currentUser();
  if (!user) redirect('/admin/login/');
  return user;
}
