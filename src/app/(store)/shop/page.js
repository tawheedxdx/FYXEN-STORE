import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import ShopFilters from '@/components/storefront/ShopFilters';
import Link from 'next/link';
import { SlidersHorizontal, X, PackageSearch, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Shop All Products | FYXEN — Premium Essentials',
  description: 'Explore FYXEN\'s full range of premium home, kitchen, office and everyday utility products. Fast delivery across India.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop All Products | FYXEN — Premium Essentials',
    description: 'Explore FYXEN\'s full range of premium home, kitchen, office and everyday utility products. Fast delivery across India.',
    url: 'https://www.fyxen.in/shop',
    siteName: 'FYXEN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products | FYXEN — Premium Essentials',
    description: 'Explore FYXEN\'s full range of premium home, kitchen, office and everyday utility products.',
  },
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

  const hasActiveFilters = Boolean(q || category || minPrice || maxPrice || sort);
  const currentParams = { q, category, minPrice, maxPrice, sort };

  const activeChips = [];
  if (q) activeChips.push({ label: `"${q}"`, param: 'q' });
  if (category) activeChips.push({ label: category.replace(/-/g, ' '), param: 'category' });
  if (minPrice || maxPrice) activeChips.push({ label: `₹${minPrice || '0'} – ₹${maxPrice || '∞'}`, param: 'price' });
  if (sort) activeChips.push({ label: sort.replace(/_/g, ' '), param: 'sort' });

  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop All Products | FYXEN",
    "description": "Explore FYXEN's full range of premium essentials.",
    "url": "https://www.fyxen.in/shop",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://www.fyxen.in/product/${p.slug}`,
        "name": p.title
      }))
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopSchema) }}
      />

      {/* Page Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 py-12 md:py-16 bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="container-custom">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c6a87c]" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6a87c]">
              Curated Catalogue
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.05]">
            Shop the <span className="font-light italic text-neutral-500">Collection</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-lg font-light">
              Explore our full range of premium everyday home and lifestyle utilities.
            </p>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-200/80 dark:border-neutral-800 w-fit">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#c6a87c]" /> Filters:
            </span>
            {activeChips.map((chip) => {
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-xs font-bold hover:opacity-90 transition-colors capitalize shadow-xs"
                >
                  {chip.label} <X className="w-3 h-3" />
                </Link>
              );
            })}
            <Link
              href="/shop"
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors ml-auto underline underline-offset-4"
            >
              Clear all
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 w-full">
          {/* Filters sidebar */}
          <ShopFilters categories={categories} currentParams={currentParams} />

          {/* Product Grid */}
          <div className="flex-1 w-full min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4 text-[#c6a87c]">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-1 text-neutral-950 dark:text-white">No products found</h2>
                <p className="text-neutral-500 max-w-xs text-xs mb-6 font-light">
                  {hasActiveFilters
                    ? 'Try adjusting or clearing your search filters to find what you are looking for.'
                    : 'Check back soon for upcoming product drops.'}
                </p>
                {hasActiveFilters && (
                  <Link href="/shop" className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold">
                    Clear All Filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
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
