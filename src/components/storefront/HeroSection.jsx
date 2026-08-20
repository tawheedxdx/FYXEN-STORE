"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';

export default function HeroSection({ featuredProduct }) {
  const currentYear = new Date().getFullYear();

  return (
    <section className="relative w-full bg-white dark:bg-[#09090b] pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-neutral-100 dark:border-neutral-900">
      {/* Ambient background light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[900px] h-[400px] bg-gradient-to-tr from-[#c6a87c]/10 via-[#d4af37]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
            
            {/* Top Tag & Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-[#c6a87c]" /> Season {currentYear}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100/80 dark:bg-neutral-900/80 px-3 py-1 rounded-full border border-black/5 dark:border-white/5">
                <div className="flex text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <span>4.9 / 5</span>
                <span className="text-neutral-400">&bull; 2,500+ Indian Homes</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.02]"
            >
              Engineered for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-[#c6a87c] dark:from-white dark:via-neutral-300 dark:to-[#c6a87c] bg-clip-text text-transparent">
                Modern Living.
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed font-light"
            >
              Discover high-craft home, kitchen, and everyday utility products. Thoughtfully engineered with premium materials, refined minimalism, and lasting durability.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto justify-center lg:justify-start pt-2"
            >
              <Link
                href="/shop"
                className="btn-primary w-full sm:w-auto px-8 py-4 text-sm font-bold shadow-lg shadow-black/10 flex items-center justify-center gap-2 rounded-xl group"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/category/best-sellers"
                className="btn-outline w-full sm:w-auto px-7 py-4 text-sm font-bold rounded-xl flex items-center justify-center gap-2"
              >
                Best Sellers <Award className="w-4 h-4 text-[#c6a87c]" />
              </Link>
            </motion.div>

            {/* Key Quality Guarantees */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-850 w-full max-w-lg text-left"
            >
              <div>
                <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 100% Genuine
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Strict quality testing</p>
              </div>
              <div>
                <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#c6a87c]" /> Fast Dispatch
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Dispatched in 24 hours</p>
              </div>
              <div>
                <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> 7-Day Returns
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Zero questions asked</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Spotlight Card */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-md relative"
            >
              {/* Product Hero Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 p-6 md:p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl overflow-hidden group">
                
                {/* Floating Highlight Badges */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="badge-luxury bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    FYXEN Signature Drop
                  </span>
                </div>

                {/* Lifestyle Image Frame */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mt-6 mb-6 bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 flex items-center justify-center">
                  <Image
                    src="/about_lifestyle.png"
                    alt="FYXEN Signature Essentials"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Spec Pills */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] text-white font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                      ⚡ Precision Crafted
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                      🛡️ 1-Year Warranty
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#c6a87c]">Curated Spotlight</p>
                      <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                        Smart Home &amp; Kitchen Utility
                      </h3>
                    </div>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      In Stock
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                    Ergonomically designed for daily performance. Made from food-grade &amp; durable materials.
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href="/shop"
                      className="text-xs font-bold text-neutral-950 dark:text-white hover:text-[#c6a87c] dark:hover:text-[#c6a87c] flex items-center gap-1.5 transition-colors"
                    >
                      Shop Featured Range <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] text-neutral-400">
                      Free Shipping Available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
