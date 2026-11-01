'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/** The navy masthead every inner page opens with. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="navy-stage relative overflow-hidden text-white">
      <div className="navy-grid absolute inset-0" aria-hidden />
      <div className="container-x relative pb-14 pt-[calc(var(--nav-h)+3.5rem)]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow-light flex items-center gap-3"
        >
          <Link href="/" className="text-white/50 transition-colors hover:text-gold-soft">
            خانه
          </Link>
          <span className="h-px w-8 bg-gold/50" />
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-balance text-3xl text-white sm:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-2xl leading-9 text-white/65"
          >
            {/* A newline in the text is a deliberate line break. */}
            {lead.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.p>
        )}
      </div>
    </header>
  );
}

/** Inline "coming soon" chip used next to headings for unfinished areas. */
export function ComingSoon() {
  return (
    <span className="mr-2 inline-block rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 align-middle text-[10px] font-bold text-gold">
      به‌زودی
    </span>
  );
}
