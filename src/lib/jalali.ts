/**
 * Jalali (Persian) calendar arithmetic, after the well-known jalaali-js
 * algorithm. Dates are plain {y, m, d} triples; the panel stores Gregorian
 * ISO strings, so these only convert on the way in and out of a form.
 */

const BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

export type YMD = { y: number; m: number; d: number };

function div(a: number, b: number) {
  return Math.trunc(a / b);
}

function jalCal(jy: number) {
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;
  for (let i = 1; i < BREAKS.length; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) {
      let n = jy - jp;
      leapJ += div(n, 33) * 8 + div((n % 33) + 3, 4);
      if (jump % 33 === 4 && jump - n === 4) leapJ += 1;
      const gy = jy + 621;
      const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
      const march = 20 + leapJ - leapG;
      if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
      let leap = ((((n + 1) % 33) - 1) % 4 + 4) % 4;
      if ((((n + 1) % 33) - 1) % 4 === -1) leap = -1;
      if (leap === -1) leap = 4;
      return { leap, gy, march };
    }
    leapJ += div(jump, 33) * 8 + div(jump % 33, 4);
    jp = jm;
  }
  throw new Error('Invalid Jalali year');
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * ((gm + 9) % 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): YMD {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(j % 1461, 4) * 5 + 308;
  const d = div(i % 153, 5) + 1;
  const m = (div(i, 153) % 12) + 1;
  const y = div(j, 1461) - 100100 + div(8 - m, 6);
  return { y, m, d };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): YMD {
  const gy = d2g(jdn).y;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) return { y: jy, m: 1 + div(k, 31), d: (k % 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { y: jy, m: 7 + div(k, 30), d: (k % 30) + 1 };
}

export function toJalali(gy: number, gm: number, gd: number): YMD {
  return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number): YMD {
  return d2g(j2d(jy, jm, jd));
}

export function isJalaliLeap(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeap(jy) ? 30 : 29;
}

export const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
