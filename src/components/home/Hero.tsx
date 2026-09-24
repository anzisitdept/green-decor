'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { useSiteContent, useSiteSettings } from '@/lib/firestore/store-data';
import type { HeroSlide } from '@/types';

const DEFAULT_SLIDES = [
  {
    id: 1,
    titleLine1: 'Beautiful',
    titleLine2: 'Spaces',
    titleLine3: 'Brighter Lives',
    image: '/hero-1.webp',
    wallScript: 'Good\nPlants\nGood\nMood ♡',
    badgeWord: 'Small',
    badgeLine1: 'Green Changes',
    badgeLine2: 'Make a Big Difference',
  },
  {
    id: 2,
    titleLine1: 'Nature’s Touch',
    titleLine2: 'for Modern',
    titleLine3: 'Living Spaces',
    image: '/hero-2.jfif',
    wallScript: 'Pure\nAir\nPure\nMind 🌿',
    badgeWord: 'Lush',
    badgeLine1: 'Living Energy',
    badgeLine2: 'For Modern Homes',
  },
  {
    id: 3,
    titleLine1: 'Lush Lawns',
    titleLine2: 'Serene Patios',
    titleLine3: 'Across Pakistan',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=95',
    wallScript: 'Live\nIn\nNature 💚',
    badgeWord: 'Bespoke',
    badgeLine1: 'Lawn & Terrace',
    badgeLine2: 'Turnkey Excellence',
  },
];

function mapAdminSlides(heroSlides: HeroSlide[]) {
  return heroSlides.map((slide, index) => {
    const lines = slide.title
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    return {
      id: index + 1,
      titleLine1: lines[0] ?? slide.title,
      titleLine2: lines[1] ?? '',
      titleLine3: lines[2] ?? '',
      image: slide.image,
      wallScript: slide.wallScript ?? '',
      badgeWord: '',
      badgeLine1: slide.badge ?? '',
      badgeLine2: slide.subtitle ?? '',
    };
  });
}

export default function Hero() {
  const { content } = useSiteContent();
  const settings = useSiteSettings();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(() => {
    const remote = content?.heroSlides?.length ? mapAdminSlides(content.heroSlides) : [];
    return remote.length > 0 ? remote : DEFAULT_SLIDES;
  }, [content]);

  // Auto-advance slides every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeSlide] ?? slides[0];
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to book a free consultation for my home/office space.',
    settings.whatsappNumber
  );

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-white select-none"
    >
      {/* Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full"
          >
            <Image
              src={current.image}
              alt="Lush Patio & Landscape Living Space"
              fill
              priority
              className="object-cover object-center"
            />

            {/* Wall Script Typography: "Good Plants Good Mood ♡" */}
            <div className="hidden sm:block absolute top-10 right-[10%] lg:right-[14%] z-10 select-none pointer-events-none text-center">
              <p className="font-serif text-[#1e2a22] font-semibold text-xs tracking-wide leading-tight whitespace-pre-line">
                {current.wallScript}
              </p>
            </div>

            {/* Floating Pill Card: "Small Green Changes Make a Big Difference" */}
            <div className="hidden sm:block absolute bottom-24 right-6 lg:right-10 z-20 bg-[#edf4ea]/95 backdrop-blur-xs px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl border border-white/90 max-w-[175px] text-center shadow-md">
              <div className="w-7 h-7 rounded-full bg-[#38b000] text-white flex items-center justify-center mx-auto mb-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-serif font-bold text-[#38b000] leading-tight">
                <span className="font-script text-xs sm:text-sm font-normal block text-[#33a800] italic">
                  {current.badgeWord}
                </span>
                {current.badgeLine1} <br />
                {current.badgeLine2}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Light fade on the left for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/50 via-white/15 to-transparent" />

      {/* Main Content Area (overlaid on upper region of the image) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-10 min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] xl:min-h-[560px]">
        <div className="max-w-xl lg:max-w-md xl:max-w-lg space-y-5">

          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#38b000]">
              WE PLAN · WE PLANT · WE PROTECT
            </span>
          </div>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="space-y-2.5"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#38b000] leading-[1.08] tracking-tight bg-white/95 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl shadow-sm w-fit">
                {current.titleLine1} <br />
                {current.titleLine2} <br />
                <span className="text-[#38b000]">{current.titleLine3}</span>
              </h1>


            </motion.div>
          </AnimatePresence>

          {/* Dual CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#38b000] text-white text-[11px] sm:text-sm font-semibold hover:bg-[#2e9900] transition-all shadow-sm hover:shadow flex items-center gap-2 active:scale-95"
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/services"
              className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full border border-[#38b000] bg-white text-[#38b000] text-[11px] sm:text-sm font-semibold hover:bg-[#eaf0e7] transition-all"
            >
              Explore Our Services
            </Link>
          </div>

          {/* Carousel Dots Indicators: ● 01 02 03 */}
          <div className="pt-1 flex items-center gap-4 text-xs font-bold text-[#556b5d]">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`flex items-center gap-1.5 transition-all cursor-pointer ${activeSlide === idx ? 'text-[#38b000] font-black scale-105' : 'text-[#8da597] hover:text-[#38b000]'
                  }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'bg-[#38b000] scale-110 ring-2 ring-[#38b000]/20' : 'bg-[#c5d6cc]'
                    }`}
                />
                <span>0{idx + 1}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
