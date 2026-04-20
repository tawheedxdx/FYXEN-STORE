'use client';

import { useState } from 'react';
import { trackOrder } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Package, CheckCircle, Truck, Star,
  XCircle, Clock, Loader2, MapPin, ShoppingBag
} from 'lucide-react';

const ORDER_STEPS = [
  { key: 'pending',   label: 'Order Placed',  icon: ShoppingBag, description: 'We received your order.' },
  { key: 'confirmed', label: 'Confirmed',      icon: CheckCircle, description: 'Your order has been confirmed and will be prepared shortly.' },
  { key: 'packed',    label: 'Packed',         icon: Package,     description: 'Your order has been carefully packed.' },
  { key: 'shipped',   label: 'Shipped',        icon: Truck,       description: 'Your order is on its way!' },
  { key: 'delivered', label: 'Delivered',      icon: Star,        description: 'Your order has been delivered. Enjoy!' },
];

const STATUS_ORDER = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

function getStepIndex(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Pending',   cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    confirmed: { label: 'Confirmed', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    packed:    { label: 'Packed',    cls: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    shipped:   { label: 'Shipped',   cls: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
    delivered: { label: 'Delivered', cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function TrackOrderClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    const formData = new FormData(e.target);
    const result = await trackOrder(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setOrder(result.order);
    }
    setLoading(false);
  }

  const isCancelled = order?.order_status === 'cancelled';
  const currentStep = order ? getStepIndex(order.order_status) : -1;

  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Track Your Order</h1>
        <p className="text-primary-500 dark:text-primary-400">
          Enter your Order ID (e.g. <span className="font-mono">FYX-123456-789</span>) and the email used at checkout.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-primary-900/30 border border-primary-100 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order ID</label>
            <input
              name="orderNumber"
              type="text"
              required
              className="input-field font-mono"
              placeholder="FYX-1234567890-123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</>
          ) : (
            <><Search className="w-4 h-4" /> Track Order</>
          )}
        </button>
      </form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 mb-8"
          >
            <XCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Result */}
      <AnimatePresence>
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Order Header */}
            <div className="bg-white dark:bg-primary-900/30 border border-primary-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-primary-500 uppercase tracking-widest mb-1">Order Number</p>
                  <p className="text-xl font-mono font-bold text-primary-900 dark:text-white">{order.order_number}</p>
                </div>
                <StatusBadge status={order.order_status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-t border-primary-100 dark:border-white/10 pt-4">
                <div>
                  <p className="text-primary-500 text-xs mb-1">Order Date</p>
                  <p className="font-medium">{new Date(order.placed_at || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-primary-500 text-xs mb-1">Total Paid</p>
                  <p className="font-bold text-primary-900 dark:text-white">₹{Number(order.grand_total).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-primary-500 text-xs mb-1">Payment</p>
                  <span className={`inline-block text-xs font-bold uppercase px-2 py-0.5 rounded ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Stepper */}
            {!isCancelled ? (
              <div className="bg-white dark:bg-primary-900/30 border border-primary-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-6">Shipment Progress</h2>
                <div className="space-y-0">
                  {ORDER_STEPS.map((step, i) => {
                    const isCompleted = i <= currentStep;
                    const isActive = i === currentStep;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4">
                        {/* Icon + connector line */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                              isCompleted
                                ? 'bg-primary-900 dark:bg-white border-primary-900 dark:border-white text-white dark:text-primary-900'
                                : 'bg-white dark:bg-primary-900 border-primary-200 dark:border-white/20 text-primary-300 dark:text-primary-600'
                            } ${isActive ? 'ring-4 ring-primary-900/20 dark:ring-white/20' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          {i < ORDER_STEPS.length - 1 && (
                            <div className={`w-0.5 flex-1 my-1 min-h-[32px] transition-colors ${isCompleted ? 'bg-primary-900 dark:bg-white' : 'bg-primary-200 dark:bg-white/10'}`} />
                          )}
                        </div>

                        {/* Content */}
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 + 0.05 }}
                          className={`pb-6 ${i === ORDER_STEPS.length - 1 ? 'pb-0' : ''}`}
                        >
                          <p className={`font-semibold ${isCompleted ? 'text-primary-900 dark:text-white' : 'text-primary-400 dark:text-primary-600'}`}>
                            {step.label}
                            {isActive && (
                              <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-accent">
                                <Clock className="w-3 h-3" /> Current
                              </span>
                            )}
                          </p>
                          {isCompleted && (
                            <p className="text-sm text-primary-500 dark:text-primary-400 mt-0.5">{step.description}</p>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4">
                <XCircle className="w-10 h-10 text-red-500 shrink-0" />
                <div>
                  <p className="font-bold text-red-700 dark:text-red-400">Order Cancelled</p>
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                    This order has been cancelled. If you believe this is a mistake, please contact support.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Address */}
            <div className="bg-white dark:bg-primary-900/30 border border-primary-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" /> Delivery Address
              </h2>
              <div className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                <p className="font-semibold text-primary-900 dark:text-white">{order.shipping_full_name}</p>
                <p>{order.shipping_line1}</p>
                <p>{order.shipping_city}, {order.shipping_state} – {order.shipping_postal_code}</p>
                <p>{order.shipping_country}</p>
                <p className="pt-1">📞 {order.shipping_phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-primary-900/30 border border-primary-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm gap-4 py-2 border-b border-primary-100 dark:border-white/5 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_title_snapshot}</p>
                      <p className="text-primary-500 text-xs">Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}</p>
                    </div>
                    <p className="font-semibold shrink-0">₹{Number(item.total_price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-base pt-4 mt-2 border-t border-primary-100 dark:border-white/10">
                <span>Total</span>
                <span>₹{Number(order.grand_total).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
