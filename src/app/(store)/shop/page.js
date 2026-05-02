import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import ShopFilters from '@/components/storefront/ShopFilters';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Shop All Products | Fyxen',
};

export const revalidate = 60;

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const q          = params?.q          || '';
  const category   = params?.category   || '';
  const minPrice   = params?.minPrice   || '';
  const maxPrice   = params?.maxPrice   || '';
  const sort       = params?.sort       || '';

  const [products, categories] = await Promise.all([
    getProducts({
      searchQuery:  q,
      categorySlug: category,
      minPrice,
      maxPrice,
      sort,
    }),
    getCategories(),
  ]);

  const hasActiveFilters = q || category || minPrice || maxPrice || sort;
  const currentParams = { q, category, minPrice, maxPrice, sort };

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Shop the Collection</h1>
        <p className="text-primary-500 max-w-2xl mx-auto">
          Explore our full range of premium essentials designed for modern living.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Filters sidebar */}
        <ShopFilters categories={categories} currentParams={currentParams} />

        {/* Product Grid */}
        <div className="flex-1 w-full min-w-0">
          {/* Active search / filter info bar */}
          {hasActiveFilters && (
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
              <Search className="w-4 h-4 shrink-0" />
              <span>
                {products.length} result{products.length !== 1 ? 's' : ''}
                {q && <> for <span className="font-semibold text-primary-900 dark:text-white">&ldquo;{q}&rdquo;</span></>}
                {category && <> in <span className="font-semibold text-primary-900 dark:text-white capitalize">{category.replace(/-/g, ' ')}</span></>}
                {(minPrice || maxPrice) && (
                  <> • ₹{minPrice || '0'} – ₹{maxPrice || '∞'}</>
                )}
              </span>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-24 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-white/10">
              <Search className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-primary-500">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Check back later for new arrivals.'}
              </p>
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
  );
}
