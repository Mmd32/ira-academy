import Link from 'next/link';
import { getSite } from '@/server/content';
import { SocialLinks } from '@/components/SocialLinks';
import { uiAll } from '@/server/ui';


export function Footer() {
  const site = getSite();
  const t = uiAll();
  // Four slots per column; a slot with an empty title is left out.
  const columns = [1, 2, 3].map((c) => ({
    title: t[`footer.${c}.title`],
    links: [1, 2, 3, 4]
      .map((l) => ({ label: t[`footer.${c}.${l}.label`], href: t[`footer.${c}.${l}.href`] }))
      .filter((l) => l.label && l.href),
  }));
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
          <p className="mt-4 max-w-xs whitespace-pre-line text-xs leading-6 text-white/50">{site.footerText}</p>
          <SocialLinks site={site} />
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <div className="eyebrow-light">{column.title}</div>
            <ul className="mt-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-gold-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {year} {site.brand} — {t['footer.copyright']}
      </div>
    </footer>
  );
}
