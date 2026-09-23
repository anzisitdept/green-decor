'use client';

import React, { useState } from 'react';
import { Star, ShieldCheck, Check, Send } from 'lucide-react';
import { submitReview } from '@/lib/firestore/reviews';
import { useUIStore } from '@/lib/store/useUIStore';

export default function ReviewSubmissionForm() {
  const [reviewType, setReviewType] = useState<'private' | 'general'>('general');
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { showToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        authorName: authorName.trim(),
        rating,
        text: text.trim(),
        type: reviewType,
      });
      setSubmitted(true);
      showToast(
        reviewType === 'private'
          ? 'Your private feedback has been sent directly to our team.'
          : 'Thank you! Your review has been submitted for approval.',
        'info'
      );
      setAuthorName('');
      setText('');
      setRating(5);
    } catch {
      showToast('Could not submit right now. Please try again.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-xs p-6 sm:p-8">
      <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#38b000]">
        Share Your Experience
      </h2>
      <p className="text-xs sm:text-sm text-[#52685a] mt-2 mb-6">
        Leave a public review to help other plant lovers, or send private feedback straight to our team.
      </p>

      {submitted ? (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-start gap-2">
          <Check className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {reviewType === 'private'
              ? 'Your private feedback has been sent to our team. Thank you!'
              : 'Your review was submitted and will display once approved. Thank you!'}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReviewType('general')}
              className={`text-left p-3 rounded-2xl border-2 transition-all ${
                reviewType === 'general'
                  ? 'border-[#38b000] bg-[#f4f7f2]'
                  : 'border-[#edf3ec] bg-white hover:border-[#d6e2d3]'
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-[#172b21]">
                <Star className="w-3.5 h-3.5 text-[#38b000]" />
                <span>General Review</span>
              </span>
              <p className="text-[11px] text-[#52685a] mt-1 leading-snug">
                Publishes publicly after approval
              </p>
            </button>

            <button
              type="button"
              onClick={() => setReviewType('private')}
              className={`text-left p-3 rounded-2xl border-2 transition-all ${
                reviewType === 'private'
                  ? 'border-[#38b000] bg-[#f4f7f2]'
                  : 'border-[#edf3ec] bg-white hover:border-[#d6e2d3]'
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-[#172b21]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38b000]" />
                <span>Private Feedback</span>
              </span>
              <p className="text-[11px] text-[#52685a] mt-1 leading-snug">
                Sent only to our team, never shown publicly
              </p>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172b21] mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Malik"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172b21] mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#38b000] bg-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4/5 Stars)</option>
                <option value="3">⭐⭐⭐ (3/5 Stars)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172b21] mb-1">
              {reviewType === 'private' ? 'Your Feedback' : 'Review'}
            </label>
            <textarea
              required
              rows={4}
              placeholder={
                reviewType === 'private'
                  ? 'Tell us privately about your experience — our team reads every message...'
                  : 'Share your thoughts on our plants, services, and delivery experience...'
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-colors disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting
                ? 'Submitting...'
                : reviewType === 'private'
                  ? 'Send Private Feedback'
                  : 'Submit Review'}
            </button>
            {reviewType === 'general' && (
              <span className="text-[11px] text-[#52685a]">
                Reviewed by our team before publishing.
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}