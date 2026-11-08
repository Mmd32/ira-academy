import { getSite, getVisibleCourses } from './content';
import { createLead } from './leads';

/**
 * The site's advisor. Deliberately plain: it matches words in the visitor's
 * message against the course catalogue and a few common questions, answers
 * from what the panel holds, and when it cannot help it asks for a phone
 * number so a person can. There is no model behind it, so it costs nothing,
 * never invents a price, and gives the same answer to the same question.
 */

export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatLink = { label: string; href: string };
export type ChatReply = { reply: string; links?: ChatLink[]; leadSaved?: boolean };

const DIGITS: Record<string, string> = {};
'۰۱۲۳۴۵۶۷۸۹'.split('').forEach((d, i) => (DIGITS[d] = String(i)));
'٠١٢٣٤٥٦٧٨٩'.split('').forEach((d, i) => (DIGITS[d] = String(i)));

/** One spelling per word: Arabic letters, half-spaces, digits, case. */
export function normalize(text: string): string {
  return text
    .replace(/[۰-۹٠-٩]/g, (d) => DIGITS[d] ?? d)
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[‌‏‎]/g, ' ')
    .replace(/[ً-ٰٟ]/g, '')
    .toLowerCase();
}

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

/** Words a visitor uses that the catalogue spells another way. */
const SYNONYMS: Record<string, string[]> = {
  ویترین: ['ویژوال', 'مرچندایزینگ'],
  چیدمان: ['ویژوال', 'مرچندایزینگ'],
  دکور: ['ویژوال'],
  قفسه: ['ویژوال', 'مرچندایزینگ'],
  کافه: ['کافه', 'رستوران'],
  رستوران: ['کافه', 'رستوران'],
  قهوه: ['کافه'],
  فرنچایز: ['فرنچایز', 'امتیاز'],
  نمایندگی: ['فرنچایز'],
  مدیریت: ['مدیریت', 'مدیر'],
  مدیر: ['مدیریت', 'مدیر'],
  فروشنده: ['فروش'],
  فروش: ['فروش'],
  مشتری: ['مشتری', 'تجربه'],
  پوشاک: ['فروشگاه', 'فروش'],
  سوپرمارکت: ['فروشگاه', 'مدیریت'],
  مغازه: ['فروشگاه'],
};

const STOP = new Set(['و', 'در', 'به', 'از', 'برای', 'با', 'که', 'را', 'این', 'یک', 'من', 'می', 'خواهم', 'میخوام', 'دوره', 'آموزش']);

