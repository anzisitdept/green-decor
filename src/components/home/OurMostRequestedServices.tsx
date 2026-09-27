'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Leaf, Droplet, Scissors } from 'lucide-react';
import { useStoreServices } from '@/lib/firestore/store-data';

const SERVICE_SLOTS = [
  {
    slug: 'book-a-gardener',
    title: 'Garden Maintenance',
    Icon: Sprout,
  },
  {
    slug: 'green-care',
    title: 'Indoor Plants',
    Icon: Leaf,
  },
  {
    slug: 'landscaping',
    title: 'Irrigation Services',
    Icon: Droplet,
  },
  {
    slug: 'green-makeover',
    title: 'Artificial Grass',
    Icon: Scissors,
  },
];

export default function OurMostRequestedServices() {
  const services = useStoreServices();
  const servicesList = SERVICE_SLOTS.map((slot) => {
    const match = services.find((s) => s.slug === slot.slug);
    return match
      ? { id: match.id, slug: match.slug, title: match.title, Icon: slot.Icon }
      : { id: slot.slug, slug: slot.slug, title: slot.title, Icon: slot.Icon };
  });

  return (
    <section className="w-full bg-[#0d3b2e] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Explore our wide range of services
          </h2>
        </div>

        {/* 4 Service Icon Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {servicesList.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group flex flex-col items-center text-center gap-3.5"
            >
              {/* White Circle Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110">
                <service.Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#0d3b2e]" />
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {service.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}