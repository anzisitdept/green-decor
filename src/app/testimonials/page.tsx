import React from 'react';
import { CheckCircle2, PenLine } from 'lucide-react';
import ReviewSubmissionForm from '@/components/reviews/ReviewSubmissionForm';
import LiveReviews from '@/components/reviews/LiveReviews';
import FeaturedTestimonials from '@/components/reviews/FeaturedTestimonials';

export const metadata = {
  title: 'Verified Customer Reviews — Green Decor Pakistan',
  description: 'Read genuine verified buyer reviews from plant lovers, homeowners, and businesses across Pakistan.',
};

export default function TestimonialsPage() {
  return (
    <div className="bg-[#f8f7f2] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d]">
            VERIFIED REVIEWS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#38b000] tracking-tight">
            What Our Customers Say
          </h1>
          <p className="text-xs sm:text-sm text-[#52685a]">
            Genuine feedback from plant lovers across Pakistan.
          </p>
        </div>

        {/* Reviews Grid */}
        <div>
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#556b5d]">
              CUSTOMER STORIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#38b000] mt-1">
              Featured Testimonials
            </h2>
          </div>
          <FeaturedTestimonials />
        </div>

        {/* Live Approved Reviews */}
        <LiveReviews />

        {/* Submit a Review / Private Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <ReviewSubmissionForm />
          </div>
          <div className="lg:col-span-4 rounded-3xl bg-[#0d3b2e] text-white p-6 sm:p-8 lg:sticky lg:top-24">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8d9b5]">
              <PenLine className="w-3.5 h-3.5" />
              WE LISTEN
            </span>
            <h3 className="font-serif font-bold text-2xl mt-3 text-white">
              Your Words Shape Our Garden
            </h3>
            <p className="text-xs text-[#cfe0d6] leading-relaxed mt-3">
              Public reviews go live after a quick team review. Private feedback goes straight
              to our team &mdash; it&rsquo;s never shown publicly, ever.
            </p>
            <ul className="mt-6 space-y-3 text-xs text-[#cfe0d6]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8bc34a] shrink-0 mt-0.5" />
                Help other plant lovers choose with confidence
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8bc34a] shrink-0 mt-0.5" />
                Private feedback is read by our team every week
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8bc34a] shrink-0 mt-0.5" />
                No account needed &mdash; just your name and a few words
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
