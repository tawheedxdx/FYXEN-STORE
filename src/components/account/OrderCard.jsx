'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PayNowButton from './PayNowButton';
import CancelOrderButton from './CancelOrderButton';
import Script from 'next/script';
import { ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrderCard({ order }) {
  const router = useRouter();

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
            <div className="flex flex-col items-end gap-2">
              <PayNowButton order={order} className="px-5 py-2 text-xs" />
              <CancelOrderButton 
                orderId={order.id} 
                orderStatus={order.order_status} 
                paymentStatus={order.payment_status}
              />
            </div>
            
            <div className="flex items-center gap-1 text-xs font-bold text-primary-400 group-hover:text-primary-900 dark:group-hover:text-white transition-colors">
              View Details <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
