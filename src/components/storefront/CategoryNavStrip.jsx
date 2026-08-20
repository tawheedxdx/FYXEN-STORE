"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { Sparkles, Award, Flame, Grid, Compass } from 'lucide-react';

const specialLinks = [
  { href: '/shop', label: 'All Catalogue', icon: Grid },
  { href: '/category/best-sellers', label: 'Best Sellers', icon: Award },
  { href: '/category/new-arrivals', label: 'New Arrivals', icon: Sparkles },
  { href: '/category/sale', label: 'Special Offers', icon: Flame },
];

export default function CategoryNavStrip({ categories = [] }) {
  const containerRef = useRef(null);
  const pathname = usePathname();

  const allLinks = [
    ...specialLinks,
    ...categories.map(c => ({ href: `/category/${c.slug}`, label: c.name, icon: Compass })),
  ];

  return (
    <nav className="bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 sticky top-16 md:top-20 z-30 select-none">
      <div className="container-custom">
        <div
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3"
        >
          {allLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border ${
                  isActive
                    ? 'bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 dark:border-white shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 border-neutral-200/60 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c6a87c]' : 'text-neutral-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
