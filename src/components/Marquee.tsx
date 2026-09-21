import type { ReactNode } from 'react';

/** Infinite RTL ticker: the children are rendered twice so the loop never shows a gap. */
export function Marquee({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`marquee-mask overflow-hidden ${className ?? ''}`}>
      <div
        className="marquee-track flex w-max items-center gap-4"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex items-center gap-4">{children}</div>
        <div className="flex items-center gap-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
