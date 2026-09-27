import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile, UserRole, UserStatus } from '@/types';

export interface StoredUserProfile {
  name: string;
  phone?: string;
  photoURL?: string;
  createdAt: string;
}

/**
 * Reads the stored profile for an account. Returns null when the document is
 * missing so callers can fall back to whatever the Auth record implies.
 */
export async function readUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    name: (data.name as string) || 'Green Decor Member',
    email: (data.email as string) || undefined,
    phone: (data.phone as string) || undefined,
    photoURL: (data.photoURL as string) || undefined,
    role: (data.role as UserRole) === 'admin' ? 'admin' : 'user',
    status: (data.status as UserStatus) === 'disabled' ? 'disabled' : 'active',
    addresses: [],
    createdAt: (data.createdAt as string) || new Date().toISOString(),
  };
}

/**
 * Mirrors the auth account into `users/{uid}` so the admin panel can list it.
 *
 * `role` and `status` are written **only when the document is created**. They
 * are deliberately left alone on an existing record: the same person may have
 * been promoted to admin in the admin panel, and blindly rewriting `role` on
 * every sign-in would silently demote them and lock them out of the panel.
 *
 * Firestore rules reject a client that tries to create its own document with
 * `role: 'admin'`, so creating new records as `'user'` is safe.
 *
 * The admin panel can also pre-create a profile under `users/{phone}` before
 * the person ever signs up. This function cannot claim that document: the
 * `/users` rules only let a client touch its own uid-keyed record, so a
 * non-admin writing to a phone-keyed document is denied outright. The admin
 * users panel pairs the two records on read instead.
 */
export async function saveUserProfile(uid: string, profile: StoredUserProfile): Promise<void> {
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    // Only touch the fields this function owns, and only when they drifted.
    const current = existing.data() as Partial<StoredUserProfile>;
    const changed =
      current.name !== profile.name ||
      (current.phone ?? '') !== (profile.phone ?? '') ||
      (current.photoURL ?? '') !== (profile.photoURL ?? '');
    if (!changed) return;

    await setDoc(ref, { ...profile, uid }, { merge: true });
    return;
  }

  await setDoc(
    ref,
    { ...profile, uid, role: 'user', status: 'active', source: 'registration' },
    { merge: true }
  );
}
