import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import { createClient } from '@/lib/supabase/server';
import MaintenancePage from '@/components/common/MaintenancePage';
import { AlertTriangle } from 'lucide-react';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { getCart } from '@/app/(store)/cart/actions';

export default async function StoreLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'customer';
  let showWelcome = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, has_seen_welcome')
      .eq('id', user.id)
      .single();
    role = profile?.role || 'customer';
    showWelcome = profile?.has_seen_welcome === false;
  }

  const { data: settings } = await supabase.from('settings').select('*').single();
  const mode = settings?.site_mode || 'online';
  const isAdmin = role === 'admin';

  // Fetch cart to count items
  const { items } = await getCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
      <Navbar cartCount={cartCount} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WelcomeModal show={showWelcome} />
    </>
  );
}
