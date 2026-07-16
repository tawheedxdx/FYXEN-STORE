import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OffersListClient from './OffersListClient';
import OfferForm from '@/components/admin/OfferForm';
import { Gift } from 'lucide-react';

export const metadata = {
  title: 'Manage Offers & Giveaways | Admin',
};

export default async function AdminOffersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Fetch offers
  const { data: offers, error: offersError } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  if (offersError) {
    console.error('Error fetching offers:', offersError);
  }

  // Fetch products for product selection in form
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, sku, is_active')
    .order('title', { ascending: true });

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white flex items-center gap-2">
            <Gift className="w-8 h-8 text-accent" />
            Promotional Offers & Giveaways
          </h1>
          <p className="text-primary-500 mt-1">
            Create giveaway campaigns, select valid date ranges, set terms, and link eligible products.
          </p>
        </div>
        <div>
          <OfferForm products={products || []} />
        </div>
      </div>

      <OffersListClient initialOffers={offers || []} products={products || []} />
    </div>
  );
}
