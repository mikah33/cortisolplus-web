import { FUNNEL_STEPS } from './acquisition.js';

// Ad landing quiz at /start/. Answers never leave the browser: only the step
// names in FUNNEL_STEPS are reported, and only with analytics consent.

// RevenueCat Web Purchase Link for the web checkout. Leave empty until the link
// exists in RevenueCat (with Redemption Links on, so a web buyer can unlock the
// app). While empty, qualified visitors are sent to the App Store instead.
export const WEB_CHECKOUT_URL = '';

export function trackFunnel(step) {
  if (!FUNNEL_STEPS.has(step) || typeof window === 'undefined') return;
  document.dispatchEvent(new CustomEvent('cplus:funnel', { detail: { step } }));
}
