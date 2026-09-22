'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { promoSlidesData } from '@/lib/data/promos';

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoSlidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = promoSlidesData[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promoSlidesData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promoSlidesData.length) % promoSlidesData.length);
  };

  return (
    <section className="pt-6 pb-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative rounded-3xl overflow-hidden shadow-md min-h-[200px] sm:min-h-[220px] bg-[#14402a]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-[#14402a] via-[#1b5338] to-[#256c49] flex items-center"
          >
            {/* Background Image with Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 overflow-hidden opacity-30 md:opacity-40">
              <Image
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#14402a] via-[#14402a]/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-12 py-8 max-w-2xl text-white space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-white">
                  {currentSlide.kicker}
                </span>
                {currentSlide.badge && (
                  <span className="text-[10px] sm:text-xs font-bold text-[#fec89a] bg-black/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {currentSlide.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold leading-tight text-white">
                {currentSlide.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#d0ded6] line-clamp-2 max-w-lg">
                {currentSlide.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={currentSlide.ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#14402a] text-xs sm:text-sm font-bold hover:bg-[#eaf0e7] transition-all shadow-md active:scale-95"
                >
                  <span>{currentSlide.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
          {/* Prev/Next arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5 px-2">
            {promoSlidesData.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
