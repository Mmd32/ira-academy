export type Stat = { value: string; label: string };

export const site = {
  brand: 'آکادمی ریتیل ایران',
  brandEn: 'Iran Retail Academy',
  tagline: 'مرجع آموزش تخصصی ریتیل — برای فروشگاه‌داران مستقل و برندهای زنجیره‌ای، با رویکردی عملی و آکادمیک.',
  phone: '02128429966',
  /** Second line of the same office. */
  phone2: '02128429965',
  mobile: '0912-0000000',
  email: 'info@academyretailiran.com',
  instagram: '@academyretailiran',
  /** Full profile URL. Empty hides the icon. */
  linkedin: 'https://www.linkedin.com/company/iran-retail-academy/',
  address: 'تهران، خیابان ولیعصر، بالاتر از چهارراه پارک وی، شماره ۲۷۸۸، طبقه ۷',
  /** Shown under the logo in the footer. */
  footerText:
    'مرجع آموزش‌های تخصصی صنعت ریتیل.\nنقطه تلاقی دانش آکادمیک، تجربیات عملی و شبکه‌سازی مؤثر.',
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
