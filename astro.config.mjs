// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cortisolplus.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Attach App Store screenshots to the home entry + ensure lastmod is set.
      serialize(item) {
        // Always emit a lastmod (use today's date for now; replace with file mtime later).
        if (!item.lastmod) item.lastmod = new Date().toISOString();

        const homeUrl = new URL(item.url);
        if (homeUrl.pathname === '/' || homeUrl.pathname === '') {
          item.img = [
            { url: 'https://cortisolplus.com/screenshots/track-cortisol-levels.png', title: 'Cortisol+ — Track cortisol levels on Apple Watch', caption: 'Apple Watch Ultra displaying real-time cortisol score of 12 Excellent.' },
            { url: 'https://cortisolplus.com/screenshots/health-breakdown.png', title: 'Cortisol+ — Health Breakdown', caption: '10 of 13 biometric factors driving cortisol — HRV, RHR, blood oxygen, breathing rate.' },
            { url: 'https://cortisolplus.com/screenshots/daily-insights.png', title: 'Cortisol+ — Daily Insights', caption: 'Daily Insights dashboard with cortisol overview, heart rate, sleep, and 7-day trend.' },
            { url: 'https://cortisolplus.com/screenshots/ai-coach.png', title: 'Cortisol+ — AI-powered coach', caption: 'AI Coach with Wellness Score 81, 30-day stress streak, and personalized Zen tips.' },
            { url: 'https://cortisolplus.com/screenshots/sleep-analysis.png', title: 'Cortisol+ — Sleep Analysis', caption: 'Sleep stages, quality score, and 8-night cortisol-sleep insights.' },
            { url: 'https://cortisolplus.com/screenshots/track-metrics.png', title: 'Cortisol+ — Track Metrics', caption: 'Monthly health tracking with HRV, RHR, activity, and Zen wellness score.' },
            { url: 'https://cortisolplus.com/screenshots/connect-with-friends.png', title: 'Cortisol+ — Connect with friends', caption: 'Connect feed with friends sharing wellness milestones — available in 171 countries.' },
          ];
        }
        return item;
      },
    }),
  ],
});
