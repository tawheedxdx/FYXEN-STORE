import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, User, MapPin, Phone, Calendar, Hash, Gift } from 'lucide-react';
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown';
import PaymentStatusDropdown from '@/components/admin/PaymentStatusDropdown';
import OrderInvoiceButton from '@/components/admin/OrderInvoiceButton';

export const metadata = { title: 'Order Details | Admin' };

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: order, error } = await adminSupabase
    .from('orders')
    .select('*, profiles(full_name, email, phone), order_items(*)')
    .eq('id', id)
    .single();

  if (error || !order) notFound();

  let optedOffersDetails = [];
  if (order.opted_in_offers && order.opted_in_offers.length > 0) {
    const { data: dbOffers } = await adminSupabase
      .from('offers')
      .select('title, description')
      .in('id', order.opted_in_offers);
    if (dbOffers) optedOffersDetails = dbOffers;
  }

  // Check if invoice already exists
  const { data: existingInvoice } = await adminSupabase
    .from('invoices')
    .select('invoice_number')
    .eq('order_id', order.id)
    .maybeSingle();

  const items = order.order_items || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-primary-500 hover:text-accent transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
            Order <span className="text-accent">#{order.order_number}</span>
          </h1>
          <p className="text-primary-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <OrderInvoiceButton 
            orderId={order.id} 
            orderStatus={order.order_status} 
            existingInvoiceNumber={existingInvoice?.invoice_number} 
          />
          <div className="bg-white dark:bg-neutral-900 p-2 rounded-lg border border-primary-100 dark:border-neutral-800 flex items-center gap-3 shadow-sm">
            <span className="text-xs font-bold uppercase text-primary-400 pl-2">Status</span>
            <OrderStatusDropdown orderId={order.id} currentStatus={order.order_status} />
          </div>
          <div className="bg-white dark:bg-neutral-900 p-2 rounded-lg border border-primary-100 dark:border-neutral-800 flex items-center gap-3 shadow-sm">
            <span className="text-xs font-bold uppercase text-primary-400 pl-2">Payment</span>
            <PaymentStatusDropdown orderId={order.id} currentStatus={order.payment_status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Items & Summary */}
        <div className="xl:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-primary-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-primary-100 dark:border-neutral-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Order Items ({items.length})</h2>
            </div>
            <div className="divide-y divide-primary-100 dark:divide-neutral-800">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-primary-50 dark:bg-neutral-800 rounded-lg overflow-hidden border border-primary-100 dark:border-neutral-700 flex-shrink-0">
                    <img 
                      src={item.image_snapshot || '/placeholder.png'} 
                      alt={item.product_title_snapshot || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary-900 dark:text-white truncate">{item.product_title_snapshot}</h3>
                    <p className="text-sm text-primary-500">₹{Number(item.unit_price || 0).toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-900 dark:text-white">₹{Number(item.total_price || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opted-in Promotions & Giveaways */}
          {optedOffersDetails.length > 0 && (
            <div className="bg-green-500/5 rounded-xl border border-green-500/20 dark:border-green-500/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-green-500/10 dark:border-green-500/15 flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-bold text-green-950 dark:text-green-400">Opted-in Promotions & Giveaways</h2>
              </div>
              <div className="divide-y divide-green-500/10 dark:divide-green-500/10">
                {optedOffersDetails.map((offer, idx) => (
                  <div key={idx} className="p-6 space-y-1">
                    <h3 className="font-bold text-green-800 dark:text-green-400">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-sm text-green-700/80 dark:text-green-500/75 leading-relaxed">{offer.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-primary-100 dark:border-neutral-800 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold border-b border-primary-100 dark:border-neutral-800 pb-4 mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-primary-500">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{Number(order.discount_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-primary-500">
                <span>
                  {order.delivery_type === 'founder'
                    ? 'Founder In-Hand Delivery'
                    : order.delivery_type === 'express'
                      ? 'Express Delivery'
                      : 'Standard Shipping'}
                </span>
                <span>{Number(order.shipping_amount || 0) === 0 ? 'FREE' : `₹${Number(order.shipping_amount).toFixed(2)}`}</span>
              </div>
              {Number(order.cod_fee || 0) > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>COD Compliance Fee</span>
                  <span>+₹{Number(order.cod_fee).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-black text-primary-900 dark:text-white pt-4 border-t border-primary-100 dark:border-neutral-800">
                <span>Total</span>
                <span>₹{Number(order.grand_total || 0).toFixed(2)}</span>
              </div>

              {order.payment_method === 'PARTIAL' && (
                <div className="mt-4 pt-4 border-t border-primary-100 dark:border-neutral-800 space-y-2 text-sm">
                  <div className="flex justify-between text-primary-500">
                    <span>Paid Online (Booking)</span>
                    <span className="font-semibold text-primary-900 dark:text-white">₹{Number(order.partial_payment_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>COD Balance Due</span>
                    <span className="font-bold text-amber-800">₹{Number(order.cod_balance_amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-8">
          {/* Customer Info */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-primary-100 dark:border-neutral-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Customer Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Name</p>
                <p className="font-semibold text-primary-900 dark:text-white">{order.profiles?.full_name || order.shipping_full_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Email</p>
                <p className="text-primary-600 dark:text-neutral-400">{order.profiles?.email || 'No email provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Phone</p>
                <div className="flex items-center gap-2 text-primary-900 dark:text-white">
                  <Phone className="w-4 h-4 text-primary-400" />
                  <p className="font-medium">{order.shipping_phone || order.profiles?.phone || 'No phone'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-primary-100 dark:border-neutral-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Shipping Address</h2>
            </div>
            <div className="space-y-2 text-primary-600 dark:text-neutral-300">
              <p className="font-bold text-primary-900 dark:text-white">{order.shipping_full_name}</p>
              <p>{order.shipping_line1}</p>
              {order.shipping_line2 && <p>{order.shipping_line2}</p>}
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
              <p>{order.shipping_country || 'India'}</p>
            </div>
          </div>

          {/* Internal Notes / Metadata */}
          <div className="bg-primary-900 text-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Transaction Details</h2>
            </div>
            <div className="space-y-3 text-sm opacity-80">
              <p>Payment Method: <span className="font-bold text-white uppercase">{order.payment_method === 'PARTIAL' ? 'Partial Payment' : (order.payment_method || 'Online')}</span></p>
              {order.razorpay_order_id && <p>RZP Order: {order.razorpay_order_id}</p>}
              {order.razorpay_payment_id && <p>RZP Payment: {order.razorpay_payment_id}</p>}
              <p>Internal ID: {order.id}</p>
              
              {/* Policy Acceptance details */}
              <div className="border-t border-white/20 pt-3 mt-3 space-y-1 text-xs">
                <p className="text-accent font-bold">✓ Policy Agreement Signed</p>
                <p>Accepted: {order.terms_accepted ? 'Yes' : 'No'}</p>
                {order.terms_accepted_at && (
                  <p>Accepted At: {new Date(order.terms_accepted_at).toLocaleString()}</p>
                )}
                {order.terms_version && <p>Version: {order.terms_version}</p>}
                {order.user_ip && <p>User IP: {order.user_ip}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
