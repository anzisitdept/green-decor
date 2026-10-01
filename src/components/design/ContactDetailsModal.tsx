'use client';

import React from 'react';
import { ArrowRight, Phone, User, X } from 'lucide-react';

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  title?: string;
  description?: string;
}

export default function ContactDetailsModal({
  isOpen,
  onClose,
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  title = 'Your Contact Details',
  description = 'Enter your details to generate your AI design concept preview.',
}: ContactDetailsModalProps) {
  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#e2e8e0] relative space-y-4 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-full bg-[#faedcd] text-[#0d3b2e] flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-[#d47343]" />
          </div>
          <h3 className="font-serif font-extrabold text-xl text-[#0d3b2e]">{title}</h3>
          <p className="text-xs text-[#52685a]">{description}</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#172b21] mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g. Hamza Khan"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
              />
              <User className="w-4 h-4 text-[#8da597] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172b21] mb-1">Mobile Phone Number *</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="0300 1234567"
                className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
              />
              <Phone className="w-4 h-4 text-[#8da597] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0d3b2e] text-white text-xs font-bold hover:bg-[#145c43] transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Continue &amp; Proceed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}