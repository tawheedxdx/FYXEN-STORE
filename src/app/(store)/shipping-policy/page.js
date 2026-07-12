import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Shipping Policy | Fyxen',
};

export default async function ShippingPolicyPage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from('site_pages')
    .select('*')
    .eq('slug', 'shipping-policy')
    .single();

  if (!page) notFound();

  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      
      <div 
        className="prose prose-primary dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
