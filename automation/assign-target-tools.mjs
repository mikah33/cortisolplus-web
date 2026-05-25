#!/usr/bin/env node
/**
 * Assigns the most conversion-relevant tool URL to each topic in the queue.
 * Heuristic: match by slug keywords first (most specific), fall back to category.
 *
 * Run once after adding/editing topics:
 *   node automation/assign-target-tools.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE = path.join(__dirname, 'topic-queue.json');

const queue = JSON.parse(await fs.readFile(QUEUE, 'utf-8'));

const SLUG_KEYWORD_MAP = [
  // [keyword(s), tool]   — slug match takes priority over category
  [['burnout', 'overtraining', 'exhaustion'], '/tools/burnout-risk'],
  [['sleep', 'insomnia', '3am', '3-am', 'nocturnal', 'midnight', 'mouth-tape', 'weighted-blanket'], '/tools/sleep-debt-cortisol'],
  [['morning', 'cortisol-curve', 'awakening', 'car', 'wakeup', 'jet-lag', 'shift-work'], '/tools/morning-cortisol-test'],
  [['stress-score', 'stressed', 'wired-but-tired', 'tired-all-the-time', 'workload', 'pace'], '/tools/stress-score'],
];

const CATEGORY_DEFAULTS = {
  trending:    '/tools/cortisol-calculator',
  symptom:     '/tools/cortisol-calculator',
  demographic: '/tools/cortisol-calculator',
  condition:   '/tools/cortisol-calculator',
  supplement:  '/tools/cortisol-calculator',
  food:        '/tools/cortisol-calculator',
  practice:    '/tools/stress-score',
  circadian:   '/tools/morning-cortisol-test',
  test:        '/tools/cortisol-calculator',
  wearable:    '/tools/cortisol-calculator',
  hardware:    '/tools/cortisol-calculator',
  hrv:         '/tools/cortisol-calculator',
  'long-tail': '/tools/cortisol-calculator',
};

function targetToolFor(topic) {
  const slug = topic.slug.toLowerCase();
  // First pass: slug keyword match
  for (const [keywords, tool] of SLUG_KEYWORD_MAP) {
    if (keywords.some((k) => slug.includes(k))) return tool;
  }
  // Fallback: category default
  return CATEGORY_DEFAULTS[topic.category] ?? '/tools/cortisol-calculator';
}

// Apply
const counts = {};
for (const topic of queue) {
  const tool = targetToolFor(topic);
  topic.targetTool = tool;
  counts[tool] = (counts[tool] ?? 0) + 1;
}

await fs.writeFile(QUEUE, JSON.stringify(queue, null, 2) + '\n', 'utf-8');

console.log(`✓ Assigned targetTool to ${queue.length} topics\n`);
console.log('Distribution:');
for (const [tool, count] of Object.entries(counts).sort((a,b) => b[1] - a[1])) {
  const pct = ((count / queue.length) * 100).toFixed(1);
  console.log(`  ${count.toString().padStart(3)}  (${pct.padStart(5)}%)  ${tool}`);
}
