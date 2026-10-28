// Web checkout for /start/: Firebase sign-in plus RevenueCat Web Billing
// (Stripe). Loaded on demand when someone taps a buy button, so the quiz
// itself ships without these SDKs.
//
// Two ways a web purchase reaches the app's "Cortisol+ Pro" entitlement:
// - Signed in (Android, desktop): the Firebase uid is the RevenueCat app user
//   id, the same id the apps use, so signing into the app with the same
//   Google account unlocks Pro.
// - Anonymous (iPhone, until Apple sign-in is configured for the web):
//   RevenueCat returns a redemption link that opens the app and moves the
//   purchase onto the app's user.

import type { PlanId } from './content';

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

// Firebase web app "Cortisol Dashboard" in the cortisol-plus project. These
// values are public client config, not secrets.
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDYGdFvc0b-2Z4L0iaQCl3JAQPVrjN9I04',
  authDomain: 'cortisol-plus.firebaseapp.com',
  projectId: 'cortisol-plus',
  storageBucket: 'cortisol-plus.firebasestorage.app',
  messagingSenderId: '137775789145',
  appId: '1:137775789145:web:daa6b684f2f81b28596d48',
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

export interface WebUser {
  uid: string;
  email: string | null;
  name: string | null;
}

async function firebase() {
  const [{ initializeApp, getApps }, auth, store] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);
  const app = getApps()[0] ?? initializeApp(FIREBASE_CONFIG);
  return { app, auth, store, authInstance: auth.getAuth(app), db: store.getFirestore(app) };
}

/** Google sign-in. Uses a popup; falls back to a full-page redirect if the popup is blocked. */
export async function signInWithGoogle(): Promise<WebUser> {
  const { auth, authInstance } = await firebase();
  const provider = new auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const { user } = await auth.signInWithPopup(authInstance, provider);
    return { uid: user.uid, email: user.email, name: user.displayName };
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
      await auth.signInWithRedirect(authInstance, provider);
    }
    throw error;
  }
}

/** The user returning from a redirect sign-in, or one already signed in on this browser. */
export async function currentUser(): Promise<WebUser | null> {
  const { auth, authInstance } = await firebase();
  try {
    await auth.getRedirectResult(authInstance);
  } catch {
    /* a failed redirect leaves the user signed out; they can try again */
  }
  await authInstance.authStateReady();
  const user = authInstance.currentUser;
  return user && !user.isAnonymous ? { uid: user.uid, email: user.email, name: user.displayName } : null;
}

/** Save the web onboarding answers under the user, where only they can read them. */
export async function saveAnswers(uid: string, answers: Record<string, unknown>) {
  const { store, db } = await firebase();
  await store.setDoc(
    store.doc(db, 'users', uid, 'private', 'web_onboarding'),
    { ...answers, source: 'web', updatedAt: store.serverTimestamp() },
    { merge: true },
  );
}

export interface CheckoutResult {
  status: 'purchased' | 'cancelled';
  /** Present for anonymous purchases: opens the app and unlocks Pro. */
  redeemUrl?: string | null;
  email?: string;
}

/**
 * Open RevenueCat's checkout for a plan. With a user, the purchase lands on
 * their Firebase uid; without one it is anonymous and returns a redemption link.
 */
export async function checkout(plan: PlanId, user: WebUser | null, attributes: Record<string, string>): Promise<CheckoutResult> {
  const { Purchases, ErrorCode, PurchasesError } = await import('@revenuecat/purchases-js');
  const apiKey = isSandbox() ? RC_SANDBOX_KEY : RC_PUBLIC_KEY;
  const appUserId = user?.uid ?? Purchases.generateRevenueCatAnonymousAppUserId();
  const purchases = Purchases.isConfigured()
    ? Purchases.getSharedInstance()
    : Purchases.configure({ apiKey, appUserId });
  if (purchases.getAppUserId() !== appUserId) await purchases.changeUser(appUserId);

  try {
    await purchases.setAttributes({ ...attributes, ...(user?.email ? { $email: user.email } : {}) });
  } catch {
    /* attributes are nice to have; never block a purchase on them */
  }

  const offerings = await purchases.getOfferings({ offeringIdentifier: RC_OFFERING, currency: 'USD' });
  const offering = offerings.all[RC_OFFERING];
  const rcPackage = offering?.packagesById[PACKAGE_FOR_PLAN[plan]];
  if (!rcPackage) throw new Error(`Plan ${plan} isn't available in the "${RC_OFFERING}" offering.`);

  try {
    const result = await purchases.purchase({
      rcPackage,
      customerEmail: user?.email ?? undefined,
      metadata: { source: 'cortisolplus.com/start', plan },
    });
    const active = ENTITLEMENT in result.customerInfo.entitlements.active;
    if (!active) throw new Error('The payment went through but Pro is not active yet. Please contact support.');
    return { status: 'purchased', redeemUrl: result.redemptionInfo?.redeemUrl, email: result.customerEmail };
  } catch (error) {
    if (error instanceof PurchasesError && error.errorCode === ErrorCode.UserCancelledError) {
      return { status: 'cancelled' };
    }
    throw error;
  }
}
