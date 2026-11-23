/**
 * Sets a new password for an existing admin account, for when it is forgotten.
 *
 *   npm run reset-admin
 *
 * Asks for the username and then the new password at a prompt that does not
 * echo, so the password never sits in shell history. Every session the account
 * had is ended.
 */
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

import { hashPassword } from '../src/server/auth';
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
  const username = (await ask('نام کاربری حساب: ')).toLowerCase();
  const row = db().prepare(`SELECT id FROM users WHERE username = ?`).get(username) as
    | { id: number }
    | undefined;
  if (!row) fail(`حسابی با نام «${username}» پیدا نشد.`);

  const password = await askSecret('رمز تازه (دیده نمی‌شود): ');
  if (password.length < 8) fail('رمز باید دست‌کم ۸ کاراکتر باشد.');
  const again = await askSecret('تکرار رمز تازه: ');
  if (again !== password) fail('دو رمز یکسان نیستند.');

  db().prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(hashPassword(password), row.id);
  db().prepare(`DELETE FROM sessions WHERE user_id = ?`).run(row.id);
  rl.close();

  console.log(`\n✓ رمز «${username}» عوض شد. ورود از مسیر /admin`);
}

main().catch((err) => {
  console.error('تعویض رمز شکست خورد:', err);
  rl.close();
  process.exit(1);
});
