import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { PackageSearch, ArrowRight } from 'lucide-react';

export const revalidate = 60;

const specialMeta = {
  'best-sellers': { name: 'Best Sellers', tagline: 'The products our customers love most.' },
  'new-arrivals': { name: 'New Arrivals', tagline: 'The latest additions to the Fyxen collection.' },
  'sale': { name: 'On Sale', tagline: 'Premium quality at exclusive, limited-time prices.' },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  const special = specialMeta[slug];
  const name = special?.name || category?.name || slug.replace(/-/g, ' ');
  return {
    title: `${name} | Fyxen`,
    description: special?.tagline || category?.description || `Explore our ${name} collection at Fyxen.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: slug }),
    getCategories(),
  ]);

  const currentCategory = categories.find(c => c.slug === slug);
  const special = specialMeta[slug];
  const displayName = special?.name || currentCategory?.name || slug.replace(/-/g, ' ');
  const displayDesc = special?.tagline || currentCategory?.description || '';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="border-b border-primary-100 dark:border-white/5 py-12 md:py-16">
        <div className="container-custom">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-3">Collection</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.9] capitalize">
            {displayName.split(' ').map((word, i) =>
              i === 1 ? <span key={i}><br /><span className="italic font-light">{word}</span></span> : word + ' '
            )}
          </h1>
          {displayDesc && (
            <p className="text-primary-500 dark:text-primary-400 mt-4 text-base max-w-lg">{displayDesc}</p>
          )}
          <p className="text-sm text-primary-400 mt-2 font-medium">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="flex flex-col md:flex-row gap-10 w-full">

          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="sticky top-28">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-4">Browse</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/shop" className="block py-2 text-sm text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-primary-200">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/category/best-sellers" className={`block py-2 text-sm transition-colors border-b ${slug === 'best-sellers' ? 'text-primary-900 dark:text-white font-bold border-primary-900 dark:border-white' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white border-transparent hover:border-primary-200'}`}>
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="/category/new-arrivals" className={`block py-2 text-sm transition-colors border-b ${slug === 'new-arrivals' ? 'text-primary-900 dark:text-white font-bold border-primary-900 dark:border-white' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white border-transparent hover:border-primary-200'}`}>
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/category/sale" className={`block py-2 text-sm transition-colors border-b ${slug === 'sale' ? 'text-primary-900 dark:text-white font-bold border-primary-900 dark:border-white' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white border-transparent hover:border-primary-200'}`}>
                    Sale
                  </Link>
                </li>
                {categories.length > 0 && <li><div className="my-3 border-t border-primary-100 dark:border-white/10" /></li>}
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className={`block py-2 text-sm transition-colors border-b ${slug === cat.slug ? 'text-primary-900 dark:text-white font-bold border-primary-900 dark:border-white' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white border-transparent hover:border-primary-200'}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-28 border border-dashed border-primary-200 dark:border-white/10 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-5">
                  <PackageSearch className="w-7 h-7 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Nothing here yet</h2>
                <p className="text-primary-500 text-sm mb-6 max-w-xs">Check back soon — we're always adding new products.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 font-bold text-sm border-b border-primary-900 dark:border-white pb-0.5 hover:opacity-60 transition-opacity">
                  Browse All <ArrowRight className="w-4 h-4" />
                </Link>
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
