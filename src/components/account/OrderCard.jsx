'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { retryPayment, verifyPayment } from '@/app/(store)/checkout/actions';
import Script from 'next/script';
import { Loader2, ChevronRight, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrderCard({ order }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePayNow(e) {
    e.stopPropagation();
    e.preventDefault();
    
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
      default: return 'bg-primary-100 text-primary-700 dark:bg-white/5 dark:text-primary-400 border-primary-200 dark:border-white/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'failed': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      
      <Link 
        href={`/account/orders/${order.id}`}
        className="block bg-white dark:bg-black/40 border border-primary-200 dark:border-white/10 rounded-2xl p-5 md:p-6 hover:shadow-xl hover:shadow-primary-900/5 dark:hover:shadow-none transition-all group relative overflow-hidden"
      >
        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.payment_status)}`}>
                {getStatusIcon(order.payment_status)}
                {order.payment_status}
              </span>
              <span className="text-xs text-primary-400 font-medium">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-primary-900 dark:text-white group-hover:text-primary-600 transition-colors">
                #{order.order_number}
              </h3>
              <p className="text-sm text-primary-500 dark:text-primary-400 mt-1">
                {order.order_items?.length} {order.order_items?.length === 1 ? 'item' : 'items'} • ₹{order.grand_total.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex -space-x-3 overflow-hidden py-1">
              {order.order_items?.slice(0, 4).map((item, idx) => {
                const imgUrl = item.image_snapshot || item.products?.product_images?.[0]?.image_url;
                return (
                  <div key={item.id} className="relative w-10 h-10 rounded-xl border-2 border-white dark:border-black bg-primary-50 dark:bg-white/5 overflow-hidden flex-shrink-0 shadow-sm" style={{ zIndex: 10 - idx }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={item.product_title_snapshot} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-primary-300 font-bold">FX</div>
                    )}
                  </div>
                );
              })}
              {order.order_items?.length > 4 && (
                <div className="w-10 h-10 rounded-xl border-2 border-white dark:border-black bg-primary-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm relative" style={{ zIndex: 5 }}>
                  +{order.order_items.length - 4}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between items-end gap-4 shrink-0">
            {(order.payment_status === 'pending' || order.payment_status === 'failed') && (
              <button
                onClick={handlePayNow}
                disabled={isLoading}
                className="btn-primary px-5 py-2 text-xs rounded-xl shadow-lg shadow-primary-900/10 flex items-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5" />
                )}
                Pay Now
              </button>
            )}
            
            <div className="flex items-center gap-1 text-xs font-bold text-primary-400 group-hover:text-primary-900 dark:group-hover:text-white transition-colors">
              View Details <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-[11px] text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </Link>
    </>
  );
}
