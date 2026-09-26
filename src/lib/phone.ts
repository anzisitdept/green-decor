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
