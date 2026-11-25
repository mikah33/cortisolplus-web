// GA4 events for the /start/ web onboarding, so reports show which screen
// visitors stop on. Only screen names, plan ids and prices are sent: never
// names, answers, emails or unlock links.
//
// The screen is part of the event name (web_ob_symptoms, web_ob_paywall, …)
// rather than a parameter: GA4 can't report on a parameter until it is
// registered as a custom dimension, but event names work in every report.
// Parameters (screen_index, platform, in_app_browser, plan, value) ride along
// for when they are registered.
//
// window.gtag only exists once WebsiteAnalytics has loaded Google Analytics for
// a visitor whose privacy choice allows it. The flow can mount before that
// script runs, so early events wait briefly for gtag and are dropped if it
// never appears (analytics declined).

type Params = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;

export type StartMoment =
  | 'open' // the flow mounted, before the launch video
  | 'exit_offer'
  | 'checkout' // RevenueCat checkout opened
  | 'checkout_cancel'
  | 'checkout_error'
  | 'purchase'
  | 'unlock_click'; // "Unlock Pro in the app" tapped after buying

const WAIT_MS = 8000;
const pending: Array<[string, Params]> = [];
let timer = 0;
let waited = 0;
let lastScreen = '';

const gtag = (): Gtag | undefined => (window as typeof window & { gtag?: Gtag }).gtag;

/** A screen was shown. Repeats of the same screen in a row are sent once. */
export function trackStartScreen(screen: string, params: Params = {}) {
  if (!screen || screen === lastScreen) return;
  lastScreen = screen;
  send(screen, params);
}

/** A moment that isn't a screen. */
export function trackStartEvent(moment: StartMoment, params: Params = {}) {
  send(moment, params);
}

function send(key: string, params: Params) {
  const name = `web_ob_${key.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`.slice(0, 40);
  if (import.meta.env.DEV) console.debug('[start-analytics]', name, params);
  const g = gtag();
  if (g && !pending.length) { g('event', name, params); return; }
  pending.push([name, params]);
  if (!timer) { waited = 0; timer = window.setInterval(flush, 250); }
}

function flush() {
  const g = gtag();
  if (g) {
    for (const [name, params] of pending.splice(0)) g('event', name, params);
  } else if ((waited += 250) >= WAIT_MS) {
    pending.length = 0;
  }
  if (!pending.length) {
    window.clearInterval(timer);
    timer = 0;
  }
}
