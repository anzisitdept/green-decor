'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { OrderAddress } from '@/types';

interface CheckoutStore {
  /**
   * Delivery details captured on the checkout step. The payment step is a
   * separate route, so the form has to hand its values over; sessionStorage
   * keeps them for the length of the checkout without leaving a half-finished
   * order sitting in localStorage.
   */
  address: OrderAddress | null;
  setAddress: (address: OrderAddress) => void;
  clear: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      clear: () => set({ address: null }),
    }),
    {
      name: 'green-decor-checkout-draft',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
