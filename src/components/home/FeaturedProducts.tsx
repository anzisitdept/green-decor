'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productsData } from '@/lib/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<'all' | 'plants' | 'home-decor' | 'plant-care' | 'gift-pots'>('all');

  const categories = [
    { id: 'all', label: 'All Bestsellers' },
    { id: 'plants', label: 'Lush Plants' },
    { id: 'home-decor', label: 'Artisan Decor' },
    { id: 'plant-care', label: 'Plant Care' },
    { id: 'gift-pots', label: 'Gift Sets' },
  ];

  const filteredProducts = activeTab === 'all'
    ? productsData.filter((p) => p.featured || p.rating >= 4.9).slice(0, 8)
    : productsData.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="pt-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#14402a]">
            Top Rated Plants & Decor
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-2xl border border-[#e5ece3] shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === cat.id
                  ? 'bg-[#14402a] text-white shadow-xs'
                  : 'text-[#52685a] hover:text-[#14402a] hover:bg-[#f4f7f2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom Link */}
      <div className="mt-10 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#14402a] text-white text-xs sm:text-sm font-bold hover:bg-[#1b5539] transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <span>Explore All 100+ Products in Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
