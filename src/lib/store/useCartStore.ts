'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  discountPercentage: number;
  
  addItem: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  
  getItemsCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountPercentage: 0,

      addItem: (product, quantity = 1, selectedOption) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedOption === selectedOption
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated };
          }

          return {
            items: [...state.items, { product, quantity, selectedOption }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercentage: 0 });
      },

      applyPromoCode: (code: string) => {
        const cleaned = code.trim().toUpperCase();
        if (cleaned === 'GREENDECOR10' || cleaned === 'PLANT10') {
          set({ promoCode: cleaned, discountPercentage: 10 });
          return { success: true, message: '10% discount applied successfully!' };
        } else if (cleaned === 'WELCOME15') {
          set({ promoCode: cleaned, discountPercentage: 15 });
          return { success: true, message: '15% Welcome discount applied!' };
        } else if (cleaned === 'FREESHIP') {
          set({ promoCode: cleaned, discountPercentage: 5 });
          return { success: true, message: 'Promo applied! Extra discount enabled.' };
        }
        return { success: false, message: 'Invalid promo code. Try "GREENDECOR10" or "WELCOME15"' };
      },

      removePromoCode: () => {
        set({ promoCode: null, discountPercentage: 0 });
      },

      getItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const effectivePrice = item.product.salePrice ?? item.product.price;
          return sum + effectivePrice * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const discountPct = get().discountPercentage;
        return (subtotal * discountPct) / 100;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free delivery across Pakistan for orders above PKR 4,000
        return subtotal >= 4000 ? 0 : 350;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'green-decor-cart',
    }
  )
);
