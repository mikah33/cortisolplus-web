const KNOWN_SOURCES = ['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'copilot.microsoft.com', 'bing.com', 'google.com', 'duckduckgo.com'];

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
  return { ...context, page_location: `https://cortisolplus.com${pathname}`, link_domain: 'apps.apple.com' };
}

export const marketingPage = path => path === '/' || /^\/(download|features|how-it-works|about|press)(\/|$)/.test(path);
