'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Scroll-into-view entrance used across every page. Fades only when the viewer prefers reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200 }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36, rotateX: 8 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
