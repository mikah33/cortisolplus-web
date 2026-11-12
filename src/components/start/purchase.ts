// A completed web purchase, kept in localStorage so /start/ can always show the
// buyer their unlock screen, whether they paid in the flow or in Zen's chat.
import type { PlanId } from './content';

export const PURCHASE_KEY = 'cp_start_purchase_v1';

export interface Purchase {
  plan: PlanId;
  email: string | null;
  /** The one-time link that unlocks Pro in the app (rc-9fb3e14b26://…). */
  redeemUrl: string | null;
  /** The same link as an https URL, for a QR code a phone can scan. */
  redeemUrlRedirect?: string | null;
}

export function readPurchase(): Purchase | null {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY);
    return raw ? (JSON.parse(raw) as Purchase) : null;
  } catch {
    return null;
  }
}

export function writePurchase(purchase: Purchase) {
  try {
    localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchase));
  } catch {
    /* the download screen still shows now; it just won't survive a reload */
  }
}
