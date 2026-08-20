import Link from 'next/link';
import { HelpCircle, ChevronRight } from 'lucide-react';
import FAQClient from './FAQClient';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | FYXEN',
  description: 'Find instant answers to common questions about FYXEN orders, payments, delivery, returns, and support.',
};

export default function FAQPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-[#070708] min-h-screen py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 dark:text-white">Frequently Asked Questions</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6a87c]/10 text-[#c6a87c] text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" /> Help Center
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
            Everything you need to know about our products, ordering, shipping speeds, payments, and 2-day return settlements.
          </p>
        </div>

        {/* Interactive FAQ Client */}
        <FAQClient />
      </div>
    </div>
  );
}
