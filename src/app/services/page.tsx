import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Trees, Home, Fish, Sparkles, Gift, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import { servicesData } from '@/lib/data/services';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata = {
  title: 'Our Services — Green Decor | Learn, Heal, Transform & Grow',
  description: 'Explore turnkey green services across Pakistan: green styling, landscaping, plant health, gardener visits, makeovers, custom pots, gifting, aqua corners and care plans.',
};

export default function ServicesOverviewPage() {
  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to inquire about your turnkey landscaping and interior plant styling services.'
  );

  return (
    <div className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#52685a]">
          TURNKEY BOTANICAL & LANDSCAPE SOLUTIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#14402a] leading-tight">
          Solutions Crafted for Every Space
        </h1>
        <p className="text-xs sm:text-sm text-[#4a5f52] leading-relaxed">
          From lush private garden transformations to low-maintenance biophilic corporate offices and planted aquascapes across Pakistan.
        </p>
      </div>

      {/* Services Grid (6 Core Categories) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#e5ece3] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f4f7f2]">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#14402a]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {service.pricingRange}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#14402a] group-hover:text-[#d47343] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#52685a] mt-1.5 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-3 border-t border-[#f0f4ee]">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#2a3f33]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 sm:p-7 pt-0">
              <Link
                href={`/services/${service.slug}`}
                className="w-full py-3 px-4 rounded-xl bg-[#eaf0e7] group-hover:bg-[#14402a] text-[#14402a] group-hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>View Details & Request Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* Consultation Banner */}
      <div className="bg-[#14402a] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#d47343]">
            BESPOKE SITE VISIT & CONSULTATION
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold">
            Need an on-site landscape assessment?
          </h3>
          <p className="text-xs sm:text-sm text-[#b8d4c3] leading-relaxed">
            Our principal horticulturists visit residential estates, rooftop terraces, and office complexes in Lahore, Islamabad, and Karachi.
          </p>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-full bg-white text-[#14402a] text-xs sm:text-sm font-bold hover:bg-[#eaf0e7] transition-all shadow-lg active:scale-95 shrink-0 flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Book Free Site Assessment</span>
        </a>
      </div>

    </div>
  );
}
