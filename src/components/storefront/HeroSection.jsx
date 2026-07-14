"use client";

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  const currentYear = new Date().getFullYear();
  return (
    <section className="relative w-full bg-white dark:bg-black py-16 md:py-24 flex items-center justify-center border-b border-primary-100 dark:border-white/5">
      <div className="container-custom w-full max-w-4xl text-center flex flex-col items-center">
        
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-6">
          New Season — {currentYear} Collection
        </p>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.95] mb-8">
          The <span className="italic font-light">Premium</span> Standard.
        </h1>
        
        <p className="text-base md:text-lg text-primary-500 dark:text-primary-400 max-w-2xl mb-10 leading-relaxed">
          Elevating everyday living with premium essentials — crafted for those who appreciate the finer details.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary-900 dark:bg-white text-white dark:text-primary-900 px-8 py-4 rounded-full font-bold text-sm hover:bg-primary-700 dark:hover:bg-gray-100 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Discover Now
          </Link>
          <Link
            href="/category/new-arrivals"
            className="inline-flex items-center gap-2 text-primary-900 dark:text-white font-semibold text-sm px-8 py-4 rounded-full border border-primary-200 dark:border-white/20 hover:bg-primary-50 dark:hover:bg-white/10 transition-all"
          >
            New Arrivals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
