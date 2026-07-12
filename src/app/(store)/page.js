import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import HeroSection from '@/components/storefront/HeroSection';
import CategoryNavStrip from '@/components/storefront/CategoryNavStrip';
import CollectionBanners from '@/components/storefront/CollectionBanners';
import PromoBanner from '@/components/storefront/PromoBanner';
import NewsletterForm from '@/components/storefront/NewsletterForm';
import ProductCard from '@/components/product/ProductCard';
import HomeRecommendations from '@/components/storefront/HomeRecommendations';
import { getProducts, getCategories } from '@/services/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Fyxen — Premium Essentials',
  description: 'Elevating everyday living with premium essentials crafted for those who appreciate the finer details.',
};

export const revalidate = 60;

const trustFeatures = [
  { icon: ShieldCheck, title: 'Authentic Products', desc: 'Every item is 100% genuine and quality-checked.' },
  { icon: Truck, title: 'Delivered Across India', desc: 'Swift, reliable delivery to your doorstep.' },
  { icon: RotateCcw, title: 'Easy 7-Day Returns', desc: 'Not happy? Return it, no questions asked.' },
  { icon: Clock, title: '24/7 Support', desc: 'Our team is always here to help you.' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const [featuredProducts, bestSellers, categories, { data: banners }] = await Promise.all([
    getProducts({ featured: true }),
    getProducts({ bestSeller: true }),
    getCategories(),
    supabase.from('promo_banners').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1),
  ]);

  const activeBanner = banners?.[0];

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black">

      {/* 1. Category Nav Strip */}
      <CategoryNavStrip categories={categories} />

      {/* 2. Featured Products — "Fyxen Exclusives" */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-white dark:bg-black">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">
              {/* Left: Section Header */}
              <div className="md:sticky md:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-4">Handpicked</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.95] mb-5">
                  Fyxen<br /><span className="italic font-light">Exclusives</span>
                </h2>
                <p className="text-sm text-primary-500 dark:text-primary-400 leading-relaxed mb-8 max-w-[240px]">
                  Handpicked exclusively for those who appreciate quality and craftsmanship.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 dark:text-white border-b border-primary-900 dark:border-white pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Shop the Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right: Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {featuredProducts.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="py-16 md:py-24 bg-primary-50 dark:bg-primary-950/40">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">
              {/* Left: Section Header */}
              <div className="md:sticky md:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-4">Top Picks</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.95] mb-5">
                  Featured<br /><span className="italic font-light">Products</span>
                </h2>
                <p className="text-sm text-primary-500 dark:text-primary-400 leading-relaxed mb-8 max-w-[240px]">
                  The products our customers keep coming back for, time and time again.
                </p>
                <Link
                  href="/category/best-sellers"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 dark:text-white border-b border-primary-900 dark:border-white pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Shop the Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right: Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {bestSellers.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended for you Section */}
      <HomeRecommendations />

      {/* 4. Hero */}
      <HeroSection />

      {/* 5. Trust Pillars */}
      <section className="py-14 md:py-20 bg-white dark:bg-black border-b border-primary-100 dark:border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                </div>
                <div>
                  <p className="font-bold text-sm text-primary-900 dark:text-white">{title}</p>
                  <p className="text-xs text-primary-500 dark:text-primary-400 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Promo Banner */}
      {activeBanner && <PromoBanner banner={activeBanner} />}

      {/* 7. Curated Collection Banners */}
      <CollectionBanners />

      {/* 8. Stats Bar */}
      <section className="py-14 md:py-20 bg-white dark:bg-black border-y border-primary-100 dark:border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-primary-100 dark:divide-white/10">
            {[
              { num: '2,000+', text: 'Orders Shipped' },
              { num: '500+', text: 'Happy Customers' },
              { num: '4.9 / 5', text: 'Customer Rating' },
              { num: '100%', text: 'Authentic Products' },
            ].map(({ num, text }) => (
              <div key={text} className="flex flex-col items-center text-center md:px-8 py-2">
                <span className="text-3xl md:text-4xl font-black text-primary-900 dark:text-white tracking-tighter">{num}</span>
                <span className="text-xs text-primary-500 dark:text-primary-400 uppercase tracking-widest font-medium mt-2">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter */}
      <section className="py-16 md:py-24 bg-primary-900 dark:bg-primary-950">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-4">Exclusive Access</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 leading-[0.9]">
              Thrive<br /><span className="italic font-light">With Us</span>
            </h2>
            <p className="text-primary-400 text-base mb-10 leading-relaxed">
              Get early access to new drops, exclusive member discounts, and curated picks — straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-primary-500 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
              <Link
                href="#"
                className="px-8 py-3.5 bg-white text-primary-900 rounded-full font-bold text-sm hover:bg-gray-100 transition-all whitespace-nowrap"
              >
                Subscribe
              </Link>
            </div>
            <p className="text-primary-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
