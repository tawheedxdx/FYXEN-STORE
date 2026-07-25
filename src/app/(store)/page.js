import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import HeroSection from '@/components/storefront/HeroSection';
import CategoryNavStrip from '@/components/storefront/CategoryNavStrip';
import CollectionBanners from '@/components/storefront/CollectionBanners';
import PromoBanner from '@/components/storefront/PromoBanner';
import NewsletterForm from '@/components/storefront/NewsletterForm';
import ProductCard from '@/components/product/ProductCard';
import HomeRecommendations from '@/components/storefront/HomeRecommendations';
import ActiveOffersGrid from '@/components/storefront/ActiveOffersGrid';
import { getProducts, getCategories } from '@/services/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Premium Home, Kitchen & Lifestyle Products | FYXEN',
  description: 'Discover premium home, kitchen, office and everyday utility products from FYXEN. Designed for modern living with quality, style and practicality. Fast delivery across India.',
};

export const revalidate = 60;

const trustFeatures = [
  { icon: ShieldCheck, title: 'Authentic Products', desc: 'Every item is 100% genuine and quality-checked.' },
  { icon: Truck, title: 'Delivered Across India', desc: 'Swift, reliable delivery to your doorstep.' },
  { icon: RotateCcw, title: 'Easy 7-Day Returns', desc: 'Not happy? Return it, no questions asked.' },
  { icon: Clock, title: '24/7 Support', desc: 'Our team is always here to help you.' },
];

const customerReviews = [
  {
    author: 'Aarav Sharma',
    date: '2026-06-12',
    reviewBody: 'FYXEN oil sprayer dispenser has completely transformed my daily cooking routine. Supreme build quality and sleek design!',
    ratingValue: 5,
  },
  {
    author: 'Priya Patel',
    date: '2026-06-28',
    reviewBody: 'Fast delivery across India! The portable neck fan feels super premium and light. Highly recommended Indian brand.',
    ratingValue: 5,
  },
  {
    author: 'Rohan Mehta',
    date: '2026-07-04',
    reviewBody: 'Inkless thermal printer works flawlessly with my phone. Clean packaging, genuine quality, and responsive support.',
    ratingValue: 5,
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [featuredProducts, bestSellers, categories, { data: banners }, { data: settings }, { data: offers }] = await Promise.all([
    getProducts({ featured: true }),
    getProducts({ bestSeller: true }),
    getCategories(),
    supabase.from('promo_banners').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('settings').select('*').single(),
    supabase.from('offers').select('*').eq('active', true).lte('starts_at', now).gte('ends_at', now).order('created_at', { ascending: false }),
  ]);

  const activeBanner = banners?.[0];
  const showCurated = settings?.curated_section_enabled ?? true;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.fyxen.in",
    "name": "FYXEN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.fyxen.in/shop?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "FYXEN Lifestyle Products Collection",
    "description": "FYXEN is an Indian premium lifestyle brand offering innovative home, kitchen, office and everyday utility products.",
    "brand": {
      "@type": "Brand",
      "name": "FYXEN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "148"
    },
    "review": customerReviews.map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.author
      },
      "datePublished": r.date,
      "reviewBody": r.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.ratingValue,
        "bestRating": "5"
      }
    }))
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

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
                  <ProductCard key={product.id} product={product} offers={offers || []} />
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
                  <ProductCard key={product.id} product={product} offers={offers || []} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended for you Section */}
      <HomeRecommendations />

      {/* Active Offers & Giveaways Grid */}
      <ActiveOffersGrid offers={offers || []} />

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

      {/* 8. Brand Overview & Customer Reviews */}
      <section className="py-20 md:py-28 bg-primary-50/50 dark:bg-neutral-950 border-t border-b border-primary-100 dark:border-white/5">
        <div className="container-custom">
          {/* Brand Positioning Statement */}
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-900/10 dark:bg-white/10 text-primary-900 dark:text-white text-xs font-bold uppercase tracking-widest">
              Indian Premium Lifestyle Brand
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-primary-900 dark:text-white tracking-tight leading-tight">
              Thoughtfully Designed for Modern Living
            </h2>
            <p className="text-base md:text-lg text-primary-600 dark:text-primary-300 font-light leading-relaxed max-w-3xl mx-auto">
              FYXEN brings thoughtfully designed home, kitchen, office and everyday utility products that simplify daily living through premium quality, elegant design and reliable performance across India.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-primary-500 dark:text-primary-400 font-medium">
              <span className="flex items-center gap-1.5">✓ Operated by Bytread International Pvt Ltd</span>
              <span className="flex items-center gap-1.5">✓ 100% Genuine Quality</span>
              <span className="flex items-center gap-1.5">✓ Express Shipping Across India</span>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-2">Verified Reviews</p>
              <h3 className="text-2xl md:text-4xl font-black text-primary-900 dark:text-white tracking-tight">
                Trusted by Thousands Across India
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customerReviews.map((rev, idx) => (
                <div key={idx} className="bg-white dark:bg-neutral-900 border border-primary-100 dark:border-white/10 p-7 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      {'★'.repeat(rev.ratingValue)}
                    </div>
                    <p className="text-sm text-primary-700 dark:text-primary-300 leading-relaxed italic">
                      "{rev.reviewBody}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-primary-100 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="font-bold text-primary-900 dark:text-white">{rev.author}</span>
                    <span className="text-primary-400">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
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
