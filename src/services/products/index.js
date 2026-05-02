import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_cache } from 'next/cache';

// ─── Cached: getCategories ───────────────────────────────────────────────────
// Uses service-role client (no cookies) so it's safe inside unstable_cache.
// Revalidated every 60s or on demand via the 'categories' cache tag.
export const getCategories = unstable_cache(
  async () => {
    const supabase = createAdminClient();
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
  },
  ['categories'],
  { revalidate: 60, tags: ['categories'] }
);

// ─── Cached: getProducts ──────────────────────────────────────────────────────
// Cache key includes all filter options so each unique filter set is cached.
export async function getProducts(options = {}) {
  const cacheKey = JSON.stringify(options);

  const fetcher = unstable_cache(
    async () => {
      const supabase = createAdminClient();

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
      `).eq('is_active', true);

      // FIX: resolve category slug → id in the same client, no extra createClient call
      if (options.categorySlug) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .maybeSingle();

        if (cat) {
          query = query.eq('category_id', cat.id);
        } else {
          // Category doesn't exist — return empty without a second round-trip
          return [];
        }
      }

      if (options.featured) {
        query = query.eq('featured', true);
      }

      if (options.searchQuery) {
        query = query.or(
          `title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%,brand.ilike.%${options.searchQuery}%`
        );
      }

      if (options.minPrice !== undefined && options.minPrice !== null && options.minPrice !== '') {
        query = query.gte('price', Number(options.minPrice));
      }
      if (options.maxPrice !== undefined && options.maxPrice !== null && options.maxPrice !== '') {
        query = query.lte('price', Number(options.maxPrice));
      }

      if (options.sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (options.sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return data || [];
    },
    ['products', cacheKey],
    { revalidate: 60, tags: ['products'] }
  );

  return fetcher();
}

// ─── Cached: getProductBySlug ─────────────────────────────────────────────────
// Deduplicates the duplicate DB calls from generateMetadata + page render.
export async function getProductBySlug(slug) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_variants(*), categories(name, slug), reviews(*, profiles(full_name))')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      if (data?.product_images) {
        data.product_images.sort((a, b) => a.sort_order - b.sort_order);
      }

      return data;
    },
    ['product', slug],
    { revalidate: 60, tags: ['products', `product-${slug}`] }
  );

  return fetcher();
}
