'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building, 
  Check, 
  ArrowRight,
  ShoppingBag,
  MapPin,
  Lock
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useOrdersStore } from '@/lib/store/useOrdersStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { formatPKR } from '@/lib/utils';
import { createOrder as persistOrder } from '@/lib/firestore/writes';
import { redeemCoupon } from '@/lib/redeemCoupon';
import { OrderAddress, PaymentMethod } from '@/types';
import PakistanLocationFields, { LocationSelection } from '@/components/checkout/PakistanLocationFields';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, promoCode, getSubtotal, getDiscount, getShippingFee, getTotal, clearCart } = useCartStore();
  const { createOrder } = useOrdersStore();
  const { showToast } = useUIStore();

  const savedAddress = user?.addresses[0];

  const [fullName, setFullName] = useState(user?.name || 'Hamza Khan');
  const [phone, setPhone] = useState(user?.phone || '+92 333 8951222');
  const [email, setEmail] = useState(user?.email || 'hamza.khan@example.com');
  const [streetAddress, setStreetAddress] = useState(savedAddress?.streetAddress || 'House 42, Sector Y, Phase 3, DHA');
  const [location, setLocation] = useState<LocationSelection>(() => ({
    province: savedAddress?.province || 'Punjab',
    district: savedAddress?.district || savedAddress?.city || 'Lahore',
    tehsil: savedAddress?.tehsil || '',
    postalCode: savedAddress?.postalCode || '',
  }));
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-serif font-bold text-[#38b000]">Your Bag is Empty</h1>
        <p className="text-xs text-[#52685a] mt-2 mb-6">Add plants and decor before proceeding to checkout.</p>
        <Link href="/shop" className="px-6 py-3 rounded-full bg-[#38b000] text-white text-xs font-bold">
          Go to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Consume the coupon before the order exists. Firestore rules block the
    // browser from incrementing usedCount, so the server has to do it, and a
    // code that turns out to be exhausted has to stop the order rather than
    // quietly apply a discount nobody paid for.
    if (promoCode) {
      try {
        await redeemCoupon(promoCode);
      } catch (err) {
        setIsSubmitting(false);
        showToast(
          err instanceof Error ? err.message : 'We could not verify your promo code.',
          'warning'
        );
        return;
      }
    }

    const shippingAddress: OrderAddress = {
      fullName,
      phone,
      email,
      streetAddress,
      city: location.tehsil || location.district,
      district: location.district,
      tehsil: location.tehsil,
      province: location.province,
      postalCode: location.postalCode,
      notes,
    };

    setTimeout(() => {
      const order = createOrder(
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shipping,
        discount,
        total,
        user?.uid,
        promoCode ?? undefined
      );

      // Persist to Firestore so the admin panel sees the order immediately.
      persistOrder(order).catch(() => {
        // Local order is kept as a cache even if the network write fails.
      });

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38b000', '#2d6a4f', '#d47343', '#52b788'],
        });
      } catch (err) {
        // ignore
      }

      clearCart();
      showToast(`Order #${order.id} placed successfully!`);
      router.push(`/orders/${order.id}`);
    }, 800);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52685a] mb-2">
          <Link href="/cart" className="hover:text-[#38b000]">Cart</Link>
          <span>/</span>
          <span className="text-[#38b000]">Secure Checkout</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#38b000]">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#52685a] mt-1">
          Complete your delivery details. Cash on Delivery and Mobile Wallets supported.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#38b000] flex items-center gap-2 pb-3 border-b border-[#f0f4ee]">
              <MapPin className="w-5 h-5 text-[#38b000]" />
              <span>1. Pakistan Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#172b21] mb-1">Full Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hamza Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172b21] mb-1">Mobile Phone (for Courier) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172b21] mb-1">Email Address (for Order Updates) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172b21] mb-1">Street Address, House/Apt No. *</label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="House #, Street #, Sector / Block / Phase"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
              />
            </div>

            <PakistanLocationFields value={location} onChange={setLocation} />

            <div>
              <label className="block text-xs font-bold text-[#172b21] mb-1">Delivery Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ring gate bell, leave with guard if unavailable"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#38b000] flex items-center gap-2 pb-3 border-b border-[#f0f4ee]">
              <Banknote className="w-5 h-5 text-[#38b000]" />
              <span>2. Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#38b000] bg-[#f4f7f2]'
                    : 'border-[#edf3ec] hover:border-[#d6e2d3] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-[#38b000]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172b21]">Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-bold text-[#38b000] bg-[#eaf0e7] px-2 py-0.5 rounded-full">
                      Most Popular in PK
                    </span>
                  </div>
                  <p className="text-xs text-[#52685a] mt-0.5">
                    Pay securely in cash to the delivery rider upon inspection of your healthy plants.
                  </p>
                </div>
              </label>

              {/* JazzCash / Easypaisa */}
              <label
                onClick={() => setPaymentMethod('jazzcash')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#38b000] bg-[#f4f7f2]'
                    : 'border-[#edf3ec] hover:border-[#d6e2d3] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 accent-[#38b000]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172b21]">JazzCash / Easypaisa Mobile Wallet</span>
                    <span className="text-[10px] font-bold text-[#d47343] bg-[#fdf3ec] px-2 py-0.5 rounded-full">
                      Instant Confirmation
                    </span>
                  </div>
                  <p className="text-xs text-[#52685a] mt-0.5">
                    Transfer directly to <strong>0300-1234567 (Green Decor Pvt Ltd)</strong> after placing order.
                  </p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#38b000] bg-[#f4f7f2]'
                    : 'border-[#edf3ec] hover:border-[#d6e2d3] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 accent-[#38b000]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172b21]">Direct Bank Transfer (IBFT)</span>
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      Meezan / HBL
                    </span>
                  </div>
                  <p className="text-xs text-[#52685a] mt-0.5">
                    Meezan Bank Ltd. Account: 0102-0103982410 (Green Decor).
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-6 sticky top-24">
          <h3 className="text-base font-serif font-bold text-[#38b000] pb-4 border-b border-[#f0f4ee]">
            Order Review ({items.length} items)
          </h3>

          {/* Items mini list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => {
              const effectivePrice = product.salePrice ?? product.price;
              return (
                <div key={product.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f4f7f2] shrink-0 border border-[#e5ece3]">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#172b21] truncate">{product.name}</p>
                      <p className="text-[#52685a]">Qty: {quantity} &times; {formatPKR(effectivePrice)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#38b000] shrink-0">
                    {formatPKR(effectivePrice * quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing table */}
          <div className="space-y-2 text-xs text-[#52685a] pt-4 border-t border-[#f0f4ee]">
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
              <span>Delivery (Nationwide Crated)</span>
              <span className="font-semibold text-[#172b21]">
                {shipping === 0 ? <span className="text-emerald-700 uppercase font-bold">FREE</span> : formatPKR(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-serif font-bold text-[#38b000] pt-3 border-t border-[#f0f4ee]">
              <span>Grand Total</span>
              <span>{formatPKR(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#38b000] text-white text-sm font-bold hover:bg-[#2e9900] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Placing Your Order...' : `Place Order • ${formatPKR(total)}`}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#718b7a] pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Healthy Plant Arrival or Free Replacement</span>
          </div>

        </div>

      </form>
    </div>
  );
}
