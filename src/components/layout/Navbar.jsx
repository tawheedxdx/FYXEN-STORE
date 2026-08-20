'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Wallet, Search, Sparkles, Home, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchBar from '@/components/ui/SearchBar';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop All' },
  { href: '/category/best-sellers', label: 'Best Sellers', badge: 'Popular' },
  { href: '/category/new-arrivals', label: 'New Arrivals', badge: 'New' },
  { href: '/category/sale', label: 'Special Offers', badge: 'Sale' },
  { href: '/about', label: 'About Us' },
];

export default function Navbar({ cartCount: initialCartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openCart, cartCount: contextCartCount } = useCart();
  
  const displayCartCount = contextCartCount !== undefined ? contextCartCount : initialCartCount;

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP & MOBILE TOP NAVBAR ── */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-sm py-2.5 md:py-3.5'
            : 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3.5 md:py-5'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Left: Mobile Hamburger & Desktop Logo */}
          <div className="flex items-center gap-4">
            {/* Hamburger on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 -ml-2 text-neutral-900 dark:text-white md:hidden rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="FYXEN"
                className="h-9 sm:h-10 md:h-12 w-auto object-contain dark:brightness-0 dark:invert transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-neutral-100/60 dark:bg-neutral-900/60 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-neutral-950 dark:text-white bg-white dark:bg-neutral-800 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                      link.badge === 'Sale'
                        ? 'bg-rose-500 text-white'
                        : link.badge === 'New'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#c6a87c] text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Theme, Account, Cart Drawer) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <SearchBar />
            <ThemeToggle />

            {/* Account Link */}
            <Link
              href="/account"
              className="hidden sm:flex p-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="My Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Trigger (Opens SlideCart Drawer) */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 font-bold text-xs"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden md:inline-block">Bag</span>
              {displayCartCount > 0 && (
                <span className="min-w-[20px] h-[20px] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-black flex items-center justify-center rounded-full px-1 shadow-sm animate-pulse">
                  {displayCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 z-[90] h-full w-[85%] max-w-[340px] bg-white dark:bg-[#0c0c0e] shadow-2xl flex flex-col border-r border-neutral-200/80 dark:border-neutral-800"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-neutral-800/80">
                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/logo.png" alt="FYXEN" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-3 mb-2">Departments</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-sm font-bold transition-colors ${
                      pathname === link.href
                        ? 'text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#c6a87c] text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <div className="my-4 border-t border-neutral-100 dark:border-neutral-800/80" />

                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-3 mb-2">My Account</p>
                {[
                  { href: '/account', icon: User, label: 'Profile & Orders' },
                  { href: '/account/wallet', icon: Wallet, label: 'Store Wallet' },
                  { href: '/track-order', icon: Sparkles, label: 'Track Order Status' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-neutral-400" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Bag {displayCartCount > 0 && `(${displayCartCount})`}
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM BAR (Thumb Zone App Navigation) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            pathname === '/' ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 text-xs'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            pathname.startsWith('/shop') ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 text-xs'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Shop</span>
        </Link>

        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-neutral-500 dark:text-neutral-400 text-xs transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] bg-[#c6a87c] text-white text-[9px] font-black flex items-center justify-center rounded-full px-0.5">
                {displayCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Bag</span>
        </button>

        <Link
          href="/account"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            pathname.startsWith('/account') ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 text-xs'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </>
  );
}
