"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

export default function CategoryShowcase({ categories }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-black overflow-hidden">
      <div className="container-custom relative">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-20 px-4 gap-6">
          <div className="text-center md:text-left">
            <span className="text-accent font-black tracking-[0.2em] uppercase text-xs md:text-sm mb-4 block">Collections</span>
            <h2 className="text-3xl md:text-6xl font-black text-primary-900 dark:text-white uppercase tracking-tighter">
              Shop by <span className="text-primary-400">Category</span>
            </h2>
          </div>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-4 rounded-full border border-primary-100 hover:bg-primary-900 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-4 rounded-full border border-primary-100 hover:bg-primary-900 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-8 pb-8 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] md:w-[400px] snap-center"
            >
              <Link href={`/category/${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-primary-50">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-200">
                    <ImageIcon className="w-12 h-12 mb-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-accent transition-colors uppercase tracking-tighter">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                    <span className="text-sm font-bold uppercase tracking-widest">Explore Collection</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
