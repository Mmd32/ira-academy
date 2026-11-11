import { db } from './db';

/**
 * People with a public profile. A founder, a group head, an instructor or an
 * article author all have the same shape; `kind` decides which section of the
 * site lists them.
 */

export const PERSON_KINDS = {
  founder: 'هیئت مؤسس',
  manager: 'مدیر گروه',
  instructor: 'مدرس',
  author: 'نویسنده',
} as const;

export type PersonKind = keyof typeof PERSON_KINDS;

export type Person = {
  id: number;
  slug: string;
  kind: PersonKind;
  name: string;
  role: string;
  groupLabel: string;
  bio: string;
  photo: string;
  instagram: string;
  linkedin: string;
  website: string;
  email: string;
  position: number;
  visible: boolean;
};

type Row = Record<string, unknown>;

function toPerson(r: Row): Person {
  const kind = String(r.kind);
  return {
    id: Number(r.id),
    slug: String(r.slug),
    kind: (kind in PERSON_KINDS ? kind : 'instructor') as PersonKind,
    name: String(r.name),
    role: String(r.role),
    groupLabel: String(r.group_label),
    bio: String(r.bio),
    photo: String(r.photo),
    instagram: String(r.instagram),
    linkedin: String(r.linkedin),
    website: String(r.website),
    email: String(r.email),
    position: Number(r.position),
    visible: Number(r.visible) === 1,
  };
}

export function listPeople(options: { kind?: PersonKind; onlyVisible?: boolean } = {}): Person[] {
  const where: string[] = [];
  const args: unknown[] = [];
  if (options.kind) {
    where.push('kind = ?');
    args.push(options.kind);
  }
  if (options.onlyVisible) where.push('visible = 1');
  const rows = db()
    .prepare(`SELECT * FROM people ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY position, id`)
    .all(...args) as Row[];
  return rows.map(toPerson);
}

export function getPerson(slug: string, options: { includeHidden?: boolean } = {}): Person | undefined {
  const row = db()
    .prepare(`SELECT * FROM people WHERE slug = ?${options.includeHidden ? '' : ' AND visible = 1'}`)
    .get(slug) as Row | undefined;
  return row ? toPerson(row) : undefined;
}

export type PersonInput = Omit<Person, 'id'>;

/** Only same-site paths and https links are kept; anything else (javascript:, data:) is dropped. */
export function safeUrl(value: string): string {
  const v = value.trim();
  return /^(https:\/\/[^\s]+|\/[^\s/][^\s]*)$/.test(v) ? v.slice(0, 300) : '';
}

export function savePerson(originalSlug: string | null, input: PersonInput): { slug: string } | { error: string } {
  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: 'نشانی صفحه باید انگلیسی و با خط تیره باشد، مثل ali-rezaei' };
  if (!input.name.trim()) return { error: 'نام خالی است' };
  if (!(input.kind in PERSON_KINDS)) return { error: 'نقش نامعتبر است' };

  const clash = db().prepare(`SELECT slug FROM people WHERE slug = ? AND slug <> ?`).get(slug, originalSlug ?? '');
  if (clash) return { error: 'این نشانی برای شخص دیگری است' };

  const values = {
    slug,
    kind: input.kind,
    name: input.name.trim().slice(0, 120),
    role: input.role.trim().slice(0, 160),
    group_label: input.groupLabel.trim().slice(0, 120),
    bio: input.bio.replace(/\r/g, '').trim().slice(0, 5000),
    photo: safeUrl(input.photo),
    instagram: input.instagram.trim().replace(/^@/, '').replace(/[^A-Za-z0-9._]/g, '').slice(0, 60),
    linkedin: safeUrl(input.linkedin),
    website: safeUrl(input.website),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ? input.email.trim().slice(0, 120) : '',
    position: Number.isFinite(input.position) ? Math.trunc(input.position) : 0,
    visible: input.visible ? 1 : 0,
  };

  const d = db();
  d.transaction(() => {
    if (originalSlug && d.prepare(`SELECT 1 FROM people WHERE slug = ?`).get(originalSlug)) {
      d.prepare(
        `UPDATE people SET slug=@slug, kind=@kind, name=@name, role=@role, group_label=@group_label, bio=@bio, photo=@photo,
           instagram=@instagram, linkedin=@linkedin, website=@website, email=@email, position=@position, visible=@visible
         WHERE slug = @original`,
      ).run({ ...values, original: originalSlug });
      // Articles that pointed at the old address follow it.
      if (originalSlug !== slug) d.prepare(`UPDATE articles SET author_slug = ? WHERE author_slug = ?`).run(slug, originalSlug);
    } else {
      d.prepare(
        `INSERT INTO people (slug, kind, name, role, group_label, bio, photo, instagram, linkedin, website, email, position, visible, created_at)
         VALUES (@slug,@kind,@name,@role,@group_label,@bio,@photo,@instagram,@linkedin,@website,@email,@position,@visible,@created)`,
      ).run({ ...values, created: new Date().toISOString() });
    }
  })();
  return { slug };
}

export function deletePerson(slug: string) {
  const d = db();
  d.transaction(() => {
    d.prepare(`UPDATE articles SET author_slug = '' WHERE author_slug = ?`).run(slug);
    d.prepare(`DELETE FROM people WHERE slug = ?`).run(slug);
  })();
}

/** Published articles written by this person: linked by profile, or by the same name typed in. */
export function articlesBy(person: Person) {
  return db()
    .prepare(
      `SELECT slug, title, short_title, excerpt, kind, published_at, cover_src, cover_alt FROM articles
        WHERE published = 1 AND (author_slug = ? OR author_name = ?) ORDER BY published_at DESC`,
    )
    .all(person.slug, person.name) as {
    slug: string;
    title: string;
    short_title: string;
    excerpt: string;
    kind: string;
    published_at: string;
    cover_src: string;
    cover_alt: string;
  }[];
}
