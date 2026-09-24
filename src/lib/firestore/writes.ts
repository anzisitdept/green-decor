import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { serializeForWrite } from '@/lib/firestore/serialize';
import type { ContactMessage, Order, ServiceRequest } from '@/types';

export async function createOrder(order: Order): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.orders),
    serializeForWrite(order)
  );
  return ref.id;
}

export async function submitServiceRequest(request: Omit<ServiceRequest, 'id'>): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.serviceRequests),
    serializeForWrite(request)
  );
  return ref.id;
}

export async function submitContactMessage(message: Omit<ContactMessage, 'id'>): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.contactInquiries),
    serializeForWrite(message)
  );
  return ref.id;
}
