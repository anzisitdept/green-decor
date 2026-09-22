'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, MapPin, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function TrustBar() {
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to explore your green decor solutions for my space.'
  );

  const trustItems = [
    {
      icon: <Sprout className="w-5 h-5 text-[#14402a]" />,
      num: '1000+',
      label: 'Happy Customers',
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#14402a]" />,
      num: 'Across',
      label: 'Pakistan',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#14402a]" />,
      num: 'Quality',
      label: 'Plants & Materials',
    },
    {
      icon: <Leaf className="w-5 h-5 text-[#14402a]" />,
      num: 'Trusted by Homes',
      label: '& Businesses',
    },
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-transparent border-t border-[#dce7da] pt-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-3/4">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#eaf0e7] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-[#172b21] block leading-tight">
                  {item.num}
                </span>
                <span className="text-[11px] text-[#52685a] block leading-tight">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button: Let's Grow Together -> */}
        <div className="shrink-0 w-full lg:w-auto text-center lg:text-right">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#14402a] text-white text-xs sm:text-sm font-semibold hover:bg-[#1b5539] transition-all shadow-md active:scale-95 group"
          >
            <span>Let&rsquo;s Grow Together</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
