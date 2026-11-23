/**
 * A course's short description.
 *
 * Written as lines — a bold opening line, then the rest, one per line:
 *
 *   مدیریت اجرایی فروشگاه:
 *   نظم عملیاتی، مدیریت تیم،
 *   …
 *
 * A description with no line breaks is an ordinary paragraph, so courses that
 * still carry one sentence are unaffected.
 */
export function CourseBlurb({ text, className }: { text: string; className?: string }) {
  const [first, ...rest] = text.split('\n');

  if (rest.length === 0) return <p className={className}>{text}</p>;

  return (
    <div className={className}>
      <p className="font-bold text-ink">{first}</p>
      {rest.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}
