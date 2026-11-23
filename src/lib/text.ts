const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;

/** Converts ASCII digits in a value to Persian digits. */
export function fa(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export type TitlePart = { text: string; gold: boolean };

/**
 * Splits a headline on *asterisks*; the wrapped segments render in gold.
 * "فروشگاه شما، یک *مدرسه‌ی فروش* کم دارد" -> 3 parts, the middle one gold.
 */
export function splitTitle(title: string): TitlePart[] {
  return title
    .split(/\*(.*?)\*/g)
    .map((text, i) => ({ text, gold: i % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}

/**
 * Two landlines written the way people read them aloud: the first number in
 * groups, the second reduced to what differs.
 *
 *   ('02128429966', '02128429965')  →  «۰۲۱ ۲۸۴۲ ۹۹۶۶ و ۵»
 *
 * When the lines do not share everything but the last digit, the second is
 * written out in full instead, so nothing is ever abbreviated into ambiguity.
 */
export function formatLandlines(first: string, second?: string): string {
  const group = (n: string) => {
    const d = n.replace(/\D/g, '');
    return d.length === 11 && d.startsWith('021')
      ? `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}`
      : n.trim();
  };

  const a = first.replace(/\D/g, '');
  const b = (second ?? '').replace(/\D/g, '');
  if (!a) return '';
  if (!b) return fa(group(first));

  const sameButLast = a.length === b.length && a.slice(0, -1) === b.slice(0, -1);
  return fa(`${group(first)} و ${sameButLast ? b.slice(-1) : group(second ?? '')}`);
}

/** "02128429966" → "۰۲۱ ۲۸۴۲ ۹۹۶۶": a Tehran landline in groups, digits in Persian. */
export function groupLandline(number: string): string {
  const d = number.replace(/\D/g, '');
  return fa(d.length === 11 && d.startsWith('021') ? `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}` : number.trim());
}

/** "02128429966" → "+982128429966", the form a phone's dialler wants. */
export function telHref(number: string): string {
  const d = number.replace(/\D/g, '');
  return d ? `tel:+98${d.replace(/^0/, '')}` : '';
}
