"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon, ArrowRight } from 'lucide-react';

export default function CategoryShowcase({ categories }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) return null;

  const [hero, ...rest] = categories;

  return (
    <section className="py-20 md:py-28 bg-primary-50 dark:bg-primary-950/40 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4">
          <div>
            <span className="section-label">Collections</span>
            <h2 className="text-3xl md:text-5xl font-black text-primary-900 dark:text-white tracking-tighter mt-1">
              Shop by <span className="text-accent">Category</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile scroll arrows */}
            <div className="flex md:hidden gap-2">
              <button onClick={() => scroll('left')} className="p-2.5 rounded-full border border-primary-200 dark:border-primary-800 hover:bg-white dark:hover:bg-primary-800 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll('right')} className="p-2.5 rounded-full border border-primary-200 dark:border-primary-800 hover:bg-white dark:hover:bg-primary-800 transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-accent dark:hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Desktop: Masonry Grid */}
        <div className="hidden md:grid grid-cols-3 gap-5 auto-rows-[280px]">
          {/* Hero tile — spans 2 rows */}
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-1 row-span-2"
            >
              <CategoryTile category={hero} large />
            </motion.div>
          )}

          {/* Remaining tiles */}
          {rest.slice(0, 4).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <CategoryTile category={cat} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex md:hidden overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {categories.map((cat) => (
            <div key={cat.id} className="flex-shrink-0 w-[240px] snap-center">
              <div className="h-[300px]">
                <CategoryTile category={cat} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ category, large }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block w-full h-full overflow-hidden rounded-2xl bg-primary-200 dark:bg-primary-800"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-108"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-400">
          <ImageIcon className="w-10 h-10 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
        </div>
      )}

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/20 to-transparent transition-opacity duration-500 group-hover:from-primary-950/90" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <h3 className={`font-black text-white tracking-tight uppercase group-hover:text-accent transition-colors duration-300 ${large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
          {category.name}
        </h3>
        <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Shop Now <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
