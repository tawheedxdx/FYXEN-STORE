import { getProductBySlug, getCategories } from '@/services/products';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductReviews from '@/components/product/ProductReviews';
import FrequentlyBoughtTogether from '@/components/product/FrequentlyBoughtTogether';
import RecommendationCarousel from '@/components/product/RecommendationCarousel';
import RecentlyViewedTracker from '@/components/product/RecentlyViewedTracker';
import { getFrequentlyBoughtTogether, getContentBasedRecommendations } from '@/services/products/recommendations';
import { createClient } from '@/lib/supabase/server';
import ProductInteractiveSection from '@/components/product/ProductInteractiveSection';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) return { title: 'Product Not Found' };
  
  const title = product.seo_title || `${product.title} | Fyxen`;
  const description = product.seo_description || product.short_description || `Purchase ${product.title} at Fyxen. Premium quality and express shipping.`;
  const image = product.product_images?.[0]?.image_url || 'https://zwqrkassfbesjfakiybh.supabase.co/storage/v1/object/public/brand-assets/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/product/${slug}`,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!product) {
    notFound();
  }

  const allCategories = await getCategories();
  const breadcrumbs = [];
  let currentCategory = product.categories;
  const visited = new Set();
  while (currentCategory) {
    if (visited.has(currentCategory.id)) break;
    visited.add(currentCategory.id);
    breadcrumbs.unshift({
      name: currentCategory.name,
      url: `/category/${currentCategory.slug}`
    });
    if (currentCategory.parent_id) {
      const parent = allCategories.find(c => c.id === currentCategory.parent_id);
      currentCategory = parent;
    } else {
      currentCategory = null;
    }
  }

  const discount = product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const now = new Date().toISOString();
  const [fbt, related, { data: offers }] = await Promise.all([
    getFrequentlyBoughtTogether(product.id, 1),
    getContentBasedRecommendations(product.id, 6),
    supabase.from('offers').select('*').eq('active', true).lte('starts_at', now).gte('ends_at', now).order('created_at', { ascending: false })
  ]);

  const productOffers = (offers || []).filter(offer => {
    const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
    return isSiteWide || offer.eligible_product_ids.includes(product.id);
  });

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs md:text-sm text-primary-400 dark:text-primary-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-primary-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-primary-300 dark:text-white/10" />
              <Link href={crumb.url} className="hover:text-primary-900 dark:hover:text-white transition-colors">
                {crumb.name}
              </Link>
            </span>
          ))}
          <span className="flex items-center space-x-2">
            <ChevronRight className="w-3.5 h-3.5 text-primary-300 dark:text-white/10" />
            <span className="text-primary-850 dark:text-white font-medium truncate max-w-[200px]" title={product.title}>
              {product.title}
            </span>
          </span>
        </nav>

        <ProductInteractiveSection product={product} offers={productOffers} />

        {/* Track recently viewed products */}
        <RecentlyViewedTracker slug={product.slug} />

        {/* Frequently Bought Together Section */}
        <FrequentlyBoughtTogether product={product} recommendations={fbt} />

        {/* Related Products Section */}
        <RecommendationCarousel products={related} title="You May Also Like" />

        {/* Reviews System */}
        <ProductReviews productId={product.id} reviews={product.reviews || []} user={user} />
      </div>
    </div>
  );
}
