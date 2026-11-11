/** Shared form furniture for the panel, so every screen looks the same. */

export const fieldBox =
  'mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm leading-7 outline-none transition-colors focus:border-brand-400';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-ink">{label}</span>
      {hint && <span className="mr-2 text-xs font-normal text-ink-mute">{hint}</span>}
      {children}
    </label>
  );
}

export function PageTitle({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">{title}</h1>
      {lead && <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">{lead}</p>}
    </div>
  );
}
