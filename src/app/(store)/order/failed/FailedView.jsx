'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, Headset } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FailedView({ orderId, orderNumber }) {
  return (
    <div className="container-custom py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.8
        }}
        className="relative mb-6 select-none"
      >
        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full opacity-30" />
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 w-full max-w-[280px] md:max-w-[320px] mx-auto filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(255,255,255,0.02)]"
        >
          <Image
            src="/order failed svg/Missed chances-amico.svg"
            alt="Order Failed Illustration"
            width={320}
            height={320}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-400">
          Payment Not Verified
        </h1>
        <p className="text-xl text-primary-600 dark:text-primary-300 max-w-lg mx-auto">
          We couldn't securely verify your payment. Don't worry, no charges were finalized.
        </p>
      </motion.div>

      {(orderNumber || orderId) && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 p-6 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl backdrop-blur-md"
        >
          <p className="text-sm text-red-500 uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-xl font-mono font-semibold text-red-700 dark:text-red-400 tracking-wider">
            {orderNumber ? `#${orderNumber}` : orderId}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6"
      >
        <p className="text-primary-500 max-w-md mx-auto">
          Your cart is still saved. You can try the payment again securely.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md"
      >
        <Link href="/checkout" className="btn-primary bg-red-600 hover:bg-red-700 text-white flex-1 flex items-center justify-center gap-2 group border-none">
          <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
          Try Again
        </Link>
        <Link href="/contact" className="btn-outline flex-1 flex items-center justify-center gap-2">
          <Headset className="w-5 h-5" />
          Support
        </Link>
      </motion.div>
    </div>
  );
}
