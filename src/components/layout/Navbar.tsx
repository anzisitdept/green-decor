'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { getWhatsAppLink } from '@/lib/utils';
import { useSiteSettings } from '@/lib/firestore/store-data';
import MegaMenu from './MegaMenu';
import LeftSidebar from './LeftSidebar';

export default function Navbar() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = useCartStore((state) => state.getItemsCount());
  const { openSearch, openLeftMenu } = useUIStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
    'Hello Green Decor! I would like to inquire about your plants, home decor, and landscaping services.',
    settings.whatsappNumber
  );

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e5ece3] py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Left Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={openLeftMenu}
                aria-label="Open menu"
                className="relative p-2 rounded-full border border-[#d6e2d3] text-[#38b000] hover:bg-[#eaf0e7] hover:border-[#38b000] transition-colors"
              >
                <Menu className="w-5 h-5" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d47343] border-2 border-white text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Logo Lockup (centered on mobile, left-aligned next to menu on desktop) */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 group lg:static lg:left-auto lg:translate-x-0 lg:justify-start"
            >
              <div className="flex flex-col min-w-0 text-center lg:text-left">
                <span className="font-serif tracking-tight font-extrabold text-xl sm:text-2xl text-[#38b000] leading-none truncate">
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
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          pathname.startsWith('/services')
                            ? 'text-[#38b000] font-semibold bg-[#eaf0e7]'
                            : 'text-[#2a3f33] hover:text-[#38b000] hover:bg-[#f0f5ee]'
                        }`}
                      >
                        {link.icon}
                        {link.name}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isMegaMenuOpen ? 'rotate-180 text-[#38b000]' : ''
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#38b000] font-semibold bg-[#eaf0e7]'
                        : 'text-[#2a3f33] hover:text-[#38b000] hover:bg-[#f0f5ee]'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Modal Trigger */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search products and services"
                className="p-2 rounded-full text-[#38b000] hover:bg-[#eaf0e7] transition-colors relative"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1QKGrBCGVP/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hidden sm:inline-flex p-2 rounded-full text-[#38b000] hover:bg-[#eaf0e7] transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
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
                className="hidden sm:inline-flex p-2 rounded-full text-[#38b000] hover:bg-[#eaf0e7] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
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
