'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function SuccessView({ orderId, paymentStatus }) {
  const isCod = paymentStatus === 'cod';

  return (
    <div className="container-custom py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <Script id="google-conversion-event" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
              'send_to': 'AW-18110601963/0zAaCMOEpqEcEOu157tD',
              'value': 1.0,
              'currency': 'INR'
          });
        `}
      </Script>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1
        }}
        className="relative"
      >
        <div className={`absolute inset-0 ${isCod ? 'bg-blue-500/20' : 'bg-green-500/20'} blur-3xl rounded-full`} />
        {isCod ? (
          <Package className="w-28 h-28 text-blue-500 relative z-10" strokeWidth={1.5} />
        ) : (
          <CheckCircle className="w-28 h-28 text-green-500 relative z-10" strokeWidth={1.5} />
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 space-y-4"
      >
        <h1 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isCod ? 'from-blue-500 to-indigo-400' : 'from-green-500 to-emerald-400'}`}>
          {isCod ? 'Order Placed!' : 'Payment Verified!'}
        </h1>
        <p className="text-xl text-primary-600 dark:text-primary-300 max-w-lg mx-auto">
          {isCod 
            ? 'Your order has been received and will be delivered shortly. Please keep the cash ready!'
            : 'Your premium order has been successfully placed and is now being processed.'}
        </p>
      </motion.div>

      {orderId && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 p-6 bg-primary-50 dark:bg-white/5 border border-primary-200 dark:border-white/10 rounded-2xl backdrop-blur-md"
        >
          <p className="text-sm text-primary-500 uppercase tracking-widest mb-1">Order ID</p>
          <p className="text-xl font-mono font-semibold text-primary-900 dark:text-white tracking-wider">{orderId}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md"
      >
        <Link href="/account/orders" className="btn-primary flex-1 flex items-center justify-center gap-2 group">
          <Package className="w-5 h-5" />
          Track Order
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/shop" className="btn-outline flex-1 flex items-center justify-center">
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}
