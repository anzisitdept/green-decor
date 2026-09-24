'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useUIStore } from '@/lib/store/useUIStore';
import { useStoreProducts, useStoreServices } from '@/lib/firestore/store-data';
import { formatPKR } from '@/lib/utils';

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const productsData = useStoreProducts();
  const servicesData = useStoreServices();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().openSearch();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? productsData.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredServices = query.trim()
    ? servicesData.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = [
    'Monstera',
    'Snake Plant',
    'Fiddle Leaf Fig',
    'Landscaping',
    'Terracotta Pot',
    'Neem Oil',
    'Aquarium',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5ece3] z-10 animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#f0f4ee] flex items-center gap-3 bg-[#fbfcf9]">
          <Search className="w-5 h-5 text-[#38b000] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search plants, pots, planters, landscaping services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#172b21] placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="text-xs font-semibold px-2 py-1 rounded bg-[#eaf0e7] text-[#38b000] hover:bg-[#d8e5d4]"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-3">
                Trending Searches in Pakistan
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f7f2] text-xs font-medium text-[#38b000] hover:bg-[#eaf0e7] border border-[#e5ece3] transition-colors"
                  >
                    <Tag className="w-3 h-3 text-[#d47343]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Product matches */}
              {filteredProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider">
                      Products ({filteredProducts.length})
                    </p>
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={closeSearch}
                      className="text-xs text-[#38b000] hover:underline font-semibold"
                    >
                      View in Shop &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredProducts.slice(0, 4).map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f4f7f2] border border-transparent hover:border-[#d6e2d3] transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#eaf0e7]">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#172b21] truncate">{product.name}</p>
                          <p className="text-xs font-bold text-[#38b000] mt-0.5">
                            {formatPKR(product.salePrice ?? product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Service matches */}
              {filteredServices.length > 0 && (
                <div className="pt-3 border-t border-[#f0f4ee]">
                  <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-3">
                    Services ({filteredServices.length})
                  </p>
                  <div className="space-y-2">
                    {filteredServices.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        onClick={closeSearch}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf7] hover:bg-[#eaf0e7] transition-colors border border-[#edf3ec]"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#38b000]">{service.title}</p>
                          <p className="text-xs text-[#52685a] line-clamp-1">{service.shortDescription}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#38b000] shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredServices.length === 0 && (
                <div className="text-center py-8 text-[#52685a]">
                  <p className="text-sm font-semibold">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs mt-1">Try searching for &ldquo;Monstera&rdquo;, &ldquo;Landscaping&rdquo;, or browse our full shop.</p>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
