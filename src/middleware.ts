import { NextResponse, type NextRequest } from 'next/server';

import { PREVIEW_COOKIE, gateEnabled, isExempt, previewToken } from '@/lib/preview-gate';

/**
 * Shows the holding page to everyone who has not entered the preview
 * password. It rewrites rather than redirects, so the address the visitor
 * typed stays in the bar and nothing leaks about which pages exist.
 */
export async function middleware(request: NextRequest) {
  if (!gateEnabled()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (isExempt(pathname)) return NextResponse.next();

  const cookie = request.cookies.get(PREVIEW_COOKIE)?.value;
  if (cookie && cookie === (await previewToken())) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/soon';
  url.search = '';
  return NextResponse.rewrite(url, { status: 503 });
}

export const config = {
  // Everything except Next's own assets, which the gate never needs to see.
  matcher: ['/((?!_next/static|_next/image).*)'],
};
