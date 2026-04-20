import { getProducts, getCategories } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export const metadata = {
  title: 'Shop All Products',
};

export default async function ShopPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="container-custom py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Shop the Collection</h1>
        <p className="text-primary-500 max-w-2xl mx-auto">Explore our full range of premium essentials designed for modern living.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 sticky top-24 w-full">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-accent font-medium">All Products</Link>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className="text-primary-600 dark:text-primary-300 hover:text-accent transition-colors">
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
              <p className="text-primary-500">Check back later for new arrivals.</p>
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
