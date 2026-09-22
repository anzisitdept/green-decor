'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { testimonialsData } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => {
      setVisibleCount(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, testimonialsData.length - visibleCount);
  const clampedStart = Math.min(startIndex, maxIndex);
  const cardWidthPct = 100 / visibleCount;

  const nextSlide = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#52685a]">
            VERIFIED CUSTOMER EXPERIENCES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#14402a] mt-1">
            Loved Across Pakistan
          </h2>
          <p className="text-xs sm:text-sm text-[#52685a] mt-1">
            See how homes, offices, and courtyards are flourishing with Green Decor.
          </p>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous review"
            className="p-3 rounded-full bg-white hover:bg-[#eaf0e7] text-[#14402a] border border-[#d6e2d3] shadow-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next review"
            className="p-3 rounded-full bg-white hover:bg-[#eaf0e7] text-[#14402a] border border-[#d6e2d3] shadow-xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testimonials Single-Row Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${clampedStart * cardWidthPct}%)` }}
        >
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="shrink-0 px-2 first:pl-0 last:pr-0"
              style={{ width: `${cardWidthPct}%` }}
            >
              <div className="h-full bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-[#e5ece3] flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#d47343] bg-[#fdf3ec] px-2 py-0.5 rounded-full">
                      {item.city}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#2a3f33] leading-relaxed italic mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Footer */}
                <div className="pt-4 border-t border-[#f0f4ee] flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-[#14402a]">
                    <Image
                      src={item.photoUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-[#172b21] truncate">{item.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#52685a] truncate">{item.role}</p>
                    <p className="text-[10px] text-[#d47343] font-medium truncate mt-0.5">
                      Project: {item.serviceOrProduct}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-1.5">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStartIndex(i)}
            aria-label={`Go to review slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              clampedStart === i ? 'w-6 h-2 bg-[#14402a]' : 'w-2 h-2 bg-[#d6e2d3] hover:bg-[#14402a]/50'
            }`}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/testimonials"
          className="text-xs font-bold text-[#14402a] hover:text-[#d47343] hover:underline inline-flex items-center gap-1"
        >
          Read all 350+ customer reviews from Lahore, Karachi & Islamabad &rarr;
        </Link>
      </div>
    </section>
  );
}