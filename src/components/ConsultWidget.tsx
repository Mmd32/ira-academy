'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { role: 'user' | 'assistant'; content: string };

const GREETING: Message = {
  role: 'assistant',
  content:
    'سلام! من مشاور هوشمند آکادمی ریتیل ایران هستم 🌟 بفرمایید چه نوع فروشگاه یا کسب‌وکاری دارید تا بهترین دوره را پیشنهاد بدهم؟',
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export function ConsultWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = draft.trim();
    if (!text || pending) return;

    setDraft('');
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setPending(true);

    try {
      const res = await fetch(`${API_BASE}/api/consult/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The greeting is local-only; the API receives the real exchange.
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply || 'مشکلی پیش آمد؛ لطفاً دوباره تلاش کنید یا از بخش تماس پیام بگذارید.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'ارتباط با مشاور برقرار نشد. لطفاً بعداً دوباره تلاش کنید یا از بخش تماس با ما پیام بگذارید.',
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, pending, open]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="گفت‌وگو با مشاور آکادمی"
        className="fixed bottom-6 left-6 z-50 flex h-14 items-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white shadow-glow-navy transition-all hover:-translate-y-0.5 hover:bg-brand-500"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs text-ink">✦</span>
        مشاور هوشمند
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 left-6 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
          >
            <div className="navy-stage flex items-center gap-3 px-5 py-4 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold-soft">
                ✦
              </span>
              <div>
                <div className="text-sm font-extrabold">مشاور آکادمی</div>
                <div className="text-[11px] text-white/60">پاسخ‌گویی هوشمند — نیازسنجی و معرفی دوره</div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-paper p-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-7 ${
                    message.role === 'user'
                      ? 'mr-auto rounded-tr-md bg-brand text-white'
                      : 'ml-auto rounded-tl-md border border-line bg-white text-ink shadow-card'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {pending && (
                <div className="ml-auto flex w-16 items-center justify-center gap-1 rounded-2xl border border-line bg-white px-4 py-3 shadow-card">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300"
                      style={{ animationDelay: `${0.2 * i}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-line bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="پیام خود را بنویسید…"
                className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400"
              />
              <button
                onClick={send}
                disabled={pending || !draft.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-all hover:bg-brand-500 disabled:opacity-40"
                aria-label="ارسال"
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
