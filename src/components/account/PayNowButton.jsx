'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { retryPayment, verifyPayment } from '@/app/(store)/checkout/actions';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import Script from 'next/script';

export default function PayNowButton({ order, className = "" }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePayNow(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setIsLoading(true);
    setError(null);

    // Guard: Razorpay script must be loaded
    if (!window.Razorpay) {
      setError('Payment gateway is still loading. Please wait.');
      setIsLoading(false);
      return;
    }

    const res = await retryPayment(order.id);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    const options = {
      key: res.key,
      amount: res.amount,
      currency: 'INR',
      name: 'Fyxen',
      description: `Payment for Order ${order.order_number}`,
      image: 'https://zwqrkassfbesjfakiybh.supabase.co/storage/v1/object/public/brand-assets/logo.png',
      order_id: res.rzpOrderId,
      handler: async function (response) {
        setIsLoading(true);
        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: order.id,
        });

        if (verifyRes.success) {
          router.refresh(); // Reload to show updated status
        } else {
          setError('Payment verification failed.');
        }
        setIsLoading(false);
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
      rzp.open();
    } catch (err) {
      console.error('Razorpay init error:', err);
      setError('Could not open payment window.');
      setIsLoading(false);
    }
  }

  if (order.payment_status !== 'pending' && order.payment_status !== 'failed') {
    return null;
  }

  if (order.order_status === 'cancelled') {
    return null;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="flex flex-col gap-2">
        <button
          onClick={handlePayNow}
          disabled={isLoading}
          className={`btn-primary px-6 py-2.5 text-sm rounded-xl shadow-lg shadow-primary-900/10 flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          Pay Now
        </button>
        {error && (
          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    </>
  );
}
