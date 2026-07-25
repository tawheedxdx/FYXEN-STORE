import Link from 'next/link';
import { Newspaper, Mail, Download, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Press & Media | FYXEN',
  description: 'Official press releases, media kit, brand assets, and media inquiries for FYXEN (Bytread International Private Limited).',
  alternates: {
    canonical: '/press',
  },
};

export default function PressPage() {
  return (
    <div className="bg-white dark:bg-black text-neutral-900 dark:text-white min-h-screen py-16 md:py-24">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-900/10 dark:bg-white/10 text-primary-900 dark:text-white text-xs font-bold uppercase tracking-widest">
            Press & Media Room
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            FYXEN Brand News & Assets
          </h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            Welcome to the FYXEN Press Center. Access official company information, press releases, high-resolution logos, and media contacts.
          </p>
        </div>

        {/* Fact Sheet */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10 mb-12 space-y-6">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-primary-600 dark:text-primary-300" />
            <h2 className="text-2xl font-bold">Company Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <div>
              <strong className="block text-neutral-900 dark:text-white mb-1">Brand Name:</strong>
              FYXEN
            </div>
            <div>
              <strong className="block text-neutral-900 dark:text-white mb-1">Legal Entity:</strong>
              Bytread International Private Limited
            </div>
            <div>
              <strong className="block text-neutral-900 dark:text-white mb-1">Industry:</strong>
              Premium E-Commerce, Home, Kitchen & Lifestyle Utilities
            </div>
            <div>
              <strong className="block text-neutral-900 dark:text-white mb-1">Geographic Focus:</strong>
              India (Nationwide Express Delivery)
            </div>
          </div>
        </div>

        {/* Brand Assets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <h3 className="font-bold text-xl">Official Brand Kit</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Download official vector logos, brand typography guidelines, and product photography for media publications.
            </p>
            <a
              href="/logo.png"
              download
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 dark:text-white border-b border-primary-900 dark:border-white pb-0.5"
            >
              Download Logo Pack (PNG) <Download className="w-4 h-4" />
            </a>
          </div>

          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <h3 className="font-bold text-xl">Media Inquiries</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              For interview requests, product reviews, press kit access, or partner inquiries, reach out to our press team.
            </p>
            <a
              href="mailto:press@fyxen.in"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 dark:text-white border-b border-primary-900 dark:border-white pb-0.5"
            >
              Contact Press Office <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
