// Web checkout for /start/: RevenueCat Web Billing (Stripe). Loaded on
// demand when someone taps a buy button, so the quiz ships without the SDK.
//
// Every web purchase is anonymous. RevenueCat returns a one-time redemption
// link (shown on the success screen and emailed) that opens the iPhone or
// Android app and moves the purchase onto the app's user, turning on the
// "Cortisol+ Pro" entitlement.

import type { PlanId } from './content';
import { newEventId, trackMeta } from '../../lib/metaPixel';
import { trackStartEvent } from '../../lib/startAnalytics';

// Public client keys (safe to ship). The sandbox key is used off production
// so test cards never touch live billing.
const RC_PUBLIC_KEY = 'rcb_HOZUcmvgieMoXdwHdVhDbRBKppXK';
const RC_SANDBOX_KEY = 'rcb_sb_fCDMrXSGYMitGkoeFvVCRygvk';
const RC_OFFERING = 'web';
const ENTITLEMENT = 'Cortisol+ Pro';

const PACKAGE_FOR_PLAN: Record<PlanId, string> = {
  weekly: '$rc_weekly',
  yearly: '$rc_annual',
  yearlyExit: 'annual_exit',
};

export function isSandbox(): boolean {
  const host = location.hostname;
  return (
    new URLSearchParams(location.search).has('sandbox') ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host.endsWith('.local')
  );
}

export interface CheckoutResult {
  status: 'purchased' | 'cancelled';
  /** Opens the app and unlocks Pro (rc-9fb3e14b26://…). Also emailed by RevenueCat. */
  redeemUrl?: string | null;
  /** The same link as an https URL, for QR codes. */
  redeemUrlRedirect?: string | null;
  email?: string;
}

/**
 * Open RevenueCat's checkout for a plan. The purchase is anonymous and
 * returns a redemption link that moves it onto the app's user.
 */
export async function checkout(plan: PlanId, attributes: Record<string, string>): Promise<CheckoutResult> {
  const { Purchases, ErrorCode, PurchasesError } = await import('@revenuecat/purchases-js');
  const apiKey = isSandbox() ? RC_SANDBOX_KEY : RC_PUBLIC_KEY;
  const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
  const purchases = Purchases.isConfigured()
    ? Purchases.getSharedInstance()
    : Purchases.configure({ apiKey, appUserId });
  if (purchases.getAppUserId() !== appUserId) await purchases.changeUser(appUserId);

  try {
    await purchases.setAttributes(attributes);
  } catch {
    /* attributes are nice to have; never block a purchase on them */
  }

  const offerings = await purchases.getOfferings({ offeringIdentifier: RC_OFFERING, currency: 'USD' });
  const offering = offerings.all[RC_OFFERING];
  const rcPackage = offering?.packagesById[PACKAGE_FOR_PLAN[plan]];
  if (!rcPackage) throw new Error(`Plan ${plan} isn't available in the "${RC_OFFERING}" offering.`);

  // Meta Pixel (web-to-app ads): the price actually charged, nothing else.
  const price = rcPackage.webBillingProduct.currentPrice;
  const value = Math.round(price.amountMicros / 10_000) / 100;
  trackMeta('InitiateCheckout', { value, currency: price.currency });
  // GA4 funnel. Sandbox test cards (?sandbox) are left out, as for Meta.
  const funnel = { plan, value, currency: price.currency };
  if (!isSandbox()) trackStartEvent('checkout', funnel);

  try {
    const result = await purchases.purchase({
      rcPackage,
      metadata: { source: 'cortisolplus.com/start', plan },
    });
    // Sandbox test cards (?sandbox) must never count as ad conversions.
    if (!isSandbox()) {
      trackMeta('Purchase', { value, currency: price.currency }, newEventId());
      trackStartEvent('purchase', funnel);
    }
    // A completed payment always gets the unlock screen. For anonymous buyers
    // the entitlement may not be reported as active on the web customer yet;
    // it is granted to the app user when the redemption link is opened.
    if (!(ENTITLEMENT in result.customerInfo.entitlements.active)) {
      console.info('[checkout] Paid; entitlement not yet active on web customer', {
        active: Object.keys(result.customerInfo.entitlements.active),
        redeemUrl: result.redemptionInfo?.redeemUrl ?? null,
      });
    }
    return {
      status: 'purchased',
      redeemUrl: result.redemptionInfo?.redeemUrl,
      redeemUrlRedirect: result.redemptionInfo?.redeemUrlRedirect,
      email: result.customerEmail,
    };
  } catch (error) {
    if (error instanceof PurchasesError && error.errorCode === ErrorCode.UserCancelledError) {
      return { status: 'cancelled' };
    }
    throw error;
  }
}
