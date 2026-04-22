import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, User, MapPin, Phone, Calendar, Hash } from 'lucide-react';
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown';
import PaymentStatusDropdown from '@/components/admin/PaymentStatusDropdown';

export const metadata = { title: 'Order Details | Admin' };

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email, phone), order_items(*)')
    .eq('id', id)
    .single();

  if (error || !order) notFound();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-primary-500 hover:text-accent transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-primary-900 flex items-center gap-3">
            Order <span className="text-accent">#{order.order_number}</span>
          </h1>
          <p className="text-primary-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white p-2 rounded-lg border border-primary-100 flex items-center gap-3 shadow-sm">
            <span className="text-xs font-bold uppercase text-primary-400 pl-2">Status</span>
            <OrderStatusDropdown orderId={order.id} currentStatus={order.order_status} />
          </div>
          <div className="bg-white p-2 rounded-lg border border-primary-100 flex items-center gap-3 shadow-sm">
            <span className="text-xs font-bold uppercase text-primary-400 pl-2">Payment</span>
            <PaymentStatusDropdown orderId={order.id} currentStatus={order.payment_status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Items & Summary */}
        <div className="xl:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-primary-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-primary-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Order Items ({order.order_items.length})</h2>
            </div>
            <div className="divide-y divide-primary-100">
              {order.order_items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-primary-50 rounded-lg overflow-hidden border border-primary-100 flex-shrink-0">
                    <img 
                      src={item.image_snapshot || '/placeholder.png'} 
                      alt={item.product_title_snapshot}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary-900 truncate">{item.product_title_snapshot}</h3>
                    <p className="text-sm text-primary-500">₹{item.unit_price} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-900">₹{item.total_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-xl border border-primary-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold border-b border-primary-100 pb-4 mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-primary-500">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-primary-500">
                <span>Shipping</span>
                <span>₹{order.shipping_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-primary-900 pt-4 border-t border-primary-100">
                <span>Total</span>
                <span>₹{order.grand_total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-8">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-primary-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Customer Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Name</p>
                <p className="font-semibold text-primary-900">{order.profiles?.full_name || order.shipping_full_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Email</p>
                <p className="text-primary-600">{order.profiles?.email || 'No email provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Phone</p>
                <div className="flex items-center gap-2 text-primary-900">
                  <Phone className="w-4 h-4 text-primary-400" />
                  <p className="font-medium">{order.shipping_phone || order.profiles?.phone || 'No phone'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-primary-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Shipping Address</h2>
            </div>
            <div className="space-y-2 text-primary-600">
              <p className="font-bold text-primary-900">{order.shipping_full_name}</p>
              <p>{order.shipping_line1}</p>
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
              <p>{order.shipping_country}</p>
            </div>
          </div>

          {/* Internal Notes / Metadata */}
          <div className="bg-primary-900 text-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Transaction Details</h2>
            </div>
            <div className="space-y-3 text-sm opacity-80">
              <p>Payment Method: <span className="font-bold text-white uppercase">{order.payment_method || 'Online'}</span></p>
              {order.razorpay_order_id && <p>RZP Order: {order.razorpay_order_id}</p>}
              {order.razorpay_payment_id && <p>RZP Payment: {order.razorpay_payment_id}</p>}
              <p>Internal ID: {order.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
