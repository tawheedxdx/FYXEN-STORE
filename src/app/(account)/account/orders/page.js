import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      {!orders || orders.length === 0 ? (
        <div className="text-center py-12 border border-primary-100 rounded-lg bg-primary-50">
          <p className="text-primary-600 mb-4">You haven't placed any orders yet.</p>
          <Link href="/shop" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-primary-200 rounded-lg p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4 pb-4 border-b border-primary-100">
                <div>
                  <p className="text-sm text-primary-500">Order Number</p>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-500">Date Placed</p>
                  <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-500">Total Amount</p>
                  <p className="font-semibold">₹{order.grand_total}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <p className="font-medium text-primary-800">{item.quantity}x {item.product_title_snapshot}</p>
                    <p>₹{item.total_price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
