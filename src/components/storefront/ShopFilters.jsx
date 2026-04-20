'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function ShopFilters({ categories, currentParams = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(currentParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice || '');
  const [sort, setSort]     = useState(currentParams.sort || '');
  const [priceOpen, setPriceOpen]     = useState(true);
  const [sortOpen, setSortOpen]       = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);

  // Current active values from URL
  const activeQ        = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || '';
  const activeMin      = searchParams.get('minPrice') || '';
  const activeMax      = searchParams.get('maxPrice') || '';
  const activeSort     = searchParams.get('sort') || '';

  const buildUrl = useCallback((overrides = {}) => {
    const params = new URLSearchParams();
    const q        = overrides.q        !== undefined ? overrides.q        : activeQ;
    const category = overrides.category !== undefined ? overrides.category : activeCategory;
    const min      = overrides.minPrice  !== undefined ? overrides.minPrice  : minPrice;
    const max      = overrides.maxPrice  !== undefined ? overrides.maxPrice  : maxPrice;
    const s        = overrides.sort      !== undefined ? overrides.sort      : sort;

    if (q)        params.set('q', q);
    if (category) params.set('category', category);
    if (min)      params.set('minPrice', min);
    if (max)      params.set('maxPrice', max);
    if (s)        params.set('sort', s);

    return `${pathname}?${params.toString()}`;
  }, [activeQ, activeCategory, minPrice, maxPrice, sort, pathname]);

  function applyPrice() {
    router.push(buildUrl({ minPrice, maxPrice }));
    setMobileOpen(false);
  }

  function clearPrice() {
    setMinPrice('');
    setMaxPrice('');
    router.push(buildUrl({ minPrice: '', maxPrice: '' }));
  }

  function setCategory(slug) {
    const params = new URLSearchParams();
    if (activeQ) params.set('q', activeQ);
    if (slug)    params.set('category', slug);
    if (sort)    params.set('sort', sort);
    router.push(`${pathname}?${params.toString()}`);
    setMobileOpen(false);
  }

  function handleSort(val) {
    setSort(val);
    router.push(buildUrl({ sort: val }));
  }

  function clearAll() {
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    router.push(pathname + (activeQ ? `?q=${activeQ}` : ''));
    setMobileOpen(false);
  }

  const hasActiveFilters = activeCategory || activeMin || activeMax || activeSort;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium"
        >
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-primary-900 dark:text-white">Categories</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCategory('')}
              className={`w-full text-left py-1.5 px-2 rounded-lg text-sm transition-colors ${
                !activeCategory ? 'text-accent font-semibold bg-accent/10' : 'text-primary-700 dark:text-primary-300 hover:text-accent hover:bg-primary-50 dark:hover:bg-white/5'
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => setCategory(cat.slug)}
                className={`w-full text-left py-1.5 px-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.slug ? 'text-accent font-semibold bg-accent/10' : 'text-primary-700 dark:text-primary-300 hover:text-accent hover:bg-primary-50 dark:hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div className="border-t border-primary-100 dark:border-white/10 pt-5">
        <button
          onClick={() => setSortOpen(p => !p)}
          className="w-full flex items-center justify-between font-bold text-sm uppercase tracking-wider text-primary-900 dark:text-white mb-3"
        >
          Sort By
          {sortOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {sortOpen && (
          <ul className="space-y-1">
            {[
              { value: '',           label: 'Newest First' },
              { value: 'price_asc',  label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
            ].map(opt => (
              <li key={opt.value}>
                <button
                  onClick={() => handleSort(opt.value)}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-sm transition-colors ${
                    activeSort === opt.value ? 'text-accent font-semibold bg-accent/10' : 'text-primary-700 dark:text-primary-300 hover:text-accent hover:bg-primary-50 dark:hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price Range */}
      <div className="border-t border-primary-100 dark:border-white/10 pt-5">
        <button
          onClick={() => setPriceOpen(p => !p)}
          className="w-full flex items-center justify-between font-bold text-sm uppercase tracking-wider text-primary-900 dark:text-white mb-3"
        >
          Price Range
          {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {priceOpen && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs text-primary-500 mb-1 block">Min (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-md border border-primary-200 dark:border-white/10 bg-white dark:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900 dark:focus:ring-white"
                />
              </div>
              <span className="mt-5 text-primary-400">–</span>
              <div className="flex-1">
                <label className="text-xs text-primary-500 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full px-3 py-2 text-sm rounded-md border border-primary-200 dark:border-white/10 bg-white dark:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900 dark:focus:ring-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={applyPrice} className="btn-primary flex-1 py-2 text-xs min-h-0 h-9">
                Apply
              </button>
              {(activeMin || activeMax) && (
                <button onClick={clearPrice} className="btn-outline flex-1 py-2 text-xs min-h-0 h-9">
                  Clear
                </button>
              )}
            </div>

            {/* Quick price presets */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                { label: 'Under ₹500',  min: '', max: '500' },
                { label: '₹500–₹1000', min: '500', max: '1000' },
                { label: 'Over ₹1000', min: '1000', max: '' },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setMinPrice(preset.min);
                    setMaxPrice(preset.max);
                    router.push(buildUrl({ minPrice: preset.min, maxPrice: preset.max }));
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeMin === preset.min && activeMax === preset.max
                      ? 'bg-primary-900 dark:bg-white text-white dark:text-primary-900 border-primary-900 dark:border-white'
                      : 'border-primary-200 dark:border-white/10 text-primary-600 dark:text-primary-400 hover:border-primary-900 dark:hover:border-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline gap-2 w-full"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sort
          {hasActiveFilters && (
            <span className="ml-1 bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {[activeCategory, activeMin || activeMax, activeSort].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-primary-900 rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <span className="font-bold text-lg">Filters</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-primary-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FiltersContent />
            <button onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-6">
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="bg-white dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 sticky top-24">
          <FiltersContent />
        </div>
      </aside>
    </>
  );
}
