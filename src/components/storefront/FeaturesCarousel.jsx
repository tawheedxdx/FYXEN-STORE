"use client";

import { useRef } from 'react';
import { Trophy, Zap, Star, ShieldCheck, Clock, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Trophy,
    title: "Premium Quality",
    description: "Uncompromising materials and craftsmanship in every release."
  },
  {
    icon: Zap,
    title: "Express Delivery",
    description: "Fast, reliable delivery nationwide by our premium partners."
  },
  {
    icon: Star,
    title: "VIP Support",
    description: "Dedicated concierge service for a seamless experience."
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% secure payment processing with encrypted transactions."
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description: "Round-the-clock assistance for all your premium needs."
  },
  {
    icon: Truck,
    title: "Tracked Shipping",
    description: "Real-time updates on your order journey from our hub."
  }
];

export default function FeaturesCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - (clientWidth * 0.8) : scrollLeft + (clientWidth * 0.8);
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black relative z-20 -mt-10 rounded-t-[2.5rem] md:rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="container-custom px-4 relative">
        <div className="flex justify-between items-end mb-10 px-4">
          <div className="text-left">
            <span className="text-accent font-black tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 block">Our Promise</span>
            <h2 className="text-2xl md:text-4xl font-black text-primary-900 dark:text-white uppercase tracking-tighter">
              Why <span className="text-primary-400">Fyxen?</span>
            </h2>
          </div>
          
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-primary-100 dark:border-white/10 hover:bg-primary-900 hover:text-white dark:hover:bg-white dark:hover:text-primary-900 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-primary-100 dark:border-white/10 hover:bg-primary-900 hover:text-white dark:hover:bg-white dark:hover:text-primary-900 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-12 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[260px] md:w-[320px] snap-center"
            >
              <div className="flex flex-col items-center p-8 md:p-10 bg-primary-50/50 dark:bg-white/[0.03] rounded-[2rem] border border-primary-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-900/5 transition-all text-center h-full">
                <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-primary-900 dark:text-accent group-hover:text-primary-900" />
                </div>
                <h3 className="font-black text-lg md:text-xl mb-3 uppercase tracking-tight text-primary-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-primary-500 dark:text-primary-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile indicators */}
        <div className="flex md:hidden justify-center gap-1.5 -mt-4">
          {features.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-200 dark:bg-white/10" />
          ))}
        </div>
      </div>
    </section>
  );
}
