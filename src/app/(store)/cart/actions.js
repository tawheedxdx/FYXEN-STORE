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
      products (
        id, title, slug, price, shipping_price, tax_rate, stock_quantity, product_images(image_url)
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
    taxRate: item.products.tax_rate || 0,
    quantity: item.quantity,
    image: item.products.product_images?.[0]?.image_url,
    stockQuantity: item.products.stock_quantity || 0,
    isStockError: item.quantity > (item.products.stock_quantity || 0),
  })) || [];

  const subtotal = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalShipping = formattedItems.reduce((acc, item) => acc + (item.shippingPrice * item.quantity), 0);
  const totalTax = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.taxRate / 100)), 0);

  return { items: formattedItems, subtotal, totalShipping, totalTax };
}

export async function addToCart(productId, quantity = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please sign in to add items to your cart.' };
  }

  // Parallelize: get cart + product price/stock at the same time
  const [cart, { data: product }] = await Promise.all([
    getOrCreateCart(supabase, user.id),
    supabase.from('products').select('price, stock_quantity').eq('id', productId).single(),
  ]);

  if (!product) return { error: 'Product not found' };
  if (!cart) return { error: 'Could not create cart' };

  const currentStock = product.stock_quantity || 0;
  if (currentStock <= 0) return { error: 'This product is currently out of stock.' };

  // Must be sequential — depends on cart.id
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .maybeSingle();

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
        quantity,
        unit_price: product.price,
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
    .select('products(stock_quantity)')
    .eq('id', cartItemId)
    .single();

  const stock = item?.products?.stock_quantity || 0;
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
