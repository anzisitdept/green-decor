'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useCallback } from 'react';
import { ArrowRight, UploadCloud, Sparkles, Check, Loader2, RotateCcw } from 'lucide-react';
import { generateDesignSuggestions, DesignSuggestion } from '@/lib/designSuggestions';

const previewChips = ['Tropical', 'Minimal', 'Resort'];

const IDLE_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80';

interface UploadedImage {
  url: string;
  name: string;
}

export default function DesignCTASection() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [suggestion, setSuggestion] = useState<DesignSuggestion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImage((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return { url, name: file.name };
    });
    setStatus('loading');
    setSuggestion(null);

    generateDesignSuggestions({ image: { name: file.name } }).then((ideas) => {
      setSuggestion(ideas[0] ?? null);
      setStatus('ready');
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleBrowse = () => fileInputRef.current?.click();

  const resetImage = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
    setSuggestion(null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="w-full bg-[#172b21] relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#38b000]/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full bg-[#d47343]/15 blur-3xl" aria-hidden />

      <div className="relative w-full grid md:grid-cols-2 gap-10 md:gap-8 px-6 sm:px-10 lg:px-16 py-4 sm:py-8 items-center">
        {/* Copy */}
        <div>
          <span className="font-script text-2xl sm:text-3xl text-[#38b000]">Design Studio</span>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight mt-3">
            Show us your space, get design ideas.
          </h2>

          <Link
            href="/design-studio"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#38b000] text-white text-sm font-bold hover:bg-[#2e9900] transition-colors"
          >
            Try the Design Studio
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-white/45 mt-3">Free · No signup needed · Works with your own photos</p>
        </div>

        {/* Interactive AI result visual */}
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="rounded-3xl border-2 border-dashed border-white/25 bg-white/[0.06] p-5 text-center"
          >
            <div className="mx-auto w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-[#38b000]" />
            </div>
            <p className="text-xs font-semibold text-white/85 mt-3">Drop a photo of your space</p>
            <p className="text-[11px] text-white/45 mt-1">balcony · garden · living room · land</p>
            <button
              type="button"
              onClick={handleBrowse}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#38b000] text-white text-[11px] font-bold hover:bg-[#2e9900] transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Browse Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Result card: white mock gets replaced by the uploaded image */}
          <div className="mt-3 relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
            {status === 'idle' && (
              <div className="absolute inset-0">
                <Image
                  src={IDLE_IMAGE}
                  alt="AI rendered idea example"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-4">
                  <span className="inline-flex items-center rounded-full bg-[#38b000] text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1">
                    AI Rendered Idea
                  </span>
                  <p className="font-serif font-bold text-white text-base sm:text-lg mt-1.5 leading-snug">Urban Jungle Balcony</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {previewChips.map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white"
                      >
                        <Check className="w-3 h-3 text-[#38b000]" />
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="absolute inset-0 bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center text-center p-4">
                <Loader2 className="w-8 h-8 text-[#38b000] animate-spin" />
                <p className="mt-3 text-xs font-semibold text-white">Rendering your AI idea…</p>
              </div>
            )}

            {status === 'ready' && image && suggestion && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                  src={image.url}
                  alt="AI rendered idea"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  style={{ filter: 'saturate(1.35) contrast(1.06) brightness(1.08)', transform: 'scale(1.08)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#38b000]/25 via-[#172b21]/10 to-transparent" />

                <button
                  type="button"
                  onClick={resetImage}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                  aria-label="Replace photo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent pt-8 pb-3 px-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#38b000] text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1">
                    <Sparkles className="w-3 h-3" />
                    AI Rendered Idea
                  </span>
                  <p className="font-serif font-bold text-white text-base sm:text-lg mt-1.5 leading-snug">{suggestion.theme}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {suggestion.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white"
                      >
                        <Check className="w-3 h-3 text-[#38b000]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}