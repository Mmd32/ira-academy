/**
 * Renders a value in exactly the order it was written.
 *
 * A phone number like «۰۲۱ ۲۸۴۲ ۹۹۶۶ و ۵» mixes digits with a Persian word,
 * and bidi reordering then moves the parts around: left-to-right turned the
 * tail into «۵ و», right-to-left reversed the groups entirely. Splitting on
 * spaces and isolating each piece with <bdi> keeps every piece correct inside
 * itself while the pieces stay in the order they were typed.
 */
export function LiteralText({ value, className }: { value: string; className?: string }) {
  const parts = value.split(/\s+/).filter(Boolean);

  return (
    <span className={className} dir="ltr" style={{ unicodeBidi: 'isolate' }}>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <bdi>{part}</bdi>
        </span>
      ))}
    </span>
  );
}
