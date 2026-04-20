import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();
  
  // Verify admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;

  // Mock implementation for demo purpose, normally these would be aggregated queries
  // 1. Total Orders
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  
  // 2. Total Products
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
  
  // 3. Total Revenue
  const { data: orders } = await supabase.from('orders').select('grand_total').eq('payment_status', 'paid');
  const totalRevenue = orders?.reduce((acc, order) => acc + order.grand_total, 0) || 0;

  // 4. Low stock products
  const { data: lowStock } = await supabase.from('products').select('*').lt('stock_quantity', 10).order('stock_quantity');

  return {
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalRevenue,
    lowStock: lowStock || []
  };
}
