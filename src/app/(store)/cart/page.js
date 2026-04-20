import { getCart } from '@/app/(store)/cart/actions';
import CartList from '@/components/cart/CartList';
import Link from 'next/link';

export const metadata = {
  title: 'Your Cart',
};

export default async function CartPage() {
  const { items, subtotal } = await getCart();

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-white/10">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-primary-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/shop" className="btn-primary inline-flex">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <CartList initialItems={items} />
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-primary-200 dark:border-white/10 pb-6">
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-primary-300">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-primary-300">Shipping</span>
                  <span className="text-accent font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600 dark:text-primary-300">Taxes</span>
                  <span className="text-accent font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold">Estimated Total</span>
                <span className="font-bold text-xl">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" className="btn-primary w-full text-center">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
