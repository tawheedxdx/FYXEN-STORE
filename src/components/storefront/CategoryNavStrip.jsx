"use client";

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

const specialLinks = [
  { href: '/shop', label: 'All' },
  { href: '/category/best-sellers', label: 'Best Sellers' },
  { href: '/category/new-arrivals', label: 'New Arrivals' },
  { href: '/category/sale', label: 'Sale' },
];

export default function CategoryNavStrip({ categories = [] }) {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const isInteractingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const lastInteractionTimeRef = useRef(0);

  const allLinks = [
    ...specialLinks,
    ...categories.map(c => ({ href: `/category/${c.slug}`, label: c.name })),
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    const scrollSpeed = 0.6; // Scroll speed in pixels per frame

    const step = () => {
      const isInteracting = isInteractingRef.current;
      const timeSinceLastInteraction = Date.now() - lastInteractionTimeRef.current;

      // Only auto-scroll if user is not currently touching/hovering AND at least 2 seconds passed since manual scroll
      if (!isInteracting && timeSinceLastInteraction > 2000) {
        const halfWidth = container.scrollWidth / 2;

        isProgrammaticScrollRef.current = true;
        container.scrollLeft += scrollSpeed;

        // Wrap around check for infinite scrolling (forward)
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }

        // Reset the programmatic scroll flag in the next tick
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 50);
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const halfWidth = container.scrollWidth / 2;

    // Wrap around dynamically for manual scroll in both directions
    if (container.scrollLeft >= halfWidth) {
      isProgrammaticScrollRef.current = true;
      container.scrollLeft -= halfWidth;
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    } else if (container.scrollLeft <= 0) {
      isProgrammaticScrollRef.current = true;
      container.scrollLeft += halfWidth;
      setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    }

    // If it's a manual scroll (user sliding/inertia), update interaction timestamp
    if (!isProgrammaticScrollRef.current) {
      lastInteractionTimeRef.current = Date.now();
    }
  };

  const handleTouchStart = () => {
    isInteractingRef.current = true;
    lastInteractionTimeRef.current = Date.now();
  };

  const handleTouchEnd = () => {
    isInteractingRef.current = false;
    lastInteractionTimeRef.current = Date.now();
  };

  return (
    <nav className="bg-white dark:bg-black border-b border-primary-100 dark:border-white/10 select-none">
      {/* Mobile Scrollable Ticker View */}
      <div className="relative overflow-hidden w-full md:hidden">
        {/* Soft edge fade overlays for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-black z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-black z-10 pointer-events-none" />

        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide select-none py-1 active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onScroll={handleScroll}
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


