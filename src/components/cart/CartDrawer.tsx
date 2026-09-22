'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { formatPKR } from '@/lib/utils';

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
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

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();
  const freeShippingThreshold = 4000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#f0f4ee] flex items-center justify-between bg-[#fbfcf9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8f1e6] flex items-center justify-center text-[#14402a]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#14402a]">Your Shopping Bag</h3>
                <p className="text-xs text-[#52685a]">{getItemsCount()} item{getItemsCount() !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#f4f7f2] border-b border-[#e5ece3]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="font-semibold text-[#14402a] flex items-center gap-1">
                  🎉 You unlocked <strong>FREE Delivery</strong> across Pakistan!
                </span>
              ) : (
                <span className="text-[#52685a]">
                  Add <strong>{formatPKR(remainingForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
              <span className="font-bold text-[#14402a]">{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-2 bg-[#dce7da] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#14402a] transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#f4f7f2] flex items-center justify-center text-[#14402a] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-serif font-semibold text-lg text-[#14402a]">Your Bag is Empty</h4>
                <p className="text-xs text-[#52685a] max-w-xs mt-1 mb-6">
                  Explore our lush indoor plants, handcrafted planters, and botanical accessories.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[#14402a] text-white text-xs font-semibold hover:bg-[#1b5539] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity, selectedOption }) => {
                const effectivePrice = product.salePrice ?? product.price;
                return (
                  <div
                    key={`${product.id}-${selectedOption || ''}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-[#fafbf9] border border-[#edf3ec] hover:border-[#d6e2d3] transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#e5ece3]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={closeCart}
                            className="text-xs font-semibold text-[#172b21] hover:text-[#14402a] line-clamp-2"
                          >
                            {product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {selectedOption && (
                          <span className="text-[10px] text-[#52685a] bg-white px-1.5 py-0.5 rounded border border-[#e5ece3] mt-1 inline-block">
                            {selectedOption}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f0f4ee]">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#d6e2d3] rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 px-2 text-[#14402a] hover:bg-[#f4f7f2]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#172b21]">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 px-2 text-[#14402a] hover:bg-[#f4f7f2]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#14402a]">
                            {formatPKR(effectivePrice * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#fbfcf9] border-t border-[#f0f4ee] space-y-4">
              {/* Promo Code Input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eaf0e7] border border-[#c8d9c5] text-xs">
                    <div className="flex items-center gap-1.5 text-[#14402a] font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code: {promoCode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-red-500 hover:underline text-[11px] font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. GREENDECOR10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs focus:outline-none focus:ring-2 focus:ring-[#14402a] uppercase bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#eaf0e7] text-[#14402a] text-xs font-bold hover:bg-[#d8e5d4] transition-colors shrink-0"
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

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#52685a] pt-2 border-t border-[#f0f4ee]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#172b21]">{formatPKR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (Across Pakistan)</span>
                  <span className="font-semibold text-[#172b21]">
                    {shipping === 0 ? <span className="text-emerald-700 uppercase font-bold">FREE</span> : formatPKR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#14402a] pt-2 border-t border-[#f0f4ee]">
                  <span>Estimated Total</span>
                  <span>{formatPKR(total)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl border border-[#14402a] text-[#14402a] text-center text-xs font-bold hover:bg-[#f4f7f2] transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl bg-[#14402a] text-white text-center text-xs font-bold hover:bg-[#1b5539] transition-all shadow-md hover:shadow flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#718b7a] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery & Secure Bank Transfers Accepted</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
