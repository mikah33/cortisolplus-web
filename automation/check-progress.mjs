#!/usr/bin/env node
/**
 * Cortisol+ blog automation — progress checker.
 *
 * Reads the topic queue + the current src/content/blog/ folder and prints:
 *   - How many topics are queued total
 *   - How many have been published
 *   - How many are left
 *   - Per-category breakdown
 *
 * Usage:  node automation/check-progress.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const QUEUE = path.join(__dirname, 'topic-queue.json');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');

const queue = JSON.parse(await fs.readFile(QUEUE, 'utf-8'));
const published = (await fs.readdir(BLOG_DIR))
  .filter((f) => /\.(mdx?)$/i.test(f))
  .map((f) => path.basename(f, path.extname(f)));

const publishedSet = new Set(published);
const queuedSlugs = new Set(queue.map((t) => t.slug));

// Categorize
const byCategory = {};
for (const t of queue) {
  byCategory[t.category] ??= { total: 0, published: 0, remaining: [] };
  byCategory[t.category].total++;
  if (publishedSet.has(t.slug)) byCategory[t.category].published++;
  else byCategory[t.category].remaining.push(t.slug);
}

// Posts on the site that aren't from the queue (manually written)
const manual = published.filter((s) => !queuedSlugs.has(s));

const totalQueue = queue.length;
const totalPublished = published.length;
const fromQueuePublished = queue.filter((t) => publishedSet.has(t.slug)).length;
const remaining = totalQueue - fromQueuePublished;
const pctDone = ((fromQueuePublished / totalQueue) * 100).toFixed(1);

// At 3 posts per week, how long until queue exhausted?
const weeksLeft = Math.ceil(remaining / 3);
const exhaustionDate = new Date();
exhaustionDate.setDate(exhaustionDate.getDate() + weeksLeft * 7);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  CORTISOL+ BLOG AUTOMATION — PROGRESS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`  Total topics in queue:     ${totalQueue}`);
console.log(`  Published from queue:      ${fromQueuePublished}`);
console.log(`  Manually-written posts:    ${manual.length}`);
console.log(`  Total posts live on site:  ${totalPublished}`);
console.log(`  Remaining in queue:        ${remaining}`);
console.log(`  Queue progress:            ${pctDone}%\n`);

const barWidth = 40;
const filled = Math.round((fromQueuePublished / totalQueue) * barWidth);
const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
console.log(`  [${bar}]  ${fromQueuePublished}/${totalQueue}\n`);

console.log(`  At 3 posts/week:           ~${weeksLeft} weeks until queue exhausted`);
console.log(`  Estimated exhaustion:      ${exhaustionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  BY CATEGORY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const cats = Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total);
const longest = Math.max(...cats.map(([c]) => c.length));
for (const [cat, stats] of cats) {
  const pct = ((stats.published / stats.total) * 100).toFixed(0);
  const w = 20;
  const f = Math.round((stats.published / stats.total) * w);
  const b = '█'.repeat(f) + '░'.repeat(w - f);
  console.log(`  ${cat.padEnd(longest)}  ${String(stats.published).padStart(3)}/${String(stats.total).padEnd(3)}  [${b}]  ${pct.padStart(3)}%`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  NEXT 6 UP IN THE QUEUE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const next6 = queue.filter((t) => !publishedSet.has(t.slug)).slice(0, 6);
for (const t of next6) {
  console.log(`  [${t.category.padEnd(12)}]  ${t.title}`);
  console.log(`                  → ${t.slug}`);
}

if (manual.length > 0) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  POSTS PUBLISHED OUTSIDE THE QUEUE (manual writes)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  for (const slug of manual) console.log(`  · ${slug}`);
}

console.log('');
