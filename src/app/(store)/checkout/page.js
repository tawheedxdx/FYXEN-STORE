import { getCart } from '@/app/(store)/cart/actions';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CheckoutItemsManager from '@/components/checkout/CheckoutItemsManager';
import CheckoutOffersBadge from '@/components/checkout/CheckoutOffersBadge';

export const metadata = {
  title: 'Secure Checkout | FYXEN',
  description: 'Complete your order securely with FYXEN standard, express, or founder hand delivery.',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  const { items, subtotal, totalShipping, totalTax } = await getCart();

  if (items.length === 0) {
    redirect('/cart');
  }

  // Fetch profile for pre-filling
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, email, wallet_balance')
    .eq('id', user.id)
    .single();

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .single();

  // Fetch active promotions/offers
  const now = new Date().toISOString();
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .eq('active', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .order('created_at', { ascending: false });

  const tax = totalTax;

  return (
    <div className="bg-[#fcfbf9] dark:bg-[#070708] min-h-screen py-8 md:py-12 pb-safe">
      <div className="container-custom max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 text-neutral-950 dark:text-white tracking-tight">
          Secure Checkout
        </h1>
        
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
          {/* Checkout Form (Shipping & Payment) */}
          <div className="flex-1">
            <CheckoutForm 
              subtotal={subtotal} 
              tax={tax}
              profile={profile}
              user={user}
              settings={settings}
              offers={offers || []}
              items={items}
            />
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white dark:bg-[#0c0c0e] p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 lg:sticky lg:top-24 shadow-xs">
              <h2 className="text-xl font-black mb-6 text-neutral-950 dark:text-white">Order Summary</h2>
              
              <CheckoutOffersBadge items={items} offers={offers || []} />
              
              <CheckoutItemsManager items={items} />
              
              <div className="space-y-3 text-xs mb-6 border-t border-neutral-100 dark:border-neutral-800 pt-6 text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax / GST</span>
                    <span className="font-bold text-neutral-900 dark:text-white">₹{tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {subtotal >= (settings?.standard_delivery_free_threshold ?? 499) ? (
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    ) : (
                      `₹${(settings?.standard_delivery_fee ?? 30).toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>
              
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 leading-relaxed">
                Choose your preferred delivery type & payment mode on the left to see your final order total.
              </div>

              <p className="text-[11px] text-neutral-400 text-center mt-6 flex items-center justify-center gap-1.5">
                🔒 256-Bit SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
