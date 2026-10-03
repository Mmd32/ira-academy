/** How a programme is delivered — the top-level grouping on /programs. */
export type CourseModel = 'standard' | 'organization' | 'institute' | 'university';

export type ProgramModel = { id: CourseModel; title: string; desc: string };

export type Course = {
  id: string;
  title: string;
  blurb: string;
  audience: string;
  sessions: number;
  hours: number;
  model: CourseModel;
  /** Hidden from the site when false; the entry is kept so it can return. */
  enabled?: boolean;
  /** Lower sorts first on /programs. */
  order?: number;
};

export type Workshop = { id: string; title: string; blurb: string; duration: string };
export type Seminar = { id: string; title: string; blurb: string; type: string };

/**
 * PLACEHOLDER COPY — the four delivery models are confirmed, but their
 * descriptions still need the academy's own wording.
 */
export const programModels = [
  {
    id: 'standard',
    title: 'استاندارد',
    desc: 'دوره‌های عمومی آکادمی با سرفصل ثابت و ثبت‌نام آزاد.'
  },
  {
    id: 'organization',
    title: 'سازمانی — Custom-Made',
    desc: 'این دوره‌ها بر اساس نیاز برندها شخصی‌سازی و در محل آن سازمان برگزار می‌شود.'
  },
  {
    id: 'institute',
    title: 'همکاری با انستیتوها',
    desc: 'دوره‌های مشترک با انستیتوها و مراکز آموزشی تخصصی.'
  },
  {
    id: 'university',
    title: 'همکاری با دانشگاه‌ها',
    desc: 'دوره‌های مشترک با دانشگاه‌ها و مراکز آموزش عالی.'
  }
] as const satisfies readonly ProgramModel[];

export const courses = [
  {
    id: 'pro-selling',
    title: 'اصول فروش حضوری حرفه‌ای',
    blurb: 'از سلام اول تا بستن فروش — مهارت‌های گفت‌وگو، شناخت نیاز مشتری و تکنیک‌های فروش اخلاق‌محور.',
    audience: 'فروشندگان',
    sessions: 6,
    hours: 18,
    model: 'standard',
    enabled: false
  },
  {
    id: 'visual-merchandising',
    title: 'ویزوال مرچندایزینگ و چیدمان فروشگاه',
    blurb: 'طراحی مسیر حرکت مشتری، ویترین، نورپردازی و چیدمان قفسه — فروشگاه به‌مثابه ابزار فروش خاموش.',
    audience: 'مدیران فروشگاه',
    sessions: 5,
    hours: 15,
    model: 'standard',
    order: 3
  },
  {
    id: 'store-management-1',
    title: 'مبانی مدیریت فروشگاه (سطح پایه)',
    blurb: 'مدیریت اجرایی فروشگاه: نظم عملیاتی، تحویل شیفت، تیم، تجربه‌ی مشتری، موجودی و کنترل‌های مالی — با ۱۱ ابزار کاربردی.',
    audience: 'مدیران و سرپرستان',
    sessions: 9,
    hours: 22,
    model: 'standard',
    order: 1
  },
  {
    id: 'store-management-2',
    title: 'مدیریت حرفه‌ای فروشگاه (سطح پیشرفته)',
    blurb: 'فراتر از اجرا: تحلیل KPIها، تصمیم‌گیری در بحران، رهبری تیم، سودآوری و طراحی فروشگاه مقیاس‌پذیر + پروژه‌ی پایانی.',
    audience: 'دانش‌آموختگان سطح پایه',
    sessions: 9,
    hours: 30,
    model: 'standard',
    order: 2
  },
  {
    id: 'customer-experience',
    title: 'تجربه و خدمات مشتری',
    blurb: 'استانداردهای خدمت، مدیریت شکایت، وفادارسازی و باشگاه مشتریان — تجربه‌ای که مشتری را برمی‌گرداند.',
    audience: 'فروشندگان',
    sessions: 4,
    hours: 12,
    model: 'standard',
    enabled: false
  },
  {
    id: 'pricing-promotion',
    title: 'قیمت‌گذاری، تخفیف و پروموشن',
    blurb: 'منطق قیمت‌گذاری در بازار ایران و طراحی کمپین تخفیف بدون نابودی حاشیه‌ی سود.',
    audience: 'مالکان و برندها',
    sessions: 4,
    hours: 12,
    model: 'standard',
    enabled: false
  },
  {
    id: 'inventory',
    title: 'مدیریت موجودی و انبار',
    blurb: 'پیش‌بینی تقاضا، نقطه‌ی سفارش، کنترل کسری و ضایعات — پول خوابیده در قفسه‌ها را بیدار کنید.',
    audience: 'مدیران فروشگاه',
    sessions: 5,
    hours: 15,
    model: 'standard',
    enabled: false
  },
  {
    id: 'online-retail',
    title: 'فروش آنلاین و اینستاگرام برای فروشگاه‌ها',
    blurb: 'از ویترین دیجیتال تا ارسال — اتصال فروش اینستاگرامی به فروشگاه فیزیکی، مخصوص بازار ایران.',
    audience: 'مالکان و برندها',
    sessions: 6,
    hours: 18,
    model: 'standard',
    enabled: false
  },
  {
    id: 'team-leadership',
    title: 'رهبری تیم فروش',
    blurb: 'جذب و آموزش فروشنده، انگیزش تیم، هدف‌گذاری و فرهنگ فروشگاه — برای کسانی که تیم می‌سازند.',
    audience: 'مالکان و برندها',
    sessions: 6,
    hours: 18,
    model: 'standard',
    enabled: false
  },
  {
    id: 'fnb-cafe-management',
    title: 'مبانی مدیریت عملیات رستوران و کافی‌شاپ',
    blurb: 'منوی مهندسی‌شده، مدیریت پرایم‌کاست، گردش انبار و استاندارد سرویس برای کافه و رستوران.',
    audience: 'مالکان و مدیران F&B',
    sessions: 14,
    hours: 32,
    model: 'standard',
    order: 4
  },
  {
    id: 'fnb-service',
    title: 'استاندارد سرویس و مهمان‌نوازی',
    blurb: 'طراحی تجربه‌ی مهمان از ورود تا خروج؛ آموزش تیم سالن برای سرویس منظم و قابل‌تکرار.',
    audience: 'پرسنل و سرپرستان سالن',
    sessions: 4,
    hours: 12,
    model: 'standard',
    enabled: false
  },
  {
    id: 'franchise',
    title: 'فرنچایز و توسعه‌ی شعب',
    blurb: 'از استانداردسازی عملیات تا قرارداد فرنچایز — مسیر تبدیل یک فروشگاه موفق به زنجیره.',
    audience: 'مالکان و برندها',
    sessions: 4,
    hours: 8,
    model: 'standard',
    order: 5
  }
] as const satisfies readonly Course[];

