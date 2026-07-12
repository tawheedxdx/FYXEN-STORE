'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_TAGS = ['New Arrivals', 'Best Sellers', 'Premium', 'Lifestyle'];

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [aiProducts, setAiProducts] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Fetch AI recommendations when opened
  useEffect(() => {
    if (!open) return;

    async function fetchRecommendations() {
      setLoadingRecs(true);
      try {
        const recentlyViewedRaw = localStorage.getItem('recentlyViewed');
        let recentlyViewed = [];
        if (recentlyViewedRaw) {
          try {
            recentlyViewed = JSON.parse(recentlyViewedRaw);
          } catch (e) {
            // Ignore parse errors
          }
        }

        let url = `/api/recommendations?type=personalized&limit=4`;
        if (recentlyViewed.length > 0) {
          url += `&recentlyViewed=${encodeURIComponent(JSON.stringify(recentlyViewed))}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setAiProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch search bar recommendations:', err);
      } finally {
        setLoadingRecs(false);
      }
    }

    fetchRecommendations();
  }, [open]);

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

            {/* ── Mobile: slide down from top ── */}
            <motion.div
              key="sb-mobile"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-primary-900 rounded-b-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="px-4 pt-4 pb-6">
                {/* Header for mobile search */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Search Products</h2>
                  <button onClick={close} className="p-2 -mr-2 text-primary-500 hover:text-accent transition-colors" aria-label="Close search">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Input row */}
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-primary-50 dark:bg-white/5 border border-primary-200 dark:border-white/10 rounded-xl px-3 py-3">
                  <Search className="w-5 h-5 text-primary-400 shrink-0" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="What are you looking for?"
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
                  className="btn-primary w-full mt-4 gap-2 disabled:opacity-40"
                >
                  <Search className="w-4 h-4" />
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick tags & AI Recommendations */}
                {!query && (
                  <>
                    <div className="mt-6">
                      <p className="text-xs font-medium text-primary-400 uppercase tracking-widest mb-3">Popular Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTag(tag)}
                            className="text-sm px-4 py-2 rounded-full border border-primary-200 dark:border-white/10 text-primary-700 dark:text-primary-300 hover:border-accent hover:text-accent active:scale-95 transition-all min-h-[44px]"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-primary-100 dark:border-white/5 pt-5">
                      <p className="text-xs font-medium text-primary-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        Suggested for You <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-semibold normal-case">AI</span>
                      </p>
                      
                      {loadingRecs ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                              <div className="w-12 h-16 bg-primary-100 dark:bg-white/5 rounded-lg shrink-0" />
                              <div className="flex-1 py-1 space-y-2">
                                <div className="h-3 bg-primary-100 dark:bg-white/5 rounded w-1/4" />
                                <div className="h-4 bg-primary-100 dark:bg-white/5 rounded w-3/4" />
                                <div className="h-3 bg-primary-100 dark:bg-white/5 rounded w-1/3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : aiProducts.length > 0 ? (
                        <div className="space-y-3">
                          {aiProducts.map(product => {
                            const images = product.product_images || [];
                            const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
                            const image = sortedImages[0]?.image_url || product.image_url || null;
                            return (
                              <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                onClick={close}
                                className="flex gap-3 p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-white/5 transition-colors group"
                              >
                                <div className="relative w-12 h-16 bg-primary-100 dark:bg-primary-800 rounded-lg overflow-hidden shrink-0">
                                  {image ? (
                                    <Image
                                      src={image}
                                      alt={product.title}
                                      fill
                                      sizes="48px"
                                      className="object-cover group-hover:scale-105 transition-transform duration-350"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-primary-300 font-semibold">
                                      Fyxen
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-0.5">
                                    {product.brand || 'Fyxen'}
                                  </p>
                                  <h4 className="text-sm font-medium text-primary-900 dark:text-white truncate group-hover:text-accent transition-colors">
                                    {product.title}
                                  </h4>
                                  <p className="text-xs font-bold text-primary-900 dark:text-white mt-1">
                                    ₹{Number(product.price).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-primary-400 italic">No recommendations available yet.</p>
                      )}
                    </div>
                  </>
                )}
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
                <div className="border-t border-primary-100 dark:border-white/10 bg-primary-50/50 dark:bg-primary-950/20 py-8">
                  <div className="container-custom grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left side: Popular Searches */}
                    <div className="md:col-span-4 lg:col-span-3">
                      <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4">Popular Searches</p>
                      <div className="flex flex-col gap-2">
                        {QUICK_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTag(tag)}
                            className="text-left text-sm px-4 py-2.5 rounded-xl border border-primary-200/60 dark:border-white/5 bg-white dark:bg-white/5 text-primary-700 dark:text-primary-300 hover:border-accent hover:text-accent hover:shadow-sm transition-all duration-200"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right side: AI Recommended Products */}
                    <div className="md:col-span-8 lg:col-span-9 border-t md:border-t-0 md:border-l border-primary-100 dark:border-white/10 pt-6 md:pt-0 md:pl-8">
                      <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        Suggested for You <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-semibold normal-case">AI RECOMMENDED</span>
                      </p>

                      {loadingRecs ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse space-y-3">
                              <div className="aspect-[3/4] bg-primary-100 dark:bg-white/5 rounded-xl" />
                              <div className="space-y-2">
                                <div className="h-3 bg-primary-100 dark:bg-white/5 rounded w-1/3" />
                                <div className="h-4 bg-primary-100 dark:bg-white/5 rounded w-3/4" />
                                <div className="h-3 bg-primary-100 dark:bg-white/5 rounded w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : aiProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {aiProducts.map(product => {
                            const images = product.product_images || [];
                            const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
                            const image = sortedImages[0]?.image_url || product.image_url || null;
                            const discount = product.compare_at_price > product.price
                              ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                              : 0;

                            return (
                              <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                onClick={close}
                                className="group flex flex-col bg-white dark:bg-white/5 p-3 rounded-xl border border-primary-100/60 dark:border-white/5 hover:border-accent dark:hover:border-accent hover:shadow-md transition-all duration-300"
                              >
                                {/* Image */}
                                <div className="relative aspect-[3/4] w-full bg-primary-50 dark:bg-primary-900 rounded-lg overflow-hidden mb-2.5">
                                  {image ? (
                                    <Image
                                      src={image}
                                      alt={product.title}
                                      fill
                                      sizes="(max-width: 1024px) 25vw, 15vw"
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-primary-300 font-semibold">
                                      Fyxen
                                    </div>
                                  )}
                                  
                                  {/* Sale Badge */}
                                  {discount > 0 && (
                                    <span className="absolute top-2 left-2 text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded">
                                      {discount}% OFF
                                    </span>
                                  )}
                                </div>

                                {/* Text info */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                  <div>
                                    <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider mb-0.5">
                                      {product.brand || 'Fyxen'}
                                    </p>
                                    <h4 className="text-xs font-semibold text-primary-900 dark:text-white group-hover:text-accent group-hover:underline underline-offset-2 transition-colors line-clamp-2 leading-snug">
                                      {product.title}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-xs font-bold text-primary-900 dark:text-white">
                                      ₹{Number(product.price).toLocaleString('en-IN')}
                                    </span>
                                    {product.compare_at_price > product.price && (
                                      <span className="text-[10px] text-primary-400 line-through">
                                        ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-primary-200 dark:border-white/5 rounded-xl">
                          <p className="text-sm text-primary-400 italic">No personalized recommendations yet.</p>
                          <p className="text-xs text-primary-400 mt-1">Browse some products first to train the AI recommendations engine!</p>
                        </div>
                      )}
                    </div>
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
