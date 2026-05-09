import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock, Star, RotateCcw } from 'lucide-react';
import HeroSection from '@/components/storefront/HeroSection';
import CategoryShowcase from '@/components/storefront/CategoryShowcase';
import ProductCarousel from '@/components/storefront/ProductCarousel';
import PromoBanner from '@/components/storefront/PromoBanner';
import NewsletterForm from '@/components/storefront/NewsletterForm';
import ProductCard from '@/components/product/ProductCard';
import { getProducts, getCategories } from '@/services/products';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const [featuredProducts, categories, { data: banners }] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
    supabase.from('promo_banners').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1)
  ]);

  const activeBanner = banners?.[0];

  const trustFeatures = [
    { icon: ShieldCheck, title: 'Premium Quality', desc: 'Rigorously tested materials in every product.' },
    { icon: Truck, title: 'Fast Shipping', desc: 'Express nationwide delivery via trusted partners.' },
    { icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle-free 7-day return policy.' },
    { icon: Clock, title: '24/7 Support', desc: 'Dedicated team ready to assist you anytime.' },
  ];

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black overflow-hidden">

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Bar */}
      <section className="py-8 md:py-12 bg-white dark:bg-primary-950 border-b border-primary-100 dark:border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start md:items-center gap-3 group">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-sm text-primary-900 dark:text-white">{title}</p>
                  <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5 hidden md:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <CategoryShowcase categories={categories} />

      {/* 4. Featured Products */}
      <section className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4">
            <div>
              <span className="section-label">Our Picks</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-primary-900 dark:text-white mt-1">
                Featured <span className="text-accent">Selection</span>
              </h2>
              <p className="text-primary-500 dark:text-primary-400 text-base mt-3 max-w-lg">
                Curated for those who settle for nothing but the best.
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 btn-outline shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <ProductCarousel products={[]} />
          )}
        </div>
      </section>

      {/* 5. Promo Banner */}
      {activeBanner && <PromoBanner banner={activeBanner} />}

      {/* 6. Social Proof Bar */}
      <section className="py-12 bg-primary-50 dark:bg-primary-950/50 border-y border-primary-100 dark:border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 text-center">
            {[
              { num: '2,000+', text: 'Orders Shipped' },
              { num: '500+', text: 'Happy Customers' },
              { num: '4.9/5', text: 'Customer Rating' },
              { num: '100%', text: 'Authentic Products' },
            ].map(({ num, text }) => (
              <div key={text} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-primary-900 dark:text-white tracking-tighter">{num}</span>
                <span className="text-xs text-primary-500 dark:text-primary-400 uppercase tracking-wider font-medium mt-1">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="container-custom">
          <div className="relative bg-primary-900 dark:bg-primary-950 rounded-3xl overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center p-10 md:p-16">
              {/* Left */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Exclusive Access</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                  Join the<br /><span className="text-accent">Elite.</span>
                </h2>
                <p className="text-primary-300 text-base leading-relaxed mb-6">
                  Get early access to new drops, exclusive member-only discounts, and curated recommendations straight to your inbox.
                </p>
                <div className="flex items-center gap-2 text-primary-400 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary-500" />
                  No spam. Unsubscribe anytime.
                </div>
              </div>

              {/* Right */}
              <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                <p className="text-white font-semibold mb-4">Join <span className="text-accent">12,000+</span> subscribers today</p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
