import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();

  // Verify admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;

  // Run all 4 stat queries in parallel instead of sequentially
  const [
    { count: totalOrders },
    { count: totalProducts },
    { data: paidOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('grand_total').eq('payment_status', 'paid'),
    supabase.from('products').select('*').lt('stock_quantity', 10).order('stock_quantity'),
  ]);

  const totalRevenue = paidOrders?.reduce((acc, order) => acc + order.grand_total, 0) || 0;

  return {
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalRevenue,
    lowStock: lowStock || [],
  };
}
