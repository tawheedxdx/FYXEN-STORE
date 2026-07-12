"use client";

import { useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 bg-white/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-primary-200 dark:border-white/10">
        <p className="text-xl font-medium text-primary-400 uppercase tracking-widest">New drops arriving soon</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Navigation Buttons - Hidden on Mobile, Visible on Hover on Desktop */}
      <div className="hidden md:block">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white dark:bg-primary-900 border border-primary-100 dark:border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-primary-900 -translate-x-4 group-hover:translate-x-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white dark:bg-primary-900 border border-primary-100 dark:border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-primary-900 translate-x-4 group-hover:translate-x-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 md:gap-8 pb-12 px-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] snap-center"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
      
      {/* Mobile Swipe Indicator */}
      <div className="md:hidden flex justify-center gap-1 mt-2">
        {products.slice(0, 5).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-primary-300" />
        ))}
      </div>
    </div>
  );
}
