/**
 * Creates an admin account: `npm run create-admin -- <username> <password> "<display name>"`.
 *
 * A script rather than a sign-up page, because this site has no public
 * registration — accounts are handed out deliberately. Each person gets their
 * own, so the leads table can record who called whom.
 */
import { countUsers, createUser } from '../src/server/auth';
import { db } from '../src/server/db';

const [username, password, displayName] = process.argv.slice(2);

if (!username || !password) {
  console.error('استفاده:  npm run create-admin -- <نام‌کاربری> <رمز> "<نام نمایشی>"');
  process.exit(1);
}

if (password.length < 8) {
  console.error('رمز باید دست‌کم ۸ کاراکتر باشد.');
  process.exit(1);
}

const taken = db()
  .prepare(`SELECT 1 FROM users WHERE username = ?`)
  .get(username.trim().toLowerCase());

if (taken) {
  console.error(`نام کاربری «${username}» از قبل وجود دارد.`);
  process.exit(1);
}

createUser(username, password, displayName || username);

console.log(`حساب ساخته شد: ${username}`);
console.log(`تعداد کل حساب‌های مدیریت: ${countUsers()}`);
console.log('ورود از مسیر /admin');
