'use client';

import React from 'react';
import { Star, CheckCircle2, Loader2 } from 'lucide-react';
import { useApprovedReviews } from '@/lib/firestore/reviews';

export default function LiveReviews() {
  const { reviews, loading } = useApprovedReviews();

  return (
    <div>
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d]">
          APPROVED &amp; LIVE
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#38b000] mt-1">
          Latest Reviews
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-xs text-[#52685a] py-12">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#d6e2d3] p-10 text-center">
          <Star className="w-8 h-8 text-[#38b000] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#172b21]">No public reviews yet</p>
          <p className="text-xs text-[#52685a] mt-1">
            Be the first to share your Green Decor experience below.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-center text-amber-400 gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-center text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal mb-6">
                  {review.text}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs">
                <span className="font-bold text-neutral-900">{review.authorName}</span>
                <span className="flex items-center gap-1 font-semibold text-[#27964c] text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-[#27964c] text-white" />
                  <span>Verified Buyer</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}