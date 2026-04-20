"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full bg-primary-900 flex items-center justify-center overflow-hidden">
      {/* Placeholder for Hero Image Background */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
      
      <div className="relative z-10 container-custom text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Redefine Your <br/> <span className="text-accent italic font-light">Everyday.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-primary-200 max-w-2xl mx-auto mb-10"
        >
          Discover our exclusive collection of premium essentials. Crafted with precision for those who appreciate the uncompromising quality of Fyxen.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/shop" className="btn-primary w-full sm:w-auto text-base px-8 py-4">
            Explore Collection
          </Link>
          <Link href="/category/new-arrivals" className="btn-outline border-white text-white hover:bg-white hover:text-primary-900 w-full sm:w-auto text-base px-8 py-4">
            New Arrivals
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
