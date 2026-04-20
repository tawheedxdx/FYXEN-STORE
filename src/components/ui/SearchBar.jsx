'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { setOpen(false); setQuery(''); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-primary-900 dark:text-white hover:text-accent transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => { setOpen(false); setQuery(''); }}
            />

            {/* Search Panel */}
            <motion.div
              key="search-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 z-[70] bg-white dark:bg-primary-900 shadow-2xl"
            >
              <form onSubmit={handleSearch} className="container-custom py-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-primary-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products, categories, brands..."
                  className="flex-1 bg-transparent text-lg text-primary-900 dark:text-white placeholder:text-primary-400 focus:outline-none"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="p-1 text-primary-400 hover:text-primary-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-sm min-h-0 h-10 shrink-0"
                  disabled={!query.trim()}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setQuery(''); }}
                  className="p-2 text-primary-500 hover:text-primary-900 dark:hover:text-white"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Quick suggestions */}
              {!query && (
                <div className="container-custom pb-4">
                  <p className="text-xs text-primary-400 uppercase tracking-widest mb-2">Quick Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Lifestyle', 'Premium', 'New Arrivals', 'Best Sellers'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          router.push(`/shop?q=${encodeURIComponent(tag)}`);
                          setOpen(false);
                          setQuery('');
                        }}
                        className="text-sm px-3 py-1.5 rounded-full border border-primary-200 dark:border-white/10 text-primary-700 dark:text-primary-300 hover:border-accent hover:text-accent transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
