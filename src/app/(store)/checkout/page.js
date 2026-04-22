import { getCart } from '@/app/(store)/cart/actions';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Secure Checkout | Fyxen',
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
    .select('full_name, phone, email')
    .eq('id', user.id)
    .single();

  const shipping = totalShipping;
  const tax = totalTax;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="bg-primary-50 dark:bg-primary-900/10 min-h-screen py-8 md:py-12 pb-safe">
      <div className="container-custom max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Secure Checkout</h1>
        
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
          {/* Checkout Form (Shipping & Payment) */}
          <div className="flex-1">
            <CheckoutForm 
              subtotal={subtotal} 
              shipping={shipping} 
              tax={tax}
              grandTotal={grandTotal} 
              profile={profile}
              user={user}
            />
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white dark:bg-black p-5 md:p-6 rounded-xl border border-primary-200 dark:border-white/10 lg:sticky lg:top-24 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-primary-100 rounded overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-2">{item.title}</p>
                      <p className="text-primary-500">Qty: {item.quantity}</p>
                      <p className="font-semibold mt-1">₹{item.price} {item.taxRate > 0 && <span className="text-[10px] text-primary-400 font-normal">+ GST</span>}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm mb-6 border-t border-primary-100 dark:border-white/10 pt-6">
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-primary-400">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-600 dark:text-primary-400">Tax / GST</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-primary-400">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-primary-200 dark:border-white/20 pt-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary-900 dark:text-white">₹{grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-primary-400 text-center mt-6">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
