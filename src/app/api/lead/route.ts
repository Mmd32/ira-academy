import { NextResponse } from 'next/server';

import { createLead } from '@/server/leads';

/**
 * Receives the site's forms. RegisterForm and LeadForm have always posted
 * here; until now nothing answered, so every submission fell through to the
 * mailto fallback and, on a phone, usually vanished.
 */

export const dynamic = 'force-dynamic';

/** One IP gets a handful of submissions per window — enough for a real person,
 *  not enough to fill the table or to spam the sales team's notifications. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing: drop anything that has gone quiet.
  if (hits.size > 500) {
    hits.forEach((times, key) => {
      if (times.every((t: number) => now - t >= WINDOW_MS)) hits.delete(key);
    });
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'درخواست‌های بیش از حد. چند لحظه بعد دوباره تلاش کنید.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'درخواست نامعتبر' }, { status: 400 });
  }

  // A submission with no way to call the person back is of no use to anyone.
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: 'نام و شماره تماس لازم است.' },
      { status: 422 },
    );
  }

  // A hidden field real people never fill in; bots fill everything.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const id = createLead({
    type: body.type as string,
    program: body.program as string,
    name,
    phone,
    company: body.company as string,
    note: body.note as string,
  });

  return NextResponse.json({ ok: true, id });
}
