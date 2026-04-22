'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function AnnouncementBannerClient({ announcement }) {
  const pathname = usePathname();
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!announcement) {
      document.documentElement.style.setProperty('--banner-height', '0px');
      return;
    }

    const updateHeight = () => {
      if (bannerRef.current && announcement.is_sticky) {
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

  if (!announcement) return null;

  // Visibility Logic
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
    // Reset height if not visible on this page
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--banner-height', '0px');
    }
    return null;
  }

  const content = (
    <div 
      ref={bannerRef}
      className="py-2 px-4 text-center text-[13px] md:text-sm font-medium transition-all"
      style={{ 
        backgroundColor: announcement.bg_color, 
        color: announcement.text_color 
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
