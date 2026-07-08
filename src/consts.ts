export const SITE = {
  name: 'Cortisol+',
  fullName: 'Cortisol+ Stress & HRV Monitor',
  title: 'Cortisol+ — Track your cortisol on Apple Watch',
  description:
    'Cortisol+ estimates your cortisol levels in real time using Apple Watch biometrics. See your stress, sleep, and recovery — decoded.',
  url: 'https://cortisolplus.com',
  appStoreUrl: 'https://apps.apple.com/app/id6759510126',
  appStoreId: '6759510126',
  bundleId: 'com.elevatedsystems.cortisolplus',
  twitter: '@cortisolplus',
  x: 'https://x.com/cortisolplus',
  tiktok: 'https://www.tiktok.com/@cortisol.plus',
  tiktokHandle: '@cortisol.plus',
  substack: 'https://cortisolplus.substack.com',
  substackName: 'The Cortisol Brief',
  ogImage: '/og-default.png',
} as const;

/**
 * Live App Store rating from Apple's iTunes lookup API.
 * Refresh manually by running: curl -s "https://itunes.apple.com/lookup?id=6759510126"
 * Last refreshed: 2026-07-08.
 */
export const APP_RATING = {
  value: 4.6,           // averageUserRating (rounded 1dp)
  precise: 4.63889,     // actual averageUserRating from Apple
  count: 36,            // userRatingCount
  best: 5,
  worst: 1,
  lastChecked: '2026-07-08',
} as const;

/**
 * Hand-maintained "last editorially reviewed" date for evergreen medical
 * content pages. Bump ONLY when content is genuinely re-reviewed — it feeds
 * `lastReviewed`/`dateModified` in MedicalWebPage schema. Never derive from the
 * build date (that would falsely re-stamp "reviewed today" on every deploy).
 */
export const CONTENT_REVIEWED = '2026-07-08';

export const PUBLISHER = {
  name: 'Elevated Systems LLC',
  legalName: 'Elevated Systems LLC',
  url: 'https://elevatedagency.org/',
  email: 'admin@elevatedsystems.info',
  privacyEmail: 'admin@elevatedsystems.info',
  legalEmail: 'admin@elevatedsystems.info',
  supportEmail: 'admin@elevatedsystems.info',
} as const;

export const SOCIAL_PROFILES = [
  SITE.x,
  SITE.tiktok,
  SITE.substack,
  SITE.appStoreUrl,
  PUBLISHER.url,
];

export const NAV = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Cortisol', href: '/cortisol' },
  { label: 'Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' },
] as const;
