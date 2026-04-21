import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const images = product.product_images || [];
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const imageUrl = sortedImages.length > 0 ? sortedImages[0].image_url : (product.image_url || null);

  return (
    <Link href={`/product/${product.slug}`} className="group cursor-pointer block w-full">
      <div className="relative aspect-[4/5] w-full bg-primary-100 dark:bg-primary-800 rounded-lg overflow-hidden mb-4 border border-primary-200 dark:border-white/5 shadow-sm group-hover:shadow-md transition-shadow">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={product.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={product.featured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary-300 dark:text-primary-600 font-medium">
            Fyxen
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.compare_at_price > product.price && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
          )}
          {product.featured && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs text-primary-500 mb-1">{product.brand || 'Fyxen'}</span>
        <h3 className="font-semibold text-primary-900 dark:text-white truncate group-hover:text-accent transition-colors">{product.title}</h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-primary-900 dark:text-white">₹{product.price}</span>
          {product.compare_at_price > product.price && (
            <span className="text-sm text-primary-400 line-through">₹{product.compare_at_price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
