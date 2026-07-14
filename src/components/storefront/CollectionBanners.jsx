"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const defaultBanners = [
  {
    href: '/category/best-sellers',
    label: 'Best Sellers',
    tagline: 'Our most-loved products, chosen by our community.',
    cta: 'Shop the Collection',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop',
  },
  {
    href: '/category/new-arrivals',
    label: 'New Arrivals',
    tagline: 'The latest additions to the Fyxen collection.',
    cta: 'View New Arrivals',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
  },
  {
    href: '/category/sale',
    label: 'On Sale',
    tagline: 'Premium quality at exclusive, limited-time prices.',
    cta: 'Shop the Sale',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function CollectionBanners({ settings }) {
  const sectionTitle = settings?.curated_section_title || 'Curated For You';
  const sectionHeading = settings?.curated_section_heading || 'Fyxen Favourites';
  const displayBanners = settings?.curated_banners_json || defaultBanners;

  const headingParts = sectionHeading.split(' ');
  const lastWord = headingParts.length > 1 ? headingParts.pop() : '';
  const mainHeading = headingParts.join(' ');

  const activeBanners = displayBanners.filter(b => b.image && b.label);
  if (activeBanners.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-primary-50 dark:bg-primary-950/40">
      <div className="container-custom">
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400 mb-2">{sectionTitle}</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-primary-900 dark:text-white">
            {mainHeading} {lastWord && <span className="italic font-light">{lastWord}</span>}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeBanners.map((banner, index) => (
            <Link
              key={`${banner.href}-${index}`}
              href={banner.href}
              className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-primary-200 dark:bg-primary-800"
            >
              <Image
                src={banner.image}
                alt={banner.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{banner.tagline}</p>
                <h3 className="text-white text-2xl font-black tracking-tight mb-4">{banner.label}</h3>
                <span className="inline-flex items-center gap-2 text-white text-sm font-bold border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                  {banner.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
