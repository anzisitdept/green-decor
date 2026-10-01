'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Leaf } from 'lucide-react';

export default function AnnouncementMarquee() {
  const text = "Starting from 1000 PKR only ";
  
  // Repeat array for seamless infinite marquee loop
  const items = Array.from({ length: 12 });

  return (
    <div className="w-full bg-[#e85d04] text-white overflow-hidden py-3 sm:py-3.5 border-y border-[#d05000] shadow-md select-none">
      <Link href="/services" className="block cursor-pointer">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-8">
          {items.map((_, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="font-extrabold uppercase text-xs sm:text-sm tracking-widest drop-shadow-xs">
                {text}
              </span>
              <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="font-serif italic text-xs text-amber-100 font-semibold shrink-0">
                Green Decor Special
              </span>
              <Leaf className="w-4 h-4 text-emerald-200 shrink-0" />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
