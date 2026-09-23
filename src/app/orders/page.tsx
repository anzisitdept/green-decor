'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, ArrowRight, CheckCircle2, Clock, MapPin, Eye } from 'lucide-react';
import { useOrdersStore } from '@/lib/store/useOrdersStore';
import { formatPKR } from '@/lib/utils';

export default function OrdersHistoryPage() {
  const { orders } = useOrdersStore();

  const statusColors: Record<string, string> = {
    placed: 'bg-blue-50 text-blue-700 border-blue-200',
    confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    processing: 'bg-amber-50 text-amber-700 border-amber-200',
    shipped: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#38b000]">
          Your Orders & Tracking
        </h1>
        <p className="text-xs sm:text-sm text-[#52685a] mt-1">
          Track real-time shipment progress for your plants, planters, and landscape materials.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e5ece3] shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f4f7f2] flex items-center justify-center text-[#38b000] mx-auto">
            <Package className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#38b000]">No Orders Yet</h3>
          <p className="text-xs text-[#52685a]">
            You have not placed any orders yet. Start your botanical journey with our curated plants.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-full bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-colors"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md hover:border-[#b8cdb5] transition-all space-y-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f4ee]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-[#38b000]">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#52685a] mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })} · Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-[#38b000]">
                    {formatPKR(order.total)}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#eaf0e7] text-[#38b000] text-xs font-bold hover:bg-[#d8e5d4] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>

              {/* Items Thumbnails preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8faf7] border border-[#edf3ec]"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#e5ece3]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#172b21] truncate">{product.name}</p>
                      <p className="text-[11px] text-[#52685a]">
                        Qty: {quantity} · {formatPKR((product.salePrice ?? product.price) * quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery destination snippet */}
              <div className="flex items-center justify-between text-xs text-[#52685a] pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#38b000]" />
                  <span>Delivering to <strong>{order.shippingAddress.fullName}</strong> in <strong>{order.shippingAddress.city}</strong></span>
                </div>
                <span className="text-[11px] text-[#38b000] font-semibold uppercase">
                  Payment: {order.paymentMethod.toUpperCase()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
