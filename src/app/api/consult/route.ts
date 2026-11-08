import { NextResponse } from 'next/server';

import { answer, type ChatMessage } from '@/server/consult';

export const dynamic = 'force-dynamic';

/** Same flood guard idea as /api/lead: generous for shared mobile addresses, hostile to scripts. */
const WINDOW_MS = 600_000;
const MAX_PER_WINDOW = 80;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    hits.forEach((times, key) => {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    });
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ reply: 'پیام‌های زیادی فرستاده شد. چند دقیقه بعد دوباره تلاش کنید.' }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = (await request.json()) as { messages?: unknown };
  } catch {
    return NextResponse.json({ reply: 'درخواست نامعتبر' }, { status: 400 });
  }

  const messages: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            typeof m === 'object' &&
            ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant') &&
            typeof (m as ChatMessage).content === 'string',
        )
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }))
    : [];

  if (!messages.some((m) => m.role === 'user')) {
    return NextResponse.json({ reply: 'پیام خود را بنویسید.' }, { status: 422 });
  }
  return NextResponse.json(answer(messages));
}
