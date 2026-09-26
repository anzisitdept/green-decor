import Image from 'next/image';
import { Sparkles, Check } from 'lucide-react';

const PREVIEW_CHIPS = ['Tropical', 'Minimal', 'Resort'];

const PREVIEW_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80';

export default function AIResultPreviewCard() {
  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
      <Image
        src={PREVIEW_IMAGE}
        alt="AI rendered idea example"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#38b000] text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1">
          <Sparkles className="w-3 h-3" />
          AI Rendered Idea
        </span>
        <p className="font-serif font-bold text-white text-base sm:text-lg mt-1.5 leading-snug">
          Urban Jungle Balcony
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {PREVIEW_CHIPS.map((chip) => (
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
  );
}
