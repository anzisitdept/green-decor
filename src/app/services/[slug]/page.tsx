'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  MessageCircle, 
  Sparkles, 
  Calendar, 
  HelpCircle, 
  ChevronDown,
  Building,
  Home,
  Check
} from 'lucide-react';
import { useStoreServices, useSiteSettings } from '@/lib/firestore/store-data';
import { useUIStore } from '@/lib/store/useUIStore';
import { getWhatsAppLink } from '@/lib/utils';
import { submitServiceRequest } from '@/lib/firestore/writes';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const servicesData = useStoreServices();
  const settings = useSiteSettings();
  const service = servicesData.find((s) => s.slug === slug);
  const { showToast } = useUIStore();

  // Quote Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial' | 'Office' | 'Balcony / Terrace' | 'Other'>('Residential');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#38b000]">Service Not Found</h2>
        <Link href="/services" className="px-6 py-3 rounded-full bg-[#38b000] text-white text-xs font-bold mt-4 inline-block">
          Back to Services
        </Link>
      </div>
    );
  }

  const whatsappDirectHref = getWhatsAppLink(
    `Hello Green Decor! I would like to request a quote for "${service.title}" in ${city}. Details: ${message || 'Please share portfolio and consultation slots.'}`,
    settings.whatsappNumber
  );

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      await submitServiceRequest({
        serviceSlug: service.slug,
        serviceTitle: service.title,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city,
        propertyType,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'new',
      });
      showToast(`Quote request for ${service.title} sent! Our horticulturist will contact you within 2 hours.`);
    } catch {
      showToast('Could not send your request. Please reach us on WhatsApp.', 'warning');
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#52685a] mb-6">
        <Link href="/" className="hover:text-[#38b000]">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-[#38b000]">Services</Link>
        <span>/</span>
        <span className="text-[#38b000] font-semibold">{service.title}</span>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-black mb-12">
        <div className="relative aspect-[21/9] min-h-[340px] sm:min-h-[380px] w-full">
          <Image
            src={service.heroImage}
            alt={service.title}
            fill
            priority
            className="object-cover"
          />
          {/* Subtle bottom gradient overlay for legibility while keeping the full image vibrant & clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl text-white space-y-3">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#d47343] bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full self-start border border-white/20">
              {service.pricingRange}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-white drop-shadow-md">
              {service.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-100 max-w-2xl leading-relaxed drop-shadow-xs">
              {service.fullDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Details, Benefits, Process, Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Key Deliverables */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#38b000] pb-3 border-b border-[#f0f4ee]">
              What We Deliver
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#f8faf7] border border-[#edf3ec] text-xs text-[#2a3f33]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#38b000]">
              Why Choose Green Decor for {service.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {service.benefits.map((b, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-[#e5ece3] shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#38b000] font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#172b21]">{b.title}</h4>
                  <p className="text-xs text-[#52685a] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Process */}
          <div className="bg-[#eaf0e7] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52685a]">
                HOW IT WORKS
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#38b000] mt-1">
                Our Seamless Execution Process
              </h3>
            </div>

            <div className="space-y-4">
              {service.process.map((step) => (
                <div key={step.step} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#38b000] text-white flex items-center justify-center shrink-0 font-serif font-bold text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#172b21]">{step.title}</h4>
                    <p className="text-xs text-[#52685a] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Gallery */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#38b000]">
              Recent Works & Installations
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {service.gallery.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-xs border border-[#e5ece3]">
                  <Image src={img} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-md space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#38b000] pb-3 border-b border-[#f0f4ee]">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#edf3ec] rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#172b21] hover:bg-[#f8faf7]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#38b000] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-[#52685a] leading-relaxed bg-[#fbfcf9]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: "Request a Free Quote" Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ece3] shadow-xl space-y-6 sticky top-24">
          <div className="pb-4 border-b border-[#f0f4ee]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47343] bg-[#fdf3ec] px-2.5 py-1 rounded-full">
              FREE CONSULTATION & ESTIMATE
            </span>
            <h3 className="text-xl font-serif font-bold text-[#38b000] mt-2">
              Request a Quote for {service.title}
            </h3>
            <p className="text-xs text-[#52685a] mt-1">
              Tell us about your space. We provide itemized estimates and 3D mockups.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-emerald-900">
                Consultation Request Received!
              </h4>
              <p className="text-xs text-emerald-800">
                Our landscape specialist for {city} will contact you at <strong>{phone}</strong> shortly.
              </p>
              <a
                href={whatsappDirectHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Connect</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172b21] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Malik"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#38b000] bg-white"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172b21] mb-1">Property / Space Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#38b000] bg-white"
                >
                  <option value="Residential">Residential House / Lawn (1 to 4 Kanal)</option>
                  <option value="Balcony / Terrace">Rooftop Terrace / Balcony</option>
                  <option value="Office">Corporate Office / Commercial Hub</option>
                  <option value="Commercial">Cafe / Restaurant Courtyard</option>
                  <option value="Other">Custom Gifting / Event Setup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172b21] mb-1">Project Details & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need grass sodding, decorative planters, and drip irrigation for front lawn in DHA..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#38b000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#38b000] text-white text-xs sm:text-sm font-bold hover:bg-[#2e9900] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Submit Consultation Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#52685a]">Or speak directly:</span>
                <a
                  href={whatsappDirectHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat with Horticulturist on WhatsApp</span>
                </a>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
