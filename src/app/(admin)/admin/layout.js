import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, FolderOpen, Tag, MessageSquare, FileText, Megaphone, Layout, AlertTriangle, RotateCcw, Gift, Star, Mail, Receipt } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';
import AdminMobileMenu from '@/components/admin/AdminMobileMenu';

export const metadata = {
  title: 'FYXEN Admin Panel',
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('site_mode').single();
  const isMaintenance = settings?.site_mode === 'maintenance';
  const isOffline = settings?.site_mode === 'offline';

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 text-white flex-col hidden md:flex shrink-0 border-r border-neutral-800">
        <div className="p-6 border-b border-neutral-850 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo.png" alt="FYXEN" className="h-8 w-auto brightness-0 invert" />
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#c6a87c] text-white">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {[
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/admin/products', icon: Package, label: 'Products' },
            { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
            { href: '/admin/reviews', icon: Star, label: 'Product Reviews' },
            { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
            { href: '/admin/invoices', icon: Receipt, label: 'Invoice Manager' },
            { href: '/admin/returns', icon: RotateCcw, label: 'Returns' },
            { href: '/admin/subscribers', icon: Mail, label: 'VIP Subscribers' },
            { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
            { href: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
            { href: '/admin/promo-banner', icon: Layout, label: 'Promo Banners' },
            { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
            { href: '/admin/offers', icon: Gift, label: 'Offers & Giveaways' },
            { href: '/admin/users', icon: Users, label: 'Users' },
            { href: '/admin/settings', icon: Settings, label: 'Settings' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-850 transition-colors text-neutral-300 hover:text-white group text-xs font-semibold"
            >
              <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[#c6a87c] transition-colors" />
              <span>{label}</span>
            </Link>
          ))}
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-4 px-4 md:hidden shadow-xs">
          <AdminMobileMenu />
          <span className="font-bold text-sm text-neutral-950 dark:text-white">FYXEN Admin</span>
        </header>

        {/* Status Banners */}
        {isMaintenance && (
          <div className="bg-amber-500 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            MAINTENANCE MODE ACTIVE - Customers see a maintenance notice.
          </div>
        )}
        {isOffline && (
          <div className="bg-rose-600 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            STORE IS OFFLINE - No one can access the storefront.
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
