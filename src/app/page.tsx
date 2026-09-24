import LeftBrandSidebar from '@/components/layout/LeftBrandSidebar';
import Hero from '@/components/home/Hero';
import OurMostRequestedServices from '@/components/home/OurMostRequestedServices';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PurposeSection from '@/components/home/PurposeSection';
import DesignCTASection from '@/components/home/DesignCTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TrustBar from '@/components/home/TrustBar';

export const metadata = {
  title: 'Green Decor — Beautiful Spaces Brighter Lives | Plants, Decor & Landscaping',
  description: 'Green Decor brings premium indoor plants, handcrafted planters, turnkey landscaping, and biophilic interior styling across Pakistan.',
};

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] mx-auto min-h-screen">
      
      {/* Left Brand Sidebar (Gardener Character, Script Headings, Category Links, Logo Lockup) */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <LeftBrandSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden bg-white">

        {/* Hero Section */}
        <Hero />

        {/* Our Most Requested Services (curved green band) */}
        <OurMostRequestedServices />

        {/* Featured Bestsellers Collection */}
        <FeaturedProducts />

        {/* Our Purpose ("Greener Spaces Happier Communities" + 4 Pillars + Quote) */}
        <PurposeSection />

        {/* Design Studio CTA (upload your space → get design ideas) */}
        <DesignCTASection />

        {/* Testimonials Carousel */}
        <TestimonialsSection />

        {/* Bottom Trust Bar ("1000+ Happy Customers" + "Let's Grow Together") */}
        <TrustBar />
      </main>

    </div>
  );
}
