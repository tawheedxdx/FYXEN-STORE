import Link from 'next/link';
import { Briefcase, ArrowRight, Sparkles, HeartHandshake, Rocket } from 'lucide-react';

export const metadata = {
  title: 'Careers at FYXEN | Build the Future of Indian Premium Lifestyle',
  description: 'Join FYXEN (Bytread International Private Limited). Explore career opportunities, company culture, and open positions in India.',
  alternates: {
    canonical: '/careers',
  },
};

export default function CareersPage() {
  return (
    <div className="bg-white dark:bg-black text-neutral-900 dark:text-white min-h-screen py-16 md:py-24">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-900/10 dark:bg-white/10 text-primary-900 dark:text-white text-xs font-bold uppercase tracking-widest">
            Careers at FYXEN
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Build the Future of Everyday Utility
          </h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            FYXEN is operated by Bytread International Private Limited. We are a fast-growing Indian brand on a mission to simplify everyday living through premium quality and thoughtful design.
          </p>
        </div>

        {/* Culture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-300" />
            <h3 className="font-bold text-lg">Product Craft</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We care deeply about small details, functional aesthetics, and long-lasting quality.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <HeartHandshake className="w-6 h-6 text-primary-600 dark:text-primary-300" />
            <h3 className="font-bold text-lg">Customer First</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every feature, policy, and design decision begins with building customer trust.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <Rocket className="w-6 h-6 text-primary-600 dark:text-primary-300" />
            <h3 className="font-bold text-lg">Growth & Autonomy</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Fast-paced execution with room to take initiative and build impactful systems.
            </p>
          </div>
        </div>

        {/* Open Positions Section */}
        <div className="p-8 md:p-12 rounded-3xl bg-primary-900 dark:bg-neutral-900 text-white space-y-6 text-center">
          <Briefcase className="w-10 h-10 mx-auto text-primary-300" />
          <h2 className="text-2xl md:text-3xl font-black">Future Opportunities & Talent Pool</h2>
          <p className="text-primary-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            While we don't have active public job openings right now, we are always eager to connect with talented developers, product designers, supply chain specialists, and growth marketers.
          </p>
          <div className="pt-2">
            <a
              href="mailto:careers@fyxen.in?subject=Career Inquiry — FYXEN"
              className="inline-flex items-center gap-2 bg-white text-primary-900 font-bold px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-all text-sm"
            >
              Send Your CV / Portfolio <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
