import { createClient } from '@/lib/supabase/server';

export async function getProducts(options = {}) {
  const supabase = await createClient();
  let query = supabase.from('products').select('*, product_images(*), categories(name, slug)');

  if (options.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .single();
      
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  if (options.featured) {
    query = query.eq('featured', true);
  }

  if (options.searchQuery) {
    query = query.ilike('title', `%${options.searchQuery}%`);
  }

  query = query.eq('is_active', true);
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export async function getProductBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(name, slug)')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  // Sort images
  if (data?.product_images) {
    data.product_images.sort((a, b) => a.sort_order - b.sort_order);
  }
  
  return data;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}
