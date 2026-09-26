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

function initAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  return initializeApp({
    credential: cert({
      projectId: required('FIREBASE_PROJECT_ID'),
      clientEmail: required('FIREBASE_CLIENT_EMAIL'),
      // Pasting a PEM into a single-line env var turns its newlines into
      // literal backslash-n sequences, which the SDK rejects.
      privateKey: required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
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
