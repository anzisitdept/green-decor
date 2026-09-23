import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PurposeSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="relative lg:h-[600px]">

        {/* Left content zone — dark green diagonal band (stacked on top for mobile) */}
        <div className="relative z-10 bg-[#0d3b2e] text-white px-6 sm:px-10 lg:pl-10 lg:pr-20 py-12 sm:py-14 lg:py-0 lg:h-full lg:absolute lg:inset-0 lg:flex flex-col justify-center lg:[clip-path:polygon(0_0,58%_0,68%_100%,0_100%)]">
          <span className="text-sm font-bold text-[#8bc34a] tracking-wide uppercase">
            You think it and we can make it!
          </span>
          <h2 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-[1.1] mt-3">
            Unique Planters &amp; Pots
          </h2>
          <p className="text-[#f0f3ee] text-sm sm:text-base leading-relaxed mt-4 max-w-[500px]">
            From hand-thrown terracotta to bespoke concrete and branded corporate planters,
            every piece is crafted to your vision. We design, cast and deliver planters that
            turn any corner into a statement.
          </p>
          <div className="mt-7">
            <Link
              href="/shop?category=home-decor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8bc34a] text-[#0d3b2e] text-sm font-bold hover:bg-[#9ccc65] transition-colors group"
            >
              <span>More About Planters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right image zone — full-bleed photo behind the diagonal (below the green on mobile) */}
        <div className="relative w-full h-[300px] sm:h-[360px] lg:absolute lg:inset-0 lg:h-full">
          <Image
            src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1400&q=80"
            alt="Modern interior styling with tall green planters"
            fill
            priority
            className="object-cover object-center"
          />
          {/* thin light-gray vertical strip at the far right edge */}
          <div aria-hidden="true" className="hidden lg:block absolute inset-y-0 right-0 w-1 bg-[#d8dbdc]" />
        </div>

      </div>
    </section>
  );
}