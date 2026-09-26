export type HeroVisual = 'scene3d' | 'image' | 'chat-demo';

export type HeroSlide = {
  id: string;
  enabled: boolean;
  eyebrow: string;
  /** Text wrapped in *asterisks* renders as the gold highlight. */
  title: string;
  lead: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  visual: HeroVisual;
  image: string;
  imageBadge?: string;
};

export const hero = {
  autoplayMs: 7000,
  slides: [
    {
      id: 'brand',
      enabled: true,
      eyebrow: 'آکادمی ریتیل ایران — مرجع آموزش تخصصی ریتیل',
      title: 'فروشگاه شما، یک *مدرسه‌ی فروش* کم دارد',
      lead: 'دوره‌های تخصصی فروش، مدیریت فروشگاه و تجربه‌ی مشتری — با رویکردی عملی و آکادمیک، برای فروشگاه‌داران مستقل و برندهای زنجیره‌ای.',
      primary: {
        href: '/programs/',
        label: 'مشاهده‌ی دوره‌ها'
      },
      secondary: {
        href: '/about/',
        label: 'معرفی آکادمی'
      },
      visual: 'scene3d',
      image: ''
    },
    {
      id: 'corporate',
      enabled: true,
      eyebrow: 'خدمات سازمانی — Custom-Made',
      title: 'برای زنجیره‌ها، یک *دانشگاه داخلی* بسازید',
      lead: 'نیازسنجی اختصاصی، محتوای سفارشی، برگزاری در محل شعب و گزارش اثربخشی با شاخص‌های قبل و بعد — از فروشنده‌ی تازه‌کار تا مدیر منطقه.',
      primary: {
        href: '/corporate/',
        label: 'خدمات سازمانی'
      },
      secondary: {
        href: '/corporate/#request',
        label: 'درخواست جلسه‌ی نیازسنجی'
      },
      visual: 'image',
      image: '/media/academy.jpg',
      imageBadge: 'گزارش اثربخشی\\nقبل و بعد از آموزش'
    },
    {
      id: 'advisor',
      enabled: true,
      eyebrow: 'مشاور هوشمند آکادمی',
      title: 'نمی‌دانید از کدام دوره *شروع کنید؟*',
      lead: 'مشاور هوشمند آکادمی چند سؤال کوتاه می‌پرسد، وضعیت فروشگاه‌تان را می‌سنجد و مناسب‌ترین مسیر آموزشی را پیشنهاد می‌دهد — همین حالا، رایگان.',
      primary: {
        href: '/contact/',
        label: 'درخواست مشاوره‌ی انسانی'
      },
      secondary: {
        href: '/programs/',
        label: 'مرور همه‌ی برنامه‌ها'
      },
      visual: 'chat-demo',
      image: ''
    }
  ]
} as const;

export const heroSlides = hero.slides.filter((s) => s.enabled) as unknown as HeroSlide[];
export const heroAutoplayMs = hero.autoplayMs;
