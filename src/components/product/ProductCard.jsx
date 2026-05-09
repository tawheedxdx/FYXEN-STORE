import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const images = product.product_images || [];
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primaryImage = sortedImages[0]?.image_url || product.image_url || null;
  const secondaryImage = sortedImages[1]?.image_url || null;

  const discount = product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block w-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-primary-100 dark:bg-primary-900 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
        {/* Primary Image */}
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 ${secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
            priority={product.featured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary-300 font-semibold text-sm">
            Fyxen
          </div>
        )}

        {/* Secondary Image (hover reveal) */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.title} - alternate`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.promo_tag && (
            <span className="badge badge-promo">{product.promo_tag}</span>
          )}
          {discount > 0 && (
            <span className="badge badge-sale">{discount}% OFF</span>
          )}
          {product.featured && !product.promo_tag && (
            <span className="badge badge-featured">Featured</span>
          )}
        </div>

        {/* Hover Overlay CTA */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 p-4">
          <div className="flex items-center justify-center gap-2 bg-primary-900/95 dark:bg-white/95 text-white dark:text-primary-900 py-3 px-4 rounded-xl font-bold text-sm backdrop-blur-sm">
            <Eye className="w-4 h-4" />
            Quick View
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1 px-1">
        {/* Brand */}
        <p className="text-[11px] font-bold text-primary-400 uppercase tracking-wider">{product.brand || 'Fyxen'}</p>

        {/* Title */}
        <h3 className="font-semibold text-primary-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {product.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-bold text-base text-primary-900 dark:text-white">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.compare_at_price > product.price && (
            <span className="text-sm text-primary-400 line-through">
              ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
            </span>
          )}
          {product.tax_rate > 0 && (
            <span className="text-[10px] text-primary-400 font-medium">+GST</span>
          )}
        </div>
      </div>
    </Link>
  );
}
