export type Stat = { value: string; label: string };

export const site = {
  brand: 'آکادمی ریتیل ایران',
  brandEn: 'Iran Retail Academy',
  tagline: 'مرجع آموزش تخصصی خرده‌فروشی — برای فروشگاه‌داران مستقل و برندهای زنجیره‌ای، با رویکردی عملی و آکادمیک.',
  phone: '021-00000000',
  mobile: '0912-0000000',
  email: 'info@iranretailacademy.com',
  instagram: '@iranretailacademy',
  address: 'تهران — نشانی دقیق دفتر آکادمی پس از نهایی‌شدن در همین بخش درج می‌شود.',
  stats: [
    {
      value: '۱۲',
      label: 'دوره‌ی تخصصی'
    },
    {
      value: '۲۱۰+',
      label: 'ساعت آموزش عملی'
    },
    {
      value: '۲',
      label: 'مسیر: فروشگاه و سازمان'
    },
    {
      value: '۱۰۰٪',
      label: 'پروژه‌محور و کاربردی'
    }
  ]
} as const;

export const stats: readonly Stat[] = site.stats;
