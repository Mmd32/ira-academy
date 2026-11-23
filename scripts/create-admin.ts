/**
 * Creates an admin account.
 *
 * Run it with no arguments and it asks for each field in turn:
 *
 *   npm run create-admin
 *
 * The password is typed at a prompt rather than passed on the command line, so
 * the shell never has to quote it and it does not end up in shell history.
 * Arguments still work for scripted setups:
 *
 *   npm run create-admin -- <username> <password> "<display name>"
 *
 * A script rather than a sign-up page, because this site has no public
 * registration — accounts are handed out deliberately. Each person gets their
 * own, so the leads table can record who called whom.
 */
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

import { countUsers, createUser } from '../src/server/auth';
import { db } from '../src/server/db';

const rl = createInterface({ input: stdin, output: stdout });

const ask = (question: string): Promise<string> =>
  new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));

/** Same prompt, but nothing is echoed while the password is typed. */
const askSecret = (question: string): Promise<string> =>
  new Promise((resolve) => {
    stdout.write(question);
    const term = stdin as typeof stdin & { isTTY?: boolean; setRawMode?: (on: boolean) => void };
    if (!term.isTTY || !term.setRawMode) {
      // Not a terminal (piped input): fall back to a normal, echoed read.
      rl.question('', (answer) => resolve(answer.trim()));
      return;
    }

    let value = '';
    term.setRawMode(true);
    const onData = (chunk: Buffer) => {
      const char = chunk.toString('utf8');
      if (char === '\r' || char === '\n' || char === '\u0004') {
        term.setRawMode!(false);
        stdin.removeListener('data', onData);
        stdout.write('\n');
        resolve(value.trim());
        return;
      }
      if (char === '\u0003') {
        // Ctrl+C
        term.setRawMode!(false);
        stdout.write('\n');
        process.exit(130);
      }
      if (char === '\u007f' || char === '\b') {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    };
    stdin.on('data', onData);
  });

function fail(message: string): never {
  console.error(`\n${message}`);
  rl.close();
  process.exit(1);
}

async function main() {
  const [argUser, argPass, argName] = process.argv.slice(2);

  const username = argUser ?? (await ask('نام کاربری (انگلیسی، بدون فاصله): '));
  if (!username) fail('نام کاربری خالی است.');
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    fail('نام کاربری فقط می‌تواند حروف انگلیسی، عدد، نقطه، خط تیره و زیرخط داشته باشد.');
  }

  const taken = db()
    .prepare(`SELECT 1 FROM users WHERE username = ?`)
    .get(username.trim().toLowerCase());
  if (taken) fail(`نام کاربری «${username}» از قبل وجود دارد.`);

  const password = argPass ?? (await askSecret('رمز عبور (دیده نمی‌شود): '));
  if (password.length < 8) fail('رمز باید دست‌کم ۸ کاراکتر باشد.');

  if (!argPass) {
    const again = await askSecret('تکرار رمز عبور: ');
    if (again !== password) fail('دو رمز یکسان نیستند.');
  }

  const displayName = argName ?? (await ask('نام نمایشی (فارسی آزاد است): '));

  createUser(username, password, displayName || username);
  rl.close();

  console.log(`\n✓ حساب ساخته شد: ${username}`);
  console.log(`  تعداد کل حساب‌های مدیریت: ${countUsers()}`);
  console.log('  ورود از مسیر /admin');
}

main().catch((err) => {
  console.error('ساخت حساب شکست خورد:', err);
  rl.close();
  process.exit(1);
});
