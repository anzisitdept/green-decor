'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  Star, 
  Search, 
  Sparkles, 
  ChevronDown, 
  Check, 
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { productsData } from '@/lib/data/products';
import ProductCard from '@/components/product/ProductCard';
import { formatPKR } from '@/lib/utils';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [activeQuickTag, setActiveQuickTag] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'plants', label: 'Plants & Planters' },
    { id: 'home-decor', label: 'Home Decor' },
    { id: 'landscaping', label: 'Landscaping' },
    { id: 'aquariums', label: 'Aquariums' },
    { id: 'plant-care', label: 'Plant Care Products' },
    { id: 'gift-pots', label: 'Gift Pots & Custom' },
  ];

  const quickTags = [
    { id: 'all', label: 'All Items' },
    { id: 'featured', label: '🌟 Featured' },
    { id: 'bestseller', label: '🔥 Best Sellers' },
    { id: 'air-purifying', label: '🍃 Air Purifying' },
    { id: 'low-light', label: '🌙 Low Light' },
    { id: 'sale', label: '🏷️ On Sale' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q)) ||
          product.shortDescription.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Price filter
      const effectivePrice = product.salePrice ?? product.price;
      if (effectivePrice > maxPrice) {
        return false;
      }

      // Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Quick tags
      if (activeQuickTag === 'featured' && !product.featured) return false;
      if (activeQuickTag === 'bestseller' && product.rating < 4.9) return false;
      if (activeQuickTag === 'air-purifying' && !product.tags.some((t) => t.toLowerCase().includes('air purif'))) return false;
      if (activeQuickTag === 'low-light' && !product.tags.some((t) => t.toLowerCase().includes('low light'))) return false;
      if (activeQuickTag === 'sale' && !product.salePrice) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, maxPrice, inStockOnly, minRating, sortBy, activeQuickTag]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(30000);
    setInStockOnly(false);
    setMinRating(0);
    setActiveQuickTag('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    maxPrice < 30000 ||
    inStockOnly ||
    minRating > 0 ||
    activeQuickTag !== 'all';

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52685a] mb-2">
          <Link href="/" className="hover:text-[#38b000]">Home</Link>
          <span>/</span>
          <span className="text-[#38b000]">Shop Catalog</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#38b000]">
              Nursery & Green Decor Collection
            </h1>
            <p className="text-xs sm:text-sm text-[#52685a] mt-1">
              Acclimatized indoor plants, artisan ceramic planters, and specialized plant nutrition across Pakistan.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#d6e2d3] text-xs font-bold text-[#38b000] shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters & Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filter Tag Row (plant.pk pattern) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {quickTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setActiveQuickTag(tag.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeQuickTag === tag.id
                ? 'bg-[#38b000] text-white shadow-xs'
                : 'bg-white text-[#2a3f33] hover:bg-[#eaf0e7] border border-[#e5ece3]'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar (plant.pk adapted) */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-3xl p-6 border border-[#e5ece3] shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ee]">
            <h3 className="text-sm font-bold font-serif text-[#38b000] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Catalog</span>
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-semibold text-[#d47343] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-[#172b21] uppercase tracking-wider mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. Monstera, Terracotta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000] focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-[#172b21] uppercase tracking-wider mb-2">
              Categories
            </label>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const count = cat.id === 'all'
                  ? productsData.length
                  : productsData.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#38b000] text-white font-bold'
                        : 'text-[#2a3f33] hover:bg-[#f4f7f2]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#eaf0e7] text-[#38b000]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#172b21] uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold text-[#38b000]">
                {formatPKR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="30000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#38b000] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>PKR 500</span>
              <span>PKR 30,000</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-[#f0f4ee]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#172b21]">In-Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#38b000] accent-[#38b000] cursor-pointer"
              />
            </label>
          </div>

          {/* Rating Filter */}
          <div className="pt-2 border-t border-[#f0f4ee]">
            <label className="block text-xs font-bold text-[#172b21] uppercase tracking-wider mb-2">
              Customer Rating
            </label>
            <div className="space-y-1">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    minRating === stars
                      ? 'bg-[#eaf0e7] text-[#38b000] font-bold border border-[#c8d9c5]'
                      : 'hover:bg-[#f8faf7] text-[#52685a]'
                  }`}
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                    <span className="text-[#172b21] ml-1.5">& Up</span>
                  </div>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-[#38b000]" />}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Bar: Count & Sorting */}
          <div className="bg-white rounded-2xl p-4 border border-[#e5ece3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-[#52685a]">
              Showing <strong className="text-[#38b000]">{filteredProducts.length}</strong> of <strong>{productsData.length}</strong> products
              {selectedCategory !== 'all' && (
                <span> in <strong className="text-[#d47343]">{categories.find(c => c.id === selectedCategory)?.label}</strong></span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#52685a] font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#38b000] bg-white focus:outline-none focus:ring-2 focus:ring-[#38b000]"
              >
                <option value="featured">Featured & Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e5ece3] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f4f7f2] flex items-center justify-center text-[#38b000] mx-auto">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#38b000]">No Products Matched</h3>
              <p className="text-xs text-[#52685a] max-w-sm mx-auto">
                No items match your active filters. Try clearing your search term or adjusting the price threshold.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ee]">
                <h3 className="font-serif font-bold text-base text-[#38b000]">Filters & Sort</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category List */}
              <div className="py-4 border-b border-[#f0f4ee]">
                <p className="text-xs font-bold text-[#172b21] uppercase mb-2">Category</p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === cat.id ? 'bg-[#38b000] text-white font-bold' : 'text-[#2a3f33]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="py-4 border-b border-[#f0f4ee]">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Max Price</span>
                  <span>{formatPKR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="30000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#38b000]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#f0f4ee] space-y-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#38b000] text-white text-xs font-bold"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-[#38b000] font-serif font-bold text-lg">
        Loading Green Decor Catalog...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
