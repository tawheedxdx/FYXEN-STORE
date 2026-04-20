import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import HeroSection from '@/components/storefront/HeroSection';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/services/products';

export default async function HomePage() {
  const featuredProducts = await getProducts({ featured: true });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Markers */}
      <section className="py-12 bg-white dark:bg-black border-b border-primary-100 dark:border-white/10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary-100 dark:divide-white/10">
            <div className="flex flex-col items-center p-4">
              <ShieldCheck className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-primary-500 dark:text-primary-400 text-sm">Uncompromising materials and craftsmanship in every product.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Truck className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
              <p className="text-primary-500 dark:text-primary-400 text-sm">Fast, reliable delivery nationwide by Bytread logistics partners.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Clock className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-primary-500 dark:text-primary-400 text-sm">Dedicated customer service for a seamless shopping experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-primary-50 dark:bg-primary-900/20">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Featured Selection</h2>
              <p className="text-primary-500 dark:text-primary-400">Curated specifically for you.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary-900 dark:text-white font-medium hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-primary-500">
                <p>New featured products arriving soon.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 md:hidden flex justify-center">
             <Link href="/shop" className="btn-outline w-full">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
