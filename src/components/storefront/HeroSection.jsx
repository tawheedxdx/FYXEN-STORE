"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  const currentYear = new Date().getFullYear();
  return (
    <section className="relative w-full bg-white dark:bg-black overflow-hidden min-h-[80vh] md:min-h-screen flex items-center">
      <div className="container-custom w-full py-16 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center min-h-[80vh] md:min-h-screen">
          
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center py-16 md:py-24 order-2 md:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-6">
              New Season — {currentYear} Collection
            </p>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-primary-900 dark:text-white leading-[0.9] mb-8">
              The<br />
              <span className="italic font-light">Premium</span><br />
              Standard.
            </h1>
            <p className="text-base md:text-lg text-primary-500 dark:text-primary-400 max-w-md mb-10 leading-relaxed">
              Elevating everyday living with premium essentials — crafted for those who appreciate the finer details.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
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

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-primary-100 dark:border-white/10">
              {[
                { num: '2K+', label: 'Orders Shipped' },
                { num: '500+', label: 'Happy Customers' },
                { num: '4.9★', label: 'Rating' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-black text-primary-900 dark:text-white">{s.num}</p>
                  <p className="text-[11px] text-primary-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-[50vw] md:h-screen max-h-screen order-1 md:order-2 overflow-hidden rounded-3xl md:rounded-none md:rounded-bl-[4rem]">
            <Image
              src="https://zwqrkassfbesjfakiybh.supabase.co/storage/v1/object/public/category-images/smart-lifestyle-1778601006873.png"
              alt="Fyxen Premium Collection"
              fill
              priority
              className="object-cover"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-black/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-1">Just Landed</p>
              <p className="text-sm font-black text-primary-900 dark:text-white">New Arrivals {currentYear}</p>
              <Link href="/category/new-arrivals" className="text-xs text-primary-500 hover:text-primary-900 dark:hover:text-white transition-colors flex items-center gap-1 mt-1">
                Shop Now <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
