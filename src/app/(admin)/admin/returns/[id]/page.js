import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, User, ShoppingBag, ClipboardList, HelpCircle } from 'lucide-react';
import ReviewClient from './ReviewClient';

export const metadata = {
  title: 'Review Return Request | Admin',
};

export default async function ReviewReturnRequestPage(props) {
  const params = await props.params;
  const { id } = params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Fetch request details
  const { data: request, error } = await supabase
    .from('return_requests')
    .select('*, orders(*), profiles(*)')
    .eq('id', id)
    .single();

  if (error || !request) {
    console.error('Error fetching return request details:', error);
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-primary-900">Return request not found</h2>
        <p className="text-primary-500 mt-2">The return request you are looking for does not exist or has been deleted.</p>
        <Link href="/admin/returns" className="btn-primary inline-flex mt-4 px-6 py-2.5 rounded-xl text-sm">
          Back to Returns
        </Link>
      </div>
    );
  }

  // Resolve image URLs in answers if any
  const answers = request.answers || [];
  for (const ans of answers) {
    if (ans.type === 'image') {
      const path = ans.image_url || ans.answer;
      if (path) {
        if (path.startsWith('http://') || path.startsWith('https://')) {
          ans.resolvedUrl = path;
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('return-images')
            .getPublicUrl(path);
          ans.resolvedUrl = publicUrl;
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link 
          href="/admin/returns" 
          className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-950 font-semibold mb-2 group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Returns
        </Link>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold text-primary-900">Return Request</h1>
          <span className="text-sm text-primary-400 font-mono">ID: {request.id.slice(0, 8)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer & Order Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Details */}
            <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-primary-900 border-b border-primary-100 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-accent" /> Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Full Name</span>
                  <span className="font-medium text-primary-900">{request.profiles?.full_name || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Email Address</span>
                  <span className="text-primary-600 font-medium">{request.profiles?.email || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Order Contact Phone</span>
                  <span className="text-primary-900 font-medium">{request.orders?.shipping_phone || '—'}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-primary-900 border-b border-primary-100 pb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-accent" /> Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Order Number</span>
                  <Link 
                    href={`/admin/orders/${request.order_id}`}
                    className="font-bold text-accent hover:underline flex items-center gap-1 inline-flex"
                  >
                    {request.orders?.order_number || '—'} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Grand Total</span>
                    <span className="font-semibold text-primary-900">₹{request.orders?.grand_total || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Payment Mode</span>
                    <span className="font-medium text-primary-900 uppercase">{request.orders?.payment_method || '—'}</span>
                  </div>
                </div>
                {request.return_fee > 0 && (
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-700">Return Fee Applied</span>
                    <span className="font-bold text-amber-700">₹{request.return_fee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div>
                  <span className="block text-xs text-primary-400 font-semibold uppercase tracking-wider">Delivered On</span>
                  <span className="font-medium text-primary-900">
                    {request.orders?.delivered_at 
                      ? new Date(request.orders.delivered_at).toLocaleString() 
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Returned Items */}
          <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-primary-900 border-b border-primary-100 pb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-accent" /> Items Requested for Return
            </h3>
            <div className="divide-y divide-primary-100">
              {request.items?.map((item, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-primary-900">{item.product_title}</span>
                    <span className="text-primary-400 block text-xs">Item ID: {item.order_item_id.slice(0, 8)}...</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-primary-400">Qty to Return: </span>
                    <span className="font-bold text-primary-900 text-base">{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Answers / Proofs */}
          <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-primary-900 border-b border-primary-100 pb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" /> Return Questions & Answers
            </h3>
            
            <div className="space-y-6">
              {answers.map((ans, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-sm font-semibold text-primary-800 flex items-start gap-2">
                    <span className="text-accent">Q:</span>
                    <span>{ans.question_text}</span>
                  </div>
                  <div className="pl-6 text-sm">
                    {ans.type === 'image' ? (
                      <div className="space-y-2">
                        <span className="text-xs text-primary-400 block">Uploaded Photo Proof:</span>
                        {ans.resolvedUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-primary-100 max-w-md bg-primary-50">
                            <img 
                              src={ans.resolvedUrl} 
                              alt="Proof of Return" 
                              className="max-h-[300px] w-auto object-contain mx-auto"
                            />
                            <a 
                              href={ans.resolvedUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity gap-1"
                            >
                              Open Full Image <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-primary-400 italic">No image file found.</span>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 bg-primary-50 rounded-xl border border-primary-100 text-primary-900">
                        {ans.answer || <span className="text-primary-400 italic">No answer provided.</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {answers.length === 0 && (
                <p className="text-sm text-primary-400 italic text-center py-4">No answers submitted.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right column - moderation */}
        <div className="lg:col-span-1">
          <ReviewClient 
            requestId={request.id} 
            currentStatus={request.status} 
            initialNotes={request.admin_notes} 
            orderStatus={request.orders?.order_status}
          />
        </div>
      </div>
    </div>
  );
}
