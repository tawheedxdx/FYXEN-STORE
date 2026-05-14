import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { User, MapPin, Package, LogOut, Wallet } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

export default function AccountLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-black py-12 md:py-20 border-t border-primary-100 dark:border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-white/10 overflow-hidden sticky top-28">
                <div className="p-6 border-b border-primary-100 dark:border-white/10">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">Navigation</p>
                  <h2 className="font-black text-xl text-primary-900 dark:text-white">My Account</h2>
                </div>
                <nav className="p-3">
                  <ul className="space-y-1">
                    <li>
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 font-semibold transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 font-semibold transition-colors">
                        <Package className="w-4 h-4" /> Orders
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 font-semibold transition-colors">
                        <MapPin className="w-4 h-4" /> Addresses
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/wallet" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 font-semibold transition-colors">
                        <Wallet className="w-4 h-4" /> My Wallet
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-primary-100 dark:border-white/10 px-1">
                    <form action={logout}>
                      <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </form>
                  </div>
                </nav>
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
