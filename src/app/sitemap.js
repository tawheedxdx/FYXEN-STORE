import { getProducts, getCategories } from '@/services/products';

export default async function sitemap() {
  const baseUrl = 'https://www.fyxen.in';

  // Fetch all products and categories for dynamic sitemap
  const [products, categories] = await Promise.all([
    getProducts({}),
    getCategories(),
  ]);

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updated_at || product.created_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updated_at || category.created_at,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const staticPages = [
    '',
    '/shop',
    '/contact',
    '/track-order',
    '/privacy-policy',
    '/terms-and-conditions',
    '/shipping-policy',
    '/cancellation-refunds',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...staticPages, ...productEntries, ...categoryEntries];
}
