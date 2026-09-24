'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sprout, Leaf, Droplet, Scissors } from 'lucide-react';
import { useStoreServices } from '@/lib/firestore/store-data';

const SERVICE_SLOTS = [
  {
    slug: 'book-a-gardener',
    title: 'Garden Maintenance',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    Icon: Sprout,
  },
  {
    slug: 'green-care',
    title: 'Indoor Plants',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    Icon: Leaf,
  },
  {
    slug: 'landscaping',
    title: 'Irrigation Services',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    Icon: Droplet,
  },
  {
    slug: 'green-makeover',
    title: 'Artificial Grass',
    image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=600&q=80',
    Icon: Scissors,
  },
];

export default function OurMostRequestedServices() {
  const services = useStoreServices();
  const servicesList = SERVICE_SLOTS.map((slot) => {
    const match = services.find((s) => s.slug === slot.slug);
    return match
      ? { id: match.id, slug: match.slug, title: match.title, image: match.heroImage, Icon: slot.Icon }
      : { id: slot.slug, slug: slot.slug, title: slot.title, image: slot.image, Icon: slot.Icon };
  });

  return (
    <section className="w-full bg-[#f8f7f2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#38b000] tracking-tight">
            Explore our wide range of services
          </h2>
        </div>

        {/* 4 Service Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {servicesList.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-[3.4/4.6] sm:aspect-[3.5/4.8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end"
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Subtle Bottom Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Floating White Label Card with Top Circle Icon */}
              <div className="relative z-10 m-3 sm:m-4 bg-white rounded-2xl p-3.5 sm:p-4 text-center shadow-md flex flex-col items-center justify-center">
                {/* Circle Icon overlapping the top border */}
                <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center -mt-8 sm:-mt-9 mb-1.5 border border-neutral-100 text-[#38b000] shrink-0">
                  <service.Icon className="w-5 h-5 text-[#38b000]" />
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-[#38b000] text-center leading-tight">
                  {service.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}