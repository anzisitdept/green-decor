'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  Package,
  LayoutGrid,
  Leaf,
  Home,
  Trees,
  Fish,
  Sparkles,
  Gift,
  MessageCircle,
  ChevronRight,
  Info,
  Images,
  Quote,
  Phone,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { getWhatsAppLink } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function LeftSidebar() {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.getItemsCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const { user, isAuthenticated } = useAuthStore();
  const { isLeftMenuOpen, closeLeftMenu, openCart } = useUIStore();

  const categories = [
    { label: 'Plants & Planters', href: '/shop?category=plants', icon: <Leaf className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Home Decor', href: '/shop?category=home-decor', icon: <Home className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Plant Care Products', href: '/shop?category=plant-care', icon: <Sparkles className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Landscaping', href: '/services/landscaping', icon: <Trees className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Aqua Green', href: '/services/aqua-green', icon: <Fish className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Green Gifts', href: '/services/green-gifts', icon: <Gift className="w-4 h-4 text-[#38b000]" /> },
  ];

  const quickLinks = [
    { label: 'Track My Orders', href: '/orders', icon: <Package className="w-4 h-4 text-[#38b000]" /> },
    { label: 'My Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4 text-[#38b000]" /> },
    { label: 'My Account', href: '/account', icon: <User className="w-4 h-4 text-[#38b000]" /> },
  ];

  const menuLinks = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4 text-[#38b000]" /> },
    { label: 'About Us', href: '/about', icon: <Info className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Gallery', href: '/gallery', icon: <Images className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Testimonials', href: '/testimonials', icon: <Quote className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4 text-[#38b000]" /> },
  ];

  const coreServices = [
    { label: 'Green Your Space', href: '/services/green-your-space' },
    { label: 'Your Green Doctor', href: '/services/your-green-doctor' },
    { label: 'Book a Gardener', href: '/services/book-a-gardener' },
    { label: 'Green Gifts', href: '/services/green-gifts' },
  ];

  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to inquire about your plants, home decor, and landscaping services.'
  );

  if (!isLeftMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white p-6 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ee]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center text-[#38b000]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
            <span className="font-serif font-bold text-lg text-[#38b000]">GREEN DECOR</span>
          </div>
          <button
            type="button"
            onClick={closeLeftMenu}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAuthenticated && user ? (
          <Link
            href="/account"
            onClick={closeLeftMenu}
            className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-[#f4f7f2] border border-[#e5ece3] hover:bg-[#eaf0e7] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#38b000] text-white text-sm font-bold flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#38b000]">{user.name}</p>
              <p className="text-xs text-[#52685a]">My Account</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#52685a]" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              closeLeftMenu();
              router.push('/login');
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#38b000] text-white text-sm font-semibold hover:bg-[#2e9900] transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            closeLeftMenu();
            openCart();
          }}
          className="mt-3 w-full flex items-center justify-between p-3 rounded-2xl bg-[#f4f7f2] border border-[#e5ece3] hover:bg-[#eaf0e7] transition-colors"
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#172b21]">
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#38b000]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d47343] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span>View Your Cart</span>
          </div>
          <span className="text-xs text-[#52685a]">
            {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Empty'}
          </span>
        </button>

        <div className="mt-6 pt-4 border-t border-[#f0f4ee]">
          <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-2">Menu</p>
          <div className="flex flex-col gap-0.5">
            <Link
              href="/services"
              onClick={closeLeftMenu}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm text-[#2a3f33] hover:bg-[#f4f7f2] hover:text-[#38b000] transition-colors"
            >
              <LayoutGrid className="w-4 h-4 text-[#38b000]" />
              <span>Services</span>
            </Link>
            {menuLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeLeftMenu}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm text-[#2a3f33] hover:bg-[#f4f7f2] hover:text-[#38b000] transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#f0f4ee]">
          <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-2">Our Core Services</p>
          <div className="flex flex-col gap-0.5">
            {coreServices.map((svc) => (
              <Link
                key={svc.label}
                href={svc.href}
                onClick={closeLeftMenu}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm text-[#2a3f33] hover:bg-[#f4f7f2] hover:text-[#38b000] transition-colors"
              >
                <Leaf className="w-4 h-4 text-[#38b000]" />
                <span>{svc.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#f0f4ee]">
          <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-2">Shop by Category</p>
          <div className="flex flex-col gap-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={closeLeftMenu}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm text-[#2a3f33] hover:bg-[#f4f7f2] hover:text-[#38b000] transition-colors"
              >
                {cat.icon}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#f0f4ee]">
          <p className="text-xs font-bold text-[#52685a] uppercase tracking-wider mb-2">Quick Links</p>
          <div className="flex flex-col gap-0.5">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeLeftMenu}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm text-[#2a3f33] hover:bg-[#f4f7f2] hover:text-[#38b000] transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#f0f4ee]">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#38b000] text-white text-sm font-semibold shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="mt-auto pt-6">
          <p className="text-[11px] text-[#52685a] text-center">
            {wishlistCount > 0 ? `${wishlistCount} saved plant${wishlistCount > 1 ? 's' : ''} in your wishlist` : 'Bringing Nature to Every Space.'}
          </p>
        </div>
      </div>
    </div>
  );
}