export type CourseCategory = 'retail' | 'fnb' | 'other';

export type Category = { id: CourseCategory; title: string };

export type Course = {
  id: string;
  title: string;
  blurb: string;
  audience: string;
  sessions: number;
  hours: number;
  category: CourseCategory;
};

export type Workshop = { id: string; title: string; blurb: string; duration: string };
export type Seminar = { id: string; title: string; blurb: string; type: string };

export const categories = [
  {
    id: 'retail',
    title: 'ریتیل و فروشگاه‌داری'
  },
  {
    id: 'fnb',
    title: 'مدیریت کافه و رستوران (F&B)'
  },
  {
    id: 'other',
    title: 'سایر'
  }
] as const satisfies readonly Category[];

export const courses = [
  {
    id: 'pro-selling',
    title: 'اصول فروش حضوری حرفه‌ای',
    blurb: 'از سلام اول تا بستن فروش — مهارت‌های گفت‌وگو، شناخت نیاز مشتری و تکنیک‌های فروش اخلاق‌محور.',
    audience: 'فروشندگان',
    sessions: 6,
    hours: 18,
    category: 'retail'
  },
  {
    id: 'visual-merchandising',
    title: 'ویزوال مرچندایزینگ و چیدمان فروشگاه',
    blurb: 'طراحی مسیر حرکت مشتری، ویترین، نورپردازی و چیدمان قفسه — فروشگاه به‌مثابه ابزار فروش خاموش.',
    audience: 'مدیران فروشگاه',
    sessions: 5,
    hours: 15,
    category: 'retail'
  },
  {
    id: 'store-management-1',
    title: 'مبانی مدیریت فروشگاه (سطح پایه)',
    blurb: 'مدیریت اجرایی فروشگاه: نظم عملیاتی، تحویل شیفت، تیم، تجربه‌ی مشتری، موجودی و کنترل‌های مالی — با ۱۱ ابزار کاربردی.',
    audience: 'مدیران و سرپرستان',
    sessions: 9,
    hours: 22,
    category: 'retail'
  },
  {
    id: 'store-management-2',
    title: 'مدیریت حرفه‌ای فروشگاه (سطح دو)',
    blurb: 'فراتر از اجرا: تحلیل KPIها، تصمیم‌گیری در بحران، رهبری تیم، سودآوری و طراحی فروشگاه مقیاس‌پذیر + پروژه‌ی پایانی.',
    audience: 'دانش‌آموختگان سطح پایه',
    sessions: 9,
    hours: 30,
    category: 'retail'
  },
  {
    id: 'customer-experience',
    title: 'تجربه و خدمات مشتری',
    blurb: 'استانداردهای خدمت، مدیریت شکایت، وفادارسازی و باشگاه مشتریان — تجربه‌ای که مشتری را برمی‌گرداند.',
    audience: 'فروشندگان',
    sessions: 4,
    hours: 12,
    category: 'retail'
  },
  {
    id: 'pricing-promotion',
    title: 'قیمت‌گذاری، تخفیف و پروموشن',
    blurb: 'منطق قیمت‌گذاری در بازار ایران و طراحی کمپین تخفیف بدون نابودی حاشیه‌ی سود.',
    audience: 'مالکان و برندها',
    sessions: 4,
    hours: 12,
    category: 'retail'
  },
  {
    id: 'inventory',
    title: 'مدیریت موجودی و انبار',
    blurb: 'پیش‌بینی تقاضا، نقطه‌ی سفارش، کنترل کسری و ضایعات — پول خوابیده در قفسه‌ها را بیدار کنید.',
    audience: 'مدیران فروشگاه',
    sessions: 5,
    hours: 15,
    category: 'retail'
  },
  {
    id: 'online-retail',
    title: 'فروش آنلاین و اینستاگرام برای فروشگاه‌ها',
    blurb: 'از ویترین دیجیتال تا ارسال — اتصال فروش اینستاگرامی به فروشگاه فیزیکی، مخصوص بازار ایران.',
    audience: 'مالکان و برندها',
    sessions: 6,
    hours: 18,
    category: 'retail'
  },
  {
    id: 'team-leadership',
    title: 'رهبری تیم فروش',
    blurb: 'جذب و آموزش فروشنده، انگیزش تیم، هدف‌گذاری و فرهنگ فروشگاه — برای کسانی که تیم می‌سازند.',
    audience: 'مالکان و برندها',
    sessions: 6,
    hours: 18,
    category: 'retail'
  },
  {
    id: 'fnb-cafe-management',
    title: 'مدیریت کافه و رستوران (F&B)',
    blurb: 'منوی مهندسی‌شده، مدیریت پرایم‌کاست، گردش انبار و استاندارد سرویس برای کافه و رستوران.',
    audience: 'مالکان و مدیران F&B',
    sessions: 8,
    hours: 24,
    category: 'fnb'
  },
  {
    id: 'fnb-service',
    title: 'استاندارد سرویس و مهمان‌نوازی',
    blurb: 'طراحی تجربه‌ی مهمان از ورود تا خروج؛ آموزش تیم سالن برای سرویس منظم و قابل‌تکرار.',
    audience: 'پرسنل و سرپرستان سالن',
    sessions: 4,
    hours: 12,
    category: 'fnb'
  },
  {
    id: 'franchise',
    title: 'فرنچایز و توسعه‌ی شعب',
    blurb: 'از استانداردسازی عملیات تا قرارداد فرنچایز — مسیر تبدیل یک فروشگاه موفق به زنجیره.',
    audience: 'مالکان و برندها',
    sessions: 5,
    hours: 15,
    category: 'other'
  }
] as const satisfies readonly Course[];

