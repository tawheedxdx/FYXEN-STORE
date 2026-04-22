import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, FolderOpen, Tag, MessageSquare, FileText, Megaphone, Layout } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

export const metadata = {
  title: 'Fyxen Admin Panel',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-primary-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-primary-800">
          <Link href="/admin" className="flex items-baseline gap-2 text-2xl font-bold tracking-tighter">
            Fyxen<span className="text-accent">.</span>
            <span className="text-xs font-normal text-primary-400 ml-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {[
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
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors text-primary-200 hover:text-white group"
            >
              <Icon className="w-5 h-5 text-primary-400 group-hover:text-accent transition-colors" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 bg-white border-b border-primary-100 flex items-center justify-between px-4 md:hidden shadow-sm">
          <span className="font-bold text-lg">Fyxen<span className="text-accent">.</span> Admin</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
