import { getProducts } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Best Sellers | Fyxen',
  description: 'Shop our most popular and highest-rated products.',
};

export const revalidate = 60;

export default async function BestSellersPage() {
  const products = await getProducts({ bestSeller: true });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xs mb-4">
            <Star className="w-4 h-4 fill-current" /> Most Wanted
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Best Sellers
          </h1>
          <p className="text-primary-300 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
            Discover the items our customers love most. These are the pieces that define the Fyxen lifestyle.
          </p>
        </div>
        <div className="absolute right-[-10%] top-[-20%] w-1/2 h-[150%] bg-white/5 rotate-12 blur-3xl pointer-events-none" />
      </div>

      <div className="container-custom py-12 md:py-20">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-dashed border-primary-200 dark:border-white/10">
            <h2 className="text-2xl font-bold mb-4">Check back soon!</h2>
            <p className="text-primary-500">We're updating our collection of top-performing products.</p>
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
