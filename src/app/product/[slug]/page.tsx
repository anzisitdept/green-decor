'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  Truck, 
  Check, 
  MessageCircle, 
  AlertCircle,
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { productsData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { formatPKR, getWhatsAppLink } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const product = productsData.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { openCart, showToast } = useUIStore();

  if (!product) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#14402a]">Product Not Found</h2>
        <p className="text-xs text-[#52685a] mt-2 mb-6">The plant or product you requested may have been relocated.</p>
        <Link href="/shop" className="px-6 py-3 rounded-full bg-[#14402a] text-white text-xs font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappHref = getWhatsAppLink(
    `Hello Green Decor! I am interested in ordering "${product.name}" (PKR ${effectivePrice}). Please confirm availability and delivery time.`
  );

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`Added ${quantity}x ${product.name} to your bag!`);
    openCart();
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    showToast(added ? 'Saved to your Wishlist' : 'Removed from Wishlist', 'info');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;
    setReviewSubmitted(true);
    showToast('Thank you! Your verified review has been submitted.');
    setNewReviewAuthor('');
    setNewReviewText('');
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#52685a] mb-8">
        <Link href="/" className="hover:text-[#14402a]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#14402a]">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-[#14402a]">
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-[#14402a] font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece3] shadow-md">
        
        {/* Gallery Column (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#f4f7f2] border border-[#e5ece3]">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-[#d47343] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#14402a] ring-2 ring-[#14402a]/20 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-[#2a3f33]">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#f8faf7] border border-[#edf3ec]">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Plant-Crated Delivery Across Pakistan</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#f8faf7] border border-[#edf3ec]">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>30-Day Health Warranty & Care Support</span>
            </div>
          </div>
        </div>

        {/* Product Info Column (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d47343] uppercase tracking-wider">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-xs font-bold text-[#172b21] ml-1">{product.rating}</span>
                <span className="text-xs text-[#52685a]">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-[#14402a] mt-2">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#14402a]">
                {formatPKR(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                In Stock ({product.stock} units available)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#4a5f52] leading-relaxed mt-4">
              {product.description || product.shortDescription}
            </p>

            {/* Botanical Care Specs (if plant) */}
            {product.careInstructions && (
              <div className="mt-6 p-4 rounded-2xl bg-[#f4f7f2] border border-[#d6e2d3] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#14402a] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d47343]" />
                  <span>Plant Vital Care Parameters</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs text-[#2a3f33]">
                  <div className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Sunlight:</span>
                      <span className="text-[11px] text-[#52685a]">{product.careInstructions.sunlight}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Droplet className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Watering:</span>
                      <span className="text-[11px] text-[#52685a]">{product.careInstructions.water}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart & Actions */}
          <div className="space-y-4 pt-4 border-t border-[#f0f4ee]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between border-2 border-[#d6e2d3] rounded-2xl p-1 bg-[#fbfcf9] w-full sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#14402a] hover:bg-[#eaf0e7] rounded-xl font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-[#172b21]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#14402a] hover:bg-[#eaf0e7] rounded-xl font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#14402a] text-white text-sm font-bold hover:bg-[#1b5539] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Bag • {formatPKR(effectivePrice * quantity)}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlist}
                className={`p-4 rounded-2xl border-2 transition-colors flex items-center justify-center ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-[#d6e2d3] hover:bg-[#f4f7f2] text-[#14402a]'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Quick Inquiry Button */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#eaf0e7] text-[#14402a] text-xs sm:text-sm font-bold hover:bg-[#d8e6d4] transition-all flex items-center justify-center gap-2 border border-[#c8d9c5]"
            >
              <MessageCircle className="w-4 h-4 text-[#14402a]" />
              <span>Inquire / Order via WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

      {/* Tabs Section: Details, Care, Shipping, Reviews */}
      <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#e5ece3] shadow-md">
        
        {/* Tab Buttons */}
        <div className="flex border-b border-[#f0f4ee] gap-4 sm:gap-8 overflow-x-auto pb-2">
          {[
            { id: 'details', label: 'Details & Dimensions' },
            { id: 'care', label: 'Care & Climate Tips' },
            { id: 'shipping', label: 'Delivery & Guarantee' },
            { id: 'reviews', label: `Customer Reviews (${product.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#14402a] text-[#14402a]'
                  : 'border-transparent text-[#52685a] hover:text-[#14402a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-[#384c3f] leading-relaxed">
              <p>{product.description || product.shortDescription}</p>
              {product.details && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#f0f4ee]">
                  {product.details.height && (
                    <div className="p-3 bg-[#f8faf7] rounded-xl">
                      <span className="font-bold text-[#14402a] block">Approximate Height:</span>
                      <span>{product.details.height}</span>
                    </div>
                  )}
                  {product.details.potSize && (
                    <div className="p-3 bg-[#f8faf7] rounded-xl">
                      <span className="font-bold text-[#14402a] block">Pot Specifications:</span>
                      <span>{product.details.potSize}</span>
                    </div>
                  )}
                  {product.details.material && (
                    <div className="p-3 bg-[#f8faf7] rounded-xl">
                      <span className="font-bold text-[#14402a] block">Material / Clay:</span>
                      <span>{product.details.material}</span>
                    </div>
                  )}
                  {product.details.origin && (
                    <div className="p-3 bg-[#f8faf7] rounded-xl">
                      <span className="font-bold text-[#14402a] block">Cultivation Origin:</span>
                      <span>{product.details.origin}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-[#384c3f] leading-relaxed">
              <h4 className="font-serif font-bold text-base text-[#14402a]">
                Pro-Gardener Tips for Pakistani Climate
              </h4>
              <p>
                During intense summer months in Punjab, Sindh, and Islamabad, keep this plant away from dry air conditioning drafts and direct afternoon glass glare.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pt-2 text-[#4a5f52]">
                <li><strong>Summer:</strong> Water early morning or late evening. Mist foliage twice weekly.</li>
                <li><strong>Winter:</strong> Reduce watering frequency by half as growth slows.</li>
                <li><strong>Repotting:</strong> Use Green Decor Bio-Vitality mix with perlite for aerated drainage.</li>
              </ul>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-[#384c3f] leading-relaxed">
              <h4 className="font-serif font-bold text-base text-[#14402a]">
                Safe Doorstep Plant Transport
              </h4>
              <p>
                We use custom wooden crates with secured root balls, ensuring zero soil spillage and branch breakage during transit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#f4f7f2] border border-[#d6e2d3]">
                  <h5 className="font-bold text-[#14402a] mb-1">Lahore & Rawalpindi / Islamabad</h5>
                  <p className="text-xs text-[#52685a]">Direct van delivery within 24 to 48 hours.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f4f7f2] border border-[#d6e2d3]">
                  <h5 className="font-bold text-[#14402a] mb-1">Karachi & Nationwide</h5>
                  <p className="text-xs text-[#52685a]">Express crated courier dispatch within 2 to 4 business days.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Existing Reviews list */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#f8faf7] border border-[#edf3ec]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172b21]">Usman A. (Lahore)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4a5f52]">
                    &ldquo;Arrived in perfect health, potted in a lovely white ceramic pot. It has already sprouted two new leaves!&rdquo;
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8faf7] border border-[#edf3ec]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172b21]">Nadia K. (Karachi)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4a5f52]">
                    &ldquo;Best plant packaging in Pakistan. No broken stems at all. Highly recommended!&rdquo;
                  </p>
                </div>
              </div>

              {/* Review submission form */}
              <div className="pt-6 border-t border-[#f0f4ee]">
                <h4 className="font-serif font-bold text-base text-[#14402a] mb-4">Write a Verified Review</h4>
                {reviewSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Your review was recorded and will display shortly. Thank you!</span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#172b21] mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Asad Malik"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#172b21] mb-1">Rating</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#14402a] bg-white"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5/5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4/5 Stars)</option>
                          <option value="3">⭐⭐⭐ (3/5 Stars)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172b21] mb-1">Review</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Share your thoughts on plant health, pot quality, and delivery speed..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#14402a] text-white text-xs font-bold hover:bg-[#1b5539] transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Related Products Row */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52685a]">
                COMPLETE YOUR BOTANICAL SETUP
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#14402a] mt-1">
                You May Also Love
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#14402a] hover:underline flex items-center gap-1"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
