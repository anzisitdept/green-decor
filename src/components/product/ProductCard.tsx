'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star, Sun, Droplet, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { formatPKR } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { openQuickView, openCart, showToast } = useUIStore();

  const inWishlist = isInWishlist(product.id);
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    showToast(`Added "${product.name}" to your bag!`);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(added ? 'Saved to your Wishlist' : 'Removed from Wishlist', 'info');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div className="group relative bg-[#f8f8f6] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      
      {/* Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f2f2ee]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Status Badge (Top-Left Pill e.g. Sold out / Sale) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          {product.stock <= 0 ? (
            <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-xs">
              Sold out
            </span>
          ) : hasDiscount ? (
            <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-xs">
              {discountPercentage}% OFF
            </span>
          ) : product.featured ? (
            <span className="bg-[#38b000] text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-xs">
              Popular
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart Button (Top-Right) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
            inWishlist
              ? 'bg-white text-rose-500 opacity-100'
              : 'bg-white/80 backdrop-blur-xs text-neutral-700 hover:bg-white hover:text-rose-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Action Button (Bottom-Right Floating Pill e.g. Choose / Quick Add) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 z-10 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-semibold shadow-xs hover:shadow-md hover:bg-white hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-neutral-800" />
          <span>Choose</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-[#f8f8f6]">
        <div>
          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="text-sm sm:text-[15px] font-normal text-neutral-900 hover:text-[#38b000] transition-colors truncate block"
          >
            {product.name}
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs sm:text-sm font-medium text-neutral-800">
              {formatPKR(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
