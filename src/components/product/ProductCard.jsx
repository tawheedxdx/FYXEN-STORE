import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { Gift } from 'lucide-react';

export default function ProductCard({ product, offers = [] }) {
  const images = product.product_images || [];
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primaryImage = sortedImages[0]?.image_url || product.image_url || null;
  const secondaryImage = sortedImages[1]?.image_url || null;

  const discount = product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const productOffers = offers.filter(offer => {
    const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
    return isSiteWide || offer.eligible_product_ids.includes(product.id);
  });

  return (
    <div className="group flex flex-col w-full">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full bg-primary-100 dark:bg-primary-900 rounded-xl overflow-hidden mb-3">
          {/* Offer Badges */}
          {productOffers.length > 0 && (
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
              {productOffers.slice(0, 1).map(o => (
                <span key={o.id} className="inline-flex items-center gap-1 bg-accent text-white px-2 py-1 text-[9px] font-bold uppercase rounded-md tracking-wider shadow-md">
                  <Gift className="w-3.5 h-3.5" /> Offer
                </span>
              ))}
            </div>
          )}

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

      {/* Add to Cart or Select Options Button */}
      {product.product_variants && product.product_variants.length > 0 ? (
        <Link 
          href={`/product/${product.slug}`} 
          className="w-full h-11 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-center text-primary-900 border border-primary-300 rounded-lg hover:bg-primary-50 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors"
        >
          Select Options
        </Link>
      ) : (
        <AddToCartButton
          productId={product.id}
          stockQuantity={product.stock_quantity}
        />
      )}
    </div>
  );
}
