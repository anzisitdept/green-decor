import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StoredUserProfile {
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export async function saveUserProfile(uid: string, profile: StoredUserProfile): Promise<void> {
  await setDoc(doc(db, 'users', uid), profile, { merge: true });
}