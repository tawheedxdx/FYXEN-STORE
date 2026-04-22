import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

export async function GET() {
  const supabase = await createClient();
  const baseUrl = 'https://www.fyxen.in';

  try {
    // Fetch all active products with images and variants
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        short_description,
        description,
        slug,
        sku,
        price,
        compare_at_price,
        stock_quantity,
        brand,
        product_images (image_url, sort_order),
        product_variants (id, name, sku, price, stock_quantity, attributes_json)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products for feed:', error);
      return new Response('Error generating feed', { status: 500 });
    }

    const feedItems = [];

    products.forEach((product) => {
      const productLink = `${baseUrl}/product/${product.slug}`;
      const sortedImages = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];
      const imageLink = sortedImages.length > 0 ? sortedImages[0].image_url : '';
      
      // If product has variants, create an item for each variant
      if (product.product_variants && product.product_variants.length > 0) {
        product.product_variants.forEach((variant) => {
          const availability = variant.stock_quantity > 0 ? 'in stock' : 'out of stock';
          const price = `${Number(variant.price || product.price).toFixed(2)} INR`;
          const salePrice = product.compare_at_price > product.price ? `<g:sale_price>${price}</g:sale_price>` : '';
          const basePrice = product.compare_at_price > product.price ? `${Number(product.compare_at_price).toFixed(2)} INR` : price;
          
          feedItems.push(`
    <item>
      <g:id><![CDATA[${variant.id}]]></g:id>
      <g:item_group_id><![CDATA[${product.id}]]></g:item_group_id>
      <g:title><![CDATA[${product.title} - ${variant.name}]]></g:title>
      <g:description><![CDATA[${product.description || product.short_description || product.title}]]></g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${basePrice}</g:price>
      ${salePrice}
      <g:brand><![CDATA[${product.brand || 'Fyxen'}]]></g:brand>
      <g:condition>new</g:condition>
      <g:mpn><![CDATA[${variant.sku || product.sku || variant.id}]]></g:mpn>
      <g:identifier_exists>${(variant.sku || product.sku) ? 'yes' : 'no'}</g:identifier_exists>
    </item>`);
        });
      } else {
        // Simple product without variants
        const availability = product.stock_quantity > 0 ? 'in stock' : 'out of stock';
        const price = `${Number(product.price).toFixed(2)} INR`;
        const salePrice = product.compare_at_price > product.price ? `<g:sale_price>${price}</g:sale_price>` : '';
        const basePrice = product.compare_at_price > product.price ? `${Number(product.compare_at_price).toFixed(2)} INR` : price;

        feedItems.push(`
    <item>
      <g:id><![CDATA[${product.id}]]></g:id>
      <g:title><![CDATA[${product.title}]]></g:title>
      <g:description><![CDATA[${product.description || product.short_description || product.title}]]></g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${basePrice}</g:price>
      ${salePrice}
      <g:brand><![CDATA[${product.brand || 'Fyxen'}]]></g:brand>
      <g:condition>new</g:condition>
      <g:mpn><![CDATA[${product.sku || product.id}]]></g:mpn>
      <g:identifier_exists>${product.sku ? 'yes' : 'no'}</g:identifier_exists>
    </item>`);
      }
    });

    const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Fyxen Official Product Feed</title>
    <link>${baseUrl}</link>
    <description>Premium Lifestyle &amp; Manufacturing Essentials by Fyxen. Quality crafted for the modern world.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems.join('')}
  </channel>
</rss>`;

    return new Response(xmlFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (err) {
    console.error('Unexpected error in feed generation:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
