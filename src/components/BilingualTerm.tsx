/**
 * A Persian term with its English equivalent, set on two lines.
 *
 * Written inline — «نقشه مسیر خرید مشتری (Customer Journey Map)» — the Latin
 * half is a left-to-right island inside right-to-left text. When the line
 * wraps, the two halves land on different lines in an order that reads wrong:
 * the English can end up above the Persian it belongs to. Putting the English
 * on its own line below removes the wrap point entirely, and reads the way a
 * glossary entry is meant to.
 *
 * A term with no Latin part renders as a single line, so this is safe to use
 * on any list where only some entries carry one.
 */

/** Matches a trailing «(English)» or «— English» on an otherwise Persian term. */
const TRAILING_LATIN = /^(.*?)[\s]*(?:\(([^()]*[A-Za-z][^()]*)\)|—\s*([A-Za-z][^—]*))\s*$/;

export function splitTerm(term: string): { fa: string; en: string | null } {
  const match = term.match(TRAILING_LATIN);
  if (!match) return { fa: term.trim(), en: null };

  const fa = match[1].trim();
  const en = (match[2] ?? match[3] ?? '').trim();

  // Only split when there is a Persian half to keep above it.
  if (!fa || !/[؀-ۿ]/.test(fa)) return { fa: term.trim(), en: null };
  return { fa, en };
}

export function BilingualTerm({
  term,
  className,
  latinClassName = 'mt-0.5 block text-xs font-normal text-ink-mute',
}: {
  term: string;
  className?: string;
  latinClassName?: string;
}) {
  const { fa, en } = splitTerm(term);

  return (
    <span className={className}>
      {fa}
      {en && (
        <span className={latinClassName} dir="ltr" style={{ unicodeBidi: 'isolate' }}>
          {en}
        </span>
      )}
    </span>
  );
}
