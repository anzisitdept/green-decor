import type { Metadata } from 'next';
import { Sparkles, UploadCloud, MessageSquareText, Wand2 } from 'lucide-react';
import DesignStudioForm from '@/components/design/DesignStudioForm';

export const metadata: Metadata = {
  title: 'Design Studio Get Design Ideas for Your Space | Green Decor',
  description:
    'Upload a photo of your area or land, or describe your idea, and get curated plant, palette and layout design ideas from our AI design studio.',
};

const steps = [
  {
    icon: <UploadCloud className="w-5 h-5 text-[#38b000]" />,
    title: 'Upload your space',
    text: 'Add a photo of your balcony, garden, lawn, room or land.',
  },
  {
    icon: <MessageSquareText className="w-5 h-5 text-[#38b000]" />,
    title: 'Describe your vision',
    text: 'Tell us what vibe you want — tropical, minimal, cozy or resort.',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-[#38b000]" />,
    title: 'Get design ideas',
    text: 'Receive curated plants, color palettes and layout tips to style it.',
  },
];

export default function DesignStudioPage() {
  return (
    <div className="flex-1 min-w-0 bg-[#fbfcf9]">
      {/* Hero */}
      <section className="bg-[#172b21] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
          <svg className="w-full h-full text-[#38b000]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaves" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 10 Q55 25 40 40 Q25 25 40 10zM40 40 Q55 55 40 70 Q25 55 40 40z" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaves)" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#38b000] text-[11px] font-bold uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5" /> Green Decor Design Studio
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight mt-5">
            Show us your space,
            <br />
            <span className="text-[#38b000]">we&apos;ll design the rest.</span>
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto mt-5 leading-relaxed">
            Upload a photo of your area or land or describe your idea and let our AI design studio suggest the
            plants, colors and layouts that will bring your space to life.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 -mt-0">
        <div className="grid sm:grid-cols-3 gap-4 relative z-10 sm:-mt-8">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-white rounded-2xl border border-[#e5ece3] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-[#f2f7ef] flex items-center justify-center">{step.icon}</span>
                <span className="text-[11px] font-extrabold text-[#d6e2d3]">STEP {index + 1}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#172b21] mt-4">{step.title}</h3>
              <p className="text-xs text-[#52685a] leading-relaxed mt-1.5">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upload / Describe / Results */}
      <DesignStudioForm />
    </div>
  );
}