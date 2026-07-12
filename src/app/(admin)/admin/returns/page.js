import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RotateCcw, ExternalLink, HelpCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

export const metadata = {
  title: 'Returns Management | Admin',
};

export default async function AdminReturnsPage(props) {
  const searchParams = await props.searchParams;
  const activeStatus = searchParams.status || 'pending';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Fetch all requests to compute stats
  const { data: allRequests, error: fetchError } = await supabase
    .from('return_requests')
    .select('*, orders(order_number, grand_total), profiles(full_name, email)')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching return requests:', fetchError);
  }

  const requests = allRequests || [];

  // Count stats
  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    total: requests.length
  };

  // Filter based on activeStatus
  const filteredRequests = activeStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === activeStatus);

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-100',
    approved: 'bg-green-50 text-green-800 border-green-100',
    rejected: 'bg-red-50 text-red-800 border-red-100',
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Return Requests</h1>
          <p className="text-primary-500 mt-1">Manage product returns and process refunds.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/returns/questions" 
            className="btn-outline flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
          >
            <HelpCircle className="w-4 h-4" /> Manage Return Questions
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50/50 border-yellow-100' },
          { label: 'Approved & Refunded', value: stats.approved, color: 'text-green-600', bg: 'bg-green-50/50 border-green-100' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50/50 border-red-100' },
          { label: 'Total Requests', value: stats.total, color: 'text-primary-900', bg: 'bg-primary-50/50 border-primary-100' }
        ].map((item, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border ${item.bg} shadow-sm space-y-1`}>
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">{item.label}</p>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs & Table Container */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-primary-100 gap-6 text-sm">
          {[
            { id: 'pending', label: `Pending (${stats.pending})` },
            { id: 'approved', label: `Approved (${stats.approved})` },
            { id: 'rejected', label: `Rejected (${stats.rejected})` },
            { id: 'all', label: `All (${stats.total})` }
          ].map(tab => (
            <Link
              key={tab.id}
              href={`/admin/returns?status=${tab.id}`}
              className={`pb-3 border-b-2 font-bold transition-all ${
                activeStatus === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-primary-400 hover:text-primary-950'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-primary-100">
            <RotateCcw className="w-12 h-12 text-primary-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary-900">No return requests</h3>
            <p className="text-primary-500 mt-1">There are no return requests in this category.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-primary-100 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-sm min-w-[800px]">
              <thead>
                <tr className="bg-primary-50/50 text-primary-600 font-medium">
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Returned Items</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4">Return Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Requested On</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {filteredRequests.map(req => {
                  const StatusIcon = statusIcons[req.status] || Clock;
                  const itemNames = req.items?.map(it => `${it.product_title} (x${it.quantity})`).join(', ');

                  return (
                    <tr key={req.id} className="hover:bg-primary-50/20 transition-colors">
                      <td className="p-4 font-bold text-primary-900">
                        {req.orders?.order_number || '—'}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-primary-900">{req.profiles?.full_name || '—'}</p>
                        <p className="text-xs text-primary-400">{req.profiles?.email || '—'}</p>
                      </td>
                      <td className="p-4 max-w-xs truncate text-primary-600" title={itemNames}>
                        {itemNames || '—'}
                      </td>
                      <td className="p-4 font-semibold text-primary-900">
                        ₹{req.orders?.grand_total || '—'}
                      </td>
                      <td className="p-4 font-semibold text-primary-900">
                        {req.return_fee > 0 ? `₹${req.return_fee.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[req.status]}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-primary-500">
                        {new Date(req.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/returns/${req.id}`}
                          className="btn-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-bold"
                        >
                          Review <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
