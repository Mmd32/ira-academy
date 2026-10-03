import Link from 'next/link';
import { site } from '@/content/site';

const columns = [
  {
    title: 'آکادمی',
    links: [
      { href: '/about/', label: 'معرفی' },
      { href: '/programs/', label: 'برنامه‌های آموزشی' },
      { href: '/corporate/', label: 'خدمات سازمانی' },
      { href: '/community/', label: 'جامعه حرفه‌ای ARI' },
    ],
  },
  {
    title: 'منابع',
    links: [
      { href: '/knowledge/#articles', label: 'مقالات' },
      { href: '/knowledge/#glossary', label: 'لغت‌نامه ریتیل' },
      { href: '/knowledge/#articles', label: 'موردکاوی‌های کاربردی' },
      { href: '/portal/', label: 'درگاه' },
    ],
  },
  {
    title: 'ارتباط',
    links: [
      { href: '/contact/', label: 'تماس با آکادمی' },
      { href: '/contact/#teach', label: 'مدرس شوید' },
      { href: '/contact/#partner', label: 'مشارکت و همکاری' },
      { href: '/register/', label: 'ثبت‌نام' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false });

  return (
    <footer className="bg-[#0A1128] text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/logo-mark.png"
                alt={site.brand}
                className="h-full w-full object-contain brightness-0 invert"
              />
            </span>
            <span className="text-sm font-extrabold">{site.brand}</span>
          </div>
          <p className="mt-4 max-w-xs text-xs leading-6 text-white/50">{site.footerText}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <div className="eyebrow-light">{column.title}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 transition-colors hover:text-gold-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {year} {site.brand} — همه‌ی حقوق محفوظ است.
      </div>
    </footer>
  );
}
