'use client';

import { normalizeContact } from '@/lib/phone';

export { normalizeContact, formatContact } from '@/lib/phone';

export const WELCOME_COUPON_ENDPOINT = '/api/welcome-coupon';

export const SUBSCRIBED_KEY = 'green_decor_subscribed';
export const DISMISSED_KEY = 'green_decor_popup_dismissed';

export interface WelcomeCouponRequest {
  contact: string;
  email?: string;
  name?: string;
}

export interface WelcomeCouponResponse {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  alreadyExisted: boolean;
}

/**
 * Requests a welcome coupon for an anonymous visitor.
 *
 * The coupon is minted server-side by the `/api/welcome-coupon` route handler
 * using firebase-admin, which bypasses Firestore security rules. This is
 * deliberate: an anonymous browser client must never be able to write to the
 * `coupons` collection directly, or anyone could mint an arbitrary-value
 * discount.
 *
 * The endpoint deduplicates on the normalised contact number and returns the
 * existing code instead of minting a second coupon, so resubmitting the same
 * number is safe.
 */
export async function claimWelcomeCoupon(
  contact: string,
  email?: string,
  name?: string
): Promise<WelcomeCouponResponse> {
  const normalized = normalizeContact(contact);
  if (!normalized) {
    throw new Error('Please enter a valid Pakistani mobile number.');
  }

  let response: Response;
  try {
    response = await fetch(WELCOME_COUPON_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: normalized,
        ...(email?.trim() ? { email: email.trim() } : {}),
        ...(name?.trim() ? { name: name.trim() } : {}),
      }),
    });
  } catch {
    throw new Error('Could not reach the server. Please check your connection and try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(readError(payload, response.status));
  }

  const code = typeof payload?.code === 'string' ? payload.code.trim().toUpperCase() : '';
  if (!code) {
    throw new Error('We could not generate a discount code. Please try again.');
  }

  return {
    code,
    type: payload.type === 'flat' ? 'flat' : 'percent',
    value: typeof payload.value === 'number' ? payload.value : 0,
    alreadyExisted: payload.alreadyExisted === true,
  };
}

function readError(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const body = payload as { error?: unknown; detail?: unknown };
    if (typeof body.error === 'string' && body.error) {
      // `detail` is only ever populated outside production, so a misconfigured
      // service account is visible while developing instead of showing up as
      // an anonymous "something went wrong".
      if (typeof body.detail === 'string' && body.detail) {
        return `${body.error} (${body.detail})`;
      }
      return body.error;
    }
  }
  if (status === 429) {
    return 'Too many attempts. Please try again in a few minutes.';
  }
  return 'We could not generate a discount code. Please try again.';
}

export function describeDiscount(type: 'percent' | 'flat', value: number): string {
  return type === 'percent' ? `${value}% off` : `PKR ${value.toLocaleString('en-PK')} off`;
}
