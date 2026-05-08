import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import { createClient } from '@/lib/supabase/server';
import MaintenancePage from '@/components/common/MaintenancePage';
import { AlertTriangle } from 'lucide-react';

export default async function StoreLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'customer';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    role = profile?.role || 'customer';
  }

  const { data: settings } = await supabase.from('settings').select('site_mode').single();
  const mode = settings?.site_mode || 'online';
  const isAdmin = role === 'admin';

  // Handling Offline Mode (No one can see)
  if (mode === 'offline' && !isAdmin) {
    return <MaintenancePage mode="offline" />;
  }

  // Handling Maintenance Mode (Only Admin can see)
  if (mode === 'maintenance' && !isAdmin) {
    return <MaintenancePage mode="maintenance" />;
  }

  return (
    <>
      {mode === 'maintenance' && isAdmin && (
        <div className="bg-amber-500 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <AlertTriangle className="w-3 h-3" />
          MAINTENANCE MODE ACTIVE - Customers see a notice page.
        </div>
      )}
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
