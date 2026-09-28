'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Images } from 'lucide-react';
import { GalleryProject } from '@/types';
import {
  useStoreData,
  useStoreGalleryCategories,
  useStoreGalleryProjects,
} from '@/lib/firestore/store-data';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryProject | null>(null);

  const galleryItems = useStoreGalleryProjects();
  const galleryCategories = useStoreGalleryCategories();
  const { loading } = useStoreData();
  const isLoading = loading.galleryProjects || loading.galleryCategories;

  const filters = useMemo(
    () => [
      { id: 'all', label: 'All Projects' },
      ...galleryCategories.map((category) => ({ id: category.id, label: category.label })),
    ],
    [galleryCategories]
  );

  const filtered =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="w-full bg-white">
      {/* Hero — dark green background, centered heading, wavy divider */}
      <section className="relative w-full h-[52vh] min-h-[320px] sm:h-[58vh] lg:h-[62vh] bg-[#0d3b2e]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
          <h1 className="font-extrabold text-white text-5xl md:text-7xl tracking-tight">
            Gallery
          </h1>
        </div>
        {/* Wavy divider into white page background */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="block absolute -bottom-px left-0 w-full h-10 sm:h-14 lg:h-20"
        >
          <path d="M0,50 C180,86 420,88 720,62 C1020,36 1260,44 1440,70 L1440,90 L0,90 Z" fill="#ffffff" />
        </svg>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {filters.length > 1 && !isLoading ? (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeFilter === f.id
                  ? 'bg-[#0d3b2e] text-white shadow-md'
                  : 'bg-white text-[#2a3f33] hover:bg-[#eaf0e7] border border-[#e5ece3]'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-3xl bg-[#eaf0e7] animate-pulse"
                aria-hidden
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#e5ece3] bg-[#fbfcf9] px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf0e7] text-[#0d3b2e]">
              <Images className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-[#0d3b2e]">No projects here yet</h2>
            <p className="mt-2 max-w-md text-sm text-[#52685a]">
              Our team is documenting the latest green transformations. Browse another category or
              get in touch for a portfolio walkthrough.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0d3b2e] px-6 py-3 text-xs font-bold text-white hover:bg-[#145c43] transition-colors"
            >
              Contact us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#eaf0e7] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Overlay Info */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white space-y-1">
                  <h3 className="font-bold text-base sm:text-lg leading-snug text-white">
                    {item.title}
                  </h3>
                  {item.shortDetails ? (
                    <p className="text-xs text-[#d0ded6] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.shortDetails}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 p-4 sm:p-8 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedPhoto.image ? (
                <div className="relative aspect-[16/9] w-full bg-black">
                  <Image
                    src={selectedPhoto.image}
                    alt={selectedPhoto.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-6 sm:p-8 space-y-2 bg-[#fbfcf9]">
                <h3 className="text-xl font-bold text-[#0d3b2e]">{selectedPhoto.title}</h3>
                <p className="text-xs sm:text-sm text-[#52685a] leading-relaxed">
                  {selectedPhoto.details || selectedPhoto.shortDetails}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
