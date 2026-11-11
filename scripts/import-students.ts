/**
 * Creates student accounts from a tab-separated file and puts them in an
 * organisation and a group, so each gets a student code and the group's exams.
 *
 *   npm run import-students -- <file.tsv> "<organisation>" <PREFIX> "<group>" <out.xlsx>
 *
 * Each line of the file: name <TAB> store <TAB> national ID. The passwords are
 * generated, and written once to <out.xlsx> — they are stored hashed and
 * cannot be read back, so that sheet is the only copy. Lines that fail (a bad
 * or repeated national ID) are listed and skipped; running it again with the
 * same file skips the people who already exist.
 */
import { readFileSync, writeFileSync } from 'node:fs';

import { buildXlsx, type Cell } from '../src/server/xlsx';
import { createGroup, createOrg, createStudent, enroll, listGroups, listOrgs, addStudentsToGroup } from '../src/server/students';

const [file, orgName, prefix, groupName, out] = process.argv.slice(2);
if (!file || !orgName || !prefix || !groupName || !out) {
  console.error('usage: import-students <file.tsv> "<organisation>" <PREFIX> "<group>" <out.xlsx>');
  process.exit(1);
}

let org = listOrgs().find((o) => o.prefix === prefix.toUpperCase());
if (!org) {
  const r = createOrg({ name: orgName, prefix });
  if ('error' in r) throw new Error(r.error);
  org = listOrgs().find((o) => o.id === r.id)!;
}
let group = listGroups().find((g) => g.name === groupName);
if (!group) {
  const r = createGroup(groupName, '', org.id);
  if ('error' in r) throw new Error(r.error);
  group = listGroups().find((g) => g.id === r.id)!;
}

const rows: Cell[][] = [['ردیف', 'نام', 'فروشگاه', 'کد ملی (نام کاربری)', 'رمز عبور', 'کد دانشجویی']];
const problems: string[] = [];
const ids: number[] = [];

readFileSync(file, 'utf8')
  .replace(/\r/g, '')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .forEach((line, i) => {
    const [name = '', store = '', nationalId = ''] = line.split('\t').map((p) => p.trim());
    const r = createStudent({ name, store, nationalId });
    if (!r.ok) {
      problems.push(`سطر ${i + 1} (${name}): ${r.error}`);
      return;
    }
    ids.push(r.id);
    rows.push([rows.length, r.name, store, r.nationalId, r.password, '']);
  });

addStudentsToGroup(group.id, ids);
const codes = new Map(ids.map((id) => [id, enroll(id, org!.id)]));
ids.forEach((id, i) => {
  rows[i + 1][5] = codes.get(id) ?? '';
});

writeFileSync(out, buildXlsx([{ name: 'ورود', rows, widths: [6, 24, 16, 20, 14, 14] }]));
console.log(`created ${ids.length} accounts in «${org.name}» / «${group.name}» → ${out}`);
if (problems.length) console.log(`skipped:\n${problems.join('\n')}`);
