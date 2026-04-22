"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CategoryShowcase({ categories }) {
  // Fallback categories if none are provided or database is empty
  const displayCategories = categories?.length > 0 ? categories.slice(0, 3) : [
    { name: 'Lifestyle', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop' },
    { name: 'Essentials', slug: 'essentials', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-16 px-4">
          <h2 className="text-2xl md:text-5xl font-black text-primary-900 dark:text-white mb-4 uppercase tracking-tighter">
            Browse by <span className="text-accent">Category</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[300px] md:h-[450px] overflow-hidden rounded-2xl cursor-pointer"
            >
              <Link href={`/category/${category.slug}`} className="block w-full h-full">
                <Image
                  src={category.image_url || category.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{category.name}</h3>
                  <p className="text-primary-200 text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    Explore Collection →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
