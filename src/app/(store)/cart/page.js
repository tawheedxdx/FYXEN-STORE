import { getCart } from '@/app/(store)/cart/actions';
import CartList from '@/components/cart/CartList';
import Link from 'next/link';
import { getCartRecommendations } from '@/services/products/recommendations';
import RecommendationCarousel from '@/components/product/RecommendationCarousel';
import ProceedToCheckoutButton from '@/components/cart/ProceedToCheckoutButton';

import { AlertCircle, Lock } from 'lucide-react';

export const metadata = {
  title: 'Your Cart',
};

export default async function CartPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const errorParam = resolvedParams?.error;

  const { items, subtotal } = await getCart();
  const cartProductIds = items.map(item => item.productId).filter(Boolean);
  const recommendations = await getCartRecommendations(cartProductIds, 8);

  return (
    <div className="container-custom py-12">
      {/* Session Expiry or Access Notice */}
      {errorParam === 'session_expired' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Your previous checkout session has expired (sessions are valid for 5 minutes for payment security). Please click "Proceed to Checkout" to initiate a fresh session.</span>
        </div>
      )}

      {errorParam === 'no_session' && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold flex items-center gap-3">
          <Lock className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>Direct access to secure checkout is protected. Please click "Proceed to Checkout" below to start your verified checkout session.</span>
        </div>
      )}

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
        <>
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
                    <span className="text-primary-900 dark:text-white font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-600 dark:text-primary-300">Taxes</span>
                    <span className="text-primary-900 dark:text-white font-medium">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold">Estimated Total</span>
                  <span className="font-bold text-xl">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {items.some(i => i.isStockError) ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium">
                      Some items in your cart exceed available stock. Please reduce quantities to proceed.
                    </div>
                    <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                      Proceed to Checkout
                    </button>
                  </div>
                ) : (
                  <ProceedToCheckoutButton className="w-full text-center py-3 rounded-xl font-bold" />
                )}
              </div>
            </div>
          </div>
          
          <RecommendationCarousel products={recommendations} title="Complete Your Order" />
        </>
      )}
    </div>
  );
}
