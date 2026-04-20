import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { User, MapPin, Package, LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

export default function AccountLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-primary-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-primary-100">
                  <h2 className="font-bold text-lg">My Account</h2>
                </div>
                <nav className="p-2">
                  <ul className="space-y-1">
                    <li>
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-primary-50 text-primary-700 font-medium transition-colors">
                        <User className="w-5 h-5" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-primary-50 text-primary-700 font-medium transition-colors">
                        <Package className="w-5 h-5" /> Orders
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-primary-50 text-primary-700 font-medium transition-colors">
                        <MapPin className="w-5 h-5" /> Addresses
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-primary-100 px-2">
                    <form action={logout}>
                      <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-md hover:bg-red-50 text-red-600 font-medium transition-colors">
                        <LogOut className="w-5 h-5" /> Sign Out
                      </button>
                    </form>
                  </div>
                </nav>
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-primary-100 p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
