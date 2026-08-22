import HeroSection from '@/components/storefront/HeroSection';
import CategoryNavStrip from '@/components/storefront/CategoryNavStrip';
import HomeProductShowcase from '@/components/storefront/HomeProductShowcase';
import BrandBentoGrid from '@/components/storefront/BrandBentoGrid';
import HomeReviewsWall from '@/components/storefront/HomeReviewsWall';
import ActiveOffersGrid from '@/components/storefront/ActiveOffersGrid';
import NewsletterForm from '@/components/storefront/NewsletterForm';
import CurvedSectionDivider from '@/components/common/CurvedSectionDivider';
import { getProducts, getCategories } from '@/services/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'FYXEN | Premium Home, Kitchen & Everyday Lifestyle Products',
  description: 'Discover premium home, kitchen, and everyday utility essentials from FYXEN. Thoughtfully engineered for modern Indian homes with quality, style, and durability.',
};

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [
    featuredProducts,
    bestSellers,
    categories,
    { data: offers },
    { data: realReviews }
  ] = await Promise.all([
    getProducts({ featured: true }),
    getProducts({ bestSeller: true }),
    getCategories(),
    supabase.from('offers').select('*').eq('active', true).lte('starts_at', now).gte('ends_at', now).order('created_at', { ascending: false }),
    supabase.from('reviews').select('*, products(id, title, slug), profiles(full_name)').eq('featured_on_home', true).order('created_at', { ascending: false }),
  ]);

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

  const hasReviews = realReviews && realReviews.length > 0;
  const avgRating = hasReviews
    ? (realReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / realReviews.length).toFixed(1)
    : null;

  const reviewsSchema = hasReviews ? {
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
      "ratingValue": avgRating,
      "reviewCount": realReviews.length
    },
    "review": realReviews.map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.author_name || r.profiles?.full_name || 'Verified Buyer'
      },
      "datePublished": r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      "reviewBody": r.comment,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating || 5,
        "bestRating": "5"
      }
    }))
  } : null;

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#09090b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {reviewsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
        />
      )}

      {/* 1. Above-the-fold Crown Jewel Hero */}
      <HeroSection featuredProduct={featuredProducts?.[0]} />

      {/* 2. Interactive Category Navigator Bar */}
      <CategoryNavStrip categories={categories} />

      {/* 3. Curated Tabbed Product Showcase */}
      <HomeProductShowcase
        featuredProducts={featuredProducts}
        bestSellers={bestSellers}
        offers={offers || []}
      />

      {/* 4. Why FYXEN? Brand Bento Grid */}
      <BrandBentoGrid />

      {/* 5. Active Offers & Flash Drop Events */}
      <ActiveOffersGrid offers={offers || []} />

      {/* 6. Customer Love & Regional Social Proof Wall (Admin Curated Reviews Only) */}
      <HomeReviewsWall reviews={realReviews || []} />

      {/* 7. VIP Inner Circle Newsletter with Symmetrical Curved Opening & Ending */}
      <section className="relative overflow-hidden w-full bg-white dark:bg-[#09090b]">
        {/* Top Curve (Opening) */}
        <CurvedSectionDivider variant="top-concave" />

        {/* Section Body */}
        <div className="py-14 md:py-20 bg-neutral-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,168,124,0.08)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="container-custom relative z-10 text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#c6a87c] block">
              FYXEN VIP Club
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Unlock 10% Off Your First Order
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
              Join our inner circle for exclusive product drop announcements, VIP member discounts, and curated lifestyle recommendations.
            </p>

            <div className="pt-4">
              <NewsletterForm />
            </div>

            <p className="text-neutral-500 text-xs pt-2">
              No spam, ever. Unsubscribe with a single click anytime.
            </p>
          </div>
        </div>

        {/* Bottom Curve (Ending) */}
        <CurvedSectionDivider variant="bottom-concave" />
      </section>
    </div>
  );
}
