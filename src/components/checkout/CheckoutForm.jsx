'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession, verifyPayment, validateCoupon } from '@/app/(store)/checkout/actions';
import Script from 'next/script';
import { Loader2, Ticket, CheckCircle2, X } from 'lucide-react';

export default function CheckoutForm({ subtotal, shipping, grandTotal: initialGrandTotal, profile, user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState(null);

  const [currentDiscount, setCurrentDiscount] = useState(0);
  const [finalGrandTotal, setFinalGrandTotal] = useState(initialGrandTotal);

  useEffect(() => {
    setFinalGrandTotal(Math.max(0, subtotal - currentDiscount + shipping));
  }, [subtotal, currentDiscount, shipping]);

  async function handleApplyCoupon() {
    if (!couponCode) return;
    setIsValidating(true);
    setCouponError(null);
    
    const res = await validateCoupon(couponCode.toUpperCase(), subtotal);
    if (res.error) {
      setCouponError(res.error);
      setAppliedCoupon(null);
      setCurrentDiscount(0);
    } else {
      setAppliedCoupon(res.coupon);
      setCurrentDiscount(res.coupon.discountAmount);
      setCouponError(null);
    }
    setIsValidating(false);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCurrentDiscount(0);
  }

  async function handlePayment(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Add applied coupon code if any
    if (appliedCoupon) {
      formData.append('couponCode', appliedCoupon.code);
    }

    setIsLoading(true);
    setError(null);

    // Guard: Razorpay script must be loaded
    if (!window.Razorpay) {
      setError('Payment gateway is still loading. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    // 1. Create order on backend
    const res = await createCheckoutSession(formData);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    if (!res?.key || !res?.rzpOrderId) {
      setError('Failed to initialize payment. Please refresh and try again.');
      setIsLoading(false);
      return;
    }

    // 2. Open Razorpay Checkout
    const options = {
      key: res.key,
      amount: res.amount,
      currency: 'INR',
      name: 'Fyxen',
      description: 'Premium Lifestyle Products',
      image: 'https://zwqrkassfbesjfakiybh.supabase.co/storage/v1/object/public/brand-assets/logo.png', // Replace with your actual logo URL
      order_id: res.rzpOrderId,
      handler: async function (response) {
        setIsLoading(true);
        // 3. Verify Payment on Backend
        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: res.orderId,
        });

        if (verifyRes.success) {
          router.push(`/order/success?id=${res.orderId}`);
        } else {
          router.push(`/order/failed?id=${res.orderId}`);
        }
      },
      prefill: {
        name: res.shippingInfo.full_name,
        email: res.userEmail,
        contact: res.shippingInfo.phone,
      },
      theme: {
        color: '#09090b',
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment.failed:', response.error);
        setError(`Payment failed: ${response.error?.description || 'Unknown error'}. Please try again.`);
        setIsLoading(false);
        router.push(`/order/failed?id=${res.orderId}`);
      });

      rzp.open();
      setIsLoading(false);
    } catch (err) {
      console.error('Razorpay init error:', err);
      setError('Could not open payment window. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Load Razorpay script eagerly so it's ready before the user clicks Pay */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRzpReady(true)}
        onError={() => setError('Failed to load payment gateway. Please refresh the page.')}
      />

      <form onSubmit={handlePayment} className="bg-white dark:bg-black p-6 md:p-8 rounded-xl border border-primary-200 dark:border-white/10 shadow-sm">
        <h2 className="text-xl font-bold mb-6 border-b border-primary-100 dark:border-white/10 pb-4">Shipping Information</h2>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Full Name *</label>
              <input 
                id="fullName" 
                name="fullName" 
                type="text" 
                required 
                defaultValue={profile?.full_name || ''}
                className="input-field" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Phone Number *</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                required 
                defaultValue={profile?.phone || user?.phone || ''}
                className="input-field" 
                placeholder="9876543210" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="line1" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Address Line 1 *</label>
            <input id="line1" name="line1" type="text" required className="input-field" placeholder="Flat No., Building, Street" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">City *</label>
              <input id="city" name="city" type="text" required className="input-field" placeholder="Mumbai" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">State *</label>
              <input id="state" name="state" type="text" required className="input-field" placeholder="Maharashtra" />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">PIN Code *</label>
              <input id="postalCode" name="postalCode" type="text" required className="input-field" placeholder="400001" />
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mt-8 pt-6 border-t border-primary-100 dark:border-white/10">
          <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Discount Coupon</label>
          
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-bold text-green-700 uppercase">{appliedCoupon.code} Applied</p>
                  <p className="text-xs text-green-600">Saved ₹{currentDiscount.toFixed(2)}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={removeCoupon}
                className="p-1 hover:bg-green-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-green-700" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field pl-10 uppercase" 
                    placeholder="Enter code (e.g. SAVE20)" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidating || !couponCode}
                  className="btn-outline px-6 disabled:opacity-50"
                >
                  {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500 font-medium">{couponError}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-primary-100 dark:border-white/10">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm text-primary-500">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {currentDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Discount</span>
                <span>-₹{currentDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-primary-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary-900 dark:text-white pt-2 border-t border-primary-50 dark:border-white/5">
              <span>Total</span>
              <span>₹{finalGrandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !rzpReady}
            className="btn-primary w-full text-lg py-4 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </span>
            ) : !rzpReady ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading Payment Gateway...
              </span>
            ) : (
              `Pay ₹${finalGrandTotal.toFixed(2)} Securely`
            )}
          </button>
          <div className="flex justify-center mt-4 opacity-70">
            <p className="text-xs flex items-center gap-2">
              🔒 100% Secure Payments powered by Razorpay
            </p>
          </div>
        </div>
      </form>
    </>
  );
}

