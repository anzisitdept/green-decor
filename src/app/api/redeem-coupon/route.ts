import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore/collections';

export const runtime = 'nodejs';

class RedeemError extends Error {
  constructor(
    message: string,
    readonly reason: string,
    readonly status: number
  ) {
    super(message);
  }
}

/**
 * Records one redemption of a coupon.
 *
 * The increment runs in a transaction so two shoppers racing for the last use
 * of a single-use code cannot both win: the read of usedCount and the write
 * are serialised, and the loser is rejected with the usage-limit message.
 *
 * This has to be server-side. Firestore rules correctly refuse coupon writes
 * from anonymous clients, so the browser cannot increment the counter itself.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';

    if (!code) {
      throw new RedeemError('A promo code is required.', 'missing_code', 400);
    }

    const db = adminDb();
    const now = new Date().toISOString();

    const result = await db.runTransaction(async (tx) => {
      const coupons = db.collection(COLLECTIONS.coupons);
      const snap = await tx.get(coupons.where('code', '==', code));

      if (snap.empty) {
        throw new RedeemError(
          'Invalid promo code. Please check and try again.',
          'not_found',
          404
        );
      }

      const ref = snap.docs[0].ref;
      const data = snap.docs[0].data() ?? {};

      if (data.active === false) {
        throw new RedeemError('This promo code is no longer active.', 'inactive', 409);
      }

      if (typeof data.expiresAt === 'string' && new Date(data.expiresAt).getTime() < Date.now()) {
        throw new RedeemError('This promo code has expired.', 'expired', 409);
      }

      const usedCount = typeof data.usedCount === 'number' ? data.usedCount : 0;
      const usageLimit = typeof data.usageLimit === 'number' ? data.usageLimit : null;

      if (usageLimit !== null && usedCount >= usageLimit) {
        throw new RedeemError(
          'This promo code has reached its usage limit.',
          'exhausted',
          409
        );
      }

      // Firestore requires every read to precede every write, so resolve the
      // subscriber now, after the cheap rejections and before any mutation.
      // Look it up by `code` rather than by a contact copied onto the coupon:
      // coupon documents are world-readable, so they carry no PII.
      let subscriberRef = null;
      if (data.source === 'welcome-popup') {
        const subSnap = await tx.get(
          db.collection(COLLECTIONS.welcomeSubscribers).where('code', '==', code)
        );
        if (!subSnap.empty) {
          subscriberRef = subSnap.docs[0].ref;
        } else {
          console.warn(`[redeem-coupon] no welcome subscriber for code ${code}`);
        }
      }

      tx.update(ref, { usedCount: usedCount + 1 });

      // Keep the admin welcome-subscriber list in step with the coupon.
      if (subscriberRef) {
        tx.set(subscriberRef, { status: 'used', updatedAt: now }, { merge: true });
      }

      return {
        code,
        type: data.type === 'flat' ? 'flat' : 'percent',
        value: typeof data.value === 'number' ? data.value : 0,
        usedCount: usedCount + 1,
        usageLimit,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof RedeemError) {
      return NextResponse.json({ error: error.message, reason: error.reason }, { status: error.status });
    }
    console.error('[redeem-coupon] failed to redeem:', error);
    return NextResponse.json(
      {
        error: 'We could not verify your promo code. Please try again.',
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : { detail: error instanceof Error ? error.message : String(error) }),
      },
      { status: 500 }
    );
  }
}
