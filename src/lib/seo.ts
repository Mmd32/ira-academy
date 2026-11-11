import { siteUrl } from './site-url';

/**
 * Structured data and search-console wiring.
 *
 * Google reads two things it cannot get from the page text: who this
 * organisation is, and how the pages relate to each other. Everything here is
 * built from content the site already holds — nothing is written for the
 * crawler that a visitor does not also see.
 */

type Site = Record<string, unknown>;

const text = (site: Site, key: string) => String(site[key] ?? '').trim();

/** Digits only, with the country code, which is the form search engines expect. */
function e164(local: string): string {
  const digits = local.replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('0') ? `+98${digits.slice(1)}` : `+98${digits}`;
}

/**
 * The academy itself. Carries the address and phone, so Google can show the
 * knowledge panel and the "call" action on a phone.
 */
export function organizationSchema(site: Site) {
  const phones = [text(site, 'phone'), text(site, 'phone2')].filter(Boolean).map(e164);

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${siteUrl}/#organization`,
    name: text(site, 'brand'),
    alternateName: text(site, 'brandEn') || undefined,
    url: `${siteUrl}/`,
    logo: { '@type': 'ImageObject', url: `${siteUrl}${site.logoPath ?? '/media/logo-mark.png'}` },
    description: text(site, 'tagline') || undefined,
    email: text(site, 'email') || undefined,
    telephone: phones[0] || undefined,
    address: text(site, 'address')
      ? {
          '@type': 'PostalAddress',
          addressLocality: 'تهران',
          addressCountry: 'IR',
          streetAddress: text(site, 'address'),
        }
      : undefined,
    contactPoint: phones.length
      ? phones.map((tel) => ({
          '@type': 'ContactPoint',
          telephone: tel,
          contactType: 'customer service',
          areaServed: 'IR',
          availableLanguage: ['fa'],
        }))
      : undefined,
    // Every profile the academy actually owns, so Google can tie them to
    // this one entity instead of treating each as a separate business.
    sameAs: (() => {
      const profiles: string[] = [];
      const instagram = text(site, 'instagram').replace(/^@/, '');
      if (instagram) profiles.push(`https://instagram.com/${instagram}`);
      const linkedin = text(site, 'linkedin');
      if (linkedin) profiles.push(linkedin);
      return profiles.length ? profiles : undefined;
    })(),
  };
}

/** Tells Google the site's name, so results show it instead of the domain. */
export function websiteSchema(site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: text(site, 'brand'),
    url: `${siteUrl}/`,
    inLanguage: 'fa-IR',
    publisher: { '@id': `${siteUrl}/#organization` },
  };
}

/** The trail shown under a result instead of a bare URL. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${siteUrl}${step.path}`,
    })),
  };
}

/** Lets the real questions on /contact appear as expandable answers. */
export function faqSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/** The course catalogue as a list, so /programs can show rich results. */
export function courseListSchema(
  courses: readonly { id: string; title: string; blurb: string }[],
  site: Site,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'دوره‌های آکادمی ریتیل ایران',
    itemListElement: courses.map((course, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.blurb,
        url: `${siteUrl}/register/?course=${course.id}`,
        provider: {
          '@type': 'EducationalOrganization',
          name: text(site, 'brand'),
          sameAs: `${siteUrl}/`,
        },
      },
    })),
  };
}

/**
 * Search Console verification.
 *
 * Set GOOGLE_SITE_VERIFICATION to the token from the "HTML tag" method and the
 * tag appears on every page. The DNS and HTML-file methods need no code.
 */
export function verification() {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return google ? { google } : undefined;
}
