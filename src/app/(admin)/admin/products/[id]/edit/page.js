import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit Product | Admin' };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, product_images(*)').eq('id', id).single(),
    supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Edit Product</h1>
        <p className="text-primary-500 mt-1">Update the details for <strong>{product.title}</strong>.</p>
      </div>
      <ProductForm categories={categories || []} product={product} />
    </div>
  );
}
