'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { useSiteSettings, useSiteContent, useStoreServices } from '@/lib/firestore/store-data';

const FOOTER_WAVE =
  'M1440,20 C1260,62 1060,66 880,36 C680,4 480,8 300,22 C160,32 80,26 0,18 L0,0 L1440,0 Z';

const DEFAULT_ABOUT =
  'Pakistan’s premier green living studio. We craft bespoke residential landscapes, turnkey office greenery, planted aquariums, and deliver acclimatized houseplants nationwide with a 30-day health guarantee.';

const socials = [
  {
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    href: '#',
  },
  {
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    href: 'https://www.instagram.com/greendecorpk',
  },
  {
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2.5 4.5 5 5" />
      </svg>
    ),
    href: '#',
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const settings = useSiteSettings();
  const { content } = useSiteContent();
  const storeServices = useStoreServices();
  const services = storeServices.slice(0, 4).map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  }));
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like some assistance regarding your products and landscaping services.',
    settings.whatsappNumber
  );
  const aboutText = content?.footer?.about || DEFAULT_ABOUT;
  const hoursText = settings.workingHours || 'Monday – Sunday : 09:00 AM : 08:00 PM';
  const emailText = settings.contactEmail || 'info@greendecor.com';
  const phoneText = settings.contactPhone || '+92 333 8951222';
  const phoneHref = `tel:${phoneText.replace(/[^0-9+]/g, '')}`;
  const creditsText = content?.footer?.credits;

  return (
    <>
      {!isHome && (
        <footer className="relative bg-[#0d3b2e] text-white overflow-hidden select-none">
          {/* Top S-Wave — opposite curve direction */}
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="block -mt-px w-full h-6 sm:h-9 lg:h-12"
          >
            <rect width="1440" height="80" fill="#0d3b2e" />
            <path d={FOOTER_WAVE} fill="#fff" />
          </svg>

          <div className="relative px-6 sm:px-8 lg:px-16 pt-6 sm:pt-10 pb-10">
            {/* Faint grass/leaf texture bottom-left */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <Leaf className="absolute -left-6 top-1/3 w-36 h-36 text-[#e8d9b5]/[0.18] -rotate-12" strokeWidth={1.2} />
              <Leaf className="absolute -left-2 bottom-0 w-44 h-44 text-[#e8d9b5]/[0.25] rotate-45" strokeWidth={1.2} />
              <Leaf className="absolute left-1/4 -bottom-4 w-28 h-28 text-[#e8d9b5]/[0.18] rotate-90" strokeWidth={1.2} />
            </div>

            {/* Main 4-column grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand / About */}
              <div className="order-1 space-y-4">
                <Link href="/" className="inline-flex items-end gap-1 group">
                  <Leaf className="w-5 h-5 text-[#e8d9b5] mb-1" strokeWidth={1.8} />
                  <span className="font-serif font-bold text-2xl text-[#e8d9b5] tracking-wide leading-none">
                    GREEN DECOR
                  </span>
                </Link>
                <p className="text-xs text-[#cfe0d6] leading-relaxed">
                  {aboutText}
                </p>
                <div>
                  <p className="text-xs font-bold text-white mb-3">Connect with us :</p>
                  <div className="flex items-center gap-2.5">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-9 h-9 rounded-full border border-[#e8d9b5]/40 bg-white/5 text-[#f2e8d3] flex items-center justify-center hover:bg-[#e8d9b5] hover:text-[#0d3b2e] transition-colors"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Combined Working Hours & Our Services (2-column layout on mobile) */}
              <div className="order-2 col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-5 sm:gap-10">
                {/* Working Hours */}
                <div>
                  <h5 className="text-[#e8d9b5] font-bold text-xs sm:text-sm mb-4 sm:mb-5 uppercase tracking-[0.15em] sm:tracking-[0.18em]">
                    Working Hours
                  </h5>
                  <div className="space-y-1">
                    <span className="block text-xs sm:text-sm font-bold text-emerald-400">{hoursText}</span>
                  </div>
                  <div className="my-3 sm:my-4 border-t border-dotted border-white/30" />
                  <div className="space-y-1">
                    <span className="block text-[11px] sm:text-xs font-bold text-white">Email:</span>
                    <a href={`mailto:${emailText}`} className="block text-[11px] sm:text-xs font-bold text-white hover:text-emerald-200 transition-colors break-words">
                      {emailText}
                    </a>
                  </div>
                  <div className="my-3 sm:my-4 border-t border-dotted border-white/30" />
                  <div className="space-y-1">
                    <span className="block text-[11px] sm:text-xs font-bold text-white">Call at :</span>
                    <a href={phoneHref} className="block text-xs sm:text-sm font-bold text-white leading-snug hover:text-emerald-200 transition-colors">
                      {phoneText}
                    </a>
                  </div>
                </div>

                {/* Our Services */}
                <div>
                  <h5 className="text-[#e8d9b5] font-bold text-xs sm:text-sm mb-4 sm:mb-5 uppercase tracking-[0.15em] sm:tracking-[0.18em]">
                    Our Services
                  </h5>
                  <ul className="space-y-3 sm:space-y-3.5">
                    {services.map((service) => (
                      <li key={service.label}>
                        <Link href={service.href} className="flex items-start gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span className="text-xs text-white leading-relaxed group-hover:text-emerald-200 transition-colors">
                            {service.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Subscribe Newsletter */}
              <div className="order-4">
                <h5 className="text-[#e8d9b5] font-bold text-sm mb-5 uppercase tracking-[0.18em]">
                  Subscribe Newsletter
                </h5>
                <p className="text-xs text-white leading-relaxed mb-4">
                  Get seasonal plant care tips, new arrivals and exclusive offers in your inbox.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Email Address.."
                    className="w-full px-4 py-2.5 rounded-full bg-white/95 text-[#52685a] text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors cursor-pointer"
                  >
                    Subscribe Now
                  </button>
                </form>

                {/* Watermark below Subscribe Button */}
                <div className="mt-4 text-xs font-medium text-center sm:text-left text-[#cfe0d6]">
                  {creditsText ? (
                    <span>{creditsText}</span>
                  ) : (
                    <>
                      <span>Design By </span>
                      <a
                        href="https://www.anziandco.com?refer=greendecor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#e8d9b5] hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Anzi &amp; Co.
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 mt-12 pt-6 border-t border-dotted border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <p className="text-[#c8d8cf] text-center sm:text-left">
                &copy; {new Date().getFullYear()} greendecor.com. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white">
                <Link href="#" className="hover:text-emerald-200 hover:underline transition-colors">Terms &amp; Condition</Link>
                <span className="text-white/40">|</span>
                <Link href="#" className="hover:text-emerald-200 hover:underline transition-colors">Privacy Policy</Link>
                <span className="text-white/40">|</span>
                <Link href="/contact" className="hover:text-emerald-200 hover:underline transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating WhatsApp Button — persists on all pages */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Green Decor on WhatsApp"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785c-1.772 0-3.43-.524-4.83-1.511l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}