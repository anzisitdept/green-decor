import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Alex_Brush } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/search/SearchModal';
import QuickViewModal from '@/components/product/QuickViewModal';
import ToastNotification from '@/components/common/ToastNotification';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const scriptFont = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Green Decor — Nature’s Touch for Modern Spaces',
  description: 'Pakistan’s premier botanical lifestyle & landscape architecture studio. Potted plants, ceramic planters, aquatic biotopes, and turnkey outdoor landscaping.',
  keywords: 'plants, planters, landscaping, aquariums, plant care, Lahore, Karachi, Islamabad, Pakistan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#172b21] selection:bg-[#14402a] selection:text-white">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        {/* <Footer /> */}

        {/* Global Modals, Drawers & Notifications */}
        <CartDrawer />
        <SearchModal />
        <QuickViewModal />
        <ToastNotification />
      </body>
    </html>
  );
}
