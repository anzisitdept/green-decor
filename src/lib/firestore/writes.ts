import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { serializeForWrite } from '@/lib/firestore/serialize';
import { notifyByEmail } from '@/lib/firestore/notify';
import type { ContactMessage, Order, ServiceRequest } from '@/types';

export async function createOrder(order: Order): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.orders),
    serializeForWrite(order)
  );
  // Not awaited: the order is already saved, and checkout should not block on
  // an SMTP round trip. `notifyByEmail` never rejects, so there is no unhandled
  // rejection here.
  void notifyByEmail('order', ref.id);
  return ref.id;
}

export async function submitServiceRequest(request: Omit<ServiceRequest, 'id'>): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.serviceRequests),
    serializeForWrite(request)
  );
  void notifyByEmail('quote', ref.id);
  return ref.id;
}

export async function submitContactMessage(message: Omit<ContactMessage, 'id'>): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.contactInquiries),
    serializeForWrite(message)
  );
  void notifyByEmail('contact', ref.id);
  return ref.id;
}
