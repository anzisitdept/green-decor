'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== product.id),
          }));
          return false;
        } else {
          set((state) => ({
            items: [...state.items, product],
          }));
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'green-decor-wishlist',
      skipHydration: true,
    }
  )
);
