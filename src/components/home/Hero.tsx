'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      titleLine1: 'Beautiful',
      titleLine2: 'Spaces',
      titleLine3: 'Brighter Lives',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1800&q=95',
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
      image: '/secnd-slide.webp',
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

  // Auto-advance slides every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeSlide];
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to book a free consultation for my home/office space.'
  );

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-white select-none"
    >
      {/* Full-Bleed Right Half Image */}
      <div className="relative lg:absolute top-0 right-0 bottom-0 w-full lg:w-[50%] xl:w-[52%] h-[320px] sm:h-[420px] lg:h-full z-0 overflow-hidden">
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
            <div className="hidden sm:block absolute top-10 right-[24%] lg:right-[26%] z-10 select-none pointer-events-none text-center">
              <p className="font-serif text-[#1e2a22] font-semibold text-xs tracking-wide leading-tight whitespace-pre-line">
                {current.wallScript}
              </p>
            </div>

            {/* Floating Pill Card on the Right: "Small Green Changes Make a Big Difference" */}
            <div className="absolute bottom-12 right-6 lg:right-10 z-20 bg-[#edf4ea]/95 backdrop-blur-xs px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl border border-white/90 max-w-[175px] text-center shadow-md">
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

      {/* Main Content Area (Left Text & CTAs) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 lg:pt-10 lg:pb-10">
        <div className="max-w-xl lg:max-w-md xl:max-w-lg space-y-5">

          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#556b5d]">
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
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-black text-[#38b000] leading-[1.08] tracking-tight">
                {current.titleLine1} <br />
                {current.titleLine2} <br />
                <span className="text-[#38b000]">{current.titleLine3}</span>
              </h1>


            </motion.div>
          </AnimatePresence>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#38b000] text-white text-xs sm:text-sm font-semibold hover:bg-[#2e9900] transition-all shadow-sm hover:shadow flex items-center gap-2 active:scale-95"
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/services"
              className="px-6 py-3 rounded-full border border-[#38b000] bg-white text-[#38b000] text-xs sm:text-sm font-semibold hover:bg-[#eaf0e7] transition-all"
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
