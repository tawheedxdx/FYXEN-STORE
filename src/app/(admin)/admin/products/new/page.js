import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Add Product | Admin' };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('name');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Add New Product</h1>
        <p className="text-primary-500 mt-1">Fill in the details below to add a new product to your store.</p>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  );
}
