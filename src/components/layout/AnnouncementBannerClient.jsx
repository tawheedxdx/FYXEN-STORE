'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AnnouncementBannerClient({ announcement }) {
  const pathname = usePathname();

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

  if (!isVisible) return null;

  const content = (
    <div 
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
    <div className="relative">
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
