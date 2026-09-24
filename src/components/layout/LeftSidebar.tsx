'use client';

import React, { useState } from 'react';
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
  Wand2,
  Sparkles,
  Gift,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  ArrowRight,
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
import { useSiteSettings } from '@/lib/firestore/store-data';
import { useRouter } from 'next/navigation';

export default function LeftSidebar() {
  const router = useRouter();
  const settings = useSiteSettings();
  const cartCount = useCartStore((state) => state.getItemsCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const { user, isAuthenticated } = useAuthStore();
  const { isLeftMenuOpen, closeLeftMenu, openCart } = useUIStore();

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  const categories = [
    { label: 'Plants & Planters', href: '/shop?category=plants', icon: <Leaf className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Home Decor', href: '/shop?category=home-decor', icon: <Home className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Plant Care Products', href: '/shop?category=plant-care', icon: <Sparkles className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Landscaping', href: '/services/landscaping', icon: <Trees className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Aqua Green', href: '/services/aqua-green', icon: <Fish className="w-4 h-4 text-[#38b000]" /> },
    { label: 'Green Gifts', href: '/services/green-gifts', icon: <Gift className="w-4 h-4 text-[#38b000]" /> },
  ];

  const quickLinks = [
    { label: 'Get Design Ideas', href: '/design-studio', icon: <Wand2 className="w-4 h-4 text-[#38b000]" /> },
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
    'Hello Green Decor! I would like to inquire about your plants, home decor, and landscaping services.',
    settings.whatsappNumber
  );

  if (!isLeftMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        onClick={closeLeftMenu}
        aria-label="Close menu"
        className="absolute top-4 z-[60] left-[calc(min(320px,100%)+14px)] w-9 h-9 rounded-full bg-white text-gray-600 hover:text-[#38b000] shadow-md flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white p-6 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-200">
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
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between mb-2"
          >
            <span className="text-xs font-bold text-[#52685a] uppercase tracking-wider">Menu</span>
            <ChevronDown
              className={`w-4 h-4 text-[#52685a] transition-transform duration-200 ${
                isMenuOpen ? 'rotate-180 text-[#38b000]' : ''
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="flex flex-col gap-0.5">
              {/* Services dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm transition-colors ${
                    isServicesOpen
                      ? 'text-[#38b000] font-semibold bg-[#f4f7f2]'
                      : 'text-[#2a3f33] hover:bg-[#f4f7f2] hover:text-[#38b000]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 text-[#38b000]" />
                  <span className="flex-1 text-left">Services</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#52685a] transition-transform duration-200 ${
                      isServicesOpen ? 'rotate-180 text-[#38b000]' : ''
                    }`}
                  />
                </button>

                {isServicesOpen && (
                  <div className="flex flex-col gap-0.5 mt-0.5 ml-3 pl-4 border-l-2 border-[#e5ece3]">
                    {coreServices.map((svc) => (
                      <Link
                        key={svc.label}
                        href={svc.href}
                        onClick={closeLeftMenu}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm text-[#52685a] hover:bg-[#f4f7f2] hover:text-[#38b000] transition-colors"
                      >
                        <Leaf className="w-3.5 h-3.5 text-[#38b000]" />
                        <span>{svc.label}</span>
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      onClick={closeLeftMenu}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-sm font-semibold text-[#38b000] hover:bg-[#f4f7f2] transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>View All Services</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Flat menu links */}
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
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#f0f4ee]">
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between mb-2"
          >
            <span className="text-xs font-bold text-[#52685a] uppercase tracking-wider">Shop by Category</span>
            <ChevronDown
              className={`w-4 h-4 text-[#52685a] transition-transform duration-200 ${
                isCategoriesOpen ? 'rotate-180 text-[#38b000]' : ''
              }`}
            />
          </button>

          {isCategoriesOpen && (
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
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#f0f4ee]">
          <button
            type="button"
            onClick={() => setIsQuickOpen(!isQuickOpen)}
            className="w-full flex items-center justify-between mb-2"
          >
            <span className="text-xs font-bold text-[#52685a] uppercase tracking-wider">Quick Links</span>
            <ChevronDown
              className={`w-4 h-4 text-[#52685a] transition-transform duration-200 ${
                isQuickOpen ? 'rotate-180 text-[#38b000]' : ''
              }`}
            />
          </button>

          {isQuickOpen && (
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
          )}
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