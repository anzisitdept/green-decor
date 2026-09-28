'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  UploadCloud,
  Sparkles,
  RefreshCw,
  Check,
  ImagePlus,
  X,
  Wand2,
  Leaf,
  Lightbulb,
  ArrowRight,
  Camera,
} from 'lucide-react';
import { generateDesignSuggestions, DesignSuggestion } from '@/lib/designSuggestions';

interface EnhancedDesignSuggestion extends DesignSuggestion {
  userUploaded?: boolean;
  uploadedImagePreview?: string;
}

function ConceptCard({ suggestion, index }: { suggestion: EnhancedDesignSuggestion; index: number }) {
  const [activeView, setActiveView] = useState<'render' | 'userUploaded'>('render');
  const [currentImgUrl, setCurrentImgUrl] = useState<string>(
    suggestion.imageUrl || suggestion.fallbackImageUrl || ''
  );
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setHasError(false);
    if (activeView === 'userUploaded' && suggestion.uploadedImagePreview) {
      setCurrentImgUrl(suggestion.uploadedImagePreview);
    } else {
      setCurrentImgUrl(suggestion.imageUrl || suggestion.fallbackImageUrl || '');
    }
  }, [activeView, suggestion]);

  const handleImageError = () => {
    if (!hasError && suggestion.fallbackImageUrl && currentImgUrl !== suggestion.fallbackImageUrl) {
      setHasError(true);
      setCurrentImgUrl(suggestion.fallbackImageUrl);
    }
  };

  return (
    <article className="group rounded-3xl bg-white border border-[#e5ece3] overflow-hidden hover:border-[#0d3b2e]/40 hover:shadow-xl transition-all flex flex-col justify-between">
      <div>
        {/* User Uploaded or Concept Header Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#172b21]">
          {currentImgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImgUrl}
              alt={suggestion.theme}
              onLoad={() => setImgLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                imgLoaded ? 'opacity-100 scale-100' : 'opacity-75 scale-105'
              }`}
              loading="eager"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
            {suggestion.userUploaded && suggestion.uploadedImagePreview ? (
              <div className="inline-flex items-center p-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-extrabold shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveView('render')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                    activeView === 'render' ? 'bg-[#0d3b2e] text-white shadow-xs' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#8bc34a]" />
                  AI Vision
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('userUploaded')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                    activeView === 'userUploaded' ? 'bg-[#0d3b2e] text-white shadow-xs' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Camera className="w-3 h-3 text-[#8bc34a]" />
                  Your Space
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 border border-white/20 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#8bc34a]" />
                Concept {index + 1} &bull; AI Render
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 z-10">
            <p className="text-[10px] font-bold text-[#8bc34a] uppercase tracking-widest">
              {suggestion.userUploaded ? 'Custom Styling Vision' : 'Green Decor Vision'}
            </p>
            <h4 className="font-extrabold text-lg sm:text-xl text-white leading-tight drop-shadow-sm">
              {suggestion.theme}
            </h4>
          </div>
        </div>

        {/* Concept Details below image */}
        <div className="p-6">
          <p className="text-xs sm:text-sm text-[#52685a] leading-relaxed">{suggestion.tagline}</p>

          {/* Styling Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {suggestion.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#f2f7ef] border border-[#e5ece3] px-2.5 py-1 text-[10px] font-semibold text-[#2a3f33]"
              >
                <Check className="w-3 h-3 text-[#0d3b2e]" />
                {tag}
              </span>
            ))}
          </div>

          {/* Recommended Plants */}
          {suggestion.recommendedPlants && suggestion.recommendedPlants.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#f0f4ee]">
              <p className="text-[11px] font-bold text-[#172b21] flex items-center gap-1.5 mb-2">
                <Leaf className="w-3.5 h-3.5 text-[#0d3b2e]" /> Recommended Plants for Your Space
              </p>
              <ul className="text-xs text-[#52685a] space-y-1">
                {suggestion.recommendedPlants.map((plant) => (
                  <li key={plant} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8bc34a]" />
                    {plant}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Layout Tips */}
          {suggestion.layoutTips && suggestion.layoutTips.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#f0f4ee]">
              <p className="text-[11px] font-bold text-[#172b21] flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-[#e6a100]" /> Layout &amp; Placement Tips
              </p>
              <ul className="text-xs text-[#52685a] space-y-1.5 italic">
                {suggestion.layoutTips.map((tip, idx) => (
                  <li key={idx} className="leading-snug">
                    &bull; &ldquo;{tip}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-[#fbfcf9] border-t border-[#e5ece3]">
        <Link
          href={`/services?concept=${encodeURIComponent(suggestion.theme)}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d3b2e] text-white text-xs font-bold hover:bg-[#145c43] transition-colors shadow-xs"
        >
          Request Execution for Concept {index + 1}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

export default function DesignStudioForm() {
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ data: string; mimeType: string } | null>(null);
  const [imageName, setImageName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<EnhancedDesignSuggestion[]>([]);
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
    setIsGenerating(true);
    setSuggestions([]);

    const result = await generateDesignSuggestions({
      description,
      image: imageData ? { data: imageData.data, mimeType: imageData.mimeType, name: imageName } : null,
    });

    setIsGenerating(false);

    const finalSuggestions: EnhancedDesignSuggestion[] = result.map((sug) => ({
      ...sug,
      userUploaded: Boolean(imagePreview),
      uploadedImagePreview: imagePreview || undefined,
    }));

    setSuggestions(finalSuggestions);
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
              <Sparkles className="w-3.5 h-3.5 text-[#0d3b2e]" />
              Powered by <span className="font-semibold text-[#0d3b2e]">Green Decor AI Studio</span>
            </p>
            <button
              type="button"
              onClick={handleSubmit}
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
                  <Sparkles className="w-4 h-4" />
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

      {/* Rendered Results */}
      {!isGenerating && suggestions.length > 0 && (
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <h3 className="font-extrabold text-2xl sm:text-3xl text-[#172b21]">AI Design Concepts for Your Space</h3>
              <p className="text-xs sm:text-sm text-[#52685a] mt-1">
                {suggestions.length} custom visual concepts generated directly for your uploaded space.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d6e2d3] text-[#0d3b2e] text-xs font-bold hover:bg-[#f2f7ef] transition-colors bg-white shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-Analyze Space
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestions.map((suggestion, index) => (
              <ConceptCard key={suggestion.theme + index} suggestion={suggestion} index={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}