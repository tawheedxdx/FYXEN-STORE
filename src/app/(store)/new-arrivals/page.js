import { getProducts } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'New Arrivals | Fyxen',
  description: 'Shop the latest drops and newest additions to the Fyxen store.',
};

export const revalidate = 60;

export default async function NewArrivalsPage() {
  const products = await getProducts({ newArrival: true });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="bg-primary-50 dark:bg-primary-950 text-primary-900 dark:text-white py-16 md:py-24 border-b border-primary-100 dark:border-white/5">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-4">
            <Zap className="w-4 h-4 fill-current" /> Just Landed
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            New Arrivals
          </h1>
          <p className="text-primary-500 dark:text-primary-400 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
            Stay ahead of the curve. Explore the latest premium essentials to join our curated collection.
          </p>
        </div>
      </div>

      <div className="container-custom py-12 md:py-20">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-dashed border-primary-200 dark:border-white/10">
            <h2 className="text-2xl font-bold mb-4">Something new is coming...</h2>
            <p className="text-primary-500">We're preparing our next drop. Stay tuned!</p>
            <Link href="/shop" className="mt-8 btn-primary inline-flex items-center gap-2">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
