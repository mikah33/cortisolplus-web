// Single-file XML sitemap for cortisolplus.com.
// Replaces @astrojs/sitemap (which always splits into sitemap-index.xml + sitemap-0.xml).
// All 40 URLs live in one file with <lastmod>, plus image sitemap extension
// for the App Store screenshots on the home entry.

import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

// Use declared editorial dates, never the build time, for static guide updates.
const pageSources = import.meta.glob('/src/pages/**/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
function editorialDate(route: string): string | undefined {
  const stem = route === '/' ? '/src/pages/index' : `/src/pages${route}`;
  const source = pageSources[`${stem}.astro`] ?? pageSources[`${stem}/index.astro`];
  return source?.match(/\bupdated=["'](\d{4}-\d{2}-\d{2})["']/)?.[1];
}

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
  '/press',
  '/resources',
  '/resources/perplexity',
  '/compare',
  '/compare/apple-watch-stress-apps',
  '/resources/stress-sleep-journal',
  '/download',
  '/privacy',
  '/terms',
  '/delete-account',
  '/blog',

  // Cortisol pillar
  '/cortisol',
  '/cortisol/symptoms',
  '/cortisol/levels',
  '/cortisol/test',
  '/cortisol/track',
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
  { url: `${SITE.url}/screenshots/live-stress-levels.png`, title: 'Cortisol+ — Live stress levels', caption: 'The Now dial with an example wellness score, HRV and resting heart rate; not a hormone measurement.' },
  { url: `${SITE.url}/screenshots/wearable-insights.png`, title: 'Cortisol+ — Insights from your wearable', caption: 'Daily suggestion with cortisol, sleep and recovery cards built from Apple Health readings.' },
  { url: `${SITE.url}/screenshots/sleep-quality.png`, title: 'Cortisol+ — Sleep quality', caption: 'Nightly sleep score, time asleep, efficiency and sleep stages.' },
  { url: `${SITE.url}/screenshots/activities.png`, title: 'Cortisol+ — Activities and readiness', caption: 'Weekly readiness, cardio load, steps, VO2 max and workouts.' },
  { url: `${SITE.url}/screenshots/bio-age.png`, title: 'Cortisol+ — Bio Age and Pace of Aging', caption: 'An estimated Bio Age and pace of aging from recovery data; not a medical test.' },
  { url: `${SITE.url}/screenshots/zen-ai-assistant.png`, title: 'Cortisol+ — Ask Zen', caption: 'Zen explains what is driving an example score using sleep, HRV and resting heart rate.' },
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

  // Static routes
  const staticEntries: UrlEntry[] = STATIC_ROUTES.map((route) => ({
    loc: `${SITE.url}${route === '/' ? '/' : route + '/'}`,
    lastmod: editorialDate(route),
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
      lastmod: s.data.updatedDate?.toISOString(),
    })),
    ...foods.map((f) => ({
      loc: `${SITE.url}/cortisol/foods/${f.id}/`,
      lastmod: f.data.updatedDate?.toISOString(),
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
