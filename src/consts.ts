export const SITE = {
  name: 'Cortisol+',
  fullName: 'Cortisol+ Stress & HRV Monitor',
  title: 'Cortisol+ | Apple Watch Stress & HRV Tracker',
  description:
    'Explore your Apple Watch HRV, sleep and recovery with Cortisol+. A stress tracking app with a wellness score, guided breathing and clear limitations.',
  url: 'https://cortisolplus.com',
  appStoreUrl: 'https://apps.apple.com/app/id6759510126',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.elevatedsystems.cortisolplus',
  appStoreId: '6759510126',
  /** App Store Connect provider token for campaign links (Analytics › Acquisition › Campaigns). */
  appStoreProviderToken: '128296964',
  bundleId: 'com.elevatedsystems.cortisolplus',
  youtube: 'https://www.youtube.com/@CortisolPlus',
  twitter: '@cortisolplus',
  x: 'https://x.com/cortisolplus',
  tiktok: 'https://www.tiktok.com/@cortisol.plus',
  tiktokHandle: '@cortisol.plus',
  substack: 'https://cortisolplus.substack.com',
  substackName: 'The Cortisol Brief',
  ogImage: '/og-default.png',
} as const;

/**
 * An App Store link that App Store Connect credits to a campaign (Analytics ›
 * Acquisition › Campaigns: downloads, sales, subscriptions). Apple attributes it
 * from the link itself, whatever browser or app it is opened from, and shows a
 * campaign once 5 people have downloaded through it. Token: up to 30 characters.
 */
export const appStoreCampaignLink = (campaign: string) =>
  `https://apps.apple.com/app/apple-store/id${SITE.appStoreId}?pt=${SITE.appStoreProviderToken}&ct=${encodeURIComponent(campaign)}&mt=8`;

/**
 * Live App Store rating from Apple's iTunes lookup API.
 * Refresh manually by running: curl -s "https://itunes.apple.com/lookup?id=6759510126"
 * Last refreshed: 2026-11-24 — ALL storefronts combined (sum of userRatingCount over every
 * country, average weighted by count; US 335, CA 44, GB 24, AU 15, 17 others 24).
 */
export const APP_RATING = {
  value: 4.4,           // weighted averageUserRating, all storefronts (rounded 1dp)
  precise: 4.36426,     // weighted average across storefronts
  count: 442,           // userRatingCount summed across storefronts
  best: 5,
  worst: 1,
  lastChecked: '2026-11-24',
  country: 'ALL',
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
  SITE.youtube,
  SITE.x,
  SITE.tiktok,
  SITE.substack,
  SITE.appStoreUrl,
  SITE.googlePlayUrl,
  PUBLISHER.url,
];

export const NAV = [
  { label: 'How it works', href: '/how-it-works/' },
  { label: 'Cortisol', href: '/cortisol/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Blog', href: '/blog/' },
] as const;
