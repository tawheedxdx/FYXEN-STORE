'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchBar from '@/components/ui/SearchBar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop All' },
  { href: '/category/new-arrivals', label: 'New Arrivals' },
  { href: '/category/best-sellers', label: 'Best Sellers' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHomePage && !scrolled && !mobileMenuOpen;

  return (
    <>
      <header
        className={`sticky z-50 w-full transition-all duration-500 ${
          isTransparent
            ? 'glass-panel-transparent'
            : 'glass-panel'
        }`}
        style={{ top: 'var(--banner-height, 0px)' }}
      >
        <div className="container-custom h-18 md:h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className={`p-2 -ml-2 transition-colors ${isTransparent ? 'text-white' : 'text-primary-900 dark:text-white'}`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Fyxen Logo"
                className={`h-12 md:h-14 w-auto object-contain transition-all duration-500 ${isTransparent ? 'brightness-0 invert' : ''}`}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors group ${
                  isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : pathname === link.href
                      ? 'text-primary-900 dark:text-white bg-primary-50 dark:bg-white/10'
                      : 'text-primary-600 dark:text-primary-300 hover:text-primary-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
                {pathname === link.href && !isTransparent && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-0.5 md:gap-1">
            <div className={isTransparent ? '[&_button]:text-white [&_svg]:text-white' : ''}>
              <ThemeToggle />
            </div>
            <div className={isTransparent ? '[&_button]:text-white' : ''}>
              <SearchBar />
            </div>
            <Link
              href="/account"
              className={`hidden md:flex p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-white/5'
              }`}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className={`relative p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-white/5'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-black" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.nav
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
              className="fixed top-0 left-0 z-50 h-full w-[80%] max-w-[320px] bg-white dark:bg-primary-950 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-primary-100 dark:border-white/10 shrink-0">
                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/logo.png" alt="Fyxen Logo" className="h-10 w-auto object-contain" />
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-white/5 transition-colors" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center w-full py-3 px-4 rounded-xl text-base font-semibold transition-colors ${
                        pathname === link.href
                          ? 'text-accent bg-accent/10'
                          : 'text-primary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="my-4 border-t border-primary-100 dark:border-white/10" />

                {[
                  { href: '/account', icon: User, label: 'My Account' },
                  { href: '/cart', icon: ShoppingBag, label: 'My Cart' },
                ].map(({ href, icon: Icon, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
