'use client';

import React from 'react';
import { Leaf, Users, Globe2, Heart } from 'lucide-react';

export default function PurposeSection() {
  const pillars = [
    {
      icon: <Leaf className="w-5 h-5 text-[#14402a]" />,
      label: 'Healthy Living',
    },
    {
      icon: <Users className="w-5 h-5 text-[#14402a]" />,
      label: 'Better Communities',
    },
    {
      icon: <Globe2 className="w-5 h-5 text-[#14402a]" />,
      label: 'Sustainable Pakistan',
    },
    {
      icon: <Heart className="w-5 h-5 text-[#14402a]" />,
      label: 'A Greener Tomorrow',
    },
  ];

  return (
    <section className="pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Our Purpose & Subcopy (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d]">
              OUR PURPOSE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#14402a] leading-tight">
              Greener Spaces <br />
              Happier Communities
            </h2>
            <p className="text-xs text-[#4a5f52] leading-relaxed">
              We create green environments that inspire, relax and bring people closer to nature.
            </p>
          </div>

          {/* Center: 4 Circular Pillars (4 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {pillars.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#f8faf7] shadow-xs border border-[#e5ece3] flex items-center justify-center hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-[#172b21] leading-snug">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Handwritten Quote Box (3 cols) */}
          <div className="lg:col-span-3 bg-[#f8faf7] rounded-2xl p-5 border border-[#e5ece3] flex flex-col justify-between shadow-xs relative">
            <span className="text-2xl font-serif text-[#14402a] font-bold leading-none select-none">
              “
            </span>
            <p className="font-script text-lg sm:text-xl text-[#14402a] leading-tight my-2">
              Nature is not a place to visit, it is a home to create.
            </p>
            <div className="flex justify-end">
              <span className="text-xl">🍃</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
