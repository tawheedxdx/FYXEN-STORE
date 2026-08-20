'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

function FiltersBody({
  categories,
  rootCategories,
  activeCategory,
  activeMin,
  activeMax,
  activeSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortOpen,
  setSortOpen,
  priceOpen,
  setPriceOpen,
  hasActiveFilters,
  clearAll,
  setCategory,
  handleSort,
  applyPrice,
  clearPrice,
  buildUrl,
  router,
}) {
  return (
    <div className="space-y-6">
      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest mb-3 text-neutral-950 dark:text-white">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCategory('')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                !activeCategory 
                  ? 'text-neutral-950 dark:text-white font-bold bg-neutral-100 dark:bg-neutral-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
              }`}
            >
              All Catalogue
            </button>
          </li>
          {rootCategories.map((rootCat) => {
            const children = categories.filter((c) => c.parent_id === rootCat.id);
            return (
              <li key={rootCat.id} className="space-y-1">
                <button
                  onClick={() => setCategory(rootCat.slug)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === rootCat.slug
                      ? 'text-[#c6a87c] font-bold bg-[#c6a87c]/10'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`}
                >
                  {rootCat.name}
                </button>
                {children.length > 0 && (
                  <ul className="pl-4 border-l border-neutral-200 dark:border-neutral-800 space-y-1 my-1">
                    {children.map((childCat) => (
                      <li key={childCat.id}>
                        <button
                          onClick={() => setCategory(childCat.slug)}
                          className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                            activeCategory === childCat.slug
                              ? 'text-[#c6a87c] font-bold bg-[#c6a87c]/10'
                              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                          }`}
                        >
                          {childCat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sort */}
      <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-5">
        <button
          onClick={() => setSortOpen((p) => !p)}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-widest text-neutral-950 dark:text-white mb-3 cursor-pointer"
        >
          Sort By
          {sortOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {sortOpen && (
          <ul className="space-y-1">
            {[
              { value: '', label: 'Featured & Newest' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
            ].map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => handleSort(opt.value)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeSort === opt.value
                      ? 'text-[#c6a87c] font-bold bg-[#c6a87c]/10'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
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
      <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-5">
        <button
          onClick={() => setPriceOpen((p) => !p)}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-widest text-neutral-950 dark:text-white mb-3 cursor-pointer"
        >
          Price Range (₹)
          {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {priceOpen && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-[10px] text-neutral-500 mb-1 block">Min (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono"
                />
              </div>
              <span className="mt-4 text-neutral-400">–</span>
              <div className="flex-1">
                <label className="text-[10px] text-neutral-500 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={applyPrice}
                className="btn-primary flex-1 py-2 text-xs min-h-0 h-8 font-bold"
              >
                Apply
              </button>
              {(activeMin || activeMax) && (
                <button
                  onClick={clearPrice}
                  className="btn-outline flex-1 py-2 text-xs min-h-0 h-8 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Under ₹499', min: '', max: '499' },
                { label: '₹499–₹999', min: '499', max: '999' },
                { label: 'Over ₹999', min: '999', max: '' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setMinPrice(preset.min);
                    setMaxPrice(preset.max);
                    router.push(buildUrl({ minPrice: preset.min, maxPrice: preset.max }));
                  }}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    activeMin === preset.min && activeMax === preset.max
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
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
}

export default function ShopFilters({ categories = [], currentParams = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(currentParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice || '');
  const [sort, setSort] = useState(currentParams.sort || '');
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeQ = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || '';
  const activeMin = searchParams.get('minPrice') || '';
  const activeMax = searchParams.get('maxPrice') || '';
  const activeSort = searchParams.get('sort') || '';
  const rootCategories = categories.filter((c) => !c.parent_id);

  const buildUrl = useCallback(
    (overrides = {}) => {
      const params = new URLSearchParams();
      const q = overrides.q !== undefined ? overrides.q : activeQ;
      const category = overrides.category !== undefined ? overrides.category : activeCategory;
      const min = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
      const max = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
      const s = overrides.sort !== undefined ? overrides.sort : sort;

      if (q) params.set('q', q);
      if (category) params.set('category', category);
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
      if (s) params.set('sort', s);

      return `${pathname}?${params.toString()}`;
    },
    [activeQ, activeCategory, minPrice, maxPrice, sort, pathname]
  );

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
    if (slug) params.set('category', slug);
    if (sort) params.set('sort', sort);
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

  const hasActiveFilters = Boolean(activeCategory || activeMin || activeMax || activeSort);

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline gap-2 w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter &amp; Sort Catalogue
          {hasActiveFilters && (
            <span className="ml-1 bg-[#c6a87c] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {[activeCategory, activeMin || activeMax, activeSort].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] md:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0c0c0e] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 border-l border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <span className="font-bold text-base text-neutral-950 dark:text-white">Filter Products</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-950 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FiltersBody
                categories={categories}
                rootCategories={rootCategories}
                activeCategory={activeCategory}
                activeMin={activeMin}
                activeMax={activeMax}
                activeSort={activeSort}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sortOpen={sortOpen}
                setSortOpen={setSortOpen}
                priceOpen={priceOpen}
                setPriceOpen={setPriceOpen}
                hasActiveFilters={hasActiveFilters}
                clearAll={clearAll}
                setCategory={setCategory}
                handleSort={handleSort}
                applyPrice={applyPrice}
                clearPrice={clearPrice}
                buildUrl={buildUrl}
                router={router}
              />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full mt-8 py-3.5 rounded-xl font-bold text-sm"
            >
              View Results
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="bg-neutral-50/70 dark:bg-neutral-900/40 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 sticky top-24">
          <FiltersBody
            categories={categories}
            rootCategories={rootCategories}
            activeCategory={activeCategory}
            activeMin={activeMin}
            activeMax={activeMax}
            activeSort={activeSort}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortOpen={sortOpen}
            setSortOpen={setSortOpen}
            priceOpen={priceOpen}
            setPriceOpen={setPriceOpen}
            hasActiveFilters={hasActiveFilters}
            clearAll={clearAll}
            setCategory={setCategory}
            handleSort={handleSort}
            applyPrice={applyPrice}
            clearPrice={clearPrice}
            buildUrl={buildUrl}
            router={router}
          />
        </div>
      </aside>
    </>
  );
}