export type Partner = { name: string; logo: string };

export type FeaturedCourse = {
  id: string;
  /** Small label above the title, e.g. the co-branding line. */
  eyebrow: string;
  title: string;
  blurb: string;
  audience: string;
  sessions: number;
  hours: number;
  model: CourseModel;
  /** Co-branded logos shown as a lockup; the academy's own mark is added first. */
  partners: readonly Partner[];
  highlights: readonly string[];
};

/**
 * PLACEHOLDER DATA — the course is confirmed (ARI × Bake Academy) but every
 * field below is sample copy waiting on the real course sheet.
 */
export const featuredCourse = {
  id: 'restaurant-cafe-management',
  eyebrow: 'در حال ثبت‌نام',
  title: 'مبانی مدیریت عملیات رستوران و کافی‌شاپ',
  blurb:
    'این دوره بر مدیریت اجرایی شعب رستوران‌ها و کافی‌شاپ‌ها و بهینه‌سازی ساختار عملیاتی آن‌ها تمرکز داشته و شرکت‌کنندگان را قادر می‌سازد تا عملیات روزانه شعبه تحت مدیریت خود را منظم، پایدار و تحت کنترل اداره کنند و از طریق بهبود هماهنگی تیم و اجرای صحیح فرآیندها، کیفیت سرویس، تجربه مشتری و بهره‌وری کلی واحد تجاری را ارتقا دهند.',
  audience: 'مالکان و مدیران رستوران و کافی‌شاپ',
  sessions: 14,
  hours: 32,
  model: 'institute',
  partners: [{ name: 'Bake Academy', logo: '/media/bake-academy.png' }],
  highlights: [
    'کانسپت‌های مختلف F&B',
    'مدیریت عملیات روزانه و افزایش نظم عملیاتی',
    'مدیریت تیم و ارتقای عملکرد پرسنل',
    'تعریف شاخص‌های کلیدی عملکرد (KPI)'
  ]
} as const satisfies FeaturedCourse;

/** Visible courses, in the order the page should show them. */
export const visibleCourses: readonly Course[] = (courses as readonly Course[])
  .filter((c) => c.enabled !== false)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

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
    title: 'سمینار روندهای ریتیل ۱۴۰۵',
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
