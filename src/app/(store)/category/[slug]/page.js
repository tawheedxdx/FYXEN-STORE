import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { PackageSearch, ArrowRight, Home, ChevronRight } from 'lucide-react';

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

  const rootCategories = categories.filter(c => !c.parent_id);

  // Tracing breadcrumbs for currentCategory
  const breadcrumbs = [];
  let tempCat = currentCategory;
  const visited = new Set();
  while (tempCat) {
    if (visited.has(tempCat.id)) break;
    visited.add(tempCat.id);
    breadcrumbs.unshift({
      name: tempCat.name,
      url: `/category/${tempCat.slug}`
    });
    if (tempCat.parent_id) {
      const parent = categories.find(c => c.id === tempCat.parent_id);
      tempCat = parent;
    } else {
      tempCat = null;
    }
  }

  const subcategories = currentCategory 
    ? categories.filter(c => c.parent_id === currentCategory.id)
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="border-b border-primary-100 dark:border-white/5 py-12 md:py-16">
        <div className="container-custom">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-2 text-xs text-primary-400 dark:text-primary-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
              <Link href="/" className="hover:text-primary-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={idx} className="flex items-center space-x-2">
                    <ChevronRight className="w-3 h-3 text-primary-300 dark:text-white/10" />
                    {isLast ? (
                      <span className="text-primary-700 dark:text-white font-bold">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.url} className="hover:text-primary-900 dark:hover:text-white transition-colors">
                        {crumb.name}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          )}

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-3">Collection</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.9] capitalize">
            {displayName.split(' ').map((word, i) =>
              i === 1 ? <span key={i}><br /><span className="italic font-light">{word}</span></span> : word + ' '
            )}
          </h1>
          {displayDesc && (
            <p className="text-primary-500 dark:text-primary-400 mt-4 text-base max-w-lg">{displayDesc}</p>
          )}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {subcategories.map(sub => (
                <Link 
                  key={sub.id} 
                  href={`/category/${sub.slug}`}
                  className="px-4 py-2 text-xs font-bold bg-primary-50 dark:bg-white/5 text-primary-700 dark:text-primary-300 rounded-full hover:bg-accent hover:text-primary-900 transition-colors border border-primary-100 dark:border-white/5"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
          <p className="text-sm text-primary-400 mt-4 font-medium">
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
                {rootCategories.map(rootCat => {
                  const children = categories.filter(c => c.parent_id === rootCat.id);
                  return (
                    <li key={rootCat.id} className="space-y-1">
                      <Link 
                        href={`/category/${rootCat.slug}`} 
                        className={`block py-2 text-sm transition-colors border-b ${slug === rootCat.slug ? 'text-primary-900 dark:text-white font-bold border-primary-900 dark:border-white' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white border-transparent hover:border-primary-200'}`}
                      >
                        {rootCat.name}
                      </Link>
                      {children.length > 0 && (
                        <ul className="pl-4 border-l border-primary-100 dark:border-white/5 space-y-1 my-1">
                          {children.map(childCat => {
                            const grandchildren = categories.filter(c => c.parent_id === childCat.id);
                            return (
                              <li key={childCat.id} className="space-y-1">
                                <Link 
                                  href={`/category/${childCat.slug}`} 
                                  className={`block py-1.5 text-xs transition-colors ${slug === childCat.slug ? 'text-primary-900 dark:text-white font-bold' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white'}`}
                                >
                                  {childCat.name}
                                </Link>
                                {grandchildren.length > 0 && (
                                  <ul className="pl-3 border-l border-primary-100 dark:border-white/5 space-y-1 my-1">
                                    {grandchildren.map(gChildCat => (
                                      <li key={gChildCat.id}>
                                        <Link 
                                          href={`/category/${gChildCat.slug}`} 
                                          className={`block py-1 text-[11px] transition-colors ${slug === gChildCat.slug ? 'text-primary-900 dark:text-white font-bold' : 'text-primary-400/80 dark:text-primary-500/80 hover:text-primary-900 dark:hover:text-white'}`}
                                        >
                                          {gChildCat.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
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
