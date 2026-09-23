'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { testimonialsData } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#f8f7f2] select-none">
      {/* Header & Navigation Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d]">
            VERIFIED REVIEWS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#38b000] mt-0.5 tracking-tight">
            Loved Across Pakistan
          </h2>
        </div>

        {/* Circular Green Carousel Navigation Buttons */}
        <div className="flex items-center gap-2.5 mr-2 sm:mr-6 lg:mr-10">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous reviews"
            className="w-10 h-10 rounded-full bg-[#528d56] hover:bg-[#3f7043] text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next reviews"
            className="w-10 h-10 rounded-full bg-[#d2e4d3] hover:bg-[#b8d6ba] text-[#245429] flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reviews Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-proximity pb-4 px-1 scrollbar-none"
      >
        {testimonialsData.map((item) => {
          const hasImage = !!item.image;

          return (
            <div
              key={item.id}
              className={`snap-start shrink-0 ${
                hasImage ? 'w-[320px] sm:w-[540px]' : 'w-[280px] sm:w-[360px]'
              }`}
            >
              {hasImage ? (
                /* TYPE 2: SPLIT CARD WITH IMAGE */
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow-xs border border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2">
                  {/* Left Photo */}
                  <div className="relative aspect-square sm:aspect-auto h-full w-full bg-[#f2f2ee] min-h-[220px]">
                    <Image
                      src={item.image!}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="p-6 flex flex-col justify-between bg-white min-h-[220px]">
                    <div>
                      {/* 5 Centered Gold Stars */}
                      <div className="flex justify-center text-amber-400 gap-1 mb-3">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-center text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal mb-6">
                        {item.quote}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs">
                      <span className="font-bold text-neutral-900">{item.name}</span>
                      <span className="flex items-center gap-1 font-semibold text-[#27964c] text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-[#27964c] text-white" />
                        <span>Verified Buyer</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* TYPE 1: TEXT-ONLY CARD (NO IMAGE) */
                <div className="h-full bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/60 flex flex-col justify-between">
                  <div>
                    {/* 5 Centered Gold Stars */}
                    <div className="flex justify-center text-amber-400 gap-1 mb-4">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-center text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal mb-6">
                      {item.quote}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs">
                    <span className="font-bold text-neutral-900">{item.name}</span>
                    <span className="flex items-center gap-1 font-semibold text-[#27964c] text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#27964c] text-white" />
                      <span>Verified Buyer</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Link to Reviews Page */}
      <div className="mt-6 text-center">
        <Link
          href="/testimonials"
          className="text-xs sm:text-sm font-bold text-[#38b000] hover:text-[#27964c] hover:underline inline-flex items-center gap-1.5"
        >
          <span>Read all verified customer reviews</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}