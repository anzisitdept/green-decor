'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Check, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { useUIStore } from '@/lib/store/useUIStore';

export default function ContactPage() {
  const { showToast } = useUIStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to reach out regarding plants, decor, or landscaping services.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Your message has been received! Our support team will reply shortly.');
  };

  return (
    <div className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#52685a]">
          WE&rsquo;D LOVE TO HEAR FROM YOU
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#14402a]">
          Get in Touch with Green Decor
        </h1>
        <p className="text-xs sm:text-sm text-[#4a5f52]">
          Visit our nursery hub in Lahore or connect with our plant stylists & landscape architects online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Direct Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-[#14402a] text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              Contact Information
            </h3>
            <p className="text-xs text-[#b8d4c3] leading-relaxed">
              Have questions regarding our live plants, custom ceramic planters, or want to schedule a landscaping survey? Reach out anytime.
            </p>
          </div>

          <div className="space-y-6 text-xs text-[#d0e5d8]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1e583b] flex items-center justify-center shrink-0 text-emerald-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white text-sm">Nursery & Display Hub:</strong>
                <span>Main Bedian Road, Near DHA Phase 6, Lahore, Punjab, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1e583b] flex items-center justify-center shrink-0 text-emerald-300">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white text-sm">Phone Support:</strong>
                <span>+92 300 1234567 / (042) 3589-7000</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1e583b] flex items-center justify-center shrink-0 text-emerald-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white text-sm">Email Inquiries:</strong>
                <span>care@greendecor.pk / projects@greendecor.pk</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1e583b] flex items-center justify-center shrink-0 text-emerald-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white text-sm">Visiting Hours:</strong>
                <span>Monday – Sunday: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp CTA Button */}
          <div className="pt-4 border-t border-[#1c4d35]">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-[#14402a] text-xs sm:text-sm font-bold hover:bg-[#eaf0e7] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#14402a]" />
              <span>Instant Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#e5ece3] shadow-md space-y-6">
          <div className="pb-4 border-b border-[#f0f4ee]">
            <h3 className="text-xl font-serif font-bold text-[#14402a]">
              Send Us a Direct Message
            </h3>
            <p className="text-xs text-[#52685a] mt-1">
              We respond to all online inquiries within 4 business hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-emerald-900">
                Message Sent Successfully!
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you for reaching out to Green Decor. A member of our horticulture team will contact you at <strong>{email}</strong> or <strong>{phone}</strong> shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172b21] mb-1">Topic / Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs font-semibold text-[#14402a] bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Landscape Consultation">Landscape Survey Consultation</option>
                    <option value="Custom Corporate Gifting">Custom Corporate Gifting</option>
                    <option value="Planted Aquarium Setup">Planted Aquarium Setup</option>
                    <option value="Plant Health Doctor Support">Plant Health Doctor Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172b21] mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with your green space today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#14402a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#14402a] text-white text-xs sm:text-sm font-bold hover:bg-[#1b5539] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
