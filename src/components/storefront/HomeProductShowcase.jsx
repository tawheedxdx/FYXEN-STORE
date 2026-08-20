'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Award, Gift, Zap } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

export default function HomeProductShowcase({ featuredProducts = [], bestSellers = [], offers = [] }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Curated', icon: Sparkles },
    { id: 'best', label: 'Best Sellers', icon: Award },
    { id: 'featured', label: 'Signature Drops', icon: Zap },
    { id: 'offers', label: 'Special Deals', icon: Gift },
  ];

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'best':
        return bestSellers.length > 0 ? bestSellers : featuredProducts;
      case 'featured':
        return featuredProducts.filter(p => p.featured || p.is_new_arrival);
      case 'offers':
        return featuredProducts.filter(p => p.compare_at_price > p.price || p.is_on_sale);
      case 'all':
      default:
        // Combine without duplicates
        const map = new Map();
        [...featuredProducts, ...bestSellers].forEach(p => map.set(p.id, p));
        return Array.from(map.values());
    }
  };

  const displayProducts = getFilteredProducts().slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#09090b] border-b border-neutral-100 dark:border-neutral-900">
      <div className="container-custom">
        {/* Header with Title & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6a87c] block">
              Handpicked Essentials
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              Featured <span className="font-light italic text-neutral-500 dark:text-neutral-400">Collection</span>
            </h2>
            <p className="text-sm text-neutral-500 max-w-md">
              Explore our most popular utilities designed to simplify and elevate your daily routine.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#c6a87c]' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid with Smooth Animation */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} offers={offers} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Catalog Link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors group"
          >
            Explore All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
