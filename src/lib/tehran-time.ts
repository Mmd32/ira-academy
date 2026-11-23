/**
 * Iran has no daylight saving since 2022, so Tehran is a fixed UTC+03:30.
 * The panel's date fields are browser datetime-local values ("2026-11-08T10:00")
 * with no zone; the server may run in UTC, so the zone is applied here rather
 * than trusted to the machine.
 */
const OFFSET_MIN = 3 * 60 + 30;

/** "2026-11-08T10:00" typed in Tehran time -> ISO instant, or null when empty or invalid. */
export function fromTehranInput(value: string | null | undefined): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec((value ?? '').trim());
  if (!m) return null;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const ms = Date.UTC(y, mo - 1, d, h, mi) - OFFSET_MIN * 60_000;
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

/** ISO instant -> the datetime-local value that shows it in Tehran time. */
export function toTehranInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  return new Date(t + OFFSET_MIN * 60_000).toISOString().slice(0, 16);
}

/** Jalali date and time in Tehran, for people. */
export function formatFa(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('fa-IR', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Same, as plain Latin digits for the Excel sheets, e.g. "1405/08/17 10:00". */
export function formatJalaliPlain(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}/${get('month')}/${get('day')} ${get('hour')}:${get('minute')}`;
}
