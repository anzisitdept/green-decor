import React from 'react';
import Image from 'next/image';
import { Sprout, ShieldCheck, Users, Award, Leaf } from 'lucide-react';

export const metadata = {
  title: 'About Us — Green Decor Pakistan | Our Story & Nursery Legacy',
  description: 'Learn about Green Decor Pakistan, our climate-acclimatized plant nurseries, and biophilic architectural vision.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero — plain dark green background, centered heading, wavy divider */}
      <section className="relative w-full h-[85vh] min-h-[560px] sm:h-[88vh] lg:h-[92vh] bg-[#0d3b2e]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
          <h1 className="font-extrabold text-white text-5xl md:text-7xl tracking-tight">
            About Us
          </h1>
        </div>
        {/* Wavy divider into page background */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="block absolute -bottom-px left-0 w-full h-10 sm:h-14 lg:h-20"
        >
          <path d="M0,50 C180,86 420,88 720,62 C1020,36 1260,44 1440,70 L1440,90 L0,90 Z" fill="#ffffff" />
        </svg>
      </section>

      {/* Intro / Tagline */}
      <section className="pt-14 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left column: dotted-line + leaf accent + heading */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 sm:w-14 border-t-2 border-dotted border-[#0d3b2e]/50" />
              <Leaf className="w-6 h-6 text-[#0d3b2e]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0d3b2e] leading-tight">
              We Plan . We Plant . We Protect.
            </h2>
          </div>

          {/* Right column: existing About Us body copy */}
          <div className="flex items-center">
            <p className="text-sm sm:text-base text-[#4a5f52] leading-relaxed">
              Green Decor was founded with a singular conviction: that living amidst lush greenery,
              oxygen-rich foliage, and thoughtfully styled botanical architecture transforms our
              everyday happiness and well-being.
            </p>
          </div>
</div>
      </section>

      {/* Full-bleed brand work image — no rounding, spans the section edge to edge */}
      <section className="relative w-full h-[60vh] min-h-[320px] sm:h-[70vh] lg:h-[85vh]">
        <Image
          src="/about us.jpeg"
          alt="Green Decor landscaping and installation work"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece3] shadow-lg">
          <h3 className="text-2xl font-bold text-[#0d3b2e] text-center mb-10">
            Our Four Pillars of Quality
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#0d3b2e] mx-auto">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#172b21]">100% Acclimatized Plants</h4>
              <p className="text-xs text-[#52685a]">Zero greenhouse shock; rooted for real home and outdoor climates.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#0d3b2e] mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#172b21]">Transit Crate Guarantee</h4>
              <p className="text-xs text-[#52685a]">Specialized wooden crates guarantee healthy, break-free arrival nationwide.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#0d3b2e] mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#172b21]">Architectural Quality</h4>
              <p className="text-xs text-[#52685a]">Bespoke planters and landscape layouts designed by certified horticulturists.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#0d3b2e] mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#172b21]">Ongoing Care Support</h4>
              <p className="text-xs text-[#52685a]">Complimentary WhatsApp leaf health diagnostics for every plant parent.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}