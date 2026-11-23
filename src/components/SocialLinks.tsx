/**
 * Instagram and LinkedIn, shown only when the panel holds an address for them.
 *
 * Instagram is stored as a handle («@name») and LinkedIn as a full URL, which
 * is how each is normally copied, so neither has to be reformatted by hand.
 */

type Social = { label: string; href: string; icon: React.ReactNode };

const INSTAGRAM_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const LINKEDIN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95C21.4 8.75 22 11.1 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.05-3.3-2.05 0-2.37 1.57-2.37 3.2V21h-3.9V9Z" />
  </svg>
);

export function socialLinks(site: Record<string, unknown>): Social[] {
  const links: Social[] = [];

  const instagram = String(site.instagram ?? '').trim();
  if (instagram) {
    const handle = instagram.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '');
    links.push({
      label: `اینستاگرام — @${handle}`,
      href: `https://instagram.com/${handle}`,
      icon: INSTAGRAM_ICON,
    });
  }

  const linkedin = String(site.linkedin ?? '').trim();
  if (linkedin) {
    links.push({
      label: 'لینکدین',
      href: linkedin.startsWith('http') ? linkedin : `https://linkedin.com/company/${linkedin}`,
      icon: LINKEDIN_ICON,
    });
  }

  return links;
}

export function SocialLinks({ site }: { site: Record<string, unknown> }) {
  const links = socialLinks(site);
  if (links.length === 0) return null;

  return (
    <ul className="mt-6 flex items-center gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold-soft"
          >
            <span className="h-[18px] w-[18px]">{link.icon}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
