import { SITE, PUBLISHER, APP_RATING, CONTENT_REVIEWED } from '../consts';

/**
 * YMYL-grade MedicalWebPage schema generator.
 * Adds lastReviewed, dateModified, audience, specialty, mainEntityOfPage.
 * Use on every cortisol-related content page.
 *
 * `lastReviewed` MUST reflect a real editorial review date. When a caller omits
 * it we fall back to CONTENT_REVIEWED (a hand-maintained constant) rather than
 * the build date — a build-date default would falsely re-stamp "reviewed today"
 * on every deploy, which is a trust/YMYL integrity problem.
 */
export function medicalWebPage(opts: {
  name: string;
  condition?: string;
  pathname: string;
  lastReviewed?: string;
  specialty?: 'Endocrinologic' | 'PrimaryCare' | 'Internal' | 'Cardiovascular';
}) {
  const reviewed = opts.lastReviewed ?? CONTENT_REVIEWED;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: opts.name,
    about: { '@type': 'MedicalCondition', name: opts.condition ?? 'Cortisol' },
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    lastReviewed: reviewed,
    dateModified: reviewed,
    reviewedBy: {
      '@type': 'Organization',
      name: `${SITE.name} Editorial`,
      url: `${SITE.url}/about/`,
    },
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
 * Includes `url`, a free `offers` block, and `aggregateRating` so the pages are
 * eligible for software-app rich results (the inline blocks omitted all three).
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(APP_RATING.value),
      reviewCount: String(APP_RATING.count),
      bestRating: String(APP_RATING.best),
      worstRating: String(APP_RATING.worst),
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png` },
    },
  };
}
