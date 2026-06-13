import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle2, Clock, AlertCircle, Star, RotateCcw } from 'lucide-react';
import PayNowButton from '@/components/account/PayNowButton';
import CancelOrderButton from '@/components/account/CancelOrderButton';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order #${id.slice(0, 8)} | Fyxen`,
  };
}

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch order with items
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          product_images (
            image_url
          )
        )
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Fetch return request if any
  const { data: returnRequest } = await supabaseAdmin
    .from('return_requests')
    .select('*')
    .eq('order_id', order.id)
    .maybeSingle();

  // Fetch settings for return validity
  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('return_validity_days')
    .maybeSingle();

  const validityDays = settings?.return_validity_days ?? 7;

  let canRequestReturn = false;
  let returnExpiryDate = null;
  if (order.order_status === 'delivered' && order.delivered_at && !returnRequest) {
    const deliveredDate = new Date(order.delivered_at);
    returnExpiryDate = new Date(deliveredDate.getTime() + validityDays * 24 * 60 * 60 * 1000);
    canRequestReturn = new Date() <= returnExpiryDate;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
      default: return 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-white/5 border-primary-100 dark:border-white/10';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered': return <Package className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-primary-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link 
        href="/account/orders" 
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-900 dark:hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Order #{order.order_number}</h1>
          <div className="flex items-center gap-4 text-sm text-primary-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> 
              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="w-1 h-1 bg-primary-300 rounded-full" />
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              {order.order_items?.length} Items
            </span>
          </div>
        </div>
        {order.order_status !== 'cancelled' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold uppercase ${getStatusColor(order.payment_status)}`}>
            {order.payment_status === 'paid' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            Payment: {order.payment_status}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Return Request Details */}
          {returnRequest && (
            <div className="bg-white dark:bg-black/40 border border-primary-100 dark:border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-primary-50 dark:border-white/5 pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-accent animate-pulse" /> Return Request Details
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  returnRequest.status === 'approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' 
                    : returnRequest.status === 'rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                }`}>
                  Status: {returnRequest.status}
                </span>
              </div>
              <div className="text-sm space-y-3">
                <p className="text-primary-600 dark:text-primary-300">
                  You requested a return for this order on{' '}
                  <strong>{new Date(returnRequest.created_at).toLocaleDateString()}</strong>.
                </p>
                
                {returnRequest.admin_notes && (
                  <div className="p-4 bg-primary-50 dark:bg-white/5 rounded-2xl border border-primary-100 dark:border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-400 mb-1">Feedback from Admin</p>
                    <p className="text-primary-700 dark:text-primary-200 italic">"{returnRequest.admin_notes}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {canRequestReturn && (
            <div className="bg-white dark:bg-black/40 border border-primary-100 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-accent" /> Need to Return Something?
                </h3>
                <p className="text-sm text-primary-500">
                  You can request a return for this order until{' '}
                  <strong className="text-primary-800 dark:text-white">
                    {returnExpiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </strong>.
                </p>
              </div>
              <Link
                href={`/account/orders/${order.id}/return`}
                className="btn-primary py-3 px-6 rounded-2xl shadow-lg shadow-primary-900/10 font-bold text-sm text-center shrink-0"
              >
                Request Return
              </Link>
            </div>
          )}

          {/* Order Status Timeline (Simplified) */}
          <div className="bg-white dark:bg-black/40 border border-primary-100 dark:border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5" /> Order Status
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 dark:bg-white/5 p-3 rounded-2xl">
                  {getOrderStatusIcon(order.order_status)}
                </div>
                <div>
                  <p className="font-bold text-primary-900 dark:text-white uppercase tracking-wide text-sm">{order.order_status}</p>
                  <p className="text-xs text-primary-500 mt-0.5">Your order is currently being processed.</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <PayNowButton order={order} />
                <CancelOrderButton 
                  orderId={order.id} 
                  orderStatus={order.order_status} 
                  paymentStatus={order.payment_status}
                  className="bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-black/40 border border-primary-100 dark:border-white/10 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-primary-50 dark:border-white/5">
              <h3 className="text-lg font-bold">Items Ordered</h3>
            </div>
            <div className="divide-y divide-primary-50 dark:divide-white/5">
              {order.order_items?.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="w-20 h-24 bg-primary-50 dark:bg-white/5 rounded-2xl flex-shrink-0 overflow-hidden border border-primary-100 dark:border-white/10">
                    {(item.image_snapshot || item.products?.product_images?.[0]?.image_url) ? (
                      <img 
                        src={item.image_snapshot || item.products?.product_images?.[0]?.image_url} 
                        alt={item.product_title_snapshot}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-primary-300 font-bold uppercase tracking-widest">
                        Fyxen
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-primary-900 dark:text-white line-clamp-1">{item.product_title_snapshot}</h4>
                    <p className="text-sm text-primary-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary-900 dark:text-white mt-2">₹{item.unit_price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-900 dark:text-white">₹{item.total_price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-primary-900 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-primary-900/20">
            <h3 className="text-lg font-bold mb-6">Payment Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-primary-300">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {order.wallet_amount_used > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Wallet Payment</span>
                  <span>-₹{order.wallet_amount_used.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-primary-300">
                <span>Shipping</span>
                <span>{order.shipping_amount === 0 ? 'FREE' : `₹${order.shipping_amount}`}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-base">Grand Total</span>
                <span className="font-bold text-2xl tracking-tight">₹{order.grand_total.toLocaleString('en-IN')}</span>
              </div>

              {/* Wallet Cashback Info */}
              {order.wallet_cashback_amount > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        order.order_status === 'delivered' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-primary-400'
                      }`}>
                        <Star className={`w-4 h-4 ${order.order_status === 'delivered' ? 'fill-current' : ''}`} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-tight text-primary-200">
                          {order.order_status === 'delivered' ? 'Cashback Earned' : 'Cashback Pending'}
                        </span>
                        <span className="text-[10px] text-primary-400">₹2 per ₹100 spend</span>
                      </div>
                    </div>
                    <span className={`text-base font-black ${order.order_status === 'delivered' ? 'text-accent' : 'text-primary-300'}`}>
                      +₹{order.wallet_cashback_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white dark:bg-black/40 border border-primary-100 dark:border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Shipping Address
            </h3>
            <div className="text-sm space-y-1 text-primary-900 dark:text-primary-200">
              <p className="font-bold">{order.shipping_full_name}</p>
              <p>{order.shipping_line1}</p>
              {order.shipping_line2 && <p>{order.shipping_line2}</p>}
              <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}</p>
              <p className="pt-2 font-medium flex items-center gap-2 text-primary-500">
                <Clock className="w-3.5 h-3.5" /> {order.shipping_phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
