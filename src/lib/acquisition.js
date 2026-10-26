const KNOWN_SOURCES = ['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'copilot.microsoft.com', 'claude.ai', 'gemini.google.com', 'grok.com', 'bing.com', 'google.com', 'duckduckgo.com', 'facebook.com', 'instagram.com', 'threads.net', 'reddit.com', 'youtube.com', 'tiktok.com', 'x.com', 't.co', 'substack.com'];
const SOURCE_CAMPAIGNS = {
  'chatgpt.com': 'website-chatgpt', 'chat.openai.com': 'website-chatgpt',
  'perplexity.ai': 'website-perplexity', 'copilot.microsoft.com': 'website-copilot',
  'claude.ai': 'website-claude', 'gemini.google.com': 'website-gemini', 'grok.com': 'website-grok',
  'bing.com': 'website-bing', 'google.com': 'website-google',
  'duckduckgo.com': 'website-duckduckgo', 'other-referral': 'website-referral',
  'facebook.com': 'website-meta', 'instagram.com': 'website-meta', 'threads.net': 'website-meta',
  'reddit.com': 'website-reddit', 'youtube.com': 'website-youtube', 'tiktok.com': 'website-tiktok',
  'x.com': 'website-x', 't.co': 'website-x', 'substack.com': 'website-substack',
};
// Ads and in-app browsers often send no referrer, so recognise our own tags.
// Only the presence of a click ID is used; its value is never read or kept.
const UTM_SOURCES = {
  facebook: 'facebook.com', fb: 'facebook.com', meta: 'facebook.com', instagram: 'instagram.com', ig: 'instagram.com',
  threads: 'threads.net', reddit: 'reddit.com', youtube: 'youtube.com', tiktok: 'tiktok.com',
  google: 'google.com', bing: 'bing.com', x: 'x.com', twitter: 'x.com', substack: 'substack.com',
};
const CLICK_IDS = { fbclid: 'facebook.com', ttclid: 'tiktok.com', rdt_cid: 'reddit.com', gclid: 'google.com', msclkid: 'bing.com' };
const PAID_CLICK_IDS = new Set(['ttclid', 'rdt_cid', 'gclid', 'msclkid']);
const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paid_social', 'paid-social', 'paidsocial', 'ads', 'ad', 'display']);
const KNOWN_CAMPAIGNS = new Set([
  'website-watch-guide', 'website-home', 'website-download', 'website-seo',
  'website-organic', 'website-press', ...Object.values(SOURCE_CAMPAIGNS),
]);

export function appStoreCampaign(context) {
  // Never forward arbitrary UTM text, health topics, page paths or user IDs to AppsFlyer.
  if (/^website-qa(?:-[a-z0-9-]+)?$/.test(context.campaign_name || '')) return 'website-qa';
  const campaign = SOURCE_CAMPAIGNS[context.acquisition_source] || 'website-organic';
  return context.acquisition_medium === 'paid' ? `${campaign}-paid` : campaign;
}

// AppsFlyer OneLink template that the app already handles (see the iOS repo's
// AppDelegate.onConversionDataSuccess): pid/c become RevenueCat's $mediaSource
// and $campaign, deep_link_value becomes the acquisition_page. The template
// redirects iPhones to the default App Store listing.
export const ONELINK = 'https://cortisolplus.onelink.me/6thZ';

export function isAppStoreLink(href) {
  let url;
  try { url = new URL(href); } catch { return false; }
  if (url.protocol !== 'https:') return false;
  if (url.hostname === 'apps.apple.com') return /\/id6759510126\/?$/.test(url.pathname);
  return url.origin + url.pathname === ONELINK;
}

export function appStoreCampaignUrl(href, context) {
  if (!isAppStoreLink(href)) return null;
  // A new URL ensures private or unrelated parameters cannot hitchhike.
  return `${ONELINK}?pid=website&c=${appStoreCampaign(context)}&deep_link_value=website`;
}

export function acquisitionContext(location, referrer) {
  const url = new URL(location);
  let host = '';
  try { host = new URL(referrer).hostname.replace(/^www\./, ''); } catch {}
  const clickId = Object.keys(CLICK_IDS).find(id => url.searchParams.has(id));
  const source = UTM_SOURCES[(url.searchParams.get('utm_source') || '').toLowerCase()]
    || (clickId && CLICK_IDS[clickId])
    || KNOWN_SOURCES.find(s => host === s || host.endsWith(`.${s}`))
    || (host && host !== url.hostname ? 'other-referral' : 'direct');
  const paid = PAID_MEDIUMS.has((url.searchParams.get('utm_medium') || '').toLowerCase()) || PAID_CLICK_IDS.has(clickId);
  // No query strings, fragments, searches, quiz answers, free text or full referrers.
  const suppliedCampaign = url.searchParams.get('utm_campaign') || '';
  const campaign = /^website-qa(?:-[a-z0-9-]{1,32})?$/.test(suppliedCampaign)
    ? 'website-qa' : (KNOWN_CAMPAIGNS.has(suppliedCampaign) ? suppliedCampaign : '');
  return {
    landing_path: url.pathname,
    acquisition_source: source,
    ...(paid && source !== 'direct' ? { acquisition_medium: 'paid' } : {}),
    ...(campaign ? { campaign_name: campaign } : {}),
  };
}

export function appStoreEvent(context, pathname) {
  return { ...context, page_location: `https://cortisolplus.com${pathname}`, link_domain: 'cortisolplus.onelink.me', app_store_campaign: appStoreCampaign(context) };
}

export const marketingPage = path => path === '/' || /^\/(download|features|how-it-works|about|press)(\/|$)/.test(path);
