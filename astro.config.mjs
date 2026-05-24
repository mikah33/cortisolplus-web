// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://cortisolplus.com',
  vite: {
    plugins: [tailwindcss()],
  },
  // Sitemap is custom-built at src/pages/sitemap.xml.ts to keep
  // everything in a single file instead of the index + sitemap-0 split.
  integrations: [react(), mdx()],
});
