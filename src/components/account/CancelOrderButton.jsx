'use client';

import { useState } from 'react';
import { cancelOrder } from '@/app/(account)/account/actions';
import { Loader2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CancelOrderButton({ orderId, orderStatus, paymentStatus, className = "" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const cancellableStatuses = ['pending', 'confirmed', 'packed'];
  const isCancellable = cancellableStatuses.includes(orderStatus);

  if (!isCancellable) return null;

  async function handleCancel() {
    setIsLoading(true);
    const res = await cancelOrder(orderId);
    
    if (res?.error) {
      alert(res.error);
      setIsLoading(false);
    } else {
      setShowConfirm(false);
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={`text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${className}`}
      >
        <XCircle className="w-4 h-4" />
        Cancel Order
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-primary-100 dark:border-white/10 animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 dark:bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-white text-center mb-2">Cancel Order?</h3>
            <div className="space-y-4 mb-8 text-center">
              <p className="text-primary-500 dark:text-primary-400 text-sm">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              {paymentStatus === 'paid' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Prepaid Order</p>
                  <p className="text-xs text-blue-500 dark:text-blue-300">
                    Your payment will be refunded to your original payment method in <span className="font-bold">3-10 business days</span>.
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <button
                disabled={isLoading}
                onClick={handleCancel}
                className="btn-primary bg-red-500 hover:bg-red-600 border-none w-full py-3 h-auto"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cancelling...
                  </span>
                ) : 'Yes, Cancel Order'}
              </button>
              <button
                disabled={isLoading}
                onClick={() => setShowConfirm(false)}
                className="btn-outline w-full py-3 h-auto"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
