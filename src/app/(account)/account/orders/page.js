import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import OrderCard from '@/components/account/OrderCard';
import { Package, ShoppingBag } from 'lucide-react';

export const metadata = {
  title: 'My Orders | Fyxen',
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary-900 dark:bg-white p-2.5 rounded-xl">
          <Package className="w-6 h-6 text-white dark:text-primary-900" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white">Order History</h1>
          <p className="text-sm text-primary-500 dark:text-primary-400">Manage and track your recent orders</p>
        </div>
      </div>
      
      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-primary-100 dark:border-white/5 rounded-3xl bg-primary-50/30 dark:bg-white/[0.02]">
          <div className="bg-white dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-primary-300" />
          </div>
          <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">No orders found</h3>
          <p className="text-primary-500 dark:text-primary-400 mb-8 max-w-xs mx-auto text-sm">
            You haven't placed any orders yet. Start shopping to see your history here!
          </p>
          <Link href="/shop" className="btn-primary px-8 inline-flex">Explore Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
