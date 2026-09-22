import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sprout, ShieldCheck, Heart, Users, ArrowRight, Award } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata = {
  title: 'About Us — Green Decor Pakistan | Our Story & Nursery Legacy',
  description: 'Learn about Green Decor Pakistan, our climate-acclimatized plant nurseries, and biophilic architectural vision.',
};

export default function AboutPage() {
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to learn more about your company and nursery facilities.'
  );

  return (
    <div className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#52685a]">
          NURTURING NATURE SINCE 2019
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#14402a] leading-tight">
          Bringing Pakistan&rsquo;s Spaces to Life Naturally
        </h1>
        <p className="text-xs sm:text-sm text-[#4a5f52] leading-relaxed">
          Green Decor was founded with a singular conviction: that living amidst lush greenery, oxygen-rich foliage, and thoughtfully styled botanical architecture transforms our everyday happiness and well-being.
        </p>
      </div>

      {/* Story & Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-[#eaf0e7] border-4 border-white">
          <Image
            src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80"
            alt="Green Decor Nursery in Lahore"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-[#384c3f] leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#14402a]">
            Rooted in Local Expertise & Craftsmanship
          </h2>
          <p>
            From our multi-acre nursery facility on Bedian Road, Lahore, we cultivate over 150 species of tropical foliage, exotic succulents, and ornamental landscape trees adapted to withstand local weather shifts.
          </p>
          <p>
            We partner directly with traditional potters in Gujrat and Multan to produce handmade porous terracotta planters that celebrate Pakistan’s artisan clay heritage while optimizing root health.
          </p>
          <div className="pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14402a] text-white text-xs font-bold hover:bg-[#1b5539] transition-all shadow-md"
            >
              <span>Speak with Our Founders on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5ece3] shadow-lg">
        <h3 className="text-2xl font-serif font-bold text-[#14402a] text-center mb-10">
          Our Four Pillars of Quality
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#14402a] mx-auto">
              <Sprout className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#172b21]">100% Acclimatized Plants</h4>
            <p className="text-xs text-[#52685a]">Zero greenhouse shock; rooted for real home and outdoor climates.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#14402a] mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#172b21]">Transit Crate Guarantee</h4>
            <p className="text-xs text-[#52685a]">Specialized wooden crates guarantee healthy, break-free arrival nationwide.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#14402a] mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#172b21]">Architectural Quality</h4>
            <p className="text-xs text-[#52685a]">Bespoke planters and landscape layouts designed by certified horticulturists.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#14402a] mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#172b21]">Ongoing Care Support</h4>
            <p className="text-xs text-[#52685a]">Complimentary WhatsApp leaf health diagnostics for every plant parent.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
