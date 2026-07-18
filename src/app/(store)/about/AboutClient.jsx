'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Award, ShieldCheck, Zap, UserCheck, CheckCircle, ArrowRight } from 'lucide-react';

// Scroll fade-up wrapper
function FadeIn({ children, delay = 0, y = 30 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Counting up indicator
function Counter({ value, suffix = "", delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    // Add delay before animation starts
    const timeout = setTimeout(() => {
      let start = 0;
      const end = parseInt(value, 10);
      if (isNaN(end) || end === 0) {
        setCount(value);
        return;
      }
      const duration = 1500; // ms
      const increment = end / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutClient({ productCount, parentCompany, gstNumber }) {
  // Force dark mode on mount, restore on unmount
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.add('dark');

    // Force background color for the document body during visit
    const originalBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#000000';

    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme !== 'dark' && !wasDark) {
        root.classList.remove('dark');
      }
    };
  }, []);

  const displayCompany = parentCompany || 'Bytread International Pvt. Ltd.';

  return (
    <div className="bg-[#000000] text-[#FFFFFF] min-h-screen font-sans overflow-hidden selection:bg-white selection:text-black">
      {/* ── SECTION 1: HERO (Full Screen) ── */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="space-y-8 max-w-3xl z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6"
          >
            <img 
              src="/logo.png" 
              alt="Fyxen Logo" 
              className="h-16 md:h-24 w-auto object-contain brightness-0 invert" 
            />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8 text-white font-black tracking-tighter leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            More Than a Store.
          </motion.h1>

          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-[#A8A8A8] font-light leading-relaxed">
              We believe shopping should be simple, premium, and trustworthy.
            </p>
            <p className="text-sm md:text-base text-[#888888] font-medium tracking-wide leading-relaxed">
              A carefully curated collection of products designed to make everyday life better.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-xs tracking-widest font-bold uppercase flex flex-col items-center gap-2"
        >
          <span>Scroll</span>
          <div className="w-[1px] h-8 bg-white" />
        </motion.div>
      </section>

      {/* ── SECTION 2: WHO WE ARE ── */}
      <section className="py-24 md:py-32 border-b border-white/5 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <FadeIn>
            <p className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-4">Who We Are</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-10">
              About FYXEN
            </h2>
          </FadeIn>

          <div className="space-y-8 text-lg md:text-xl text-[#A8A8A8] leading-relaxed font-light">
            <FadeIn delay={0.1}>
              <p>
                FYXEN was created with one simple goal: to build an online shopping experience that values quality, transparency, and customer satisfaction above everything else.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>
                Instead of overwhelming customers with countless choices, we carefully select products that are practical, reliable, and worth owning.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p>
                Every product listed on FYXEN is chosen with attention to quality, usability, and value, helping customers shop with confidence.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: MISSION ── */}
      <section className="py-28 md:py-36 bg-[#000000] border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-xs font-bold text-[#A8A8A8] uppercase tracking-[0.3em] mb-6">Our Mission</p>
            <p className="text-3xl md:text-5xl font-extralight text-white leading-snug tracking-wide max-w-3xl mx-auto">
              "To make premium everyday products accessible through a shopping experience that is <span className="font-bold text-[#FFFFFF]">simple, secure, and customer-focused</span>."
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 4: VALUES ── */}
      <section className="py-24 md:py-32 bg-[#050505] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-[#A8A8A8] uppercase tracking-[0.3em] mb-4">How We Operate</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Our Values</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6 text-white" />,
                title: 'Quality',
                desc: 'Every product is selected with care.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-white" />,
                title: 'Trust',
                desc: 'Transparent pricing. Secure payments. Honest policies.',
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                title: 'Innovation',
                desc: 'Continuously improving the shopping experience.',
              },
              {
                icon: <UserCheck className="w-6 h-6 text-white" />,
                title: 'Customer First',
                desc: 'Every decision begins with the customer.',
              },
            ].map((value, i) => (
              <FadeIn key={value.title} delay={i * 0.15}>
                <div className="bg-[#111111] border border-white/5 p-8 rounded-2xl h-full flex flex-col justify-between hover:border-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-[#A8A8A8] leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHY FYXEN? (Split Layout) ── */}
      <section className="py-24 md:py-32 bg-[#000000] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Lifestyle Image */}
            <FadeIn>
              <div className="overflow-hidden rounded-2xl border border-white/10 aspect-video md:aspect-[4/3]">
                <motion.img 
                  src="/about_lifestyle.png" 
                  alt="Premium Lifestyle" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </FadeIn>

            {/* Right: Why Choose Us */}
            <div className="space-y-8">
              <FadeIn>
                <p className="text-xs font-bold text-[#A8A8A8] uppercase tracking-[0.3em] mb-4">Why FYXEN?</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                  Why customers choose FYXEN
                </h2>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Carefully selected products',
                  'Secure online payments',
                  'Fast order processing',
                  'Responsive customer support',
                  'Transparent policies',
                  'Growing product collection',
                ].map((item, i) => (
                  <FadeIn key={item} delay={i * 0.08}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-[#A8A8A8]">{item}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: NUMBERS (Counters) ── */}
      <section className="py-24 md:py-32 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-xs font-bold text-[#A8A8A8] uppercase tracking-[0.3em] mb-4">Our Growth</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-16">
              Growing Every Day
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: productCount > 0 ? productCount : 15,
                suffix: '+',
                label: 'Products',
              },
              {
                value: 100,
                suffix: '%',
                label: 'Secure Payments',
              },
              {
                value: 7,
                suffix: ' Days',
                label: 'Return Policy',
              },
              {
                value: 24,
                suffix: '/7',
                label: 'Support',
              },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="space-y-2">
                  <p className="text-4xl md:text-6xl font-black text-white tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix} delay={i * 0.15} />
                  </p>
                  <p className="text-xs md:text-sm font-bold text-[#A8A8A8] uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6.5: OUR PROMISE TO YOU ── */}
      <section className="py-24 md:py-32 bg-[#000000] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="border-l-2 border-white pl-8 md:pl-12 space-y-6">
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white">
                Our Promise to You
              </h3>
              <p className="text-lg md:text-xl text-[#A8A8A8] leading-relaxed font-light">
                At FYXEN, every order is handled with care. We believe in transparent pricing, secure shopping, reliable support, and products that meet our quality standards. As we grow, our commitment remains the same: to deliver an experience you can trust.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 7: PROMISE QUOTE ── */}
      <section className="py-28 md:py-36 bg-[#050505] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <blockquote className="space-y-6">
              <p className="text-2xl md:text-4xl font-extralight italic text-[#A8A8A8] leading-relaxed">
                "We don't aim to be the biggest online store."
              </p>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tight">
                We aim to be the one customers trust.
              </p>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 8: COMPANY INFO ── */}
      <section className="py-24 md:py-32 bg-[#000000] border-b border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              FYXEN
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-2xl mx-auto border-t border-b border-white/10 py-10">
            <FadeIn>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Operated By</p>
                <p className="text-sm font-semibold text-white leading-snug">{displayCompany}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">GST Registered</p>
                <p className="text-sm font-semibold text-white">
                  {gstNumber ? gstNumber : 'Active Registry'}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Serving Area</p>
                <p className="text-sm font-semibold text-white">Serving customers across India.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 md:py-44 bg-[#050505] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 space-y-8 z-10 relative">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Ready to discover something new?
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex justify-center">
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-black font-bold text-base px-8 py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
