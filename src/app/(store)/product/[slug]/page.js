import { getProductBySlug } from '@/services/products';
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

  const discount = product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const [fbt, related] = await Promise.all([
    getFrequentlyBoughtTogether(product.id, 1),
    getContentBasedRecommendations(product.id, 6)
  ]);

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="container-custom py-8 md:py-12">
        <ProductInteractiveSection product={product} />

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
