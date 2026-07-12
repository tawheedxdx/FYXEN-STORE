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

async function uploadVariantImage(variantId, file, adminSupabase) {
  const ext = file.name.split('.').pop();
  const fileName = `variants/${variantId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await adminSupabase.storage
    .from('product-images')
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error('Variant image upload error:', uploadError);
    return null;
  }

  const { data: urlData } = adminSupabase.storage.from('product-images').getPublicUrl(fileName);
  return urlData.publicUrl;
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
  const isBestSeller = formData.get('isBestSeller') === 'true';
  const isNewArrival = formData.get('isNewArrival') === 'true';
  const isOnSale = formData.get('isOnSale') === 'true';

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
      is_best_seller: isBestSeller,
      is_new_arrival: isNewArrival,
      is_on_sale: isOnSale,
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

  // Handle product variants
  const variantsJson = formData.get('variants');
  const variants = variantsJson ? JSON.parse(variantsJson) : [];
  if (variants.length > 0) {
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const variantName = Object.entries(v.attributes || {})
        .map(([k, val]) => `${val}`)
        .join(' / ');

      const { data: newVar, error: varError } = await adminSupabase
        .from('product_variants')
        .insert({
          product_id: product.id,
          name: variantName,
          sku: v.sku || null,
          price: parseFloat(v.price) || price,
          compare_at_price: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
          stock_quantity: parseInt(v.stockQuantity || '0'),
          attributes_json: v.attributes || {},
          images: v.images || [],
        })
        .select('id')
        .single();

      if (varError) {
        console.error('Error inserting variant:', varError);
        continue;
      }

      // Check if any files were uploaded for this variant
      const files = formData.getAll(`variant_images_${v.tempId}`);
      const validFiles = files.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          validFiles.map(file => uploadVariantImage(newVar.id, file, adminSupabase))
        );
        const filteredUrls = uploadedUrls.filter(Boolean);
        if (filteredUrls.length > 0) {
          const finalImages = [...(v.images || []), ...filteredUrls];
          await adminSupabase
            .from('product_variants')
            .update({ images: finalImages })
            .eq('id', newVar.id);
        }
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/best-sellers');
  revalidatePath('/new-arrivals');
  revalidatePath('/sale');
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
  const isBestSeller = formData.get('isBestSeller') === 'true';
  const isNewArrival = formData.get('isNewArrival') === 'true';
  const isOnSale = formData.get('isOnSale') === 'true';
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
    is_best_seller: isBestSeller,
    is_new_arrival: isNewArrival,
    is_on_sale: isOnSale,
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

  // Handle product variants
  const variantsJson = formData.get('variants');
  const variants = variantsJson ? JSON.parse(variantsJson) : [];

  // Fetch existing variants to delete ones not present anymore
  const { data: existingVars } = await adminSupabase
    .from('product_variants')
    .select('id')
    .eq('product_id', productId);
  
  if (existingVars) {
    const keepIds = variants.filter(v => v.id).map(v => v.id);
    const toDeleteIds = existingVars.filter(ev => !keepIds.includes(ev.id)).map(ev => ev.id);
    if (toDeleteIds.length > 0) {
      await adminSupabase.from('product_variants').delete().in('id', toDeleteIds);
    }
  }

  // Insert/Update variants
  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const variantName = Object.entries(v.attributes || {})
      .map(([k, val]) => `${val}`)
      .join(' / ');

    const variantData = {
      product_id: productId,
      name: variantName,
      sku: v.sku || null,
      price: parseFloat(v.price) || 0,
      compare_at_price: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
      stock_quantity: parseInt(v.stockQuantity || '0'),
      attributes_json: v.attributes || {},
      images: v.images || [],
    };

    if (v.id) {
      // Update existing variant
      const { error: varError } = await adminSupabase
        .from('product_variants')
        .update(variantData)
        .eq('id', v.id);
      
      if (varError) {
        console.error('Error updating variant:', varError);
        continue;
      }

      // Check for new file uploads
      let files = formData.getAll(`variant_images_${v.id}`);
      if (files.length === 0) {
        files = formData.getAll(`variant_images_${v.tempId}`);
      }
      const validFiles = files.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          validFiles.map(file => uploadVariantImage(v.id, file, adminSupabase))
        );
        const filteredUrls = uploadedUrls.filter(Boolean);
        if (filteredUrls.length > 0) {
          const finalImages = [...(v.images || []), ...filteredUrls];
          await adminSupabase
            .from('product_variants')
            .update({ images: finalImages })
            .eq('id', v.id);
        }
      }
    } else {
      // Insert new variant
      const { data: newVar, error: varError } = await adminSupabase
        .from('product_variants')
        .insert(variantData)
        .select('id')
        .single();
      
      if (varError) {
        console.error('Error inserting variant:', varError);
        continue;
      }

      // Check for file uploads
      const files = formData.getAll(`variant_images_${v.tempId}`);
      const validFiles = files.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          validFiles.map(file => uploadVariantImage(newVar.id, file, adminSupabase))
        );
        const filteredUrls = uploadedUrls.filter(Boolean);
        if (filteredUrls.length > 0) {
          const finalImages = [...(v.images || []), ...filteredUrls];
          await adminSupabase
            .from('product_variants')
            .update({ images: finalImages })
            .eq('id', newVar.id);
        }
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath(`/product/${slug}`);
  revalidatePath('/best-sellers');
  revalidatePath('/new-arrivals');
  revalidatePath('/sale');
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
