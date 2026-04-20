import { getProductBySlug } from '@/services/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';
import ImageGallery from '@/components/product/ImageGallery';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductReviews from '@/components/product/ProductReviews';
import { ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: product.seo_title || product.title,
    description: product.seo_description || product.short_description,
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

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Product Images */}
          <ImageGallery images={product.product_images} title={product.title} />

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-6 border-b border-primary-100 dark:border-white/10 pb-6">
              <span className="text-sm font-semibold text-accent mb-2 block">{product.brand || 'Fyxen'}</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary-900 dark:text-white">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-primary-900 dark:text-white">₹{product.price}</span>
                {product.compare_at_price > product.price && (
                  <span className="text-lg text-primary-400 line-through">₹{product.compare_at_price}</span>
                )}
              </div>

              <div className="mb-6">
                {product.shipping_price > 0 ? (
                  <span className="text-sm font-medium text-primary-500 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Shipping: ₹{product.shipping_price}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Zero Shipping Charges
                  </span>
                )}
              </div>
              
              <p className="text-primary-600 dark:text-primary-300 text-lg leading-relaxed">
                {product.short_description || product.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-primary-900 dark:text-white">Availability:</span>
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                )}
              </div>
              
              {/* Variants (if applicable) */}
              {product.product_variants?.length > 0 && (
                <div className="mb-6">
                  <span className="block font-medium mb-2">Select Variant:</span>
                  <div className="flex gap-2 flex-wrap">
                    {product.product_variants.map(v => (
                      <button key={v.id} className="px-4 py-2 border border-primary-200 rounded-md hover:border-primary-900 focus:ring-2 focus:ring-primary-900 outline-none">
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-4 text-primary-700 dark:text-primary-300">
                <Truck className="w-5 h-5 text-accent" />
                <span className="text-sm">Fast Shipping across India</span>
              </div>
              <div className="flex items-center gap-4 text-primary-700 dark:text-primary-300">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-sm">1 Year Premium Warranty</span>
              </div>
              <div className="flex items-center gap-4 text-primary-700 dark:text-primary-300">
                <RotateCcw className="w-5 h-5 text-accent" />
                <span className="text-sm">15-Day Hassle-Free Returns</span>
              </div>
            </div>

            {/* Dynamic Product Highlights */}
            <ProductHighlights highlights={product.highlights} />

            {/* Full Description */}
            <div className="mt-8 prose prose-primary dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <div className="text-primary-600 dark:text-primary-300 whitespace-pre-wrap leading-loose">
                {product.description}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews System */}
        <ProductReviews productId={product.id} reviews={product.reviews || []} user={user} />
      </div>
    </div>
  );
}
