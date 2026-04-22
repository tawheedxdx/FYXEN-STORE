"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-12">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-accent rounded-3xl overflow-hidden px-8 py-16 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-900/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <div className="relative z-10 text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-primary-900 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 leading-tight">
              Summer Collection <br className="hidden md:block"/> Now <span className="text-white">Live.</span>
            </h2>
            <p className="text-primary-800 font-medium text-lg max-w-md opacity-80">
              Get up to 20% off on your first order. Use code <span className="font-bold border-b-2 border-primary-900">FYXEN20</span> at checkout.
            </p>
          </div>

          <div className="relative z-10">
            <Link 
              href="/shop" 
              className="group bg-primary-900 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Shop the Drop
              <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
