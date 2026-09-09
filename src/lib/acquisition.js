const KNOWN_SOURCES = ['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'copilot.microsoft.com', 'bing.com', 'google.com', 'duckduckgo.com'];
// Generated in Cortisol+'s App Store Connect campaign UI on 2026-09-09.
// This public attribution token identifies our developer account, not a visitor.
export const APP_STORE_PROVIDER = '128296964';
const SOURCE_CAMPAIGNS = {
  'chatgpt.com': 'website-chatgpt', 'chat.openai.com': 'website-chatgpt',
  'perplexity.ai': 'website-perplexity', 'copilot.microsoft.com': 'website-copilot',
  'bing.com': 'website-bing', 'google.com': 'website-google',
  'duckduckgo.com': 'website-duckduckgo', 'other-referral': 'website-referral',
};

export function appStoreCampaign(context) {
  // Never forward arbitrary UTM text, health topics, page paths or user IDs to Apple.
  if (/^website-qa(?:-[a-z0-9-]+)?$/.test(context.campaign_name || '')) return 'website-qa';
  return SOURCE_CAMPAIGNS[context.acquisition_source] || 'website-organic';
}

export function appStoreCampaignUrl(href, context) {
  let url;
  try { url = new URL(href); } catch { return null; }
  if (url.protocol !== 'https:' || url.hostname !== 'apps.apple.com' || !/\/id6759510126\/?$/.test(url.pathname)) return null;
  // A new URL ensures private or unrelated parameters cannot hitchhike.
  return `https://apps.apple.com/app/apple-store/id6759510126?pt=${APP_STORE_PROVIDER}&ct=${appStoreCampaign(context)}&mt=8`;
}

export function acquisitionContext(location, referrer) {
  const url = new URL(location);
  let host = '';
  try { host = new URL(referrer).hostname.replace(/^www\./, ''); } catch {}
  const source = KNOWN_SOURCES.find(s => host === s || host.endsWith(`.${s}`)) || (host && host !== url.hostname ? 'other-referral' : 'direct');
  // No query strings, fragments, searches, quiz answers, free text or full referrers.
  const campaign = url.searchParams.get('utm_campaign') || '';
  return {
    landing_path: url.pathname,
    acquisition_source: source,
    ...( /^website-[a-z0-9-]{1,40}$/.test(campaign) ? { campaign_name: campaign } : {}),
  };
}

export function appStoreEvent(context, pathname) {
  return { ...context, page_location: `https://cortisolplus.com${pathname}`, link_domain: 'apps.apple.com', app_store_campaign: appStoreCampaign(context) };
}

export const marketingPage = path => path === '/' || /^\/(download|features|how-it-works|about|press)(\/|$)/.test(path);
