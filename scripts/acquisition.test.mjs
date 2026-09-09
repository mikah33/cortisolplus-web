import test from 'node:test';
import assert from 'node:assert/strict';
import { acquisitionContext, appStoreEvent, appStoreCampaignUrl, marketingPage } from '../src/lib/acquisition.js';

test('acquisition identifies AI referral without retaining private URL details', () => {
  const context = acquisitionContext('https://cortisolplus.com/tools/?email=person@example.com&score=24#result', 'https://chatgpt.com/c/private-conversation');
  assert.deepEqual(context, { landing_path: '/tools/', acquisition_source: 'chatgpt.com' });
  assert.ok(!JSON.stringify(appStoreEvent(context, '/download/')).includes('private'));
});
test('arbitrary campaign strings and quiz data are discarded', () => {
  assert.equal(acquisitionContext('https://cortisolplus.com/?utm_campaign=my-health-answer', '').campaign_name, undefined);
  assert.equal(acquisitionContext('https://cortisolplus.com/?utm_campaign=website-watch-guide', '').campaign_name, 'website-watch-guide');
  assert.equal(acquisitionContext('https://cortisolplus.com/?utm_campaign=website-my-health-result', '').campaign_name, undefined);
  assert.equal(acquisitionContext('https://cortisolplus.com/?utm_campaign=website-qa-private', '').campaign_name, 'website-qa');
});
test('advertising events are restricted to product pages', () => {
  assert.equal(marketingPage('/features/hrv-stress-monitoring/'), true);
  for (const path of ['/tools/stress-score/', '/cortisol/symptoms/', '/blog/cortisol-anxiety-link/']) assert.equal(marketingPage(path), false);
});

test('Apple attribution uses the verified token and broad source without private parameters', () => {
  const context = acquisitionContext('https://cortisolplus.com/tools/?email=private@example.com&utm_campaign=website-my-health-result', 'https://chatgpt.com/c/private-conversation');
  const link = appStoreCampaignUrl('https://apps.apple.com/us/app/cortisol/id6759510126?email=private@example.com#private', context);
  assert.equal(link, 'https://apps.apple.com/app/apple-store/id6759510126?pt=128296964&ct=website-chatgpt&mt=8');
  assert.equal(appStoreEvent(context, '/download/').app_store_campaign, 'website-chatgpt');
  assert.equal(appStoreCampaignUrl('https://apps.apple.com/app/id6759510126', {campaign_name:'website-qa-followup'}), 'https://apps.apple.com/app/apple-store/id6759510126?pt=128296964&ct=website-qa&mt=8');
});

test('campaign decoration leaves other apps, non-HTTPS and lookalike hosts alone', () => {
  for (const href of ['https://apps.apple.com/app/id123', 'http://apps.apple.com/app/id6759510126', 'https://apps.apple.com.attacker.test/app/id6759510126', 'javascript:alert(1)', '/download/']) {
    assert.equal(appStoreCampaignUrl(href, {}), null);
  }
});
