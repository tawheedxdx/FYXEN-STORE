'use client';

import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { Gift, Star } from 'lucide-react';

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
    <div className="group flex flex-col w-full bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 p-3 sm:p-3.5 transition-all duration-300 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700">
      {/* Image Container with 4:5 Aspect Ratio */}
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-[4/5] w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden mb-3">
          {/* Top-Left: Offer & Discount Badges */}
          <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 pointer-events-none">
            {discount > 0 && (
              <span className="badge-sale px-2.5 py-1 text-[10px] font-black uppercase rounded-lg shadow-sm">
                {discount}% OFF
              </span>
            )}
            {productOffers.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#c6a87c] text-white px-2 py-0.5 text-[9px] font-bold uppercase rounded-md shadow-sm">
                <Gift className="w-3 h-3" /> Offer
              </span>
            )}
          </div>

          {/* Top-Right: Stock & Featured Tag */}
          <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
            {product.is_best_seller && (
              <span className="badge-best px-2 py-0.5 text-[9px] font-black uppercase rounded-md shadow-sm">
                Best Seller
              </span>
            )}
            {product.is_new_arrival && !product.is_best_seller && (
              <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-0.5 text-[9px] font-black uppercase rounded-md shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Primary Image */}
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-700 ${
                secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
              }`}
              priority={product.featured}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-bold text-sm">
              FYXEN
            </div>
          )}

          {/* Secondary Image (Hover Crossfade) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.title} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1 mb-3 px-1">
          {/* Brand & Ratings */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-[10px]">
              {product.brand || 'FYXEN'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-[#c6a87c] transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-black text-base sm:text-lg text-neutral-950 dark:text-white">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.compare_at_price > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Button */}
      <div className="mt-auto pt-1">
        {product.product_variants && product.product_variants.length > 0 ? (
          <Link
            href={`/product/${product.slug}`}
            className="w-full h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
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
    </div>
  );
}
