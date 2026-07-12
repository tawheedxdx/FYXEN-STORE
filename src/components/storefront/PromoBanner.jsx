"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function PromoBanner({ banner }) {
  if (!banner) return null;

  return (
    <section className="py-12">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ backgroundColor: banner.bg_color }}
          className="relative rounded-3xl overflow-hidden px-6 py-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-900/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <div className="relative z-10 text-center md:text-left" style={{ color: banner.text_color }}>
            <span 
              style={{ backgroundColor: banner.text_color, color: banner.bg_color }}
              className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3"
            >
              {banner.badge_text}
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              {banner.title}
            </h2>
            <p className="font-medium text-base md:text-lg max-w-md opacity-80">
              {banner.subtitle}
            </p>
          </div>

          <div className="relative z-10">
            <Link 
              href={banner.button_link} 
              style={{ backgroundColor: banner.text_color, color: banner.bg_color }}
              className="group px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:opacity-90 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {banner.button_text}
              <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
