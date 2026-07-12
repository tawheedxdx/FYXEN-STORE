import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Dashboard | Admin' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Run all queries in parallel
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { data: revenueOrders },
    { data: recentOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('grand_total').eq('payment_status', 'paid'),
    supabase.from('orders').select('id, order_number, grand_total, payment_status, created_at, profiles(full_name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, title, stock_quantity').lt('stock_quantity', 10).order('stock_quantity').limit(5),
  ]);

  const totalRevenue = revenueOrders?.reduce((acc, o) => acc + o.grand_total, 0) || 0;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10', href: '/admin/orders' },
    { label: 'Total Orders', value: totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/orders' },
    { label: 'Products', value: totalProducts || 0, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/products' },
    { label: 'Users', value: totalUsers || 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/users' },
  ];

  const paymentStatusColors = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
          <p className="text-primary-500 mt-1">Welcome back, {profile?.full_name || 'Admin'}!</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 h-11 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-primary-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-primary-900">{value}</p>
            <p className="text-primary-500 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-primary-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-primary-100 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline">View all →</Link>
          </div>
          {!recentOrders || recentOrders.length === 0 ? (
            <p className="p-6 text-primary-500 text-sm">No orders yet.</p>
          ) : (
            <div className="divide-y divide-primary-100">
              {recentOrders.map(order => (
                <Link 
                  key={order.order_number} 
                  href={`/admin/orders/${order.id}`}
                  className="px-6 py-4 flex items-center justify-between hover:bg-primary-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm text-primary-900 group-hover:text-accent transition-colors">{order.order_number}</p>
                    <p className="text-primary-400 text-xs">{order.profiles?.full_name || 'Guest'} · {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.payment_status}
                    </span>
                    <span className="font-semibold text-sm">₹{order.grand_total}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-primary-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-primary-100 flex justify-between items-center">
            <h2 className="text-lg font-bold">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-sm text-accent hover:underline">Manage →</Link>
          </div>
          {!lowStock || lowStock.length === 0 ? (
            <p className="p-6 text-primary-500 text-sm">All products are well stocked.</p>
          ) : (
            <div className="divide-y divide-primary-100">
              {lowStock.map(product => (
                <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                  <p className="font-medium text-sm text-primary-900">{product.title}</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock_quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {product.stock_quantity === 0 ? 'Out of stock' : `${product.stock_quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-primary-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 h-10 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link href="/admin/categories" className="btn-secondary flex items-center gap-2 h-10 text-sm">
            <Plus className="w-4 h-4" /> Add Category
          </Link>
          <Link href="/admin/orders" className="btn-outline flex items-center gap-2 h-10 text-sm">
            <ShoppingCart className="w-4 h-4" /> Manage Orders
          </Link>
          <Link href="/admin/settings" className="btn-outline flex items-center gap-2 h-10 text-sm">
            Store Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
