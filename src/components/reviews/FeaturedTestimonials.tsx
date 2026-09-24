'use client';

import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2 } from 'lucide-react';
import { useStoreTestimonials } from '@/lib/firestore/store-data';

export default function FeaturedTestimonials() {
  const testimonialsData = useStoreTestimonials();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonialsData.map((item) => {
        const hasImage = !!item.image;

        return hasImage ? (
          /* SPLIT CARD WITH IMAGE */
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xs border border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2 lg:col-span-2"
          >
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
          /* TEXT-ONLY CARD */
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/60 flex flex-col justify-between"
          >
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
        );
      })}
    </div>
  );
}
