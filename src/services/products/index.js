import { createClient } from '@/lib/supabase/server';

export async function getProducts(options = {}) {
  const supabase = await createClient();
  let query = supabase.from('products').select(`
    id, 
    title, 
    slug, 
    price, 
    compare_at_price, 
    featured, 
    brand,
    promo_tag,
    product_images(image_url, sort_order), 
    categories(name, slug)
  `);

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
    query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%,brand.ilike.%${options.searchQuery}%`);
  }

  if (options.minPrice !== undefined && options.minPrice !== null && options.minPrice !== '') {
    query = query.gte('price', Number(options.minPrice));
  }

  if (options.maxPrice !== undefined && options.maxPrice !== null && options.maxPrice !== '') {
    query = query.lte('price', Number(options.maxPrice));
  }

  query = query.eq('is_active', true);

  // Sort
  if (options.sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (options.sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false }); // newest first (default)
  }
  
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
    .select('*, product_images(*), product_variants(*), categories(name, slug), reviews(*, profiles(full_name))')
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
