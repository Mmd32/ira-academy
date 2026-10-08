import { NextResponse } from 'next/server';

import {
  PREVIEW_COOKIE,
  PREVIEW_MAX_AGE,
  previewPassword,
  previewToken,
} from '@/lib/preview-gate';

/** Checks the shared preview password and, if it matches, draws the curtain back. */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let password = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === 'string' ? body.password.trim() : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'درخواست نامعتبر' }, { status: 400 });
  }

  if (password !== previewPassword()) {
    return NextResponse.json({ ok: false, error: 'رمز درست نیست.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PREVIEW_COOKIE, await previewToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: PREVIEW_MAX_AGE,
  });
  return response;
}
