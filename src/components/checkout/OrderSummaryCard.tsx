'use client';

import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatPKR } from '@/lib/utils';

interface Props {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  children?: React.ReactNode;
}

/**
 * Shared by the delivery step and the payment step so the money column never
 * drifts between them. `sticky` keeps it in view while the longer form scrolls.
 */
export default function OrderSummaryCard({
  items,
  subtotal,
  discount,
  shipping,
  total,
  children,
}: Props) {
  return (
    <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#e5ece3] shadow-md space-y-5 sticky top-24">
      <h3 className="text-base font-bold text-[#0d3b2e] pb-3 border-b border-[#f0f4ee]">
        Order Review ({items.length} items)
      </h3>

      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
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
              <span className="font-bold text-[#0d3b2e] shrink-0">
                {formatPKR(effectivePrice * quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 text-xs text-[#52685a] pt-3 border-t border-[#f0f4ee]">
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
            {shipping === 0 ? (
              <span className="text-emerald-700 uppercase font-bold">FREE</span>
            ) : (
              formatPKR(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-lg font-serif font-bold text-[#0d3b2e] pt-3 border-t border-[#f0f4ee]">
          <span>Grand Total</span>
          <span>{formatPKR(total)}</span>
        </div>
      </div>

      {children}

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#718b7a] pt-1">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Guaranteed Healthy Plant Arrival or Free Replacement</span>
      </div>
    </div>
  );
}
