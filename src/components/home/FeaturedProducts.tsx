'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productsData } from '@/lib/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts() {
  const featuredProducts = productsData.filter((p) => p.featured).slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.scrollLeft = el.scrollLeft;
    dragState.current.moved = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el || !dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.2;
    if (Math.abs(walk) > 5) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDrag = () => {
    dragState.current.isDown = false;
  };

  const onDragClick = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <section className="pt-8 sm:pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="mb-6">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d] block mb-1">
          FEATURED COLLECTION
        </span>
        <div className="flex flex-wrap items-center gap-5 sm:gap-70">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#38b000] tracking-tight">
            Featured Plants &amp; Decor
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#38b000] text-white text-xs sm:text-sm font-bold hover:bg-[#2e9900] transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0 whitespace-nowrap ml-[20px] sm:ml-8"
          >
            <span>Shop All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Single-row horizontal scroll (drag with cursor) */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onClick={onDragClick}
        className="flex gap-5 overflow-x-auto snap-x snap-proximity pb-4 px-1 cursor-grab select-none active:cursor-grabbing scrollbar-none"
      >
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[240px] sm:w-[270px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}