function tokens(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9\u0600-\u06ff]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function matchCourses(message: string) {
  const wanted = new Set<string>();
  for (const t of tokens(message)) {
    wanted.add(t);
    for (const extra of SYNONYMS[t] ?? []) wanted.add(extra);
  }
  if (wanted.size === 0) return [];

  return getVisibleCourses()
    .map((course) => {
      const hay = normalize(`${course.title} ${course.blurb} ${course.audience}`);
      let score = 0;
      wanted.forEach((w) => {
        if (hay.includes(w)) score += normalize(course.title).includes(w) ? 3 : 1;
      });
      return { course, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((m) => m.course);
}

const PHONE = /(?:\+?98|0)?9\d{9}/;

function findPhone(text: string): string | null {
  const m = normalize(text).replace(/[\s\-().]/g, '').match(PHONE);
  if (!m) return null;
  const digits = m[0].replace(/^\+?98/, '').replace(/^0/, '');
  return `0${digits}`;
}

function callMe(site: Record<string, string>): string {
  const phone = String(site.phone ?? '').trim();
  return phone
    ? `اگر ترجیح می‌دهید، با ${phone} هم تماس بگیرید.`
    : 'می‌توانید از بخش تماس هم پیام بگذارید.';
}

export function answer(messages: ChatMessage[]): ChatReply {
  const site = getSite() as Record<string, string>;
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const raw = (lastUser?.content ?? '').slice(0, 500);
  const text = normalize(raw);

  /* A phone number is a request to be called, whatever else was said. */
  const phone = findPhone(raw);
  if (phone) {
    const transcript = messages
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'کاربر' : 'مشاور'}: ${m.content}`)
      .join('\n')
      .slice(0, 900);
    const earlierName = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content.trim())
      .find((c) => /^[^\d]{3,40}$/.test(c) && c.split(/\s+/).length <= 4);
    createLead({
      type: 'مشاور سایت',
      name: earlierName || 'ثبت‌شده از گفت‌وگوی سایت',
      phone,
      note: transcript,
    });
    return {
      reply: 'شماره‌تان ثبت شد. کارشناس آموزشی حداکثر تا یک روز کاری با شما تماس می‌گیرد. سؤال دیگری دارید؟',
      leadSaved: true,
    };
  }

  if (!text.trim() || has(text, ['سلام', 'درود', 'وقت بخیر']) && text.trim().split(/\s+/).length <= 3) {
    return {
      reply: 'سلام! بگویید چه فروشگاه یا کسب‌وکاری دارید و دنبال چه مهارتی هستید (مثلاً فروش، مدیریت فروشگاه، چیدمان)، تا دوره‌ی مناسب را معرفی کنم.',
    };
  }

  if (has(text, ['قیمت', 'هزینه', 'شهریه', 'تعرفه', 'چنده', 'چقدر', 'تخفیف'])) {
    return {
      reply: `شهریه به دوره و شیوه‌ی برگزاری بستگی دارد و کارشناس آن را دقیق اعلام می‌کند. شماره‌ی موبایل‌تان را همین‌جا بنویسید تا تماس بگیرند. ${callMe(site)}`,
      links: [{ label: 'ثبت‌نام و دریافت مشاوره', href: '/register/' }],
    };
  }

  if (has(text, ['مدرک', 'گواهی', 'گواهینامه'])) {
    return {
      reply: 'برای مدرک و اعتبار آن، شرایط هر دوره را کارشناس توضیح می‌دهد. نام دوره‌ی مورد نظرتان را بنویسید یا شماره‌تان را بفرستید.',
      links: [{ label: 'برنامه‌های آموزشی', href: '/programs/' }],
    };
  }

  if (has(text, ['سازمان', 'شرکت', 'تیم', 'کارکنان', 'پرسنل', 'برند', 'زنجیره', 'سفارشی'])) {
    return {
      reply: 'برای سازمان‌ها دوره‌ی اختصاصی و آزمون و ارزیابی نیروها داریم. اطلاعات مجموعه‌تان را بفرستید تا پیشنهاد آماده شود.',
      links: [{ label: 'خدمات سازمانی', href: '/corporate/' }],
    };
  }

  if (has(text, ['حضوری', 'آنلاین', 'مجازی', 'کجا', 'آدرس', 'نشانی', 'تلفن', 'تماس'])) {
    const address = String(site.address ?? '').trim();
    return {
      reply: `${address ? `نشانی: ${address}. ` : ''}${callMe(site)}`,
      links: [{ label: 'تماس با آکادمی', href: '/contact/' }],
    };
  }

  if (has(text, ['زمان', 'تاریخ', 'کی شروع', 'کی برگزار', 'ساعت', 'ترم', 'شروع'])) {
    return {
      reply: 'زمان شروع دوره‌ها برای هر ترم جداگانه اعلام می‌شود. با ثبت‌نام، اولین تاریخ برگزاری را کارشناس به شما می‌گوید.',
      links: [{ label: 'ثبت‌نام', href: '/register/' }],
    };
  }

  const matches = matchCourses(raw);
  if (matches.length > 0) {
    return {
      reply:
        matches.length === 1
          ? `برای نیاز شما «${matches[0].title}» مناسب است. ${matches[0].blurb}`
          : `این دوره‌ها به نیاز شما نزدیک‌ترند: «${matches[0].title}» و «${matches[1].title}». برای جزئیات هر کدام روی لینکش بزنید، یا شماره‌تان را بفرستید تا کارشناس راهنمایی کند.`,
      links: matches.map((c) => ({ label: c.title, href: `/register/?course=${c.id}` })),
    };
  }

  if (has(text, ['ثبت نام', 'ثبتنام', 'شرکت در دوره'])) {
    return {
      reply: 'برای ثبت‌نام فرم را پر کنید؛ کارشناس تماس می‌گیرد و مراحل را توضیح می‌دهد.',
      links: [{ label: 'فرم ثبت‌نام', href: '/register/' }],
    };
  }

  return {
    reply: `مطمئن نیستم درست متوجه شدم. نوع کسب‌وکارتان یا مهارتی که می‌خواهید را کوتاه بنویسید، یا شماره‌ی موبایل‌تان را بفرستید تا کارشناس تماس بگیرد. ${callMe(site)}`,
    links: [{ label: 'برنامه‌های آموزشی', href: '/programs/' }],
  };
}
