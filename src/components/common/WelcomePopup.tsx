'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/lib/store/useUIStore';
import {
  claimWelcomeCoupon,
  describeDiscount,
  normalizeContact,
  SUBSCRIBED_KEY,
  DISMISSED_KEY,
} from '@/lib/welcomeCoupon';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; type: 'percent' | 'flat'; value: number } | null>(null);
  const { showToast } = useUIStore();

  useEffect(() => {
    // Check if user is already subscribed or dismissed popup
    const subscribed = localStorage.getItem(SUBSCRIBED_KEY);
    const dismissed = localStorage.getItem(DISMISSED_KEY);

    if (!subscribed && !dismissed) {
      // Trigger popup 2.5s after initial page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaimDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contact.trim()) {
      showToast('Please enter your contact number.', 'warning');
      return;
    }

    if (!normalizeContact(contact)) {
      setError('Please enter a valid Pakistani mobile number, e.g. 0300 1234567.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await claimWelcomeCoupon(contact, email, name);

      // Only suppress the popup once the coupon is actually stored.
      localStorage.setItem(SUBSCRIBED_KEY, result.code);
      setCoupon(result);
      setIsSubmitting(false);
      showToast(
        result.alreadyExisted
          ? `Welcome back! Your code ${result.code} is ready.`
          : `🎉 Your ${describeDiscount(result.type, result.value)} code is ${result.code}`,
        'success'
      );

      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err) {
      setIsSubmitting(false);
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      showToast(message, 'warning');
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay click to dismiss */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          onClick={handleDismiss}
        />

        {/* Modal Container matching reference design */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-[440px] bg-[#1e7e40] text-white rounded-3xl p-7 sm:p-9 shadow-2xl overflow-hidden z-10"
        >
          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {coupon ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto text-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">You&apos;re All Set! 🌱</h3>
              <p className="text-sm text-emerald-100">
                Use promo code{' '}
                <span className="font-bold text-white bg-black/30 px-2.5 py-1 rounded-md break-all">
                  {coupon.code}
                </span>{' '}
                at checkout for {describeDiscount(coupon.type, coupon.value)} on your first order!
              </p>
            </div>
          ) : (
            /* Subscription Form State */
            <div>
              {/* Top Glowing Leaf / Sprout Logo */}
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <Sprout className="w-16 h-16 text-emerald-300 drop-shadow-md" strokeWidth={1.8} />
                  <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full pointer-events-none" />
                </div>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-[28px] font-black text-white text-center tracking-tight leading-tight">
                Let&rsquo;s Make It Official 🌱
              </h2>

              {/* Subheadline */}
              <p className="text-xs sm:text-sm text-emerald-100 text-center font-normal mt-2 mb-6">
                We&rsquo;ll give you a welcome discount &mdash; You bring the sunshine.
              </p>

              {/* Form */}
              <form onSubmit={handleClaimDiscount} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 shadow-xs font-medium"
                />

                <input
                  type="tel"
                  placeholder="Contact number (+92 300 1234567)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 shadow-xs font-medium"
                />

                <input
                  type="email"
                  placeholder="Email address (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 shadow-xs font-medium"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-75"
                >
                  {isSubmitting ? 'Claiming...' : 'Claim discount'}
                </button>

                {error && (
                  <p
                    role="alert"
                    className="text-xs text-red-100 bg-red-900/40 border border-red-300/40 rounded-xl px-3 py-2.5 leading-snug"
                  >
                    {error}
                  </p>
                )}
              </form>

              {/* No thanks button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full mt-3 text-center text-xs sm:text-sm font-medium text-white/90 hover:text-white hover:underline cursor-pointer block"
              >
                No, thanks
              </button>

              {/* Fine Print Disclaimer */}
              <p className="mt-6 text-[11px] text-emerald-100/75 text-center leading-tight max-w-[280px] mx-auto">
                You are signing up to receive communication via contact number and email and can unsubscribe at any time.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
