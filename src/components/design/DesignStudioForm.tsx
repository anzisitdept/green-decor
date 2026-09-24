'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Sparkles,
  RefreshCw,
  Check,
  ImagePlus,
  X,
  Wand2,
} from 'lucide-react';
import { generateDesignSuggestions, DesignSuggestion } from '@/lib/designSuggestions';

export default function DesignStudioForm() {
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>([]);
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
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const resetImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!hasInput || isGenerating) return;
    setIsGenerating(true);
    setSuggestions([]);
    const result = await generateDesignSuggestions({
      description,
      image: imageName ? { name: imageName } : undefined,
    });
    setIsGenerating(false);
    setSuggestions(result);
  };

  return (
    <section id="studio-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload your area / land image */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`rounded-3xl border-2 border-dashed p-5 sm:p-6 flex flex-col items-center justify-center text-center min-h-[280px] transition-colors ${
            imagePreview
              ? 'border-[#38b000]/40 bg-white'
              : 'border-[#d6e2d3] bg-[#f8faf7] hover:border-[#38b000]/60 hover:bg-[#f2f7ef]'
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
              <p className="text-xs text-[#52685a] mt-3 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#38b000]" /> {imageName}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs font-semibold text-[#38b000] hover:text-[#2e9900] underline underline-offset-4"
              >
                Replace image
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-[#eaf0e7] flex items-center justify-center text-[#38b000] mb-4">
                <ImagePlus className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-[#172b21]">Upload a photo of your area or land</p>
              <p className="text-xs text-[#52685a] mt-1.5 max-w-[240px]">
                Drag &amp; drop, or browse from your device. JPEG / PNG works best.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#38b000] text-white text-xs font-bold hover:bg-[#2e9900] transition-colors"
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
        <div className="rounded-3xl bg-white border border-[#e5ece3] p-5 sm:p-6 flex flex-col">
          <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-2">Describe your idea</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I have a sunny balcony in Lahore and I want a tropical relaxing corner with a seating area…"
            rows={5}
            className="w-full flex-1 resize-none rounded-2xl border border-[#d6e2d3] bg-[#fbfcf9] p-4 text-sm text-[#172b21] placeholder:text-[#9fb3a5] focus:outline-none focus:ring-2 focus:ring-[#38b000]/40 focus:border-[#38b000]"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[11px] text-[#9fb3a5]">
              Powered by <span className="font-semibold text-[#52685a]">AI design studio</span> — demo mode, real
              suggestions coming soon.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasInput || isGenerating}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#172b21] text-white text-xs font-bold hover:bg-[#0d2b1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin" />
                  Designing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#38b000]" />
                  Get Design Ideas
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isGenerating && (
        <div className="mt-10 rounded-3xl bg-white border border-[#e5ece3] p-8 text-center">
          <Wand2 className="w-8 h-8 text-[#38b000] animate-pulse mx-auto" />
          <p className="mt-3 text-sm font-semibold text-[#172b21]">Sketching design ideas for your space…</p>
          <p className="text-xs text-[#52685a] mt-1">Matching plants, palettes and layouts. This takes a few seconds.</p>
        </div>
      )}

      {!isGenerating && suggestions.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#172b21]">Your Design Ideas</h3>
              <p className="text-xs text-[#52685a] mt-1">
                {suggestions.length} concept{suggestions.length > 1 ? 's' : ''} rendered for your space.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d6e2d3] text-[#38b000] text-xs font-bold hover:bg-[#f2f7ef] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Generate More
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {suggestions.map((suggestion, index) => (
              <article
                key={suggestion.theme}
                className="group rounded-3xl bg-white border border-[#e5ece3] overflow-hidden hover:card-shadow-hover transition-shadow"
              >
                <div className="p-5">
                  <span className="inline-flex items-center gap-1.5 bg-[#eaf0e7] text-[#38b000] text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3">
                    <Sparkles className="w-3 h-3" />
                    Concept {index + 1} · AI Idea
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#172b21]">{suggestion.theme}</h4>
                  <p className="text-xs text-[#52685a] leading-relaxed mt-1.5">{suggestion.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {suggestion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-[#f2f7ef] border border-[#e5ece3] px-2.5 py-1 text-[10px] font-semibold text-[#2a3f33]"
                      >
                        <Check className="w-3 h-3 text-[#38b000]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}