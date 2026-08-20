'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

const DEFAULT_PERKS = [
  { text: 'Free Express Delivery Across India on orders above ₹499', icon: Truck, link: '/shipping-policy' },
  { text: '100% Genuine Certified Quality • 7-Day Easy Returns', icon: ShieldCheck, link: '/about' },
  { text: 'Use Code WELCOME10 for 10% OFF on your first purchase', icon: Sparkles, link: '/shop' },
];

export default function AnnouncementBannerClient({ announcement }) {
  const pathname = usePathname();
  const bannerRef = useRef(null);
  const [currentPerkIndex, setCurrentPerkIndex] = useState(0);

  // Auto-rotate default perks every 4.5 seconds
  useEffect(() => {
    if (announcement) return;
    const timer = setInterval(() => {
      setCurrentPerkIndex((prev) => (prev + 1) % DEFAULT_PERKS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcement]);

  // Adjust CSS variable for banner height
  useEffect(() => {
    const updateHeight = () => {
      if (bannerRef.current) {
        const height = bannerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--banner-height', `${height}px`);
      } else {
        document.documentElement.style.setProperty('--banner-height', '0px');
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, [announcement, pathname]);

  if (announcement) {
    const displayPages = announcement.display_pages || ['all'];
    const isVisible = displayPages.includes('all') || 
                      displayPages.some(page => {
                        const p = page.trim();
                        if (p.endsWith('*')) {
                          return pathname.startsWith(p.slice(0, -1));
                        }
                        return pathname === p;
                      });

    if (!isVisible) {
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--banner-height', '0px');
      }
      return null;
    }

    const content = (
      <div 
        ref={bannerRef}
        className="py-2 px-4 text-center text-[12px] md:text-xs font-bold tracking-wider uppercase transition-all"
        style={{ 
          backgroundColor: announcement.bg_color || '#09090b', 
          color: announcement.text_color || '#ffffff'
        }}
      >
        {announcement.content}
      </div>
    );

    return (
      <div className={announcement.is_sticky ? 'sticky top-0 z-[60]' : 'relative'}>
        {announcement.link_url ? (
          <Link href={announcement.link_url} className="block hover:opacity-95 transition-opacity">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  }

  // Default Luxury Rotating Announcement Bar
  const currentPerk = DEFAULT_PERKS[currentPerkIndex];
  const Icon = currentPerk.icon;

  return (
    <div
      ref={bannerRef}
      className="bg-neutral-950 text-white text-[11px] md:text-xs font-semibold py-2 px-4 border-b border-white/5 relative z-[60] overflow-hidden"
    >
      <div className="container-custom flex items-center justify-center min-h-[20px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPerkIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-center"
          >
            <Icon className="w-3.5 h-3.5 text-[#c6a87c] shrink-0" />
            <Link
              href={currentPerk.link}
              className="hover:underline underline-offset-4 text-neutral-200 hover:text-white transition-colors"
            >
              {currentPerk.text}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
