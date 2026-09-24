import React from 'react';
import Image from 'next/image';
import { PhoneCall } from 'lucide-react';
import ServicesGridFromStore from '@/components/services/ServicesGridFromStore';
import WhyPlantLovers from '@/components/services/WhyPlantLovers';
import WhatsAppLink from '@/components/common/WhatsAppLink';

export const metadata = {
  title: 'Our Services — Green Decor | Learn, Heal, Transform & Grow',
  description: 'Explore turnkey green services across Pakistan: green styling, landscaping, plant health, gardener visits, makeovers, custom pots, gifting, aqua corners and care plans.',
};

export default function ServicesOverviewPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero — full-bleed image, dark green overlay, centered heading, wavy divider into the page bg */}
      <section className="relative w-full h-[70vh] min-h-[440px] sm:h-[78vh] lg:h-[82vh] bg-[#0d3b2e]">
        <Image
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=90"
          alt="Green Decor greenery and landscaping work"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle bottom-only gradient overlay for text readability without obscuring upper image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
          <h1 className="font-serif font-extrabold text-white text-5xl md:text-7xl tracking-tight">
            Our Services
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

      {/* Services Cards — 2 per row, reveal row-by-row */}
      <ServicesGridFromStore />

      {/* Why Plant Lovers Choose Green Decor */}
      <WhyPlantLovers />

      {/* Consultation Banner */}
      <section className="pb-14 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#38b000] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d47343]">
              BESPOKE SITE VISIT & CONSULTATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">
              Need an on-site landscape assessment?
            </h3>
            <p className="text-xs sm:text-sm text-[#b8d4c3] leading-relaxed">
              Our principal horticulturists visit residential estates, rooftop terraces, and office complexes in Lahore, Islamabad, and Karachi.
            </p>
          </div>

          <WhatsAppLink
            message="Hello Green Decor! I would like to inquire about your turnkey landscaping and interior plant styling services."
            className="px-8 py-4 rounded-full bg-white text-[#38b000] text-xs sm:text-sm font-bold hover:bg-[#eaf0e7] transition-all shadow-lg active:scale-95 shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Book Free Site Assessment</span>
          </WhatsAppLink>
        </div>
      </section>
    </div>
  );
}