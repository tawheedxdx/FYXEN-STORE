'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, FolderOpen, Tag, MessageSquare, FileText, Megaphone, Layout } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { href: '/admin/pages', icon: FileText, label: 'Site Pages' },
  { href: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  { href: '/admin/promo-banner', icon: Layout, label: 'Promo Banners' },
  { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-primary-900 md:hidden">
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-primary-800">
          <Link href="/admin" onClick={closeMenu} className="flex items-baseline gap-2 text-2xl font-bold tracking-tighter">
            Fyxen<span className="text-accent">.</span>
            <span className="text-xs font-normal text-primary-400 ml-1">Admin</span>
          </Link>
          <button onClick={closeMenu} className="p-2 -mr-2 text-primary-400 hover:text-white">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-accent' : 'text-primary-400 group-hover:text-accent'}`} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-primary-400 text-sm mb-1">
            ← View Storefront
          </Link>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-colors text-sm">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
