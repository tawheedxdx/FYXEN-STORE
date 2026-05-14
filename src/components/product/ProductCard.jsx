import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }) {
  const images = product.product_images || [];
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primaryImage = sortedImages[0]?.image_url || product.image_url || null;
  const secondaryImage = sortedImages[1]?.image_url || null;

  const discount = product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="group flex flex-col w-full">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full bg-primary-100 dark:bg-primary-900 rounded-xl overflow-hidden mb-3">
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
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
            {product.promo_tag && (
              <span className="badge badge-promo">{product.promo_tag}</span>
            )}
            {(discount > 0 || product.is_on_sale) && (
              <span className="badge badge-sale">{discount > 0 ? `${discount}% OFF` : 'SALE'}</span>
            )}
            {product.is_best_seller && (
              <span className="badge badge-best">Best Seller</span>
            )}
            {product.is_new_arrival && (
              <span className="badge badge-new">New</span>
            )}
            {product.featured && !product.promo_tag && !product.is_best_seller && !product.is_new_arrival && (
              <span className="badge badge-featured">Featured</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-2.5 px-0.5">
          <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-0.5">{product.brand || 'Fyxen'}</p>
          <h3 className="font-semibold text-primary-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-sm text-primary-900 dark:text-white">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.compare_at_price > product.price && (
              <span className="text-xs text-primary-400 line-through">
                ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <AddToCartButton
        productId={product.id}
        stockQuantity={product.stock_quantity}
      />
    </div>
  );
}
