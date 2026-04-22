import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock, Zap, Star, Trophy } from 'lucide-react';
import HeroSection from '@/components/storefront/HeroSection';
import ProductCard from '@/components/product/ProductCard';
import CategoryShowcase from '@/components/storefront/CategoryShowcase';
import FeaturesCarousel from '@/components/storefront/FeaturesCarousel';
import PromoBanner from '@/components/storefront/PromoBanner';
import NewsletterForm from '@/components/storefront/NewsletterForm';
import { getProducts, getCategories } from '@/services/products';

import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const [featuredProducts, categories, { data: banners }] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
    supabase.from('promo_banners').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1)
  ]);

  const activeBanner = banners?.[0];

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Features Carousel */}
      <FeaturesCarousel />

      {/* 3. Category Showcase */}
      <CategoryShowcase categories={categories} />

      {/* 4. Featured Products */}
      <section className="py-20 md:py-32 bg-primary-50 dark:bg-primary-950/40 relative">
        <div className="container-custom px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-20 text-center md:text-left gap-6">
            <div>
              <span className="text-accent font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm mb-3 md:mb-4 block">Our Picks</span>
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase mb-4">Featured <span className="text-primary-400">Selection</span></h2>
              <p className="text-primary-500 dark:text-primary-400 text-base md:text-lg max-w-xl italic font-light">Curated for those who settle for nothing but the best.</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 bg-primary-900 text-white dark:bg-white dark:text-primary-900 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-accent hover:text-primary-900 transition-all text-sm md:text-base">
              VIEW ALL <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {/* ... products ... */}
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-primary-200 dark:border-white/10">
                <p className="text-xl font-medium text-primary-400 uppercase tracking-widest">New drops arriving soon</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Promo Banner */}
      {activeBanner && <PromoBanner banner={activeBanner} />}

      {/* 6. Newsletter / CTA */}
      <section className="py-32 bg-white dark:bg-black">
        <div className="container-custom">
          <div className="bg-primary-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 border-8 border-accent rounded-full -ml-32 -mt-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 border-8 border-accent rounded-full -mr-48 -mb-48 opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase">Join the <span className="text-accent">Elite.</span></h2>
              <p className="text-primary-200 text-xl mb-12 font-light italic">Subscribe to get exclusive early access to drops and member-only rewards.</p>
              
              <NewsletterForm />
              
              <p className="mt-8 text-primary-400 text-sm">No spam. Only premium updates. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
