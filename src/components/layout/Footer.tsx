'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin, MessageCircle, Heart, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export default function Footer() {
  const whatsappHref = getWhatsAppLink('Hello Green Decor! I would like some assistance regarding your products and landscaping services.');

  const cities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Sialkot', 'Gujranwala', 'Hyderabad'
  ];

  return (
    <footer className="bg-[#0f2e1f] text-[#d1dfd6] pt-16 pb-8 border-t border-[#1c4d35]">
      {/* Top Value Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#1b4832]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#18452f] flex items-center justify-center shrink-0 text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Safe Crated Plant Delivery</h4>
              <p className="text-xs text-[#9bb3a4] mt-1">Specialized transit crates ensure your lush potted foliage arrives undamaged and fresh.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#18452f] flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">30-Day Plant Guarantee</h4>
              <p className="text-xs text-[#9bb3a4] mt-1">Free horticultural care consultation and plant health warranty with every purchase.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#18452f] flex items-center justify-center shrink-0 text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">WhatsApp Plant Doctors</h4>
              <p className="text-xs text-[#9bb3a4] mt-1">Send photos of your leaves anytime to our resident horticulturists for free diagnosis.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-[#1b4a33] flex items-center justify-center text-emerald-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-tight font-bold text-xl text-white">
                  GREEN DECOR
                </span>
                <span className="text-[11px] font-medium text-[#e0895c] tracking-wide">
                  Bringing Nature to Every Space.
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-[#a2baa9] leading-relaxed max-w-sm">
              Pakistan’s premier green living studio. We craft bespoke residential landscapes, turnkey office greenery, planted aquariums, and deliver acclimatized houseplants nationwide.
            </p>

            <div className="pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2 text-xs text-[#a2baa9]">
              <li><Link href="/shop" className="hover:text-emerald-400 transition-colors">Shop Catalog</Link></li>
              <li><Link href="/services" className="hover:text-emerald-400 transition-colors">All Services</Link></li>
              <li><Link href="/gallery" className="hover:text-emerald-400 transition-colors">Project Portfolio</Link></li>
              <li><Link href="/testimonials" className="hover:text-emerald-400 transition-colors">Client Reviews</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Our Nursery</Link></li>
              <li><Link href="/orders" className="hover:text-emerald-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Our Services</h5>
            <ul className="space-y-2 text-xs text-[#a2baa9]">
              <li><Link href="/services/green-your-space" className="hover:text-emerald-400 transition-colors">Green Your Space</Link></li>
              <li><Link href="/services/landscaping" className="hover:text-emerald-400 transition-colors">Landscaping</Link></li>
              <li><Link href="/services/your-green-doctor" className="hover:text-emerald-400 transition-colors">Your Green Doctor</Link></li>
              <li><Link href="/services/book-a-gardener" className="hover:text-emerald-400 transition-colors">Book a Gardener</Link></li>
              <li><Link href="/services/green-makeover" className="hover:text-emerald-400 transition-colors">Green Makeover</Link></li>
              <li><Link href="/services/green-gifts" className="hover:text-emerald-400 transition-colors">Green Gifts</Link></li>
              <li><Link href="/services/green-care" className="hover:text-emerald-400 transition-colors">Green Care Plan</Link></li>
            </ul>
          </div>

          {/* Contact & Pakistan Cities */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact & Locations</h5>
            <div className="space-y-2.5 text-xs text-[#a2baa9]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Green Decor Nursery & Design Hub, Main Bedian Road, DHA Phase 6, Lahore</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+92 300 1234567 / (042) 3589-7000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>care@greendecor.pk</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1b4832]">
              <p className="text-[11px] font-semibold text-white mb-2">Nationwide Delivery To:</p>
              <div className="flex flex-wrap gap-1">
                {cities.slice(0, 6).map((city) => (
                  <span key={city} className="text-[10px] bg-[#163e2a] px-2 py-0.5 rounded text-[#a5c3af]">
                    {city}
                  </span>
                ))}
                <span className="text-[10px] bg-[#163e2a] px-2 py-0.5 rounded text-[#a5c3af]">+ More</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 border-t border-[#19432d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8da796]">
          <div>
            © {new Date().getFullYear()} Green Decor Pakistan (Pvt.) Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="text-[11px] text-[#718b7a]">Payment Methods:</span>
            <span className="bg-[#18452f] px-2 py-0.5 rounded text-white text-[10px] font-medium">Cash on Delivery</span>
            <span className="bg-[#18452f] px-2 py-0.5 rounded text-white text-[10px] font-medium">JazzCash</span>
            <span className="bg-[#18452f] px-2 py-0.5 rounded text-white text-[10px] font-medium">Easypaisa</span>
            <span className="bg-[#18452f] px-2 py-0.5 rounded text-white text-[10px] font-medium">Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
