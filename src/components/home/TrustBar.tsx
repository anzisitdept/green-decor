'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, MapPin, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { useSiteContent } from '@/lib/firestore/store-data';

const ICONS = [
  <Sprout key="sprout" className="w-5 h-5 text-[#0d3b2e]" />,
  <MapPin key="map" className="w-5 h-5 text-[#0d3b2e]" />,
  <ShieldCheck key="shield" className="w-5 h-5 text-[#0d3b2e]" />,
  <Leaf key="leaf" className="w-5 h-5 text-[#0d3b2e]" />,
];

export default function TrustBar() {
  const { content } = useSiteContent();
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to explore your green decor solutions for my space.'
  );

  const trustItems = content?.trustBar?.stats?.length
    ? content.trustBar.stats.map((stat, idx) => ({
        icon: ICONS[idx % ICONS.length],
        num: stat.number,
        label: stat.label,
      }))
    : [
        {
          icon: <Sprout className="w-5 h-5 text-[#0d3b2e]" />,
          num: '1000+',
          label: 'Happy Customers',
        },
        {
          icon: <MapPin className="w-5 h-5 text-[#0d3b2e]" />,
          num: 'Across',
          label: 'Pakistan',
        },
        {
          icon: <ShieldCheck className="w-5 h-5 text-[#0d3b2e]" />,
          num: 'Quality',
          label: 'Plants & Materials',
        },
        {
          icon: <Leaf className="w-5 h-5 text-[#0d3b2e]" />,
          num: 'Trusted by Homes',
          label: '& Businesses',
        },
      ];

  return (
    <section className="pt-0 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-transparent pt-2 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-3/4">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#eaf0e7] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">
                  {item.num}
                </span>
                <span className="text-[11px] text-white/70 block leading-tight">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button: Let's Grow Together -> */}
        <div className="shrink-0 w-full lg:w-auto text-center lg:text-right">
          {content?.trustBar?.note ? (
            <p className="text-[11px] text-white/70 mb-2">{content.trustBar.note}</p>
          ) : null}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white text-[#0d3b2e] text-xs sm:text-sm font-semibold hover:bg-[#eaf0e7] transition-all shadow-md active:scale-95 group"
          >
            <span>Let&rsquo;s Grow Together</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
