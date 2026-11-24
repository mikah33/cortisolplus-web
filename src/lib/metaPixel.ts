// Meta Pixel funnel events for /start/ (web-to-app ads). window.fbq only exists
// once WebsiteAnalytics has loaded the pixel for a visitor whose privacy choice
// allows it, so these calls follow that choice. Never send quiz answers, names,
// emails or anything health-related: only the event, and price for purchases.

type MetaEvent = 'ViewContent' | 'InitiateCheckout' | 'Purchase';
type Params = Record<string, string | number>;

export function trackMeta(event: MetaEvent, params: Params = {}, eventId?: string) {
  const w = window as typeof window & { fbq?: (...args: unknown[]) => void };
  if (import.meta.env.DEV) console.debug('[meta-pixel]', event, params, eventId);
  if (eventId) w.fbq?.('track', event, params, { eventID: eventId });
  else w.fbq?.('track', event, params);
}

export function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}
