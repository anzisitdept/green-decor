'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '@/lib/data/services';

export default function ServicesGrid() {
  const serviceCards = servicesData.slice(0, 6).map((service) => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    image: service.heroImage.replace('w=1200', 'w=600'),
  }));

  return (
    <section className="pt-1 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d]">
            OUR SERVICES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#14402a] mt-0.5">
            Solutions for Every Space
          </h2>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#14402a] hover:text-[#d47343] transition-colors group"
        >
          <span>View All Services</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 6 Clean White Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {serviceCards.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="group flex flex-col justify-between bg-white hover:bg-[#f6faf4] rounded-2xl p-3.5 border border-[#e5ece3] hover:border-[#14402a]/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-center"
          >
            <div>
              {/* Card Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3 shadow-xs border border-[#e8efe6]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & 1-line Description */}
              <h3 className="text-xs font-serif font-bold text-[#172b21] group-hover:text-[#14402a] transition-colors">
                {service.title}
              </h3>
              <p className="text-[10px] text-[#556b5d] line-clamp-2 mt-1 leading-tight">
                {service.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}