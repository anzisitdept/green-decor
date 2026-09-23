'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, X, ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'landscaping' | 'patios' | 'indoor' | 'aquariums' | 'commercial';
  location: string;
  imageUrl: string;
  description: string;
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Modern Terrace Pergola & Biophilic Lounge',
      category: 'patios',
      location: 'DHA Phase 5, Lahore',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      description: 'Lush potted ficus trees, custom teak benches, and mood lighting designed for outdoor evening gatherings.',
    },
    {
      id: 'g-2',
      title: 'Contemporary 2-Kanal Lawn & Stone Walkway',
      category: 'landscaping',
      location: 'Sector F-7, Islamabad',
      imageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80',
      description: 'Fine Korean turf sodding, white river pebble borders, and automated pop-up sprinkler system.',
    },
    {
      id: 'g-3',
      title: 'Luxury Double-Height Living Room Botanical Wall',
      category: 'indoor',
      location: 'Clifton Block 4, Karachi',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      description: 'Monstera, Fiddle Leaf Figs, and vertical hanging brass planters complementing modern architecture.',
    },
    {
      id: 'g-4',
      title: 'Zen High-Tech Planted Aquascape Tank (120cm)',
      category: 'aquariums',
      location: 'Gulberg 3, Lahore',
      imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
      description: 'Optiwhite low-iron glass aquarium with submerged carpet moss and schooling Cardinal Tetras.',
    },
    {
      id: 'g-5',
      title: 'Corporate HQ Biophilic Reception & Planters',
      category: 'commercial',
      location: 'Blue Area, Islamabad',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      description: 'Low-light resilient Snake Plants and ZZ foliage in artisan matte white fiber planters.',
    },
    {
      id: 'g-6',
      title: 'Courtyard Japanese Zen Garden with Water Feature',
      category: 'landscaping',
      location: 'Bahria Town, Rawalpindi',
      imageUrl: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=80',
      description: 'Sculptural stone lanterns, natural slate paving, and cascading tranquil waterfall basin.',
    },
  ];

  const filtered = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'landscaping', label: 'Lawn & Landscaping' },
    { id: 'patios', label: 'Rooftops & Patios' },
    { id: 'indoor', label: 'Indoor Living Spaces' },
    { id: 'aquariums', label: 'Planted Aquariums' },
    { id: 'commercial', label: 'Commercial & Offices' },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero — full-bleed image, dark green overlay, centered heading, wavy divider */}
      <section className="relative w-full h-[70vh] min-h-[440px] sm:h-[78vh] lg:h-[80vh] overflow-hidden bg-[#0d3b2e]">
        <Image
          src="/gallery-hero.jfif"
          alt="Green Decor gallery of our green creations"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#0d3b2e]/45 to-[#0d3b2e]/75" />
        <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
          <h1 className="font-serif font-extrabold text-white text-5xl md:text-7xl tracking-tight">

          </h1>
        </div>
        {/* Wavy divider into white page background */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-10 sm:h-14 lg:h-20"
        >
          <path d="M0,50 C180,86 420,88 720,62 C1020,36 1260,44 1440,70 L1440,90 L0,90 Z" fill="#ffffff" />
        </svg>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeFilter === f.id
                ? 'bg-[#38b000] text-white shadow-md'
                : 'bg-white text-[#2a3f33] hover:bg-[#eaf0e7] border border-[#e5ece3]'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#eaf0e7] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Overlay Info */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#fec89a] font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg leading-snug text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#d0ded6] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 p-4 sm:p-8 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-[16/9] w-full bg-black">
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-2 bg-[#fbfcf9]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d47343]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedPhoto.location}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#38b000]">{selectedPhoto.title}</h3>
                <p className="text-xs sm:text-sm text-[#52685a] leading-relaxed">{selectedPhoto.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
