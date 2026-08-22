import Link from 'next/link';
import { ShieldCheck, Sparkles, Truck, RotateCcw, ArrowRight, Layers, Cpu, HeartHandshake } from 'lucide-react';
import CurvedSectionDivider from '@/components/common/CurvedSectionDivider';

export default function BrandBentoGrid() {
  return (
    <section className="relative overflow-hidden w-full bg-white dark:bg-[#09090b]">
      {/* Top Symmetrical Concave Curve */}
      <CurvedSectionDivider variant="top-concave" />

      {/* Main Immersive Section Body */}
      <div className="py-16 md:py-24 bg-neutral-950 text-white relative overflow-hidden">
        {/* Ambient Radial Luxury Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,168,124,0.09)_0%,transparent_70%)] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#c6a87c] block">
              The FYXEN Standard
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Designed for Modern Living. <br />
              <span className="font-light italic text-neutral-400">Built to Last.</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed max-w-xl mx-auto">
              We strip away unnecessary complexity to create everyday utilities that perform flawlessly and look exceptional in your space.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Large Feature (Spans 2 columns on desktop) */}
            <div className="md:col-span-2 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#c6a87c]/40 p-8 md:p-10 flex flex-col justify-between shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#c6a87c]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 max-w-lg relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#c6a87c] border border-white/10 flex items-center justify-center font-bold">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c6a87c] block">
                  Engineering & Materials
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Premium Construction Without Compromise
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  From aircraft-grade aluminum alloy to food-safe BPA-free polymers and high-efficiency lithium cells, every FYXEN product is built to survive rigorous daily use.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 mt-8 relative z-10 text-xs">
                <div>
                  <p className="font-black text-lg text-white">100%</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Tested for Quality</p>
                </div>
                <div>
                  <p className="font-black text-lg text-white">1 Year</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Standard Warranty</p>
                </div>
                <div>
                  <p className="font-black text-lg text-white">Pan-India</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Insured Transit</p>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Thoughtful Ergonomics */}
            <div className="rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#c6a87c]/40 p-8 flex flex-col justify-between shadow-xl transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#c6a87c] border border-white/10 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c6a87c] block">
                  Ergonomics
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Designed for Everyday Utility
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Tactile buttons, leak-proof seals, and intuitive controls crafted to fit seamlessly into modern Indian lifestyles.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <span className="text-xs font-bold text-[#c6a87c] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Tested in real households
                </span>
              </div>
            </div>

            {/* Bento Card 3: 7-Day Replacement Guarantee */}
            <div className="rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#c6a87c]/40 p-8 flex flex-col justify-between shadow-xl transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
                  Buyer Protection
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  7-Day Hassle-Free Returns
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Not 100% satisfied? Enjoy an easy return or replacement process with prompt door-step pickup.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link href="/cancellation-refunds" className="text-xs font-bold text-white hover:text-[#c6a87c] flex items-center gap-1.5 transition-colors">
                  Read Return Policy <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Direct-to-Consumer Value (Spans 2 columns on desktop) */}
            <div className="md:col-span-2 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#c6a87c]/40 p-8 md:p-10 flex flex-col justify-between shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="space-y-4 max-w-lg">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#c6a87c] border border-white/10 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c6a87c] block">
                  Direct to Consumer
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Authentic Quality, Honest Pricing
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  By delivering direct from our manufacturing partners to your doorstep, we eliminate multi-tier distributor markups to offer premium luxury quality at fair prices.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Operated by Bytread International Private Limited</span>
                </div>
                <Link
                  href="/about"
                  className="text-xs font-bold text-white hover:text-[#c6a87c] flex items-center gap-1 transition-colors"
                >
                  Learn More About Us <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Symmetrical Concave Curve */}
      <CurvedSectionDivider variant="bottom-concave" />
    </section>
  );
}
