'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LeftBrandSidebar() {
  const categories = [
    {
      label: 'Pots',
      href: '/shop?category=pots',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#0d3b2e]">
          {/* Potted plant icon */}
          <path d="M12 10V3M12 3C10.5 4.5 9 6.5 9 8.5C9 9.5 10 10 12 10M12 3C13.5 4.5 15 6.5 15 8.5C15 9.5 14 10 12 10" />
          <path d="M7 10h10l-1.5 10h-7L7 10z" />
          <path d="M6 10h12" />
        </svg>
      ),
    },
    {
      label: 'Wall hangings',
      href: '/shop?category=wall-hangings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#0d3b2e]">
          {/* Framed wall art icon */}
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 15l5-4 4 3 3-2 6 4" />
          <path d="M12 21h8" />
        </svg>
      ),
    },
    {
      label: 'Landscaping',
      href: '/services/landscaping',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#0d3b2e]">
          {/* Tree icon */}
          <path d="M12 14v8M8 22h8" />
          <path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.1V15a3 3 0 0 0 6 0v-.9c1.8-1 3-2.9 3-5.1a6 6 0 0 0-6-6z" />
        </svg>
      ),
    },
    {
      label: 'Aqua Green',
      href: '/services/aqua-green',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#0d3b2e]">
          {/* Fish icon */}
          <path d="M2 12c4-4 12-6 18 0-6 6-14 4-18 0z" />
          <path d="M18 12l4-3v6l-4-3z" />
          <circle cx="7" cy="11" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Chemicals',
      href: '/shop?category=chemicals',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#0d3b2e]">
          {/* Spray bottle icon */}
          <path d="M9 3h6v3H9z" />
          <path d="M15 4h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-4" />
          <path d="M8 8h8l2 12H6L8 8z" />
        </svg>
      ),
    },
    {
      label: 'Green Gifts',
      href: '/services/green-gifts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#0d3b2e]">
          {/* Gift Box icon */}
          <rect x="3" y="8" width="18" height="13" rx="1" />
          <path d="M12 8v13M3 13h18" />
          <path d="M12 8c-2-2-4-2-4 0s2 2 4 0zm0 0c2-2 4-2 4 0s-2 2-4 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-full lg:w-[260px] xl:w-[290px] shrink-0 bg-white border-r border-[#e8ece4] px-4 py-4 flex flex-col justify-between items-center text-center relative lg:h-[calc(100vh-5rem)]">

      {/* Top Character Illustration with Overlapping Floating Script Text */}
      <div className="relative w-full flex flex-col items-center">

        {/* Floating Top-Left Handwritten Script Text matching reference image */}
        <div className="absolute top-1 left-1 z-20 text-left -rotate-6 select-none pointer-events-none">
          <div className="font-script text-xl sm:text-2xl text-[#0d3b2e] leading-[1.05] tracking-tight drop-shadow-xs">
            Greener <br />
            Spaces <br />
            Happier <br />
            People ♡
          </div>
          {/* Floating tiny leaf */}
          <div className="mt-0.5 text-emerald-800 text-xs -rotate-12">🍃</div>
        </div>

        {/* Character + Logo Image Asset - compact height so everything fits at once */}
        <div className="relative w-full aspect-[1/1.15] max-h-[250px] sm:max-h-[280px]">
          <Image
            src="/logo.png"
            alt="Green Decor - Bringing Nature to Every Space"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* 6 Category Navigation Links Centered Horizontally Under Logo */}
      <div className="w-full flex flex-col items-center py-2">
        <div className="inline-flex flex-col space-y-2.5 items-start">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-[#1f3328] hover:text-[#0d3b2e] transition-all"
            >
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-left leading-tight whitespace-nowrap">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Angled Handwritten Script Tagline matching reference */}
      <div className="pt-1 pb-1 -rotate-3 text-center select-none">
        <p className="font-script text-xl sm:text-2xl text-[#0d3b2e] leading-tight flex items-center justify-center gap-1.5">
          <span>A Greener Pakistan Together</span>
          <span className="text-sm not-italic">🍃</span>
        </p>
      </div>

    </aside>
  );
}
