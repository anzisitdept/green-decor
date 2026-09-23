import React from 'react';
import Image from 'next/image';
import { Leaf, Home, Flower2, ShieldCheck } from 'lucide-react';

const whyChooseUsPillars = [
  {
    title: 'Expert-Grown Plants',
    description: 'Hand-selected by experienced growers for exceptional health, growth, size, and beauty.',
    Icon: Leaf,
  },
  {
    title: 'Care Made Simple',
    description: 'Includes clear, beginner-friendly instructions so anyone can confidently maintain healthy plants.',
    Icon: Home,
  },
  {
    title: 'Ready to Display',
    description: 'Arrives pre-fertilized, shaped, trimmed, and cleaned for an instantly beautiful look.',
    Icon: Flower2,
  },
  {
    title: 'Safe Delivery, Every Time',
    description: 'Packed with protective materials to prevent leaf, stem, or soil damage during transport.',
    Icon: ShieldCheck,
  },
];

export default function WhyPlantLovers() {
  return (
    <section className="w-full bg-[#f8f7f2] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="pt-8 border-t border-emerald-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Side: Large Photo of Plant Lovers / Gardeners */}
            <div className="lg:col-span-6 relative aspect-[4/3.2] w-full rounded-3xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1000&q=80"
                alt="Why Plant Lovers Choose Green Decor"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Right Side: Features & CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#38b000] leading-tight">
                Why Plant Lovers Choose <br className="hidden sm:block" />
                Green Decor
              </h2>

              {/* 4 Feature Items */}
              <div className="space-y-5">
                {whyChooseUsPillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-emerald-900/10 flex items-center justify-center shrink-0 text-[#38b000] mt-0.5">
                      <pillar.Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#38b000]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#52685a] leading-relaxed mt-0.5 max-w-lg">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}