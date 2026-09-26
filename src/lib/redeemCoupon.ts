/**
 * Client helper for recording a coupon redemption.
 *
 * Kept separate from `welcomeCoupon.ts` because redemption applies to every
 * coupon, not just the ones minted by the welcome popup.
 */

export const REDEEM_COUPON_ENDPOINT = '/api/redeem-coupon';

export interface RedeemCouponResponse {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  usedCount: number;
  usageLimit: number | null;
}

/**
 * Consumes one use of the coupon. Throws with a customer-safe message when the
 * code is invalid, expired, inactive or exhausted, so checkout can block the
 * order rather than quietly granting an unverified discount.
 */
export async function redeemCoupon(code: string): Promise<RedeemCouponResponse> {
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) {
    throw new Error('No promo code to redeem.');
  }

  let response: Response;
  try {
    response = await fetch(REDEEM_COUPON_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: cleaned }),
    });
  } catch {
    throw new Error('Could not reach the server to verify your promo code. Please try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && typeof payload.error === 'string' && payload.error
        ? payload.error
        : 'We could not verify your promo code. Please try again.';
    throw new Error(message);
  }

  return {
    code: typeof payload.code === 'string' ? payload.code : cleaned,
    type: payload.type === 'flat' ? 'flat' : 'percent',
    value: typeof payload.value === 'number' ? payload.value : 0,
    usedCount: typeof payload.usedCount === 'number' ? payload.usedCount : 0,
    usageLimit: typeof payload.usageLimit === 'number' ? payload.usageLimit : null,
  };
}
