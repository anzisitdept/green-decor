'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, OrderAddress } from '@/types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { saveUserProfile, readUserProfile } from '@/lib/firestore/users';
import { normalizeContact, phoneToAuthEmail, phoneFromAuthEmail } from '@/lib/phone';

export class InvalidPhoneError extends Error {
  constructor() {
    super('Enter a valid Pakistani mobile number, e.g. 0300 1234567.');
    this.name = 'InvalidPhoneError';
  }
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: OrderAddress) => void;
  removeAddress: (index: number) => void;
}

function requireNormalizedPhone(phone: string): string {
  const normalized = normalizeContact(phone);
  if (!normalized) throw new InvalidPhoneError();
  return normalized;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthReady: false,

      login: async (phone, password) => {
        const normalized = requireNormalizedPhone(phone);
        await signInWithEmailAndPassword(auth, phoneToAuthEmail(normalized), password);
      },

      register: async (name, phone, password) => {
        const normalized = requireNormalizedPhone(phone);
        const credential = await createUserWithEmailAndPassword(
          auth,
          phoneToAuthEmail(normalized),
          password
        );
        await updateProfile(credential.user, { displayName: name });
        await saveUserProfile(credential.user.uid, {
          name,
          phone: normalized,
          createdAt: new Date().toISOString(),
        });
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: [...state.user.addresses, address],
            },
          };
        });
      },

      removeAddress: (index) => {
        set((state) => {
          if (!state.user) return state;
          const updated = [...state.user.addresses];
          updated.splice(index, 1);
          return {
            user: {
              ...state.user,
              addresses: updated,
            },
          };
        });
      },
    }),
    {
      name: 'green-decor-auth',
    }
  )
);

/**
 * The Auth record for a phone-keyed account carries no usable display fields:
 * the email is synthetic and `phoneNumber` is always null because the
 * credential is an email/password one. The phone is therefore recovered from
 * the synthetic email, and the name/role/status are filled in from Firestore
 * by `refreshProfileFromFirestore` a moment later.
 */
const toUserProfile = (u: User): UserProfile => ({
  uid: u.uid,
  name: u.displayName || 'Green Decor Member',
  email: phoneFromAuthEmail(u.email) ? undefined : u.email || undefined,
  phone: phoneFromAuthEmail(u.email) || '',
  photoURL: u.photoURL || undefined,
  role: 'user',
  status: 'active',
  addresses: [],
  createdAt: new Date().toISOString(),
});

if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const previous = useAuthStore.getState().user;
      const profile = toUserProfile(fbUser);
      if (previous && previous.uid === fbUser.uid && previous.addresses.length > 0) {
        profile.addresses = previous.addresses;
      }
      useAuthStore.setState({ user: profile, isAuthenticated: true, isAuthReady: true });

      // Correct the name, role, and status from Firestore. Without this the
      // header would show "Green Decor Member" for anyone whose profile was
      // created ahead of time in the admin panel, and addresses would be lost
      // on a fresh device.
      void refreshProfileFromFirestore(fbUser.uid, previous);
    } else {
      useAuthStore.setState({ user: null, isAuthenticated: false, isAuthReady: true });
    }
  });
}

async function refreshProfileFromFirestore(uid: string, previous: UserProfile | null) {
  try {
    const stored = await readUserProfile(uid);
    if (!stored) return;

    const current = useAuthStore.getState().user;
    if (!current || current.uid !== uid) return;

    const addresses =
      previous && previous.uid === uid && previous.addresses.length > 0
        ? previous.addresses
        : current.addresses;

    useAuthStore.setState({
      user: {
        ...current,
        name: stored.name || current.name,
        phone: stored.phone || current.phone,
        role: stored.role === 'admin' ? 'admin' : 'user',
        status: stored.status === 'disabled' ? 'disabled' : 'active',
        createdAt: stored.createdAt || current.createdAt,
        addresses,
      },
    });
  } catch {
    /* offline or rules not deployed yet: keep the Auth-derived profile */
  }
}
