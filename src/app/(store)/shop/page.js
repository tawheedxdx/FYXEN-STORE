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

  const activeChips = [];
  if (q) activeChips.push({ label: `"${q}"`, param: 'q' });
  if (category) activeChips.push({ label: category.replace(/-/g, ' '), param: 'category' });
  if (minPrice || maxPrice) activeChips.push({ label: `₹${minPrice || '0'} – ₹${maxPrice || '∞'}`, param: 'price' });
  if (sort) activeChips.push({ label: sort.replace(/_/g, ' '), param: 'sort' });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="border-b border-primary-100 dark:border-white/5 py-12 md:py-16 bg-white dark:bg-black">
        <div className="container-custom">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-3">Catalogue</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.9]">
            Shop the<br /><span className="italic font-light">Collection</span>
          </h1>
          <p className="text-primary-500 dark:text-primary-400 mt-4 text-base max-w-lg">
            Explore our full range of premium essentials designed for modern living.
          </p>
          <p className="text-sm text-primary-400 mt-2 font-medium">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Active Filters:
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-900 dark:bg-white text-white dark:text-primary-900 rounded-full text-xs font-semibold hover:bg-primary-700 transition-colors capitalize"
                >
                  {chip.label} <X className="w-3 h-3" />
                </Link>
              );
            })}
            <Link href="/shop" className="text-xs font-semibold text-primary-400 hover:text-red-500 transition-colors underline underline-offset-2 ml-1">
              Clear all
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10 w-full">
          {/* Filters sidebar */}
          <ShopFilters categories={categories} currentParams={currentParams} />

          {/* Product Grid */}
          <div className="flex-1 w-full min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-28 border border-dashed border-primary-200 dark:border-white/10 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-5">
                  <PackageSearch className="w-7 h-7 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-primary-500 max-w-xs text-sm mb-6">
                  {hasActiveFilters ? 'Try adjusting or clearing your search filters.' : 'Check back soon for new arrivals.'}
                </p>
                {hasActiveFilters && (
                  <Link href="/shop" className="btn-outline rounded-full">Clear Filters</Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
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
