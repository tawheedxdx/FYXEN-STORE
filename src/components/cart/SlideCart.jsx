'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const FREE_SHIPPING_THRESHOLD = 499;

export default function SlideCart() {
  const { isOpen, closeCart, cart, cartCount, isLoading, updateQuantity, removeItem } = useCart();
  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0c0c0e] h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200/80 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-neutral-900 dark:text-white" />
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                  Shopping Bag
                </h2>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-black">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#c6a87c]" />
                  {amountNeeded > 0 ? (
                    <>Add <strong className="text-neutral-950 dark:text-white font-bold">₹{amountNeeded.toFixed(0)}</strong> for Free Express Shipping</>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> FREE Express Shipping unlocked!
                    </span>
                  )}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#c6a87c] to-[#d4af37] rounded-full"
                />
              </div>
            </div>

            {/* Items List / Empty State */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4 text-neutral-400">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
                    Explore our collection of thoughtful essentials designed for modern everyday living.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="btn-primary text-xs px-6 py-3 rounded-xl"
                  >
                    Start Shopping <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/30 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200/50 dark:border-neutral-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                          FYXEN
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="font-bold text-sm text-neutral-900 dark:text-white truncate hover:underline hover:text-[#c6a87c] transition-colors"
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-neutral-900 dark:text-white mt-1">
                          ₹{Number(item.price).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg h-7 bg-neutral-50 dark:bg-neutral-900">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-neutral-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.stockQuantity || 10)}
                            className="w-7 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-neutral-500 font-mono">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-4">
                {/* Trust mini-strip */}
                <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-200/60 dark:border-neutral-800 pb-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 100% Genuine
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#c6a87c]" /> Express Dispatch
                  </span>
                  <span>•</span>
                  <span>7-Day Return</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Subtotal</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-neutral-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Taxes & shipping calculated at checkout</p>
                  </div>
                </div>

                {/* Direct Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full py-3.5 rounded-xl shadow-lg shadow-black/5 flex items-center justify-center gap-2 text-sm font-bold"
                >
                  Checkout Now <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline underline-offset-4 transition-colors"
                  >
                    View Full Cart Page
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
