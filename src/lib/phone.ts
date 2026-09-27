/**
 * Phone normalisation shared by the browser and the server-side coupon
 * endpoint. Deliberately free of any 'use client' directive so the
 * `/api/welcome-coupon` route handler can import it too.
 */

/**
 * Normalises a PKR phone number to digits with a 92 country code so the same
 * visitor is always deduplicated to one subscriber document.
 * Accepts 03001234567, +923001234567, 923001234567 and spaced variants.
 * Returns null when the result is not a plausible PKR mobile number.
 */
export function normalizeContact(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('0092')) digits = digits.slice(4);
  else if (digits.startsWith('92')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);

  digits = `92${digits}`;

  // Pakistani mobile numbers are 92 followed by 10 digits starting 3.
  if (!/^923\d{9}$/.test(digits)) return null;
  return digits;
}

export function formatContact(input: string): string {
  const normalized = normalizeContact(input);
  if (!normalized) return input.trim();
  return `+${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}

/**
 * Firebase Auth has no phone+password provider, so the phone number is stored
 * as a synthetic email address and the real number is kept on the Firestore
 * profile. This is the single place that mapping is defined; register and
 * login both go through it so a normalisation mismatch can never lock someone
 * out of their own account.
 *
 * The domain is deliberately unroutable in practice and must stay identical
 * everywhere it appears, including the admin panel and the seed scripts.
 */
export const PHONE_AUTH_EMAIL_DOMAIN = 'greendecor.com';

/** Builds the Firebase Auth email for a phone number. */
export function phoneToAuthEmail(normalizedPhone: string): string {
  return `${normalizedPhone}@${PHONE_AUTH_EMAIL_DOMAIN}`;
}

/**
 * Recovers the phone number from a synthetic auth email. Returns null for a
 * real email, which is how callers tell a legacy account apart from a
 * phone-keyed one.
 */
export function phoneFromAuthEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const suffix = `@${PHONE_AUTH_EMAIL_DOMAIN}`;
  if (!email.toLowerCase().endsWith(suffix)) return null;
  const local = email.slice(0, -suffix.length);
  return /^923\d{9}$/.test(local) ? local : null;
}
