import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  
  const title = category ? `${category.name} | Fyxen` : `${slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')} | Fyxen`;
  const description = category?.description || `Explore our exclusive collection of ${slug.replace('-', ' ')} at Fyxen. Quality you can trust.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  const products = await getProducts({ categorySlug: slug });
  const categories = await getCategories();
  
  const currentCategory = categories.find(c => c.slug === slug);
  if (!currentCategory && slug !== 'new-arrivals' && slug !== 'best-sellers') {
    // If it's a dynamic category that doesn't exist, we might want to 404
    // But for demo purposes or hardcoded special categories, we won't strictly 404 yet.
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 capitalize">{currentCategory?.name || slug.replace('-', ' ')}</h1>
        {currentCategory?.description && (
          <p className="text-primary-500 max-w-2xl mx-auto">{currentCategory.description}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 sticky top-24 w-full">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-primary-600 dark:text-primary-300 hover:text-accent transition-colors">All Products</Link>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <Link 
                    href={`/category/${category.slug}`} 
                    className={`${slug === category.slug ? 'text-accent font-medium' : 'text-primary-600 dark:text-primary-300 hover:text-accent transition-colors'}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {products.length === 0 ? (
            <div className="text-center py-24 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-primary-500">Check back later for new items in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
