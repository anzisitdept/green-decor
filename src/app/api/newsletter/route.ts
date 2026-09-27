import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { normalizeContact } from '@/lib/phone';

export const runtime = 'nodejs';

const USER_AGENT_MAX = 200;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = (() => {
  const parsed = Number.parseInt(process.env.NEWSLETTER_RATE_LIMIT_MAX ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
})();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Per-IP throttle. The footer form is on every page, so without a ceiling it
 * becomes a way to hammer the database. In-memory only: best-effort per
 * serverless instance rather than a global limit.
 */
const recentHits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (recentHits.get(key) ?? []).filter((t) => t > cutoff);

  if (hits.length >= RATE_LIMIT_MAX) {
    recentHits.set(key, hits);
    return true;
  }

  hits.push(now);
  recentHits.set(key, hits);

  if (recentHits.size > 5000) {
    for (const [k, v] of recentHits) {
      if (v.every((t) => t <= cutoff)) recentHits.delete(k);
    }
  }

  return false;
}

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Footer newsletter signup.
 *
 * Deliberately does NOT mint a welcome code: a newsletter subscription is not a
 * coupon claim, and the two would otherwise be indistinguishable in the admin
 * list. The record is keyed by the normalised phone number, which is the same
 * key the welcome-coupon flow uses, so somebody who does both ends up as one
 * subscriber rather than two.
 */
export async function POST(request: NextRequest) {
  if (rateLimited(clientIp(request))) {
    return fail('Too many requests. Please try again later.', 429);
  }

  let body: { contact?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request body.', 400);
  }

  if (typeof body.contact !== 'string') {
    return fail('A phone number is required.', 400);
  }

  const contact = normalizeContact(body.contact);
  if (!contact) {
    return fail('Please enter a valid Pakistani mobile number, e.g. 0300 1234567.', 400);
  }

  const db = adminDb();
  const ref = db.collection(COLLECTIONS.welcomeSubscribers).doc(contact);
  const existing = await ref.get();
  const timestamp = new Date().toISOString();

  // Merge-only, and never overwrite a claim that is already there: a repeat
  // subscriber keeps the code they were issued, and `createdAt` stays put so
  // the admin list does not show a false "joined" date on every resubscribe.
  const patch: Record<string, unknown> = {
    contact,
    newsletter: true,
    updatedAt: timestamp,
  };
  if (!existing.exists) {
    patch.status = 'active';
    patch.source = 'newsletter';
    patch.createdAt = timestamp;
  }

  const userAgent = request.headers.get('user-agent')?.slice(0, USER_AGENT_MAX);
  if (userAgent && !existing.get('userAgent')) patch.userAgent = userAgent;

  await ref.set(patch, { merge: true });

  const alreadySubscribed = Boolean(existing.get('newsletter'));

  return NextResponse.json(
    { ok: true, contact, alreadySubscribed },
    { status: alreadySubscribed ? 200 : 201 }
  );
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
