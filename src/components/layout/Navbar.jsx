'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
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
  const pathname = usePathname();

  // Close menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel">
        <div className="container-custom h-16 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 -ml-2 text-primary-900 dark:text-white"
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
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              Fyxen<span className="text-accent">.</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-accent' : 'hover:text-accent'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-4">
            <ThemeToggle />
            <SearchBar />
            <Link href="/account" className="hidden md:block p-2 text-primary-900 dark:text-white hover:text-accent transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 text-primary-900 dark:text-white hover:text-accent transition-colors relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop + Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Drawer */}
            <motion.nav
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white dark:bg-primary-900 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-primary-100 dark:border-white/10 shrink-0">
                <Link href="/" className="text-2xl font-bold tracking-tighter" onClick={() => setMobileMenuOpen(false)}>
                  Fyxen<span className="text-accent">.</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-primary-500 dark:text-primary-400" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <ul className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center w-full py-3 px-3 rounded-lg text-lg font-medium transition-colors ${
                          pathname === link.href
                            ? 'text-accent bg-accent/10'
                            : 'text-primary-900 dark:text-white hover:text-accent hover:bg-primary-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="my-6 border-t border-primary-100 dark:border-white/10" />

                <ul className="space-y-1">
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 w-full py-3 px-3 rounded-lg text-base font-medium text-primary-700 dark:text-primary-300 hover:text-accent hover:bg-primary-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      My Account
                    </Link>
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 w-full py-3 px-3 rounded-lg text-base font-medium text-primary-700 dark:text-primary-300 hover:text-accent hover:bg-primary-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      My Cart
                    </Link>
                  </motion.li>
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
