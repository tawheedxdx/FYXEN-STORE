"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  const currentYear = new Date().getFullYear();
  return (
    <section className="relative w-full bg-white dark:bg-[#09090b] py-16 lg:py-24 flex items-center border-b border-neutral-100 dark:border-neutral-900 overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neutral-100 dark:bg-neutral-900/20 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Content Column */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
              New Season — {currentYear} Collection
            </p>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.05]"
          >
            The <span className="italic font-light text-neutral-500 dark:text-neutral-400">Premium</span><br />
            Standard.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed font-light"
          >
            Elevating everyday living with premium essentials — crafted for those who appreciate the finer details and high-end aesthetics.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center lg:justify-start pt-4"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 dark:hover:opacity-90 transition-all shadow-lg shadow-neutral-900/10 dark:shadow-none cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Discover Now
            </Link>
            <Link
              href="/category/new-arrivals"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm px-8 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all cursor-pointer"
            >
              New Arrivals <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Illustration Column */}
        <div className="lg:col-span-5 flex justify-center items-center relative select-none">
          {/* Ambient Glow behind SVG */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-neutral-500/10 to-indigo-500/10 blur-3xl rounded-full opacity-60 dark:opacity-20 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-[360px] sm:max-w-[400px] lg:max-w-none relative z-10"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/home SVGS/Online shopping-rafiki.svg"
                alt="Fyxen Store Premium Collection"
                width={500}
                height={500}
                className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_15px_30px_rgba(255,255,255,0.01)]"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
