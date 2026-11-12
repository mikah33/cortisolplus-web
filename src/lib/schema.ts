import { SITE, PUBLISHER } from '../consts';

/** Educational page metadata. Review attribution is supplied only after a documented review. */
export function medicalWebPage(opts: {
  name: string;
  condition?: string;
  pathname: string;
  lastReviewed?: string;
  specialty?: 'Endocrinologic' | 'PrimaryCare' | 'Internal' | 'Cardiovascular';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: opts.name,
    about: { '@type': 'MedicalCondition', name: opts.condition ?? 'Cortisol' },
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    ...(opts.lastReviewed ? { lastReviewed: opts.lastReviewed } : {}),
    specialty: `https://schema.org/${opts.specialty ?? 'Endocrinologic'}`,
    mainEntityOfPage: new URL(opts.pathname, SITE.url).toString(),
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png` },
    },
  };
}

/**
 * Complete WebApplication schema for the interactive tool/quiz pages.
 * Describes this web tool; mobile App Store reviews do not rate a separate quiz.
 */
export function webApplication(opts: {
  name: string;
  description: string;
  pathname: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: new URL(opts.pathname, SITE.url).toString(),
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Runs in any modern browser.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png` },
    },
  };
}
