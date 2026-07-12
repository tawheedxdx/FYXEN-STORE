import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CategoryManager from '@/components/admin/CategoryManager';

export const metadata = { title: 'Categories | Admin' };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('sort_order');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Categories</h1>
        <p className="text-primary-500 mt-1">Manage your product categories.</p>
      </div>
      <CategoryManager initialCategories={categories || []} />
    </div>
  );
}
