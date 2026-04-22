"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full bg-primary-900 flex items-center justify-center overflow-hidden">
      {/* Hero Image Background with high-quality tech/lifestyle image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Essentials"
          fill
          priority
          className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 via-primary-900/80 to-primary-900"></div>
      </div>
      
      <div className="relative z-10 container-custom text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="inline-block px-4 py-1.5 bg-accent/20 border border-accent/30 rounded-full text-accent text-sm font-bold uppercase tracking-[0.2em] mb-8"
        >
          Established 2024
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]"
        >
          FYXEN <br/> <span className="text-accent">CORE.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-primary-200 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          Uncompromising quality for the modern pioneer. Discover essentials engineered for excellence.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/shop" className="group bg-accent text-primary-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white transition-all shadow-[0_0_40px_rgba(224,255,0,0.3)] hover:shadow-[0_0_60px_rgba(224,255,0,0.5)] transform hover:-translate-y-1">
            EXPLORE SHOP
          </Link>
          <Link href="/category/new-arrivals" className="px-10 py-5 border-2 border-white/20 rounded-2xl font-black text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            NEW ARRIVALS
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
