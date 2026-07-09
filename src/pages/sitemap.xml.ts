// Single-file XML sitemap for cortisolplus.com.
// Replaces @astrojs/sitemap (which always splits into sitemap-index.xml + sitemap-0.xml).
// All 40 URLs live in one file with <lastmod>, plus image sitemap extension
// for the App Store screenshots on the home entry.

import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

interface ImageEntry {
  url: string;
  title: string;
  caption: string;
}

interface UrlEntry {
  loc: string;
  lastmod?: string;
  images?: ImageEntry[];
}

// Static pages — kept in sync manually as new top-level routes are added.
const STATIC_ROUTES = [
  '/',
  '/how-it-works',
  '/about',
  '/download',
  '/privacy',
  '/terms',
  '/blog',

  // Cortisol pillar
  '/cortisol',
  '/cortisol/symptoms',
  '/cortisol/levels',
  '/cortisol/test',
  '/cortisol/foods',
  '/cortisol/lower',
  '/cortisol/lower/foods',
  '/cortisol/lower/supplements',
  '/cortisol/lower/breathing-exercises',
  '/cortisol/lower/exercise',
  '/cortisol/lower/sleep',

  // Tools
  '/tools',
  '/tools/cortisol-calculator',
  '/tools/morning-cortisol-test',
  '/tools/stress-score',
  '/tools/burnout-risk',
  '/tools/sleep-debt-cortisol',

  // Features
  '/features',
  '/features/hrv-stress-monitoring',
  '/features/sleep-cortisol-tracking',
  '/features/breathing-zen-mode',

  // HRV cluster
  '/hrv',
  '/hrv/normal-range',
  '/hrv/how-to-improve',
  '/hrv/apple-watch',

  // Stress-tracking cluster
  '/stress',
  '/stress/apple-watch',

  // Fitbit cluster
  '/fitbit',
  '/fitbit/stress-management-score',
  '/fitbit/cortisol',
  '/fitbit/hrv',

  // Audience FAQs
  '/faq-perimenopause',
  '/faq-burnout',
  '/faq-shift-workers',
  '/faq-athletes',
];

const HOME_IMAGES: ImageEntry[] = [
  { url: `${SITE.url}/screenshots/track-cortisol-levels.png`, title: 'Cortisol+ — Track cortisol levels on Apple Watch', caption: 'Apple Watch Ultra displaying real-time cortisol score of 12 Excellent.' },
  { url: `${SITE.url}/screenshots/sleep-analysis.png`, title: 'Cortisol+ — Sleep Analysis', caption: 'Sleep stages, quality score, and 8-night cortisol-sleep insights.' },
  { url: `${SITE.url}/screenshots/health-breakdown.png`, title: 'Cortisol+ — Health Breakdown', caption: '10 of 13 biometric factors driving cortisol — HRV, RHR, blood oxygen, breathing rate.' },
  { url: `${SITE.url}/screenshots/connect-with-friends.png`, title: 'Cortisol+ — Connect with friends', caption: 'Connect feed with friends sharing wellness milestones — available in 171 countries.' },
  { url: `${SITE.url}/screenshots/daily-insights.png`, title: 'Cortisol+ — Daily Insights', caption: 'Daily Insights dashboard with cortisol overview, heart rate, sleep, and 7-day trend.' },
  { url: `${SITE.url}/screenshots/ai-coach.png`, title: 'Cortisol+ — AI-powered coach', caption: 'AI Coach with Wellness Score 81, 30-day stress streak, and personalized Zen tips.' },
  { url: `${SITE.url}/screenshots/track-metrics.png`, title: 'Cortisol+ — Track Metrics', caption: 'Monthly health tracking with HRV, RHR, activity, and Zen wellness score.' },
];

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderUrl(entry: UrlEntry): string {
  const parts = [`    <loc>${xmlEscape(entry.loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.images && entry.images.length > 0) {
    for (const img of entry.images) {
      parts.push(
        '    <image:image>',
        `      <image:loc>${xmlEscape(img.url)}</image:loc>`,
        `      <image:title>${xmlEscape(img.title)}</image:title>`,
        `      <image:caption>${xmlEscape(img.caption)}</image:caption>`,
        '    </image:image>',
      );
    }
  }
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

export async function GET(_context: APIContext) {
  const today = new Date().toISOString();

  // Static routes
  const staticEntries: UrlEntry[] = STATIC_ROUTES.map((route) => ({
    loc: `${SITE.url}${route === '/' ? '/' : route + '/'}`,
    lastmod: today,
    ...(route === '/' ? { images: HOME_IMAGES } : {}),
  }));

  // Dynamic content collections
  const blogPosts = (await getCollection('blog')).filter((p) => !p.data.draft);
  const symptoms = await getCollection('symptoms');
  const foods = await getCollection('foods');

  const collectionEntries: UrlEntry[] = [
    ...blogPosts.map((p) => ({
      loc: `${SITE.url}/blog/${p.id}/`,
      lastmod: (p.data.updatedDate ?? p.data.pubDate).toISOString(),
    })),
    ...symptoms.map((s) => ({
      loc: `${SITE.url}/cortisol/symptoms/${s.id}/`,
      lastmod: s.data.updatedDate?.toISOString() ?? today,
    })),
    ...foods.map((f) => ({
      loc: `${SITE.url}/cortisol/foods/${f.id}/`,
      lastmod: f.data.updatedDate?.toISOString() ?? today,
    })),
  ];

  const allEntries = [...staticEntries, ...collectionEntries].sort((a, b) =>
    a.loc.localeCompare(b.loc),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${allEntries.map(renderUrl).join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
