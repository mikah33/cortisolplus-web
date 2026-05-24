// Generate the default 1200x630 OG / Twitter card for Cortisol+.
// Run: node scripts/generate-og.mjs
// Outputs: public/og-default.png

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const interBold = await readFile(resolve(__dirname, 'Inter-Bold.ttf'));
const interRegular = await readFile(resolve(__dirname, 'Inter-Regular.ttf'));
const appIcon = await readFile(resolve(projectRoot, 'public/icon-512.png'));
const appIconDataUri = `data:image/png;base64,${appIcon.toString('base64')}`;

// Satori takes JSX-like objects. We build them as plain JS for zero-config.
const card = {
  type: 'div',
  props: {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px',
      background: 'linear-gradient(135deg, #e6f5f1 0%, #ffffff 50%, #fff3f0 100%)',
      fontFamily: 'Inter',
      position: 'relative',
    },
    children: [
      // Top row: brand mark + brand name
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: '20px' },
          children: [
            { type: 'img', props: { src: appIconDataUri, width: 80, height: 80, style: { borderRadius: '20px' } } },
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column' },
                children: [
                  {
                    type: 'div',
                    props: { style: { fontSize: '44px', fontWeight: 700, color: '#0f1419', letterSpacing: '-0.02em' }, children: 'Cortisol+' },
                  },
                  {
                    type: 'div',
                    props: { style: { fontSize: '20px', color: '#5b6770', marginTop: '-4px' }, children: 'cortisolplus.com' },
                  },
                ],
              },
            },
          ],
        },
      },

      // Middle: headline
      {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' },
          children: [
            {
              type: 'div',
              props: {
                style: { fontSize: '76px', fontWeight: 700, color: '#0f1419', letterSpacing: '-0.03em', lineHeight: 1.0 },
                children: 'Track your cortisol on Apple Watch.',
              },
            },
            {
              type: 'div',
              props: {
                style: { fontSize: '28px', color: '#5b6770', lineHeight: 1.3, maxWidth: '880px' },
                children: 'Real-time cortisol estimation from HRV, sleep, and 10+ biometric signals. No needles. No labs.',
              },
            },
          ],
        },
      },

      // Bottom strip: rating + CTA
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
          children: [
            {
              type: 'div',
              props: {
                style: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: '#0f1419' },
                children: [
                  { type: 'div', props: { style: { color: '#fbbf24', fontSize: '28px' }, children: '★★★★★' } },
                  { type: 'div', props: { style: { fontWeight: 700 }, children: '4.9' } },
                  { type: 'div', props: { style: { color: '#5b6770' }, children: '· 16 ratings · App Store' } },
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #00bfa6 0%, #009985 100%)',
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: 700,
                  borderRadius: '999px',
                },
                children: 'Download on the App Store →',
              },
            },
          ],
        },
      },
    ],
  },
};

const svg = await satori(card, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
    { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

const out = resolve(projectRoot, 'public/og-default.png');
await writeFile(out, png);
console.log(`✓ Generated ${out} (${(png.length / 1024).toFixed(0)} KB)`);
