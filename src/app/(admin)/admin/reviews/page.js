import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdminReviewsClient from './AdminReviewsClient';

export const metadata = {
  title: 'Product Reviews | FYXEN Admin',
  description: 'Manage and create customer reviews for FYXEN store products.',
};

export default async function AdminReviewsPage({ searchParams }) {
  const params = await searchParams;
  const productId = params?.productId || '';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  const adminClient = createAdminClient();

  const [{ data: products }, { data: reviews }] = await Promise.all([
    adminClient
      .from('products')
      .select('id, title, slug, price')
      .order('title', { ascending: true }),
    adminClient
      .from('reviews')
      .select('*, products(id, title, slug), profiles(full_name)')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <AdminReviewsClient
      products={products || []}
      initialReviews={reviews || []}
      initialProductId={productId}
    />
  );
}
