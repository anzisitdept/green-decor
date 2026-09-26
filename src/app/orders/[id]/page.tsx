'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  MessageCircle, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { useOrdersStore } from '@/lib/store/useOrdersStore';
import { useMounted } from '@/lib/store/useMounted';
import { formatPKR, getWhatsAppLink } from '@/lib/utils';
import { OrderStatus } from '@/types';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { getOrderById, hydrated } = useOrdersStore();
  const mounted = useMounted();
  const order = getOrderById(orderId);

  // The store is persisted to localStorage and rehydrates before React hydrates,
  // so the server only ever has the mock seed data. Waiting for mount *and*
  // rehydration is what stops "Not Found" being painted on the server and then
  // replaced with the real order on the client.
  if (!mounted || !hydrated) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#e5ece3] border-t-[#38b000] animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#52685a]">Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-serif font-bold text-[#38b000]">Order #{orderId} Not Found</h2>
        <p className="text-xs text-[#52685a] mt-2 mb-6">We could not locate this order in our system.</p>
        <Link href="/orders" className="px-6 py-3 rounded-full bg-[#38b000] text-white text-xs font-bold">
          View All Orders
        </Link>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Order received & logged' },
    { key: 'confirmed', label: 'Nursery Verified', desc: 'Botanical inspection completed' },
    { key: 'processing', label: 'Crated & Packed', desc: 'Secured in breathable wooden crate' },
    { key: 'shipped', label: 'On Route / Shipped', desc: 'Handed to express courier' },
    { key: 'delivered', label: 'Delivered Fresh', desc: 'Handed to recipient' },
  ];

  const statusOrder: OrderStatus[] = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(order.status);

  const whatsappHref = getWhatsAppLink(
    `Hello Green Decor! I am checking on my Order #${order.id} (Tracking: ${order.trackingNumber}). Could you provide a delivery update?`
  );

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back Link & Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52685a] hover:text-[#38b000] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#38b000]">
              Order #{order.id}
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#52685a] mt-1">
            Tracking Number: <strong className="font-mono text-[#172b21]">{order.trackingNumber}</strong> · Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-[#d6e2d3] bg-white text-xs font-bold text-[#38b000] hover:bg-[#f4f7f2] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece3] shadow-md mb-8">
        <h3 className="text-base font-serif font-bold text-[#38b000] mb-8 pb-3 border-b border-[#f0f4ee]">
          Live Delivery Status Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.key} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-2 relative">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all z-10 ${
                    isCompleted
                      ? 'bg-[#38b000] text-white ring-4 ring-[#eaf0e7]'
                      : 'bg-[#f4f7f2] text-gray-400 border border-[#d6e2d3]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-[#38b000]' : isCompleted ? 'text-[#172b21]' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-[#52685a] mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status History Log */}
        <div className="mt-8 pt-6 border-t border-[#f0f4ee] space-y-2">
          <p className="text-xs font-bold text-[#52685a] uppercase">Activity Log</p>
          {order.statusHistory.map((hist, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2a3f33]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-[#38b000]">
                  {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:
                </span>{' '}
                <span>{hist.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Itemized Invoice (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-4">
          <h3 className="text-base font-serif font-bold text-[#38b000] pb-3 border-b border-[#f0f4ee]">
            Ordered Items ({order.items.length})
          </h3>

          <div className="space-y-4">
            {order.items.map(({ product, quantity, selectedOption }) => {
              const effectivePrice = product.salePrice ?? product.price;
              return (
                <div key={product.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#f4f7f2] shrink-0 border border-[#e5ece3]">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172b21]">{product.name}</p>
                      <p className="text-[11px] text-[#52685a]">
                        Qty: {quantity} &times; {formatPKR(effectivePrice)}
                      </p>
                      {selectedOption && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {selectedOption}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#38b000]">
                    {formatPKR(effectivePrice * quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t border-[#f0f4ee] text-xs text-[#52685a]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#172b21]">{formatPKR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>-{formatPKR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-semibold text-[#172b21]">
                {order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-[#38b000] pt-2 border-t border-[#f0f4ee]">
              <span>Grand Total</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-4">
            <h3 className="text-base font-serif font-bold text-[#38b000] pb-3 border-b border-[#f0f4ee]">
              Delivery Destination
            </h3>
            <div className="text-xs text-[#384c3f] space-y-1.5">
              <p className="font-bold text-sm text-[#38b000]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>
                {[order.shippingAddress.tehsil, order.shippingAddress.district, order.shippingAddress.city]
                  .filter(Boolean)
                  .join(', ')}
                , {order.shippingAddress.province}
              </p>
              {order.shippingAddress.postalCode && (
                <p className="text-[#52685a]">Postal Code: {order.shippingAddress.postalCode}</p>
              )}
              <p className="text-[#52685a]">Phone: {order.shippingAddress.phone}</p>
              <p className="text-[#52685a]">Email: {order.shippingAddress.email}</p>
              {order.shippingAddress.notes && (
                <p className="p-2.5 rounded-xl bg-[#f8faf7] text-[11px] text-gray-600 mt-2">
                  <strong>Notes:</strong> {order.shippingAddress.notes}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-3">
            <h3 className="text-base font-serif font-bold text-[#38b000] pb-3 border-b border-[#f0f4ee]">
              Payment Summary
            </h3>
            <div className="text-xs text-[#384c3f] space-y-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <strong className="uppercase">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
