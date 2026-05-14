"use client";

import Link from 'next/link';
import { useRef } from 'react';

const specialLinks = [
  { href: '/shop', label: 'All' },
  { href: '/category/best-sellers', label: 'Best Sellers' },
  { href: '/category/new-arrivals', label: 'New Arrivals' },
  { href: '/category/sale', label: 'Sale' },
];

export default function CategoryNavStrip({ categories = [] }) {
  const scrollRef = useRef(null);

  const allLinks = [
    ...specialLinks,
    ...categories.map(c => ({ href: `/category/${c.slug}`, label: c.name })),
  ];

  return (
    <nav className="bg-white dark:bg-black border-b border-primary-100 dark:border-white/10 sticky top-[64px] z-30">
      <div className="container-custom">
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
