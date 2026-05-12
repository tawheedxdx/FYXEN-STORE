import { getProducts } from '@/services/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Percent, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Exclusive Sale | Fyxen',
  description: 'Unbeatable deals on premium essentials. Limited time only.',
};

export const revalidate = 60;

export default async function SalePage() {
  const products = await getProducts({ onSale: true });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header */}
      <div className="bg-red-600 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-xs mb-4">
            <Percent className="w-4 h-4" /> Limited Time
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            The Sale
          </h1>
          <p className="text-white/80 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
            Premium quality, exclusive prices. Grab your favorites before they're gone for good.
          </p>
        </div>
        <div className="absolute right-[-5%] bottom-[-10%] text-[20vw] font-black text-white/5 select-none pointer-events-none">
          OFFER
        </div>
      </div>

      <div className="container-custom py-12 md:py-20">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-red-50 dark:bg-red-950/10 rounded-3xl border border-dashed border-red-200 dark:border-red-900/20">
            <h2 className="text-2xl font-bold mb-4 text-red-600">No active sales right now</h2>
            <p className="text-primary-500">Sign up for our newsletter to be the first to know about upcoming deals.</p>
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
