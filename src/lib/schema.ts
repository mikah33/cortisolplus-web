import { SITE, PUBLISHER } from '../consts';

/**
 * YMYL-grade MedicalWebPage schema generator.
 * Adds lastReviewed, dateModified, audience, specialty, mainEntityOfPage.
 * Use on every cortisol-related content page.
 */
export function medicalWebPage(opts: {
  name: string;
  condition?: string;
  pathname: string;
  lastReviewed?: string;
  specialty?: 'Endocrinologic' | 'PrimaryCare' | 'Internal' | 'Cardiovascular';
}) {
  const today = new Date().toISOString().slice(0, 10);
  const reviewed = opts.lastReviewed ?? today;
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
