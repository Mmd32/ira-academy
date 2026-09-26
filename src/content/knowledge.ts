export type NewsItem = { id: string; title: string; scope: string; date: string };
export type Article = { id: string; title: string; kind: string; excerpt: string };
export type MediaItem = { id: string; title: string; kind: string; length: string };
export type Toolkit = { id: string; title: string; items: readonly string[] };
export type GlossaryEntry = { term: string; def: string };

export const news = [
  {
    id: 'n1',
    title: 'رشد سهم فروشگاه‌های زنجیره‌ای از ریتیل ایران',
    scope: 'ایران',
    date: 'این هفته'
  },
  {
    id: 'n2',
    title: 'فروشگاه‌های بدون صندوق‌دار؛ تجربه‌ی تازه‌ی ریتیل جهانی',
    scope: 'جهان',
    date: 'این هفته'
  },
  {
    id: 'n3',
    title: 'موج جدید برندهای ایرانی در فرنچایز F&B',
    scope: 'ایران',
    date: 'ماه جاری'
  }
] as const satisfies readonly NewsItem[];

export const articles = [
  {
    id: 'a1',
    title: 'چرا مشتری وارد فروشگاه می‌شود ولی نمی‌خرد؟',
    kind: 'مقاله',
    excerpt: 'پنج گلوگاه رایج مسیر مشتری در فروشگاه‌های ایرانی — از ویترین تا صندوق — و راه‌حل هر کدام.'
  },
  {
    id: 'a2',
    title: 'مورد کاوی: بازطراحی چیدمان یک سوپرمارکت محلی',
    kind: 'مورد کاوی',
    excerpt: 'چطور جابه‌جایی سه قفسه و اصلاح نور، سبد خرید میانگین را ۲۲٪ بالا برد.'
  },
  {
    id: 'a3',
    title: 'گزارش برند: درس‌های توسعه‌ی یک زنجیره‌ی پوشاک ایرانی',
    kind: 'گزارش برند',
    excerpt: 'مرور مسیر رشد، خطاهای توسعه‌ی شتاب‌زده و الگوی موفق شعبه‌داری.'
  }
] as const satisfies readonly Article[];

export const media = [
  {
    id: 'v1',
    title: 'ویدیو: ۷ خطای مرگبار ویترین',
    kind: 'ویدیو',
    length: '۸ دقیقه'
  },
  {
    id: 'p1',
    title: 'پادکست: گفت‌وگو با یک مدیر فروشگاه زنجیره‌ای',
    kind: 'پادکست',
    length: '۳۴ دقیقه'
  },
  {
    id: 'v2',
    title: 'ویدیو: مسیر مشتری در فروشگاه چیست؟',
    kind: 'ویدیو',
    length: '۶ دقیقه'
  }
] as const satisfies readonly MediaItem[];

export const toolkits = [
  {
    id: 'retail',
    title: 'ریتیل',
    items: [
      'نقشه مسیر خرید مشتری (Customer Journey Map)',
      'چک‌لیست تحویل شیفت (Shift Handover Checklist)',
      'بررسی وضعیت موجودی (Stock Health Review)',
      'چک‌لیست کنترل صندوق و مرجوعی (Cash & Refund Controls)'
    ]
  },
  {
    id: 'strategy',
    title: 'استراتژی',
    items: [
      'نقشه بررسی وضعیت فروشگاه (Store Performance Map)',
      'داشبورد شاخص‌ها (KPI Dashboard)',
      'تحلیل ریشه‌ی مشکلات (Root Cause Mapping)',
      'نمای سودآوری فروشگاه (Store Profitability View)'
    ]
  },
  {
    id: 'management',
    title: 'مدیریت',
    items: [
      'برنامه روزانه فروشگاه (Daily Store Rhythm Board)',
      'مدل هماهنگی تیم (Team Alignment Model)',
      'ماتریس تصمیم عملیاتی (Operational Decision Matrix)',
      'حداقل استانداردهای اداره فروشگاه (Minimum Operating Standards)'
    ]
  }
] as const satisfies readonly Toolkit[];

export const glossary = [
  {
    term: 'ویزوال مرچندایزینگ',
    def: 'هنر و علم چیدمان و نمایش کالا برای افزایش فروش.'
  },
  {
    term: 'نرخ تبدیل',
    def: 'نسبت خریداران به کل بازدیدکنندگان فروشگاه.'
  },
  {
    term: 'سبد خرید میانگین',
    def: 'میانگین مبلغ خرید هر مشتری در یک تراکنش.'
  },
  {
    term: 'پلانوگرام',
    def: 'نقشه‌ی دقیق چیدمان کالا روی قفسه.'
  },
  {
    term: 'شرینک (Shrinkage)',
    def: 'کسری موجودی ناشی از سرقت، خطا یا ضایعات.'
  },
  {
    term: 'پرایم‌کاست',
    def: 'مجموع هزینه‌ی مواد و نیروی انسانی در F&B.'
  },
  {
    term: 'فوت‌فال (Footfall)',
    def: 'تعداد ورود مشتری به فروشگاه در یک بازه.'
  },
  {
    term: 'کراس‌مرچندایزینگ',
    def: 'چیدمان کالاهای مکمل کنار هم برای فروش بیشتر.'
  }
] as const satisfies readonly GlossaryEntry[];

/**
 * Listed in the site-map overview table (page 1) but without a detailed
 * breakdown, so they ship as placeholders until the real content arrives.
 */
export const library = {
  title: 'کتابخانه (معرفی کتاب)',
  text: 'این بخش در آینده ایجاد می‌شود — معرفی کتاب‌های تخصصی ریتیل.',
} as const;

export const handoutsArchive = {
  title: 'آرشیو جزوات آکادمی',
  text: 'این بخش در آینده ایجاد می‌شود — آرشیو جزوات دوره‌های آکادمی.',
} as const;
