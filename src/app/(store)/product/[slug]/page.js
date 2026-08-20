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
  
  const categoryName = product.categories?.name ? ` | ${product.categories.name}` : '';
  const title = product.seo_title || `${product.title}${categoryName} | FYXEN`;
  const description = product.seo_description || product.short_description || `Purchase ${product.title} at FYXEN. Premium quality and express shipping.`;
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

  // Check Verified Buyer status for review authorization
  let canReview = false;
  let hasReviewed = false;
  let userReview = null;

  if (user) {
    const [{ data: purchase }, { data: existingReview }] = await Promise.all([
      supabase
        .from('order_items')
        .select('id, orders!inner(id, user_id, order_status, payment_status)')
        .eq('product_id', product.id)
        .eq('orders.user_id', user.id)
        .in('orders.payment_status', ['paid', 'pending'])
        .not('orders.order_status', 'in', '("cancelled","refunded")')
        .limit(1)
        .maybeSingle(),
      supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);

    canReview = Boolean(purchase);
    hasReviewed = Boolean(existingReview);
    userReview = existingReview || null;
  }

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

  const productImages = product.product_images?.map(img => img.image_url) || [];
  const productPrice = Number(product.price);
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  const reviews = product.reviews || [];
  const hasReviews = reviews.length > 0;
  const avgRating = hasReviews
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : null;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": productImages.length > 0 ? productImages : ['https://www.fyxen.in/logo.png'],
    "description": product.description || product.short_description || product.title,
    "sku": product.sku || product.id,
    "mpn": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "FYXEN"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.fyxen.in/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": productPrice,
      "priceValidUntil": priceValidUntil.toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "FYXEN",
        "legalName": "Bytread International Private Limited"
      }
    },
    ...(hasReviews && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avgRating,
        "reviewCount": reviews.length
      },
      "review": reviews.slice(0, 5).map(rev => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": rev.author_name || rev.profiles?.full_name || "Verified Buyer"
        },
        "datePublished": rev.created_at ? rev.created_at.split('T')[0] : priceValidUntil.toISOString().split('T')[0],
        "reviewBody": rev.comment || "Verified product review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": rev.rating || 5,
          "bestRating": "5"
        }
      }))
    })
  };

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.fyxen.in"
      },
      ...breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": crumb.name,
        "item": `https://www.fyxen.in${crumb.url}`
      })),
      {
        "@type": "ListItem",
        "position": breadcrumbs.length + 2,
        "name": product.title,
        "item": `https://www.fyxen.in/product/${product.slug}`
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-[#09090b] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs md:text-sm text-neutral-400 dark:text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700" />
              <Link href={crumb.url} className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                {crumb.name}
              </Link>
            </span>
          ))}
          <span className="flex items-center space-x-2">
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700" />
            <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px]" title={product.title}>
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

        {/* Real Verified Reviews System */}
        <ProductReviews
          productId={product.id}
          slug={product.slug}
          reviews={reviews}
          user={user}
          canReview={canReview}
          hasReviewed={hasReviewed}
          userReview={userReview}
        />
      </div>
    </div>
  );
}
