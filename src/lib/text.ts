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
