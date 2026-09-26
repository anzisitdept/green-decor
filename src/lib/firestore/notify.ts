'use client';

export type NotifyType = 'order' | 'quote' | 'contact';

/**
 * Asks the server to email a notification for a document that was just written.
 *
 * Deliberately fire-and-forget and deliberately never throws: checkout should
 * not wait on an SMTP round trip, and a mail outage must never surface to the
 * customer or interrupt a write that already succeeded. Failures are logged and
 * swallowed. The server re-reads the document through the admin SDK before
 * sending, so nothing is trusted from the client.
 */
export async function notifyByEmail(type: NotifyType, id: string): Promise<void> {
  if (!id) return;
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id }),
      // Keeps the request alive if the user navigates away straight after
      // placing an order, which is the common case on a success screen.
      keepalive: true,
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      console.error(`[notify] ${type} notification failed:`, detail?.error ?? res.status);
    }
  } catch (error) {
    console.error(`[notify] ${type} notification could not be sent:`, error);
  }
}
