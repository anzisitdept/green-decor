'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Trees, Home, Fish, Sparkles, Gift } from 'lucide-react';
import type { ServiceItem } from '@/types';

const serviceIconMap: Record<string, typeof Leaf> = {
  Leaf,
  Trees,
  Home,
  Fish,
  Sparkles,
  Gift,
};

export default function ServicesCardGrid({ services }: { services: ServiceItem[] }) {
  const rows = Array.from({ length: Math.ceil(services.length / 2) }, (_, i) =>
    services.slice(i * 2, i * 2 + 2)
  );

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {rows.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {row.map((service) => {
            const Icon = serviceIconMap[service.icon] || Leaf;
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative block bg-white rounded-3xl shadow-md overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300"
              >
                {/* Faded ghost duplicate icon top-right (decorative) */}
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.2}
                  className="absolute -top-4 -right-4 w-32 h-32 text-[#38b000] opacity-10 rotate-12 pointer-events-none"
                />

                <div className="flex-1 p-8 sm:p-10">
                  {/* Outline icon top-left */}
                  <Icon strokeWidth={1.4} className="w-16 h-16 text-[#38b000]" />

                  {/* Title */}
                  <h3 className="relative z-10 font-serif font-bold text-2xl text-[#38b000] mt-5 group-hover:text-[#d47343] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-xs text-[#52685a] leading-relaxed mt-2 line-clamp-3 max-w-md">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Full-bleed service photo (covers full width left, right, and bottom) */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#f4f7f2]">
                  <Image
                    src={service.heroImage}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-[#38b000]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                    {service.pricingRange}
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>
      ))}
    </section>
  );
}