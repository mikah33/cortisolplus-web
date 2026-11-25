// GA4 events for the /start/ web onboarding, so reports show which screen
// visitors stop on. Only the screen's name is sent (welcome, symptoms, paywall,
// …), never what was picked or typed. window.gtag only exists once
// WebsiteAnalytics has loaded Google Analytics for a visitor whose privacy
// choice allows it, so these calls follow that choice.
//
// The screen is part of the event name (web_ob_symptoms, web_ob_paywall, …)
// rather than a parameter: GA4 can't report on a parameter until it is
// registered as a custom dimension, but event names work in every report.

let last = '';

/** A screen was shown. Repeats of the same screen in a row are sent once. */
export function trackStartScreen(screen: string) {
  if (!screen || screen === last) return;
  last = screen;
  send(screen);
}

/** A moment that isn't a screen: exit_offer, checkout, purchase. */
export function trackStartEvent(name: 'exit_offer' | 'checkout' | 'purchase') {
  send(name);
}

function send(key: string) {
  const name = `web_ob_${key.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`.slice(0, 40);
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (import.meta.env.DEV) console.debug('[start-analytics]', name);
  w.gtag?.('event', name);
}
