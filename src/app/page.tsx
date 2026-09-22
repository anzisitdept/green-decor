import LeftBrandSidebar from '@/components/layout/LeftBrandSidebar';
import Hero from '@/components/home/Hero';
import PromoCarousel from '@/components/home/PromoCarousel';
import ServicesGrid from '@/components/home/ServicesGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PurposeSection from '@/components/home/PurposeSection';
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
        
        {/* Mobile View of Brand Character Banner */}
        <div className="block lg:hidden w-full border-b border-[#e5ece3]">
          <LeftBrandSidebar />
        </div>

        {/* Hero Section */}
        <Hero />

        {/* Solutions for Every Space (6-Cards Services Grid) */}
        <ServicesGrid />

        {/* Featured Bestsellers Collection */}
        <FeaturedProducts />

        {/* Promo Carousel (plant.pk pattern offers) */}
        <PromoCarousel />

        {/* Our Purpose ("Greener Spaces Happier Communities" + 4 Pillars + Quote) */}
        <PurposeSection />

        {/* Testimonials Carousel */}
        <TestimonialsSection />

        {/* Bottom Trust Bar ("1000+ Happy Customers" + "Let's Grow Together") */}
        <TrustBar />
      </main>

    </div>
  );
}
