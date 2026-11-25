// Funnel events for /start/ (the web onboarding → web checkout → unlock).
// Only screen keys, plan ids and prices are sent: never names, answers,
// emails or unlock links.
//
// window.gtag only exists once WebsiteAnalytics has loaded Google Analytics for
// a visitor whose privacy choice allows it. The flow can mount before that
// script runs, so early events wait briefly for gtag and are dropped if it
// never appears (analytics declined).

type Params = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;

export type StartEvent =
  | 'start_open'
  | 'start_screen'
  | 'start_checkout_open'
  | 'start_checkout_cancel'
  | 'start_checkout_error'
  | 'start_exit_offer_view'
  | 'start_purchase'
  | 'start_unlock_click';

const WAIT_MS = 8000;
const pending: Array<[StartEvent, Params]> = [];
let timer = 0;
let waited = 0;

const gtag = (): Gtag | undefined => (window as typeof window & { gtag?: Gtag }).gtag;

function flush() {
  const g = gtag();
  if (g) {
    for (const [event, params] of pending.splice(0)) g('event', event, params);
  } else if ((waited += 250) >= WAIT_MS) {
    pending.length = 0;
  }
  if (!pending.length) {
    window.clearInterval(timer);
    timer = 0;
  }
}

export function trackStart(event: StartEvent, params: Params = {}) {
  if (import.meta.env.DEV) console.debug('[start-analytics]', event, params);
  const g = gtag();
  if (g && !pending.length) { g('event', event, params); return; }
  pending.push([event, params]);
  if (!timer) { waited = 0; timer = window.setInterval(flush, 250); }
}
