import { getProducts, getCategories } from '@/services/products';

export default async function sitemap() {
  const baseUrl = 'https://www.fyxen.in';

  let products = [];
  let categories = [];

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getProducts({}),
      getCategories(),
    ]);
    products = fetchedProducts || [];
    categories = fetchedCategories || [];
  } catch (err) {
    console.error('Error fetching sitemap data:', err);
  }

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updated_at ? new Date(category.updated_at).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const specialCategoryEntries = ['best-sellers', 'new-arrivals', 'sale'].map((catSlug) => ({
    url: `${baseUrl}/category/${catSlug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const staticPages = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/faq',
    '/track-order',
    '/careers',
    '/press',
    '/privacy-policy',
    '/terms-and-conditions',
    '/shipping-policy',
    '/cancellation-refunds',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : (route === '/about' || route === '/shop' ? 0.8 : 0.6),
  }));

  return [...staticPages, ...specialCategoryEntries, ...categoryEntries, ...productEntries];
}