export const workshops = [
  {
    id: 'ws-window',
    title: 'کارگاه یک‌روزه‌ی ویترین‌آرایی',
    blurb: 'طراحی و اجرای یک ویترین کامل در یک روز، با نقد گروهی.',
    duration: '۱ روز — ۶ ساعت'
  },
  {
    id: 'ws-negotiation',
    title: 'کارگاه فروش در موقعیت‌های سخت',
    blurb: 'تمرین عملی چانه‌زنی، مشتری ناراضی و اعتراض به قیمت.',
    duration: '۱ روز — ۵ ساعت'
  },
  {
    id: 'ws-instagram',
    title: 'کارگاه تولید محتوای فروشگاهی با موبایل',
    blurb: 'عکاسی از محصول، استوری فروش و تقویم محتوای هفتگی.',
    duration: '۲ روز — ۸ ساعت'
  }
] as const satisfies readonly Workshop[];

export const seminars = [
  {
    id: 'sem-trends',
    title: 'سمینار روندهای خرده‌فروشی ۱۴۰۵',
    blurb: 'تصویری از آینده‌ی نزدیک ریتیل ایران و جهان برای تصمیم‌گیران.',
    type: 'حضوری'
  },
  {
    id: 'web-loyalty',
    title: 'وبینار باشگاه مشتریان برای فروشگاه‌های کوچک',
    blurb: 'راه‌اندازی وفادارسازی بدون نرم‌افزار گران‌قیمت.',
    type: 'وبینار'
  }
] as const satisfies readonly Seminar[];

export const pastEvents = [
  'دوره‌ی جامع فروشندگی حرفه‌ای — پاییز گذشته، ۲۴ دانش‌پذیر',
  'کارگاه چیدمان فروشگاه — با همکاری یک زنجیره‌ی پوشاک، ۱۸ شرکت‌کننده',
  'وبینار قیمت‌گذاری در تورم — ۱۴۰ شرکت‌کننده‌ی آنلاین'
] as const;

/**
 * Listed in the site-map overview table (page 1) but without a detailed
 * breakdown, so it ships as a placeholder until the real calendar arrives.
 */
export const calendar = {
  title: 'تقویم آموزشی فصلی و سالانه',
  text: 'این بخش در آینده ایجاد می‌شود — تقویم آموزشی فصلی و سالانه‌ی آکادمی.',
} as const;
