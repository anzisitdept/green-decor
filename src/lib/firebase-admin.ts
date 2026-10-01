import 'server-only';

import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. The welcome coupon endpoint needs Firebase service-account credentials.`
    );
  }
  return value;
}

/**
 * A PEM has to reach the SDK as `-----BEGIN PRIVATE KEY-----\n<base64>\n-----END
 * PRIVATE KEY-----`. Depending on where the value was typed, the same key
 * arrives in several shapes: with the double quotes from a .env file still
 * around, with literal `\n` escapes, with real CRLF newlines from a Windows
 * editor, or with a mix of all three. The SDK rejects every one of those
 * variants, and because the failure surfaces as a generic 500 to the visitor
 * it is very hard to spot. Normalise them all here instead.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1).trim();
  }

  return key
    .replace(/\\r\\n|\\n/g, '\n')
    .replace(/\r\n|\r/g, '\n')
    // Base64 and the PEM markers never contain a backslash, so anything left
    // over is a doubled escape from a shell or dashboard that escaped twice.
    .replace(/\\/g, '')
    .trim();
}

function initAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  return initializeApp({
    credential: cert({
      // The browser already needs this value, so fall back to it rather than
      // failing the whole coupon flow because one copy is missing.
      projectId:
        process.env.FIREBASE_PROJECT_ID?.trim() ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
        (() => {
          throw new Error(
            'Missing FIREBASE_PROJECT_ID. Set it, or NEXT_PUBLIC_FIREBASE_PROJECT_ID as a fallback.'
          );
        })(),
      clientEmail: required('FIREBASE_CLIENT_EMAIL'),
      privateKey: normalizePrivateKey(required('FIREBASE_PRIVATE_KEY')),
    }),
  });
}

let cached: Firestore | null = null;

/**
 * Server-side Firestore handle. The admin SDK bypasses security rules, which
 * is the whole point: anonymous browsers must never be able to write to
 * `coupons` directly. Every write has to come through a trusted handler.
 */
export function adminDb(): Firestore {
  if (!cached) cached = getFirestore(initAdminApp());
  return cached;
}
