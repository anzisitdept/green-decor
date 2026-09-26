import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { sendMail, getMailConfig } from '@/lib/email';
import {
  buildOrderNotification,
  buildQuoteNotification,
  buildContactNotification,
} from '@/lib/emailTemplates';
import type { SendMailInput } from '@/lib/email';
import type { Order, ServiceRequest, ContactMessage } from '@/types';

export const runtime = 'nodejs';

type NotifyType = 'order' | 'quote' | 'contact';

const COLLECTION_FOR: Record<NotifyType, string> = {
  order: COLLECTIONS.orders,
  quote: COLLECTIONS.serviceRequests,
  contact: COLLECTIONS.contactInquiries,
};

function isNotifyType(value: unknown): value is NotifyType {
  return value === 'order' || value === 'quote' || value === 'contact';
}

/**
 * Turns admin-SDK values into plain JSON. The stored documents contain native
 * Firestore Timestamps, which arrive here as `firebase-admin` Timestamp objects
 * — a different class from the client SDK's, so they must be detected by shape
 * rather than `instanceof` or they would render as "[object Object]" in an
 * email body.
 */
function toPlain(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();

  if (value && typeof value === 'object') {
    const maybeTimestamp = value as { toDate?: unknown };
    if (typeof maybeTimestamp.toDate === 'function') {
      const date = (maybeTimestamp.toDate as () => Date)();
      if (date instanceof Date) return date.toISOString();
    }
    if (Array.isArray(value)) return value.map(toPlain);

    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val === undefined) continue;
      out[key] = toPlain(val);
    }
    return out;
  }

  return value;
}

function buildFor(type: NotifyType, data: Record<string, unknown>): SendMailInput {
  // The shape of a Firestore document is not discriminable at runtime, so each
  // cast is checked by the collection the document was read from above.
  switch (type) {
    case 'order':
      return buildOrderNotification(data as unknown as Order);
    case 'quote':
      return buildQuoteNotification(data as unknown as ServiceRequest);
    case 'contact':
      return buildContactNotification(data as unknown as ContactMessage);
  }
}

/**
 * At most one notification per document per instance, so a double submit or a
 * page refresh cannot spam the inbox. In-memory only, so it is a best-effort
 * guard on serverless rather than a global guarantee.
 */
const alreadySent = new Set<string>();

export async function POST(request: Request) {
  if (!getMailConfig()) {
    return NextResponse.json(
      { ok: false, error: 'Email is not configured on this server.' },
      { status: 503 }
    );
  }

  let body: { type?: unknown; id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!isNotifyType(body.type)) {
    return NextResponse.json({ ok: false, error: 'Unknown notification type.' }, { status: 400 });
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id || id.length > 128) {
    return NextResponse.json({ ok: false, error: 'A valid document id is required.' }, { status: 400 });
  }

  const key = `${body.type}:${id}`;
  if (alreadySent.has(key)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // Re-read the document server-side through the admin SDK, so the notification
  // reflects what was actually stored and can never be driven by caller input.
  const snap = await adminDb().collection(COLLECTION_FOR[body.type]).doc(id).get();

  if (!snap.exists) {
    return NextResponse.json({ ok: false, error: 'Document not found.' }, { status: 404 });
  }

  const data = toPlain({ id: snap.id, ...snap.data() }) as Record<string, unknown>;
  const result = await sendMail(buildFor(body.type, data));

  if (!result.sent) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  alreadySent.add(key);
  return NextResponse.json({ ok: true, dryRun: result.dryRun });
}
