"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';

const stats = [
  { value: '2K+', label: 'Orders Delivered' },
  { value: '500+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-primary-950 flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2400&auto=format&fit=crop"
          alt="Fyxen Premium Store"
          fill
          priority
          className="object-cover opacity-25"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/80 to-primary-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />
      </div>

      {/* Decorative accent orb */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container-custom w-full py-24 md:py-0">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-8"
          >
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Premium Collection 2025</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-[0.88] mb-6"
          >
            FYXEN<br />
            <span className="text-accent">CORE.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-xl text-primary-300 max-w-xl mb-10 leading-relaxed font-light"
          >
            Uncompromising quality for the modern pioneer. Discover essentials engineered for those who refuse to settle.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-accent text-primary-900 px-8 py-4 rounded-xl font-bold text-base hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore Shop
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/category/new-arrivals"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              New Arrivals
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-8 pt-8 border-t border-white/10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-white">{stat.value}</span>
                <span className="text-xs text-primary-400 uppercase tracking-wider mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-accent rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
