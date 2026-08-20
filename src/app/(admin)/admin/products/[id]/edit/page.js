import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit Product | Admin' };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const [{ data: product }, { data: categories }, { count: reviewCount }] = await Promise.all([
    supabase.from('products').select('*, product_images(*), product_variants(*)').eq('id', id).single(),
    supabase.from('categories').select('id, name, parent_id').eq('is_active', true).order('name'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('product_id', id),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Edit Product</h1>
          <p className="text-sm text-neutral-500 mt-1">Update details, images, and variants for <strong>{product.title}</strong>.</p>
        </div>

        <Link
          href={`/admin/reviews?productId=${product.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          Manage Reviews ({reviewCount || 0})
        </Link>
      </div>

      <ProductForm categories={categories || []} product={product} />
    </div>
  );
}
