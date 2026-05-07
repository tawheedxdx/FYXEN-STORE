'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;
  return user;
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
}

export async function createProduct(formData) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const title = formData.get('title');
  const slug = formData.get('slug') || slugify(title);
  const shortDescription = formData.get('shortDescription');
  const description = formData.get('description');
  const brand = formData.get('brand');
  const sku = formData.get('sku') || null;
  const price = parseFloat(formData.get('price'));
  const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice')) : null;
  const stockQuantity = parseInt(formData.get('stockQuantity') || '0');
  const categoryId = formData.get('categoryId') || null;
  const featured = formData.get('featured') === 'true';
  const isActive = formData.get('isActive') === 'true';
  const seoTitle = formData.get('seoTitle') || title;
  const seoDescription = formData.get('seoDescription') || shortDescription;

  const highlights = formData.get('highlights') ? JSON.parse(formData.get('highlights')) : [];
  const shippingPrice = parseFloat(formData.get('shippingPrice') || '0');
  const taxRate = parseFloat(formData.get('taxRate') || '0');
  
  // Insert product
  const { data: product, error: productError } = await adminSupabase
    .from('products')
    .insert({
      title,
      slug,
      short_description: shortDescription,
      description,
      brand,
      sku,
      price,
      compare_at_price: compareAtPrice,
      shipping_price: shippingPrice,
      tax_rate: taxRate,
      stock_quantity: stockQuantity,
      category_id: categoryId,
      featured,
      is_active: isActive,
      seo_title: seoTitle,
      seo_description: seoDescription,
      highlights,
      promo_tag: formData.get('promoTag') || null,
    })
    .select('id')
    .single();

  if (productError) {
    console.error('Product create error:', productError);
    return { error: productError.message };
  }

  // Handle image uploads (Parallel)
  const images = formData.getAll('images');
  const validImages = images.filter(img => img && img.size > 0);

  if (validImages.length > 0) {
    await Promise.all(validImages.map(async (img, i) => {
      const ext = img.name.split('.').pop();
      const fileName = `${product.id}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await adminSupabase.storage
        .from('product-images')
        .upload(fileName, img, { contentType: img.type, upsert: false });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return;
      }

      const { data: urlData } = adminSupabase.storage.from('product-images').getPublicUrl(fileName);

      await adminSupabase.from('product_images').insert({
        product_id: product.id,
        image_url: urlData.publicUrl,
        alt_text: title,
        sort_order: i,
      });
    }));
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  redirect('/admin/products');
}

export async function updateProduct(productId, formData) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const title = formData.get('title');
  const slug = formData.get('slug') || slugify(title);
  const featured = formData.get('featured') === 'true';
  const isActive = formData.get('isActive') === 'true';
  const seoTitle = formData.get('seoTitle') || title;
  const seoDescription = formData.get('seoDescription') || formData.get('shortDescription');
  const highlights = formData.get('highlights') ? JSON.parse(formData.get('highlights')) : [];
  const shippingPrice = parseFloat(formData.get('shippingPrice') || '0');
  const taxRate = parseFloat(formData.get('taxRate') || '0');

  const { error } = await adminSupabase.from('products').update({
    title,
    slug,
    short_description: formData.get('shortDescription'),
    description: formData.get('description'),
    brand: formData.get('brand'),
    sku: formData.get('sku') || null,
    price: parseFloat(formData.get('price')),
    compare_at_price: formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice')) : null,
    shipping_price: shippingPrice,
    tax_rate: taxRate,
    stock_quantity: parseInt(formData.get('stockQuantity') || '0'),
    category_id: formData.get('categoryId') || null,
    featured,
    is_active: isActive,
    seo_title: seoTitle,
    seo_description: seoDescription,
    highlights,
    promo_tag: formData.get('promoTag') || null,
    updated_at: new Date().toISOString(),
  }).eq('id', productId);

  if (error) return { error: error.message };

  // Handle new image uploads (Parallel)
  const images = formData.getAll('images');
  const validImages = images.filter(img => img && img.size > 0);
  
  const existingSortMax = formData.get('existingSortMax') ? parseInt(formData.get('existingSortMax')) : 0;

  if (validImages.length > 0) {
    await Promise.all(validImages.map(async (img, i) => {
      const ext = img.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await adminSupabase.storage
        .from('product-images')
        .upload(fileName, img, { contentType: img.type, upsert: false });

      if (uploadError) {
        console.error('Update image upload error:', uploadError);
        return;
      }

      const { data: urlData } = adminSupabase.storage.from('product-images').getPublicUrl(fileName);

      await adminSupabase.from('product_images').insert({
        product_id: productId,
        image_url: urlData.publicUrl,
        alt_text: title,
        sort_order: existingSortMax + i + 1,
      });
    }));
  }

  revalidatePath('/admin/products');
  revalidatePath(`/product/${slug}`);
  return { success: true };
}

export async function deleteProduct(productId) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const { error } = await adminSupabase.from('products').delete().eq('id', productId);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteProductImage(imageId, imageUrl) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  // Delete from storage
  const urlParts = imageUrl.split('/product-images/');
  if (urlParts[1]) {
    await adminSupabase.storage.from('product-images').remove([decodeURIComponent(urlParts[1])]);
  }

  // Delete from DB
  const { error } = await adminSupabase.from('product_images').delete().eq('id', imageId);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  return { success: true };
}

export async function toggleProductStatus(productId, isActive) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const { error } = await adminSupabase.from('products').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', productId);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: true };
}
