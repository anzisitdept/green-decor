'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  RefreshCw,
  Check,
  ImagePlus,
  X,
  Wand2,
} from 'lucide-react';
import { generateDesignSuggestions, DesignSuggestion } from '@/lib/designSuggestions';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import ContactDetailsModal from '@/components/design/ContactDetailsModal';

interface EnhancedDesignSuggestion extends DesignSuggestion {
  userUploaded?: boolean;
  uploadedImagePreview?: string;
}

function ConceptImage({ suggestion }: { suggestion: EnhancedDesignSuggestion }) {
  const [currentImgUrl, setCurrentImgUrl] = useState(suggestion.imageUrl || suggestion.fallbackImageUrl || '');
  const [imgLoaded, setImgLoaded] = useState(false);
  const fallbackApplied = useRef(false);

  const handleImageError = () => {
    if (!fallbackApplied.current && suggestion.fallbackImageUrl && currentImgUrl !== suggestion.fallbackImageUrl) {
      fallbackApplied.current = true;
      setCurrentImgUrl(suggestion.fallbackImageUrl);
    }
  };

  if (!currentImgUrl) return null;

  return (
    <figure className="relative w-full h-[60vh] min-h-[320px] sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-[#172b21]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentImgUrl}
        alt={suggestion.theme}
        onLoad={() => setImgLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
      />
      <div className="absolute inset-0 bg-[#f2f7ef] animate-pulse pointer-events-none" style={{ opacity: imgLoaded ? 0 : 1 }} />
    </figure>
  );
}

const MAX_GENERATIONS = 3;
const GENERATIONS_KEY = 'ai_generations_left';

function readGenerationsLeft(): number {
  if (typeof window === 'undefined') return MAX_GENERATIONS;
  const saved = window.sessionStorage.getItem(GENERATIONS_KEY);
  const parsed = saved !== null ? parseInt(saved, 10) : MAX_GENERATIONS;
  return Number.isNaN(parsed) ? MAX_GENERATIONS : parsed;
}

export default function DesignStudioForm() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ data: string; mimeType: string } | null>(null);
  const [imageName, setImageName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<EnhancedDesignSuggestion | null>(null);
  const [generationsLeft, setGenerationsLeft] = useState(readGenerationsLeft);
  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasInput = description.trim().length > 0 || imageName.length > 0;

  const handleFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    setImageName(file.name);
    const url = URL.createObjectURL(file);
    setImagePreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageData({
          data: reader.result,
          mimeType: file.type,
        });
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const resetImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageData(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!hasInput || isGenerating) return;
    if (generationsLeft <= 0) {
      showToast('You have used all your design concept generations for this session.', 'info');
      return;
    }

    setIsGenerating(true);
    setSuggestion(null);

    const result = await generateDesignSuggestions({
      description,
      name: userName,
      phone: userPhone,
      image: imageData ? { data: imageData.data, mimeType: imageData.mimeType, name: imageName } : null,
    });

    setIsGenerating(false);

    const single = result[0];
    if (!single) return;

    setSuggestion({
      ...single,
      userUploaded: Boolean(imagePreview),
      uploadedImagePreview: imagePreview || undefined,
    });

    const nextCount = generationsLeft - 1;
    setGenerationsLeft(nextCount);
    window.sessionStorage.setItem(GENERATIONS_KEY, nextCount.toString());
  };

  const handleRequestClick = () => {
    if (!userName.trim() || !userPhone.trim()) {
      setIsContactModalOpen(true);
      return;
    }
    handleSubmit();
  };

  const handleContactSubmit = () => {
    if (!userName.trim() || !userPhone.trim()) {
      showToast('Please enter both your name and phone number.', 'warning');
      return;
    }
    setIsContactModalOpen(false);
    handleSubmit();
  };

  return (
    <section id="studio-form" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload your area / land image */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`rounded-3xl border-2 border-dashed p-5 sm:p-6 flex flex-col items-center justify-center text-center min-h-[280px] transition-colors ${
            imagePreview
              ? 'border-[#0d3b2e]/40 bg-white'
              : 'border-[#d6e2d3] bg-[#f8faf7] hover:border-[#0d3b2e]/60 hover:bg-[#f2f7ef]'
          }`}
        >
          {imagePreview ? (
            <div className="w-full">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#f0f4ee]">
                <Image src={imagePreview} alt="Your space preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={resetImage}
                  aria-label="Remove image"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#52685a] mt-3 flex items-center justify-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#0d3b2e]" /> {imageName}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs font-semibold text-[#0d3b2e] hover:text-[#145c43] underline underline-offset-4"
              >
                Replace image
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#0d3b2e] mb-4">
                <ImagePlus className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-[#172b21]">Upload a photo of your area or land</p>
              <p className="text-xs text-[#52685a] mt-1.5 max-w-[260px]">
                Drag &amp; drop, or browse from your device. JPG or PNG works best.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d3b2e] text-white text-xs font-bold hover:bg-[#145c43] transition-colors shadow-xs"
              >
                <UploadCloud className="w-4 h-4" />
                Browse Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </>
          )}
        </div>

        {/* Describe your idea */}
        <div className="rounded-3xl bg-white border border-[#e5ece3] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-2">Describe your vision</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I have a sunny balcony in Lahore and I want a tropical relaxing corner with low-maintenance plants and cozy wooden seating…"
              rows={5}
              className="w-full flex-1 resize-none rounded-2xl border border-[#d6e2d3] bg-[#fbfcf9] p-4 text-sm text-[#172b21] placeholder:text-[#9fb3a5] focus:outline-none focus:ring-2 focus:ring-[#0d3b2e]/40 focus:border-[#0d3b2e]"
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[11px] text-[#52685a] flex items-center gap-1.5">
              Powered by <span className="font-semibold text-[#0d3b2e]">Green Decor AI Studio</span>
            </p>
            <button
              type="button"
              onClick={handleRequestClick}
              disabled={!hasInput || isGenerating}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#172b21] text-white text-xs font-bold hover:bg-[#0d2b1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin" />
                  Generating Renders...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Get Render Concepts
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generating state loader */}
      {isGenerating && (
        <div className="mt-12 rounded-3xl bg-white border border-[#e5ece3] p-10 text-center shadow-sm">
          <Wand2 className="w-10 h-10 text-[#0d3b2e] animate-pulse mx-auto" />
          <p className="mt-4 text-base font-bold text-[#172b21]">Analyzing your photo &amp; crafting custom concepts…</p>
          <p className="text-xs text-[#52685a] mt-1.5 max-w-md mx-auto leading-relaxed">
            Our AI engine is processing your uploaded space photo to recommend tailored plant placements, pot styles, and design layouts.
          </p>
        </div>
      )}

      {/* Rendered Results — one concept per generation */}
      {!isGenerating && suggestion && (
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <h3 className="font-extrabold text-2xl sm:text-3xl text-[#172b21]">Your AI Design Concept</h3>
              <p className="text-xs sm:text-sm text-[#52685a] mt-1">
                One custom visual concept generated for your space.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold ${
                  generationsLeft > 0
                    ? 'bg-[#f2f7ef] text-[#0d3b2e] border border-[#e5ece3]'
                    : 'bg-[#fdf1ec] text-[#b85b2e] border border-[#f0d9cd]'
                }`}
              >
                {generationsLeft > 0
                  ? `${generationsLeft} usage${generationsLeft === 1 ? '' : 's'} remaining`
                  : 'No usages remaining'}
              </span>
              <button
                type="button"
                onClick={handleRequestClick}
                disabled={generationsLeft <= 0}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d6e2d3] text-[#0d3b2e] text-xs font-bold hover:bg-[#f2f7ef] transition-colors bg-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Generate Another
              </button>
            </div>
          </div>

          <ConceptImage key={suggestion.imageUrl || suggestion.theme} suggestion={suggestion} />
        </div>
      )}

      <ContactDetailsModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        name={userName}
        phone={userPhone}
        onNameChange={setUserName}
        onPhoneChange={setUserPhone}
        onSubmit={handleContactSubmit}
        title="Your Contact Details"
        description="Enter your details to generate your AI design render concepts."
      />
    </section>
  );
}