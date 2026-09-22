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
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#e5ece3] hover:border-[#b8cdb5] transition-all duration-300 hover:shadow-xl flex flex-col justify-between">
      
      {/* Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f4f7f2]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="bg-[#d47343] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercentage}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-[#14402a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${
              inWishlist
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/90 backdrop-blur-xs text-[#14402a] hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            aria-label="Quick View"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#14402a] hover:bg-white flex items-center justify-center shadow-md transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add To Bag Bar on Hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-xl bg-[#14402a]/95 backdrop-blur-md text-white text-xs font-bold hover:bg-[#14402a] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-[#d47343] uppercase tracking-wider">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold text-[#172b21]">{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="font-serif font-bold text-sm sm:text-base text-[#172b21] hover:text-[#14402a] transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Short tagline */}
          <p className="text-xs text-[#52685a] line-clamp-1 mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Stock Footer */}
        <div className="mt-4 pt-3 border-t border-[#f0f4ee] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-[#14402a]">
              {formatPKR(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>

          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> In Stock
          </span>
        </div>

      </div>

    </div>
  );
}
