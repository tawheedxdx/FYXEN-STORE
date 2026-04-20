import { getProductBySlug } from '@/services/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import ImageGallery from '@/components/product/ImageGallery';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

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

  if (!product) {
    notFound();
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Images */}
        <ImageGallery images={product.product_images} title={product.title} />

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-primary-100 dark:border-white/10 pb-6">
            <span className="text-sm font-semibold text-accent mb-2 block">{product.brand || 'Fyxen'}</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary-900 dark:text-white">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-primary-900 dark:text-white">₹{product.price}</span>
              {product.compare_at_price > product.price && (
                <span className="text-lg text-primary-400 line-through">₹{product.compare_at_price}</span>
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

            <AddToCartButton product={product} />
          </div>

          {/* Trust Highlights */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-4 text-primary-700 dark:text-primary-300">
              <Truck className="w-5 h-5 text-accent" />
              <span className="text-sm">Free Express Shipping on orders over ₹2000</span>
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

          {/* Full Description Accordion (Mocked for now) */}
          <div className="mt-8 prose prose-primary dark:prose-invert">
            <h3>Details & Care</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
