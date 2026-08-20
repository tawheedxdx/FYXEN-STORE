'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, FolderOpen, Tag, MessageSquare, FileText, Megaphone, Layout, RotateCcw, Gift, Star, Mail } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/reviews', icon: Star, label: 'Product Reviews' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/returns', icon: RotateCcw, label: 'Returns' },
  { href: '/admin/subscribers', icon: Mail, label: 'VIP Subscribers' },
  { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { href: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  { href: '/admin/promo-banner', icon: Layout, label: 'Promo Banners' },
  { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
  { href: '/admin/offers', icon: Gift, label: 'Offers & Giveaways' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-neutral-900 dark:text-white md:hidden">
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-850">
          <Link href="/admin" onClick={closeMenu} className="flex items-center gap-2">
            <img src="/logo.png" alt="FYXEN" className="h-8 w-auto brightness-0 invert" />
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#c6a87c] text-white">
              Admin
            </span>
          </Link>
          <button onClick={closeMenu} className="p-2 -mr-2 text-neutral-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors group text-xs font-semibold ${
                  isActive 
                    ? 'bg-neutral-800 text-white' 
                    : 'text-neutral-300 hover:bg-neutral-850 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#c6a87c]' : 'text-neutral-400 group-hover:text-[#c6a87c]'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-850 space-y-1">
          <a
            href={process.env.NODE_ENV === 'production' ? 'https://www.fyxen.in' : '/'}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-850 transition-colors text-neutral-400 hover:text-white text-xs font-semibold"
          >
            &larr; View Storefront
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
