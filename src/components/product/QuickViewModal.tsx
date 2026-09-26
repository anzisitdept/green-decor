'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Star, ShoppingBag, Heart, Sun, Droplet, Award, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/lib/store/useUIStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { formatPKR, getWhatsAppLink } from '@/lib/utils';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, openCart, showToast } = useUIStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);
  const effectivePrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`Added ${quantity}x ${product.name} to bag!`);
    closeQuickView();
    openCart();
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    showToast(added ? 'Saved to your Wishlist' : 'Removed from Wishlist', 'info');
  };

  const whatsappInquiry = getWhatsAppLink(
    `Hello Green Decor! I have a question about ${product.name} (PKR ${effectivePrice}). Could you provide more details?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5ece3] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Column */}
          <div className="p-6 bg-[#f4f7f2] flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.salePrice && (
                <span className="absolute top-3 left-3 bg-[#d47343] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  SALE
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#38b000] ring-2 ring-[#38b000]/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#d47343] uppercase tracking-wider">
                  {product.categoryLabel}
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock ({product.stock})
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#38b000] mt-1.5">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#172b21]">{product.rating}</span>
                <span className="text-xs text-[#52685a]">({product.reviewCount} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-extrabold text-[#38b000]">
                  {formatPKR(effectivePrice)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPKR(product.price)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-[#52685a] leading-relaxed mt-2.5">
                {product.shortDescription}
              </p>

              {/* Care Quick Indicators */}
              {product.careInstructions && (
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#f8faf7] rounded-xl border border-[#edf3ec] text-[11px] text-[#2a3f33]">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{product.careInstructions.sunlight.split('.')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" />
                    <span>{product.careInstructions.difficulty} Care</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#d6e2d3] rounded-xl overflow-hidden bg-[#fbfcf9]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-[#38b000] hover:bg-[#f4f7f2] font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#172b21]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-[#38b000] hover:bg-[#f4f7f2] font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {formatPKR(effectivePrice * quantity)}</span>
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  className={`p-3 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-[#d6e2d3] hover:bg-[#f4f7f2] text-[#38b000]'
                  }`}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Bottom links */}
              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="text-[#38b000] hover:underline font-semibold flex items-center gap-1"
                >
                  View Full Product Details <ArrowRight className="w-3 h-3" />
                </Link>
                <a
                  href={whatsappInquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-medium"
                >
                  WhatsApp Inquiry
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
