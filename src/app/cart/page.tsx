'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatPKR } from '@/lib/utils';

export default function FullCartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getItemsCount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#14402a] mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#14402a]">Your Shopping Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-[#52685a] max-w-md mx-auto mt-2 mb-8">
          Explore our collection of acclimatized live plants, designer ceramic pots, organic fertilizers, and botanical styling accessories.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#14402a] text-white text-xs sm:text-sm font-bold hover:bg-[#1b5539] transition-all shadow-md"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#14402a]">
          Your Shopping Bag ({getItemsCount()})
        </h1>
        <p className="text-xs sm:text-sm text-[#52685a] mt-1">
          Review your selected plants and decor pieces before proceeding to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ee]">
            <span className="text-xs font-bold text-[#52685a] uppercase">Item</span>
            <span className="text-xs font-bold text-[#52685a] uppercase">Total</span>
          </div>

          <div className="space-y-4">
            {items.map(({ product, quantity, selectedOption }) => {
              const effectivePrice = product.salePrice ?? product.price;
              return (
                <div
                  key={`${product.id}-${selectedOption || ''}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#fafbf9] border border-[#edf3ec]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-[#e5ece3]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-sm font-bold text-[#172b21] hover:text-[#14402a] line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-[#52685a] mt-0.5">
                        {formatPKR(effectivePrice)} each
                      </p>
                      {selectedOption && (
                        <span className="text-[10px] text-[#52685a] bg-white px-2 py-0.5 rounded border border-[#e5ece3] mt-1 inline-block">
                          {selectedOption}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f0f4ee]">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#d6e2d3] rounded-xl bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-[#14402a] hover:bg-[#f4f7f2]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#172b21]">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1 text-[#14402a] hover:bg-[#f4f7f2]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#14402a] min-w-[90px] text-right">
                      {formatPKR(effectivePrice * quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#f0f4ee] flex items-center justify-between">
            <Link
              href="/shop"
              className="text-xs font-bold text-[#14402a] hover:underline"
            >
              &larr; Add more plants or decor
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Order Summary Column (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-6 sticky top-24">
          <h3 className="text-base font-serif font-bold text-[#14402a] pb-4 border-b border-[#f0f4ee]">
            Order Summary
          </h3>

          {/* Promo code */}
          <div>
            {promoCode ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#eaf0e7] text-xs font-semibold text-[#14402a]">
                <span>Applied: {promoCode}</span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-red-500 hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs uppercase focus:ring-2 focus:ring-[#14402a]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#eaf0e7] text-[#14402a] text-xs font-bold hover:bg-[#d8e5d4]"
                >
                  Apply
                </button>
              </form>
            )}
            {couponMsg && (
              <p className={`text-[11px] mt-1 ${couponMsg.isError ? 'text-red-500' : 'text-emerald-700'}`}>
                {couponMsg.text}
              </p>
            )}
          </div>

          {/* Pricing table */}
          <div className="space-y-2.5 text-xs text-[#52685a] pt-2 border-t border-[#f0f4ee]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#172b21]">{formatPKR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount</span>
                <span>-{formatPKR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pakistan Delivery</span>
              <span className="font-semibold text-[#172b21]">
                {shipping === 0 ? <span className="text-emerald-700 uppercase font-bold">FREE</span> : formatPKR(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#14402a] pt-3 border-t border-[#f0f4ee]">
              <span>Grand Total</span>
              <span>{formatPKR(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-2xl bg-[#14402a] text-white text-xs sm:text-sm font-bold hover:bg-[#1b5539] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#718b7a] pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cash on Delivery & Bank Transfer Accepted</span>
          </div>
        </div>

      </div>
    </div>
  );
}
