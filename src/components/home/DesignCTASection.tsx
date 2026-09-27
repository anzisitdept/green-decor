'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AIResultPreviewCard from '@/components/design/AIResultPreviewCard';

export default function DesignCTASection() {
  return (
    <section className="w-full bg-[#0d3b2e] relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#8bc34a]/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full bg-[#d47343]/15 blur-3xl" aria-hidden />

      <div className="relative w-full grid md:grid-cols-2 gap-10 md:gap-8 px-6 sm:px-10 lg:px-16 py-4 sm:py-8 items-center">
        {/* Copy */}
        <div>
          <span className="font-script text-2xl sm:text-3xl text-[#8bc34a]">Design Studio</span>
          <h2 className="font-extrabold text-3xl sm:text-5xl text-white leading-tight mt-3">
            Upload your image and see the <span className="text-[#8bc34a]">best fit idea.</span>
          </h2>

          <Link
            href="/design-studio"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0d3b2e] text-sm font-bold hover:bg-[#eaf0e7] transition-colors"
          >
            Try the Design Studio
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-white/70 mt-3">Free · No signup needed · Works with your own photos</p>
        </div>

        {/* AI result visual */}
        <div>
          <AIResultPreviewCard />
        </div>
      </div>
    </section>
  );
}
