'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/*
// HERO SLIDES & CAROUSEL DATA (Commented out for static hero image)
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
];
*/

export default function Hero() {
  /*
  // HERO CAROUSEL LOGIC (Commented out for static hero image)
  const { content } = useSiteContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(() => {
    const remote = content?.heroSlides?.length ? mapAdminSlides(content.heroSlides) : [];
    return remote.length > 0 ? remote : DEFAULT_SLIDES;
  }, [content]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);
  */

  return (
    <section className="relative w-full overflow-hidden bg-[#faedcd] pt-14 sm:pt-16 lg:pt-16">
      {/* Static Hero Banner — Spaced below navbar, background matches cream navbar theme */}
      <Link
        href="/services"
        className="block relative w-full group cursor-pointer overflow-hidden"
        aria-label="Explore Green Decor Services"
      >
        <Image
          src="/hero.jpeg"
          alt="Where life slows beautifully - Green Decor"
          width={1920}
          height={640}
          priority
          sizes="100vw"
          className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
        {/* Soft hover overlay hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </Link>
    </section>
  );
}
