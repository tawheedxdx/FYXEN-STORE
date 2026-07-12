'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper: get or create cart — minimizes round-trips by fetching user + cart together
async function getOrCreateCart(supabase, userId) {
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single();
    cart = newCart;
  }

  return cart;
}

export async function getCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { items: [], subtotal: 0, totalShipping: 0, totalTax: 0 };
  }

  const cart = await getOrCreateCart(supabase, user.id);
  if (!cart) return { items: [], subtotal: 0, totalShipping: 0, totalTax: 0 };

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      unit_price,
      variant_id,
      products (
        id, title, slug, price, shipping_price, tax_rate, stock_quantity, sku, product_images(image_url)
      ),
      product_variants (
        id, name, sku, price, compare_at_price, stock_quantity, attributes_json, images
      )
    `)
    .eq('cart_id', cart.id);

  const formattedItems = cartItems?.map(item => {
    const hasVariant = !!item.variant_id && !!item.product_variants;
    const price = hasVariant ? (item.product_variants.price || item.products.price) : item.products.price;
    const stockQuantity = hasVariant ? (item.product_variants.stock_quantity || 0) : (item.products.stock_quantity || 0);
    const title = hasVariant ? `${item.products.title} (${item.product_variants.name})` : item.products.title;
    const image = (hasVariant && item.product_variants.images?.[0]) || item.products.product_images?.[0]?.image_url;
    const sku = hasVariant ? item.product_variants.sku : item.products.sku;

    return {
      id: item.id,
      productId: item.products.id,
      variantId: item.variant_id || null,
      title,
      slug: item.products.slug,
      price,
      shippingPrice: item.products.shipping_price || 0,
      taxRate: item.products.tax_rate || 0,
      quantity: item.quantity,
      image,
      sku,
      stockQuantity,
      isStockError: item.quantity > stockQuantity,
    };
  }) || [];

  const subtotal = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalShipping = formattedItems.reduce((acc, item) => acc + (item.shippingPrice * item.quantity), 0);
  const totalTax = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.taxRate / 100)), 0);

  return { items: formattedItems, subtotal, totalShipping, totalTax };
}

export async function addToCart(productId, quantity = 1, variantId = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please sign in to add items to your cart.' };
  }

  // Fetch cart, product, and optionally variant info
  const [cart, { data: product }, { data: variant }] = await Promise.all([
    getOrCreateCart(supabase, user.id),
    supabase.from('products').select('price, stock_quantity').eq('id', productId).single(),
    variantId
      ? supabase.from('product_variants').select('price, stock_quantity').eq('id', variantId).maybeSingle()
      : Promise.resolve({ data: null })
  ]);

  if (!product) return { error: 'Product not found' };
  if (!cart) return { error: 'Could not create cart' };
  if (variantId && !variant) return { error: 'Variant not found' };

  const productPrice = (variantId && variant) ? (variant.price || product.price) : product.price;
  const currentStock = (variantId && variant) ? (variant.stock_quantity || 0) : (product.stock_quantity || 0);

  if (currentStock <= 0) return { error: 'This item is currently out of stock.' };

  // Match existing item in cart
  const query = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId);
  
  if (variantId) {
    query.eq('variant_id', variantId);
  } else {
    query.is('variant_id', null);
  }
  
  const { data: existingItem } = await query.maybeSingle();

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > currentStock) {
      return { error: `Cannot add more. Only ${currentStock} items in stock.` };
    }
    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id);
  } else {
    if (quantity > currentStock) {
      return { error: `Only ${currentStock} items in stock.` };
    }
    await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        variant_id: variantId,
        quantity,
        unit_price: productPrice,
      });
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: true };
}


export async function updateCartItemQuantity(cartItemId, quantity) {
  const supabase = await createClient();
  
  if (quantity <= 0) {
    return removeCartItem(cartItemId);
  }

  const { data: item } = await supabase
    .from('cart_items')
    .select('variant_id, products(stock_quantity), product_variants(stock_quantity)')
    .eq('id', cartItemId)
    .single();

  if (!item) return { error: 'Cart item not found' };

  const stock = item.variant_id
    ? (item.product_variants?.stock_quantity || 0)
    : (item.products?.stock_quantity || 0);

  if (quantity > stock) {
    return { error: `Only ${stock} items available in stock.` };
  }

  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: true };
}

export async function removeCartItem(cartItemId) {
  const supabase = await createClient();
  await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: true };
}
