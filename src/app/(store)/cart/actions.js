'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { items: [], subtotal: 0 };
  }

  // Get or create cart
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single();
    cart = newCart;
  }
  
  if (!cart) return { items: [], subtotal: 0 };

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      unit_price,
      products (
        id, title, slug, price, shipping_price, product_images(image_url)
      )
    `)
    .eq('cart_id', cart.id);

  const formattedItems = cartItems?.map(item => ({
    id: item.id,
    productId: item.products.id,
    title: item.products.title,
    slug: item.products.slug,
    price: item.products.price,
    shippingPrice: item.products.shipping_price || 0,
    quantity: item.quantity,
    image: item.products.product_images?.[0]?.image_url
  })) || [];

  const subtotal = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalShipping = formattedItems.reduce((acc, item) => acc + (item.shippingPrice * item.quantity), 0);

  return { items: formattedItems, subtotal, totalShipping };
}

export async function addToCart(productId, quantity = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please sign in to add items to your cart.' };
  }

  // Get or create cart
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single();
    cart = newCart;
  }

  // Get product price
  const { data: product } = await supabase
    .from('products')
    .select('price')
    .eq('id', productId)
    .single();

  if (!product) return { error: 'Product not found' };

  // Check if item exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .single();

  if (existingItem) {
    await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);
  } else {
    await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        unit_price: product.price
      });
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const supabase = await createClient();
  
  if (quantity <= 0) {
    return removeCartItem(cartItemId);
  }

  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  revalidatePath('/cart');
  return { success: true };
}

export async function removeCartItem(cartItemId) {
  const supabase = await createClient();
  await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  revalidatePath('/cart');
  return { success: true };
}
