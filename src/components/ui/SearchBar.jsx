'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_TAGS = ['New Arrivals', 'Best Sellers', 'Premium', 'Lifestyle'];

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      // Slight delay lets the animation start before focusing (prevents layout jump)
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
  }

  function handleSearch(e) {
    e?.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
      close();
    }
  }

  function handleTag(tag) {
    router.push(`/shop?q=${encodeURIComponent(tag)}`);
    close();
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-primary-900 dark:text-white hover:text-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={close}
            />

            {/* ── Mobile: slide up from bottom ── */}
            <motion.div
              key="sb-mobile"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-primary-900 rounded-t-2xl shadow-2xl"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-primary-200 dark:bg-white/20" />
              </div>

              <div className="px-4 pt-2 pb-3">
                {/* Input row */}
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-primary-50 dark:bg-white/5 border border-primary-200 dark:border-white/10 rounded-xl px-3 py-2">
                  <Search className="w-5 h-5 text-primary-400 shrink-0" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search products..."
                    // text-base = 16px — prevents iOS auto-zoom
                    className="flex-1 bg-transparent text-base text-primary-900 dark:text-white placeholder:text-primary-400 focus:outline-none min-w-0"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 text-primary-400 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </form>

                {/* Search button — large, full-width on mobile */}
                <button
                  onClick={handleSearch}
                  disabled={!query.trim()}
                  className="btn-primary w-full mt-3 gap-2 disabled:opacity-40"
                >
                  <Search className="w-4 h-4" />
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick tags */}
                {!query && (
                  <div className="mt-4 pb-2">
                    <p className="text-xs font-medium text-primary-400 uppercase tracking-widest mb-2">Quick Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTag(tag)}
                          className="text-sm px-3 py-2 rounded-full border border-primary-200 dark:border-white/10 text-primary-700 dark:text-primary-300 hover:border-accent hover:text-accent active:scale-95 transition-all min-h-[40px]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe area spacer for phones with home bar */}
                <div className="h-safe-area-inset-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
              </div>
            </motion.div>

            {/* ── Desktop: drop from top ── */}
            <motion.div
              key="sb-desktop"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block fixed top-0 left-0 right-0 z-[70] bg-white dark:bg-primary-900 shadow-2xl border-b border-primary-100 dark:border-white/10"
            >
              <form onSubmit={handleSearch} className="container-custom py-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-primary-400 shrink-0" />
                <input
                  ref={query ? undefined : inputRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products, categories, brands..."
                  className="flex-1 bg-transparent text-lg text-primary-900 dark:text-white placeholder:text-primary-400 focus:outline-none"
                  autoComplete="off"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="p-1 text-primary-400 hover:text-primary-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button type="submit" className="btn-primary px-5 min-h-0 h-10 shrink-0" disabled={!query.trim()}>
                  Search
                </button>
                <button type="button" onClick={close} className="p-2 text-primary-500 hover:text-primary-900 dark:hover:text-white" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </form>

              {!query && (
                <div className="container-custom pb-4 flex flex-wrap gap-2">
                  {QUICK_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTag(tag)}
                      className="text-sm px-3 py-1.5 rounded-full border border-primary-200 dark:border-white/10 text-primary-700 dark:text-primary-300 hover:border-accent hover:text-accent transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
