import test from 'node:test';
import assert from 'node:assert/strict';
import { acquisitionContext, appStoreEvent, marketingPage } from '../src/lib/acquisition.js';

test('acquisition identifies AI referral without retaining private URL details', () => {
  const context = acquisitionContext('https://cortisolplus.com/tools/?email=person@example.com&score=24#result', 'https://chatgpt.com/c/private-conversation');
  assert.deepEqual(context, { landing_path: '/tools/', acquisition_source: 'chatgpt.com' });
  assert.ok(!JSON.stringify(appStoreEvent(context, '/download/')).includes('private'));
});
test('arbitrary campaign strings and quiz data are discarded', () => {
  assert.equal(acquisitionContext('https://cortisolplus.com/?utm_campaign=my-health-answer', '').campaign_name, undefined);
  assert.equal(acquisitionContext('https://cortisolplus.com/?utm_campaign=website-watch-guide', '').campaign_name, 'website-watch-guide');
});
test('advertising events are restricted to product pages', () => {
  assert.equal(marketingPage('/features/hrv-stress-monitoring/'), true);
  for (const path of ['/tools/stress-score/', '/cortisol/symptoms/', '/blog/cortisol-anxiety-link/']) assert.equal(marketingPage(path), false);
});
