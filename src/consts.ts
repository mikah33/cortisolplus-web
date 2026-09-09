export const SITE = {
  name: 'Cortisol+',
  fullName: 'Cortisol+ Stress & HRV Monitor',
  title: 'Cortisol+ | Apple Watch Stress & HRV Tracker',
  description:
    'Explore your Apple Watch HRV, sleep and recovery with Cortisol+. A stress tracking app with a wellness score, guided breathing and clear limitations.',
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
 * Last refreshed: 2026-09-09 (US storefront).
 */
export const APP_RATING = {
  value: 4.5,           // averageUserRating (rounded 1dp)
  precise: 4.48649,     // actual averageUserRating from Apple
  count: 74,            // userRatingCount
  best: 5,
  worst: 1,
  lastChecked: '2026-09-09',
  country: 'US',
} as const;

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
