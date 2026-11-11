'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Link = { label: string; href: string };
type Message = { role: 'user' | 'assistant'; content: string; links?: Link[] };

const ASK_NAME: Message = {
  role: 'assistant',
  content: 'سلام! من مشاور آکادمی ریتیل ایران هستم. لطفاً نام و نام خانوادگی‌تان را بنویسید.',
};

const NAME_KEY = 'ira-consult-name';

/** A name is words of letters; anything with digits or symbols is probably a question or a number. */
function parseName(text: string): string | null {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length < 2 || clean.length > 40 || /[0-9۰-۹٠-٩@:/\\?!؟]/.test(clean)) return null;
  const words = clean.split(' ');
  return words.length <= 4 ? clean : null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export function ConsultWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([ASK_NAME]);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) {
        setName(saved);
        setMessages([
          {
            role: 'assistant',
            content: `سلام ${saved.split(' ')[0]} عزیز، خوش برگشتید! بگویید چه نوع فروشگاه یا کسب‌وکاری دارید تا دوره‌ی مناسب را معرفی کنم.`,
          },
        ]);
      }
    } catch {
      /* storage blocked: the name is simply asked again */
    }
  }, []);

  async function send() {
    const text = draft.trim();
    if (!text || pending) return;

    // First message: the visitor's name. Greet them by it, then carry on.
    if (!name) {
      const given = parseName(text);
      setDraft('');
      if (!given) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: text },
          { role: 'assistant', content: 'لطفاً فقط نام و نام خانوادگی‌تان را بنویسید، مثلاً «علی رضایی».' },
        ]);
        return;
      }
      setName(given);
      try {
        localStorage.setItem(NAME_KEY, given);
      } catch {
        /* storage blocked */
      }
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: given },
        {
          role: 'assistant',
          content: `سلام ${given.split(' ')[0]} عزیز، خوشحالم که با ما هستید! بگویید چه نوع فروشگاه یا کسب‌وکاری دارید و دنبال چه مهارتی هستید تا دوره‌ی مناسب را معرفی کنم.`,
        },
      ]);
      return;
    }

    setDraft('');
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setPending(true);

    try {
      const res = await fetch(`${API_BASE}/api/consult/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The greeting is local-only; the API receives the real exchange.
        body: JSON.stringify({ name, messages: next.slice(1).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply || 'مشکلی پیش آمد؛ لطفاً دوباره تلاش کنید یا از بخش تماس پیام بگذارید.',
          links: Array.isArray(data.links) ? data.links : undefined,
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
        aria-expanded={open}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-brand text-sm font-bold text-white shadow-glow-navy transition-all hover:-translate-y-0.5 hover:bg-brand-500 sm:bottom-6 sm:left-6 sm:h-14 sm:w-auto sm:px-5"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs text-ink">✦</span>
        <span className="hidden sm:inline">مشاور آکادمی</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 left-4 z-50 flex h-[min(480px,calc(100vh-7rem))] w-[360px] max-w-[calc(100vw-2rem)] sm:bottom-24 sm:left-6 flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
          >
            <div className="navy-stage flex items-center gap-3 px-5 py-4 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold-soft">
                ✦
              </span>
              <div>
                <div className="text-sm font-extrabold">مشاور آکادمی</div>
                <div className="text-[11px] text-white/60">نیازسنجی و معرفی دوره</div>
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
                  {message.links && message.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
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
                aria-label="پیام شما"
                placeholder={name ? 'پیام خود را بنویسید…' : 'نام و نام خانوادگی…'}
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
