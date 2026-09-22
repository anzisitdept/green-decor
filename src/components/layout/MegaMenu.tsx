'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { servicesData } from '@/lib/data/services';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  onClose: () => void;
}

export default function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] bg-white rounded-2xl shadow-2xl border border-[#e5ece3] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f0f4ee]">
        <h4 className="text-base font-serif font-bold text-[#14402a]">Our Premium Green Services</h4>
        <Link
          href="/services"
          onClick={onClose}
          className="text-xs font-semibold text-[#14402a] hover:text-[#d47343] flex items-center gap-1 transition-colors"
        >
          View All Services <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {servicesData.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            onClick={onClose}
            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f4f7f2] transition-colors border border-transparent hover:border-[#d6e2d3]"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image
                src={service.heroImage}
                alt={service.title}
                width={48}
                height={48}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="text-sm font-semibold text-[#172b21] group-hover:text-[#14402a] leading-tight">
              {service.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}