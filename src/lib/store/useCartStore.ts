'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem, Coupon, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  discountType: 'percent' | 'flat' | null;
  discountValue: number;
  shippingFreeThreshold: number;
  shippingFlatFee: number;

  addItem: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  setShippingConfig: (threshold: number, fee: number) => void;

  getItemsCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
}

const FALLBACK_COUPONS: Record<string, { type: 'percent' | 'flat'; value: number }> = {
  GREENDECOR10: { type: 'percent', value: 10 },
  PLANT10: { type: 'percent', value: 10 },
  WELCOME15: { type: 'percent', value: 15 },
  FREESHIP: { type: 'percent', value: 5 },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountType: null,
      discountValue: 0,
      shippingFreeThreshold: 4000,
      shippingFlatFee: 350,

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
        set({ items: [], promoCode: null, discountType: null, discountValue: 0 });
      },

      applyPromoCode: async (code: string) => {
        const cleaned = code.trim().toUpperCase();
        if (!cleaned) {
          return { success: false, message: 'Please enter a promo code.' };
        }

        const subtotal = get().getSubtotal();
        let coupon: Coupon | undefined;
        let lookupFailed = false;

        try {
          const snap = await getDocs(
            query(collection(db, 'coupons'), where('code', '==', cleaned))
          );
          coupon = snap.docs
            .map((d) => ({ ...(d.data() as Omit<Coupon, 'id'>), id: d.id }))
            .find((c) => c.active !== false);
        } catch {
          lookupFailed = true;
        }

        if (coupon) {
          if (coupon.minOrder && subtotal < coupon.minOrder) {
            return {
              success: false,
              message: `Minimum order for ${cleaned} is PKR ${coupon.minOrder.toLocaleString('en-PK')}.`,
            };
          }
          if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
            return { success: false, message: 'This promo code has expired.' };
          }
          if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { success: false, message: 'This promo code has reached its usage limit.' };
          }
          set({
            promoCode: cleaned,
            discountType: coupon.type,
            discountValue: coupon.value,
          });
          const label = coupon.type === 'percent' ? `${coupon.value}% off` : `PKR ${coupon.value} off`;
          return { success: true, message: `Promo applied — ${label}!` };
        }

        const fallback = FALLBACK_COUPONS[cleaned];
        if (fallback && lookupFailed) {
          set({ promoCode: cleaned, discountType: fallback.type, discountValue: fallback.value });
          return { success: true, message: 'Promo applied successfully!' };
        }

        return { success: false, message: 'Invalid promo code. Please check and try again.' };
      },

      removePromoCode: () => {
        set({ promoCode: null, discountType: null, discountValue: 0 });
      },

      setShippingConfig: (threshold, fee) => {
        set({
          shippingFreeThreshold: Number.isFinite(threshold) ? threshold : 0,
          shippingFlatFee: Number.isFinite(fee) ? fee : 0,
        });
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
        const { discountType, discountValue } = get();
        if (!discountType || discountValue <= 0) return 0;
        if (discountType === 'flat') return Math.min(discountValue, subtotal);
        return (subtotal * discountValue) / 100;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const { shippingFreeThreshold, shippingFlatFee } = get();
        return subtotal >= shippingFreeThreshold ? 0 : shippingFlatFee;
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
