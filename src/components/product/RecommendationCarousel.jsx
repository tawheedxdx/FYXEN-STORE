"use client";

import ProductCard from './ProductCard';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RecommendationCarousel({ products = [], title = "You May Also Like" }) {
  const scrollContainerRef = useRef(null);

  if (products.length === 0) return null;

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="py-12 border-t border-primary-100 dark:border-white/10 mt-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-900 dark:text-white">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 border border-primary-200 dark:border-white/10 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors text-primary-900 dark:text-white cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 border border-primary-200 dark:border-white/10 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors text-primary-900 dark:text-white cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {products.map(product => (
          <div key={product.id} className="w-[240px] sm:w-[280px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
