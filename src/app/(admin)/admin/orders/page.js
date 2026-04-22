import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown';
import PaymentStatusDropdown from '@/components/admin/PaymentStatusDropdown';

export const metadata = { title: 'Orders | Admin' };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email), order_items(quantity, image_snapshot)')
    .order('created_at', { ascending: false });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Orders</h1>
        <p className="text-primary-500 mt-1">{orders?.length || 0} total orders</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-primary-100">
          <p className="text-primary-500">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-primary-50 text-primary-600">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="group flex items-center gap-2">
                      <span className="font-bold text-primary-900 group-hover:text-accent transition-colors">{order.order_number}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="block group">
                      <p className="font-medium text-primary-900 group-hover:text-accent transition-colors">{order.profiles?.full_name || order.shipping_full_name}</p>
                      <p className="text-primary-400 text-xs">{order.profiles?.email || '—'}</p>
                    </Link>
                  </td>
                  <td className="p-4 text-primary-600">
                    <div className="flex items-center gap-2">
                      {order.order_items?.[0]?.image_snapshot && (
                        <img src={order.order_items[0].image_snapshot} className="w-8 h-8 rounded object-cover border border-primary-100" />
                      )}
                      <span>{order.order_items?.length || 0} item(s)</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">₹{order.grand_total}</td>
                  <td className="p-4">
                    <PaymentStatusDropdown orderId={order.id} currentStatus={order.payment_status} />
                  </td>
                  <td className="p-4">
                    <OrderStatusDropdown orderId={order.id} currentStatus={order.order_status} />
                  </td>
                  <td className="p-4 text-primary-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
