import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import ShopFilters from '@/components/storefront/ShopFilters';
import Link from 'next/link';
import { SlidersHorizontal, X, PackageSearch } from 'lucide-react';

export const metadata = {
  title: 'Shop All Products | Fyxen',
  description: 'Explore Fyxen\'s full range of premium essentials.',
};

export const revalidate = 60;

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const q        = params?.q        || '';
  const category = params?.category || '';
  const minPrice = params?.minPrice || '';
  const maxPrice = params?.maxPrice || '';
  const sort     = params?.sort     || '';

  const [products, categories] = await Promise.all([
    getProducts({ searchQuery: q, categorySlug: category, minPrice, maxPrice, sort }),
    getCategories(),
  ]);

  const hasActiveFilters = q || category || minPrice || maxPrice || sort;
  const currentParams = { q, category, minPrice, maxPrice, sort };

  // Build active filter chips
  const activeChips = [];
  if (q) activeChips.push({ label: `"${q}"`, param: 'q' });
  if (category) activeChips.push({ label: category.replace(/-/g, ' '), param: 'category' });
  if (minPrice || maxPrice) activeChips.push({ label: `₹${minPrice || '0'} – ₹${maxPrice || '∞'}`, param: 'price' });
  if (sort) activeChips.push({ label: sort.replace(/_/g, ' '), param: 'sort' });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="bg-primary-50 dark:bg-primary-950/50 border-b border-primary-100 dark:border-white/5 py-10 md:py-14">
        <div className="container-custom">
          <span className="section-label">Catalogue</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary-900 dark:text-white mt-1">
            Shop the Collection
          </h1>
          <p className="text-primary-500 dark:text-primary-400 mt-3 max-w-lg">
            Explore our full range of premium essentials designed for modern living.
          </p>
          <p className="text-sm text-primary-400 dark:text-primary-500 mt-2 font-medium">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
            </span>
            {activeChips.map(chip => {
              const clearUrl = (() => {
                const p = { ...currentParams };
                if (chip.param === 'q') delete p.q;
                if (chip.param === 'category') delete p.category;
                if (chip.param === 'price') { delete p.minPrice; delete p.maxPrice; }
                if (chip.param === 'sort') delete p.sort;
                const qs = Object.entries(p).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join('&');
                return `/shop${qs ? `?${qs}` : ''}`;
              })();
              return (
                <Link
                  key={chip.param}
                  href={clearUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-full text-xs font-semibold hover:bg-primary-700 dark:hover:bg-gray-100 transition-colors capitalize"
                >
                  {chip.label} <X className="w-3 h-3" />
                </Link>
              );
            })}
            <Link
              href="/shop"
              className="text-xs font-semibold text-primary-400 hover:text-red-500 transition-colors underline underline-offset-2 ml-1"
            >
              Clear all
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Filters sidebar */}
          <ShopFilters categories={categories} currentParams={currentParams} />

          {/* Product Grid */}
          <div className="flex-1 w-full min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-5">
                  <PackageSearch className="w-8 h-8 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-primary-500 dark:text-primary-400 max-w-xs text-sm">
                  {hasActiveFilters
                    ? 'Try adjusting or clearing your search filters.'
                    : 'Check back soon for new arrivals.'}
                </p>
                {hasActiveFilters && (
                  <Link href="/shop" className="mt-6 btn-outline">
                    Clear Filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
