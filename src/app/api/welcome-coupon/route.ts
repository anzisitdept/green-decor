import { createHash, randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { normalizeContact } from '@/lib/phone';

export const runtime = 'nodejs';

const SOURCE = 'welcome-popup';
const CODE_PREFIX = 'WELCOME-';
/** No 0/O/1/I/L so codes survive being read aloud or retyped from a screen. */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;
const CODE_ATTEMPTS = 5;
const USER_AGENT_MAX = 200;
const EMAIL_MAX = 254;
const NAME_MAX = 80;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = (() => {
  const parsed = Number.parseInt(process.env.WELCOME_RATE_LIMIT_MAX ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
})();

interface OfferConfig {
  percent: number;
  minOrder: number;
  usageLimit: number;
  validDays: number;
}

function envInt(name: string, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(process.env[name] ?? '', 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function offerConfig(): OfferConfig {
  return {
    percent: envInt('WELCOME_COUPON_PERCENT', 5, 1, 100),
    minOrder: envInt('WELCOME_COUPON_MIN_ORDER', 0, 0, 10_000_000),
    usageLimit: envInt('WELCOME_COUPON_USAGE_LIMIT', 1, 1, 100_000),
    validDays: envInt('WELCOME_COUPON_VALID_DAYS', 30, 1, 3650),
  };
}

function generateCode(): string {
  let suffix = '';
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    suffix += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return `${CODE_PREFIX}${suffix}`;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Salted SHA-256, never the raw address. Without WELCOME_IP_HASH_SALT we skip
 * the field entirely rather than storing something reversible.
 */
function hashIp(ip: string): string | undefined {
  const salt = process.env.WELCOME_IP_HASH_SALT?.trim();
  if (!salt || ip === 'unknown') return undefined;
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

/**
 * Per-IP throttle. Contact dedupe stops one number being claimed twice, but
 * nothing stops someone cycling through many numbers, so the endpoint itself
 * needs a ceiling. In-memory only: on serverless this is best-effort per
 * instance, not a global limit.
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

function cleanEmail(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed.length > EMAIL_MAX) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return undefined;
  return trimmed;
}

function cleanName(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  // Collapse whitespace and strip control characters so a pasted name cannot
  // break the admin table or smuggle markup into the panel.
  const trimmed = value.replace(/[\p{Cc}\p{Cf}]/gu, ' ').replace(/\s+/g, ' ').trim();
  if (!trimmed || trimmed.length > NAME_MAX) return undefined;
  return trimmed;
}

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    return await issueCoupon(request);
  } catch (error) {
    // Never let a raw SDK message reach the customer, but do not swallow it:
    // an unconfigured service account looks identical to a generic failure
    // from the browser otherwise.
    console.error('[welcome-coupon] failed to issue coupon:', error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'We could not generate a discount code. Please try again.',
        ...(process.env.NODE_ENV === 'production' ? {} : { detail }),
      },
      { status: 500 }
    );
  }
}

async function issueCoupon(request: NextRequest) {
  const ip = clientIp(request);
  const throttleKey = hashIp(ip) ?? ip;

  if (rateLimited(throttleKey)) {
    return fail('Too many requests. Please try again later.', 429);
  }

  let body: { contact?: unknown; email?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request body.', 400);
  }

  if (typeof body.contact !== 'string') {
    return fail('A contact number is required.', 400);
  }

  const contact = normalizeContact(body.contact);
  if (!contact) {
    return fail('Please enter a valid Pakistani mobile number.', 400);
  }

  const email = cleanEmail(body.email);
  const name = cleanName(body.name);
  const db = adminDb();
  const offer = offerConfig();
  const now = new Date();
  const coupons = db.collection(COLLECTIONS.coupons);

  // Keying the document on the normalised contact makes the dedupe atomic:
  // a concurrent double submit targets the same document instead of racing to
  // create two. The read below is only used to recover the original code.
  const subscriberRef = db.collection(COLLECTIONS.welcomeSubscribers).doc(contact);
  const existing = await subscriberRef.get();
  const existingCode = existing.exists
    ? (existing.get('code') as string | undefined)
    : undefined;

  if (existingCode) {
    // Report what the code is actually worth now, not the launch offer, since
    // staff may have edited the coupon since it was issued.
    const issued = await coupons.doc(existingCode.toUpperCase()).get();
    const data = issued.data();
    return NextResponse.json({
      code: existingCode.toUpperCase(),
      type: data?.type === 'flat' ? 'flat' : 'percent',
      value: typeof data?.value === 'number' ? data.value : offer.percent,
      alreadyExisted: true,
    });
  }

  const expiresAt = new Date(now.getTime() + offer.validDays * 24 * 60 * 60 * 1000);
  const timestamp = now.toISOString();

  let code = generateCode();

  for (let attempt = 0; attempt < CODE_ATTEMPTS; attempt += 1) {
    const clash = await coupons.doc(code).get();
    if (!clash.exists) break;
    code = generateCode();
  }

  const userAgent = request.headers.get('user-agent')?.slice(0, USER_AGENT_MAX);
  const ipHash = hashIp(ip);

  // Deliberately no contact/email here. `coupons` is world-readable, so any
  // PII written to this document is public. The admin joins on `code` to read
  // the private welcomeSubscribers record instead.
  const couponData: Record<string, unknown> = {
    code,
    type: 'percent',
    value: offer.percent,
    minOrder: offer.minOrder,
    active: true,
    usedCount: 0,
    usageLimit: offer.usageLimit,
    expiresAt: expiresAt.toISOString(),
    createdAt: timestamp,
    source: SOURCE,
    note: `Welcome popup ${offer.percent}% - first order`,
    claimedAt: timestamp,
  };

  const subscriberData: Record<string, unknown> = {
    contact,
    code,
    status: 'active',
    source: SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  if (email) subscriberData.email = email;
  if (ipHash) subscriberData.ipHash = ipHash;
  if (userAgent) subscriberData.userAgent = userAgent;

  // Mirror the person into `users` so they show up in the admin Users panel
  // alongside real accounts, with their contact details visible. Keyed by the
  // normalised contact because a popup visitor has no auth uid; auth uids are
  // long random strings, so the two key spaces cannot collide. Merge-only: an
  // existing account keeps its own uid, name and role.
  const userData: Record<string, unknown> = {
    name: name || `Guest ${contact.slice(-4)}`,
    email: email || '',
    phone: contact,
    role: 'user',
    status: 'active',
    source: SOURCE,
    welcomeCode: code,
    welcomeClaimedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const batch = db.batch();
  batch.set(coupons.doc(), couponData);
  batch.set(subscriberRef, subscriberData);
  batch.set(db.collection(COLLECTIONS.users).doc(contact), userData, { merge: true });
  await batch.commit();

  return NextResponse.json(
    { code, type: 'percent', value: offer.percent, alreadyExisted: false },
    { status: 201 }
  );
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
