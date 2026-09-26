import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StoredUserProfile {
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  createdAt: string;
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
 */
export async function saveUserProfile(uid: string, profile: StoredUserProfile): Promise<void> {
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    // Only touch the fields this function owns, and only when they drifted.
    const current = existing.data() as Partial<StoredUserProfile>;
    const changed =
      current.name !== profile.name ||
      current.email !== profile.email ||
      (current.phone ?? '') !== (profile.phone ?? '') ||
      (current.photoURL ?? '') !== (profile.photoURL ?? '');
    if (!changed) return;

    await setDoc(ref, { ...profile, uid }, { merge: true });
    return;
  }

  await setDoc(
    ref,
    { ...profile, uid, role: 'user', status: 'active' },
    { merge: true }
  );
}
