import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, Quote, MapPin } from 'lucide-react';
import { testimonialsData } from '@/lib/data/testimonials';

export const metadata = {
  title: 'Customer Testimonials — Green Decor Pakistan | Reviews & Ratings',
  description: 'Read genuine reviews from homeowners, interior designers, and corporate clients across Lahore, Karachi, and Islamabad.',
};

export default function TestimonialsPage() {
  return (
    <div className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#52685a]">
          REAL STORIES & VERIFIED RATINGS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#14402a]">
          What Our Clients Say
        </h1>
        <p className="text-xs sm:text-sm text-[#4a5f52]">
          Over 1,000 satisfied plant lovers, estates, and corporate spaces across Pakistan.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialsData.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#d47343] bg-[#fdf3ec] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{t.city}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#2a3f33] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#f0f4ee] flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#14402a]">
                <Image src={t.photoUrl} alt={t.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-[#172b21]">{t.name}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[11px] text-[#52685a] truncate">{t.role}</p>
                <p className="text-[10px] text-[#d47343] font-medium truncate mt-0.5">
                  {t.serviceOrProduct}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
