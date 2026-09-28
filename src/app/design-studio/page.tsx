import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, UploadCloud, MessageSquareText, Wand2, Hammer, MessageCircle } from 'lucide-react';
import DesignStudioForm from '@/components/design/DesignStudioForm';
import { getWhatsAppLink } from '@/lib/utils';

/**
 * The studio is still being tested, so the page advertises the flow without
 * taking submissions. Flip this to `true` once testing is done to bring the
 * form back — nothing else needs to change.
 */
const DESIGN_STUDIO_LIVE = false;

export const metadata: Metadata = {
  title: 'Design Studio Get Design Ideas for Your Space | Green Decor',
  description:
    'Upload a photo of your area or land, or describe your idea, and get curated plant, palette and layout design ideas from our AI design studio.',
};

const steps = [
  {
    icon: <UploadCloud className="w-5 h-5 text-[#0d3b2e]" />,
    title: 'Upload your space',
    text: 'Add a photo of your balcony, garden, lawn, room or land.',
  },
  {
    icon: <MessageSquareText className="w-5 h-5 text-[#0d3b2e]" />,
    title: 'Describe your vision',
    text: 'Tell us what vibe you want — tropical, minimal, cozy or resort.',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-[#0d3b2e]" />,
    title: 'Get design ideas',
    text: 'Receive curated plants, color palettes and layout tips to style it.',
  },
];

export default function DesignStudioPage() {
  return (
    <div className="flex-1 min-w-0 bg-[#fbfcf9] relative">
      {/* Everything below is blurred and inert while the studio is in testing —
          the centred notice is the only thing a visitor can see or touch. */}
      <div
        className={DESIGN_STUDIO_LIVE ? '' : 'blur-md pointer-events-none select-none'}
        aria-hidden={DESIGN_STUDIO_LIVE ? undefined : true}
      >
        {/* Hero */}
        <section className="bg-[#172b21] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
          <svg className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaves" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 10 Q55 25 40 40 Q25 25 40 10zM40 40 Q55 55 40 70 Q25 55 40 40z" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaves)" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5" /> Green Decor Design Studio
          </span>
          <h1 className="font-extrabold text-3xl sm:text-5xl text-white leading-tight mt-5">
            Show us your space,
            <br />
            <span className="text-[#8bc34a]">we&apos;ll design the rest.</span>
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
              <h3 className="font-bold text-base text-[#172b21] mt-4">{step.title}</h3>
              <p className="text-xs text-[#52685a] leading-relaxed mt-1.5">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upload / Describe / Results */}
      {DESIGN_STUDIO_LIVE ? <DesignStudioForm /> : null}
      </div>

      {DESIGN_STUDIO_LIVE ? null : (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#e5ece3] bg-white/95 px-7 py-8 text-center shadow-2xl backdrop-blur-sm sm:px-10 sm:py-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f2f7ef] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0d3b2e]">
              <Sparkles className="w-3.5 h-3.5" /> Coming soon
            </span>
            <h1 className="mt-5 font-extrabold text-2xl text-[#172b21] sm:text-3xl">
              Something new is growing here
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#52685a]">
              The Design Studio is still in testing, so the upload and design tool is not taking
              requests yet. It will be live as soon as testing is completed.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#b85b2e]">
              <Hammer className="h-3.5 w-3.5" />
              Under testing
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={getWhatsAppLink(
                  'Hello Green Decor! I am waiting for the Design Studio. Can you help me with ideas in the meantime?'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0d3b2e] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#145c43]"
              >
                <MessageCircle className="w-4 h-4" />
                Get ideas on WhatsApp
              </a>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6e2d3] px-5 py-3 text-xs font-bold text-[#0d3b2e] transition-colors hover:bg-[#f2f7ef]"
              >
                Browse our gallery
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}