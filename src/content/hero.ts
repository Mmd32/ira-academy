export type HeroVisual = 'scene3d' | 'image' | 'chat-demo';

export type HeroSlide = {
  id: string;
  enabled: boolean;
  eyebrow: string;
  /**
   * Text wrapped in *asterisks* renders as the gold highlight; a newline
   * forces a line break, so a title can be set line by line instead of
   * wrapping wherever the column happens to end.
   */
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
      eyebrow: 'آکادمی ریتیل ایران، مرجع آموزش‌های تخصصی صنعت فروشگاه‌داری',
      title: 'برای صنعت فروشگاه‌داری،\nدانش تخصصی یک انتخاب نیست.\n*یک ضرورت است!*',
      lead: 'آکادمی ریتیل ایران، مرجع توسعه دانش و مهارت‌های فروشگاه‌داری',
      primary: {
        href: '/programs/',
        label: 'مشاهده'
      },
      secondary: {
        href: '/about/',
        label: 'معرفی'
      },
      visual: 'scene3d',
      image: ''
    },
    {
      id: 'corporate',
      enabled: false,
      eyebrow: 'خدمات سازمانی — ویژه‌سازی‌شده',
      title: 'برای زنجیره‌ها، یک *دانشگاه داخلی* بسازید',
      lead: 'نیازسنجی اختصاصی، محتوای سفارشی، برگزاری در محل شعب و گزارش اثربخشی با شاخص‌های قبل و بعد — از فروشنده‌ی تازه‌کار تا مدیر منطقه.',
      primary: {
        href: '/corporate/',
        label: 'خدمات سازمانی'
      },
      secondary: {
        href: '/corporate/#request',
        label: 'درخواست جلسه نیازسنجی'
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
      lead: 'مشاور هوشمند آکادمی از شما چند سؤال کوتاه می‌پرسد و با توجه به شرایط فروشگاه‌ها و وضعیت کسب‌وکارتان، مناسب‌ترین مسیر آموزشی را به شما پیشنهاد می‌دهد.',
      primary: {
        href: '/contact/',
        label: 'مشاوره'
      },
      secondary: {
        href: '/programs/',
        label: 'مرور همه برنامه‌ها'
      },
      visual: 'chat-demo',
      image: ''
    }
  ]
} as const;

export const heroSlides = hero.slides.filter((s) => s.enabled) as unknown as HeroSlide[];
export const heroAutoplayMs = hero.autoplayMs;
