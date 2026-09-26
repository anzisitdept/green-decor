'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, OrderAddress } from '@/types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { saveUserProfile } from '@/lib/firestore/users';

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: OrderAddress) => void;
  removeAddress: (index: number) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthReady: false,

      login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },

      register: async (name, email, password, phone) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        const current = useAuthStore.getState().user;
        if (current && phone) {
          useAuthStore.setState({ user: { ...current, phone } });
        }
        await saveUserProfile(credential.user.uid, {
          name,
          email,
          phone: phone || undefined,
          createdAt: new Date().toISOString(),
        });
      },

      loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, provider);
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

const toUserProfile = (u: User): UserProfile => ({
  uid: u.uid,
  name: u.displayName || 'Green Decor Member',
  email: u.email || '',
  phone: u.phoneNumber || '',
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

      // Mirror into `users/{uid}` on every sign-in, not just on the email
      // registration form. Google sign-in never went through `register`, which
      // left those accounts with no Firestore document and therefore invisible
      // in the admin Users panel. Failures are swallowed: a profile-sync problem
      // must never block someone from shopping.
      void saveUserProfile(fbUser.uid, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone || undefined,
        photoURL: profile.photoURL,
        createdAt: previous?.createdAt ?? profile.createdAt,
      }).catch(() => {
        /* offline, permission denied, or rules not deployed yet */
      });
    } else {
      useAuthStore.setState({ user: null, isAuthenticated: false, isAuthReady: true });
    }
  });
}
