'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Lock, Sparkles, MessageSquare } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCheckoutStore } from '@/lib/store/useCheckoutStore';
import { formatPKR, getWhatsAppLink } from '@/lib/utils';
import { OrderAddress } from '@/types';
import PakistanLocationFields, { LocationSelection } from '@/components/checkout/PakistanLocationFields';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none';
const labelClass = 'block text-xs font-bold text-[#172b21] mb-1';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getSubtotal, getDiscount, getShippingFee, getTotal } = useCartStore();
  const setAddress = useCheckoutStore((state) => state.setAddress);

  const savedAddress = user?.addresses[0];

  const [fullName, setFullName] = useState(user?.name || 'Hamza Khan');
  const [phone, setPhone] = useState(user?.phone || '+92 333 8951222');
  const [email, setEmail] = useState(user?.email || 'hamza.khan@example.com');
  const [streetAddress, setStreetAddress] = useState(
    savedAddress?.streetAddress || 'House 42, Sector Y, Phase 3, DHA'
  );
  const [location, setLocation] = useState<LocationSelection>(() => ({
    province: savedAddress?.province || 'Punjab',
    district: savedAddress?.district || savedAddress?.city || 'Lahore',
    tehsil: savedAddress?.tehsil || '',
    postalCode: savedAddress?.postalCode || '',
  }));
  const [notes, setNotes] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  const handleQuickNote = (badgeText: string) => {
    setNotes((prev) => (prev ? `${prev} • ${badgeText}` : badgeText));
  };

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-[#0d3b2e]">Your Bag is Empty</h1>
        <p className="text-xs text-[#52685a] mt-2 mb-6">Add plants and decor before proceeding to checkout.</p>
        <Link href="/shop" className="px-6 py-3 rounded-full bg-[#0d3b2e] text-white text-xs font-bold">
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();

    const shippingAddress: OrderAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      streetAddress: streetAddress.trim(),
      city: location.tehsil || location.district,
      district: location.district,
      tehsil: location.tehsil,
      province: location.province,
      postalCode: location.postalCode,
      notes: notes.trim() || undefined,
    };

    setAddress(shippingAddress);
    router.push('/checkout/payment');
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52685a] mb-2">
          <Link href="/cart" className="hover:text-[#0d3b2e]">Cart</Link>
          <span>/</span>
          <span className="text-[#0d3b2e]">Delivery Details</span>
          <span>/</span>
          <span className="text-[#aabcb0]">Payment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d3b2e]">
          Where should we deliver?
        </h1>
        <p className="text-xs sm:text-sm text-[#52685a] mt-1">
          Step 1 of 2 — your delivery details, then you choose how to pay.
        </p>
      </div>

      <form onSubmit={handleProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#e5ece3] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#0d3b2e] flex items-center gap-2 pb-3 border-b border-[#f0f4ee]">
            <MapPin className="w-4 h-4" />
            <span>Pakistan Delivery Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Full Recipient Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Hamza Khan"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mobile Phone (for Courier) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300 1234567"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email (order updates) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Street Address, House/Apt No. *</label>
            <input
              type="text"
              required
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="House #, Street #, Sector / Block / Phase"
              className={inputClass}
            />
          </div>

          <PakistanLocationFields value={location} onChange={setLocation} compact />

          {/* Pot Customization & Order Notes Section */}
          <div className="pt-3 border-t border-[#f0f4ee] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-[#0d3b2e] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#d47343]" />
                <span>Pot Customization & Delivery Notes</span>
              </label>
              <span className="text-[10px] text-[#52685a] font-medium">Optional</span>
            </div>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your pot customization text (e.g. engraved name, color shade), gift message, or special delivery instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none bg-[#fafcf9]"
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#52685a] font-semibold">Quick Add:</span>
              {[
                'Engrave Custom Name',
                'Single Drainage Hole',
                'Include Gift Card',
                'Ring Gate Bell',
                'Call Before Delivery',
              ].map((badgeText) => (
                <button
                  key={badgeText}
                  type="button"
                  onClick={() => handleQuickNote(badgeText)}
                  className="px-2.5 py-1 rounded-full bg-[#f4f8f3] hover:bg-[#eaf0e7] border border-[#d6e2d3] text-[#0d3b2e] text-[10px] font-semibold transition-colors"
                >
                  + {badgeText}
                </button>
              ))}
            </div>
          </div>
        </div>

        <OrderSummaryCard
          items={items}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          total={total}
        >
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#0d3b2e] text-white text-sm font-bold hover:bg-[#145c43] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white/70">•</span>
            <span>{formatPKR(total)}</span>
          </button>

          <p className="text-[11px] text-[#52685a] text-center">
            Next step: pay with cash on delivery or submit your transfer receipt.
          </p>
        </OrderSummaryCard>
      </form>

      <div className="mt-6 flex items-center justify-center">
        <a
          href={getWhatsAppLink('Hello Green Decor! I need help completing my checkout.')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#52685a] hover:text-[#0d3b2e] underline underline-offset-4"
        >
          Need help? Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}
