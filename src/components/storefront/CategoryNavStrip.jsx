"use client";

import Link from 'next/link';
import { useRef, useState } from 'react';

const specialLinks = [
  { href: '/shop', label: 'All' },
  { href: '/category/best-sellers', label: 'Best Sellers' },
  { href: '/category/new-arrivals', label: 'New Arrivals' },
  { href: '/category/sale', label: 'Sale' },
];

export default function CategoryNavStrip({ categories = [] }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const allLinks = [
    ...specialLinks,
    ...categories.map(c => ({ href: `/category/${c.slug}`, label: c.name })),
  ];

  return (
    <nav className="bg-white dark:bg-black border-b border-primary-100 dark:border-white/10 select-none">
      {/* Mobile Marquee View */}
      <div className="relative overflow-hidden w-full md:hidden">
        {/* Soft edge fade overlays for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-black z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-black z-10 pointer-events-none" />

        <div
          className="flex w-max animate-marquee"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >
          {/* First Group */}
          <div className="flex shrink-0 items-center">
            {allLinks.map((link, idx) => (
              <Link
                key={`m1-${link.href}-${idx}`}
                href={link.href}
                className="shrink-0 px-5 py-3.5 text-sm font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Duplicate Group for Infinite Loop */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {allLinks.map((link, idx) => (
              <Link
                key={`m2-${link.href}-${idx}`}
                href={link.href}
                className="shrink-0 px-5 py-3.5 text-sm font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Static View */}
      <div className="hidden md:block container-custom">
        <div
          ref={scrollRef}
          className="flex items-center gap-0 overflow-x-auto scrollbar-hide"
        >
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 px-5 py-4 text-sm font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white border-b-2 border-transparent hover:border-primary-900 dark:hover:border-white transition-all whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

