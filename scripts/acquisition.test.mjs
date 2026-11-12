import test from 'node:test';
import assert from 'node:assert/strict';
import { acquisitionContext, appStoreEvent, appStoreCampaignUrl, isAppStoreLink, marketingPage } from '../src/lib/acquisition.js';

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

test('download links use the OneLink template and broad source without private parameters', () => {
  const context = acquisitionContext('https://cortisolplus.com/tools/?email=private@example.com&utm_campaign=website-my-health-result', 'https://chatgpt.com/c/private-conversation');
  const link = appStoreCampaignUrl('https://apps.apple.com/us/app/cortisol/id6759510126?email=private@example.com#private', context);
  assert.equal(link, 'https://cortisolplus.onelink.me/6thZ?pid=website&c=website-chatgpt&deep_link_value=website');
  assert.equal(appStoreEvent(context, '/download/').app_store_campaign, 'website-chatgpt');
  assert.equal(appStoreCampaignUrl('https://apps.apple.com/app/id6759510126', {campaign_name:'website-qa-followup'}), 'https://cortisolplus.onelink.me/6thZ?pid=website&c=website-qa&deep_link_value=website');
});

test('campaign decoration leaves other apps, non-HTTPS and lookalike hosts alone', () => {
  for (const href of ['https://apps.apple.com/app/id123', 'http://apps.apple.com/app/id6759510126', 'https://apps.apple.com.attacker.test/app/id6759510126', 'https://cortisolplus.onelink.me/other', 'https://cortisolplus.onelink.me.attacker.test/6thZ', 'javascript:alert(1)', '/download/']) {
    assert.equal(appStoreCampaignUrl(href, {}), null);
    assert.equal(isAppStoreLink(href), false);
  }
});

test('additional AI referrers get distinct campaigns, including Gemini before Google', () => {
  for (const [host, campaign] of [['claude.ai','website-claude'],['gemini.google.com','website-gemini'],['grok.com','website-grok']]) {
    const context = acquisitionContext('https://cortisolplus.com/', `https://${host}/private-chat`);
    assert.equal(context.acquisition_source, host);
    assert.equal(appStoreEvent(context, '/').app_store_campaign, campaign);
  }
  assert.equal(acquisitionContext('https://cortisolplus.com/', 'https://fakeclaude.ai/').acquisition_source, 'other-referral');
});

test('social and ad traffic gets broad campaigns even when in-app browsers drop the referrer', () => {
  for (const [href, referrer, campaign] of [
    ['https://cortisolplus.com/?fbclid=PRIVATECLICKID', '', 'website-meta'],
    ['https://cortisolplus.com/', 'https://l.facebook.com/l.php?u=private', 'website-meta'],
    ['https://cortisolplus.com/', 'https://www.instagram.com/', 'website-meta'],
    ['https://cortisolplus.com/?utm_source=facebook&utm_medium=paid_social&utm_content=private-ad-name', '', 'website-meta-paid'],
    ['https://cortisolplus.com/?utm_source=IG&utm_medium=cpc', '', 'website-meta-paid'],
    ['https://cortisolplus.com/?ttclid=PRIVATECLICKID', '', 'website-tiktok-paid'],
    ['https://cortisolplus.com/?gclid=PRIVATECLICKID', 'https://www.google.com/', 'website-google-paid'],
    ['https://cortisolplus.com/', 'https://out.reddit.com/private', 'website-reddit'],
    ['https://cortisolplus.com/', 'https://t.co/private', 'website-x'],
    ['https://cortisolplus.com/?utm_source=unknown-newsletter', '', 'website-organic'],
    ['https://cortisolplus.com/?utm_medium=cpc', '', 'website-organic'],
  ]) {
    const context = acquisitionContext(href, referrer);
    const event = appStoreEvent(context, '/');
    assert.equal(event.app_store_campaign, campaign, href + ' ' + referrer);
    assert.ok(!JSON.stringify(event).match(/PRIVATE|private/), href);
  }
});

test('already-decorated OneLinks are recognised and rebuilt without extra parameters', () => {
  const href = 'https://cortisolplus.onelink.me/6thZ?pid=website&c=website-meta&deep_link_value=website&email=private@example.com';
  assert.equal(isAppStoreLink(href), true);
  assert.equal(appStoreCampaignUrl(href, acquisitionContext('https://cortisolplus.com/?fbclid=x', '')), 'https://cortisolplus.onelink.me/6thZ?pid=website&c=website-meta&deep_link_value=website');
});
