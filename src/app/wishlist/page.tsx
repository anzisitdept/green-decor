'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { formatPKR } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { openCart, showToast } = useUIStore();

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((product) => {
      addItem(product, 1);
    });
    showToast(`Moved ${items.length} items to your shopping bag!`);
    openCart();
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#38b000]">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#52685a] mt-1">
            Your saved plants, ceramic planters, and botanical styling favorites.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="px-5 py-2.5 rounded-full bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs font-semibold text-red-500 hover:underline px-3 py-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e5ece3] shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f4f7f2] flex items-center justify-center text-[#38b000] mx-auto">
            <Heart className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#38b000]">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#52685a]">
            Click the heart icon on any plant, pot, or garden accessory to save it for later.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-full bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
