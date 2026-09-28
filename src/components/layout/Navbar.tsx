'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Home,
  Info,
  Leaf,
  Images,
  Quote,
  Phone,
  ChevronDown,
  Menu,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { getWhatsAppLink } from '@/lib/utils';
import MegaMenu from './MegaMenu';
import LeftSidebar from './LeftSidebar';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  const cartCount = useCartStore((state) => state.getItemsCount());
  const { openSearch, openCart, openLeftMenu } = useUIStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      setIsScrolled(currentY > 20);

      // Hide the navbar on any scroll down, bring it back on scroll up (or at the top)
      setIsNavHidden(currentY > 40 && currentY > lastY);

      lastScrollYRef.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'About Us', href: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'Services', href: '/services', isMega: true, icon: <Leaf className="w-4 h-4" /> },
    { name: 'Gallery', href: '/gallery', icon: <Images className="w-4 h-4" /> },
    { name: 'Testimonials', href: '/testimonials', icon: <Quote className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const whatsappHref = getWhatsAppLink(
    'Hello Green Decor! I would like to inquire about your plants, home decor, and landscaping services.'
  );

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent ${isNavHidden ? '-translate-y-full' : 'translate-y-0'
          } ${isScrolled
            ? 'bg-white/85 border-b border-white/60 shadow-[0_10px_30px_-14px_rgba(13,59,46,0.35)] py-2.5 sm:py-2'
            : 'bg-white/30 border-b border-white/20 shadow-[0_8px_24px_-18px_rgba(13,59,46,0.25)] py-3 lg:py-2.5'
          }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 min-h-[56px] sm:min-h-[64px] lg:min-h-0">

            {/* Left Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={openLeftMenu}
                aria-label="Open menu"
                className="relative p-2.5 rounded-full border border-[#d6e2d3] text-[#0d3b2e] hover:bg-[#eaf0e7] hover:border-[#0d3b2e] transition-colors bg-white/40"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo Lockup (centered on mobile, left-aligned next to menu on desktop) */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 group lg:static lg:left-auto lg:translate-x-0 lg:justify-start"
            >
              {/* Mobile: brand logo image */}
              <Image
                src="/logo.png"
                alt="Green Decor"
                width={77}
                height={98}
                priority
                sizes="77px"
                className="h-20 sm:h-24 w-auto object-contain lg:hidden drop-shadow-xs"
              />

              <div className="hidden lg:flex flex-col min-w-0 text-left">
                <span className="font-serif tracking-tight font-extrabold text-xl sm:text-2xl text-[#0d3b2e] leading-none truncate">
                  GREEN DECOR
                </span>
                <span className="block text-[11px] font-medium text-[#d47343] tracking-wide mt-0.5 truncate max-w-[220px]">
                  Bringing Nature to Every Space.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.isMega) {
                  return (
                    <div
                      key={link.name}
                      ref={megaMenuRef}
                      className="relative"
                      onMouseEnter={() => setIsMegaMenuOpen(true)}
                      onMouseLeave={() => setIsMegaMenuOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname.startsWith('/services')
                          ? 'text-[#0d3b2e] font-semibold bg-[#eaf0e7]'
                          : 'text-[#2a3f33] hover:text-[#0d3b2e] hover:bg-[#f0f5ee]'
                          }`}
                      >
                        {link.icon}
                        {link.name}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#0d3b2e]' : ''
                            }`}
                        />
                      </button>
                      {isMegaMenuOpen && (
                        <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive
                      ? 'text-[#0d3b2e] font-semibold bg-[#eaf0e7]'
                      : 'text-[#2a3f33] hover:text-[#0d3b2e] hover:bg-[#f0f5ee]'
                      }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search Modal Trigger */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search products and services"
                className="p-2.5 rounded-full text-[#0d3b2e] hover:bg-[#eaf0e7] transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                aria-label="Open cart"
                className="relative p-2.5 rounded-full text-[#0d3b2e] hover:bg-[#eaf0e7] transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d47343] border-2 border-white text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1QKGrBCGVP/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hidden sm:inline-flex p-2.5 rounded-full text-[#0d3b2e] hover:bg-[#eaf0e7] transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H9v3h2.3v7h2.2z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hidden sm:inline-flex p-2.5 rounded-full text-[#0d3b2e] hover:bg-[#eaf0e7] transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Left Menu Sidebar */}
      <LeftSidebar />
    </>
  );
}
