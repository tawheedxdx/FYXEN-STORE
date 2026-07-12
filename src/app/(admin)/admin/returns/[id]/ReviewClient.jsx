'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { processReturnRequest, refundReturnOrder } from '../actions';
import { useRouter } from 'next/navigation';

export default function ReviewClient({ requestId, currentStatus, initialNotes, orderStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(initialNotes || '');
  const [isPending, setIsPending] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [localOrderStatus, setLocalOrderStatus] = useState(orderStatus);
  const router = useRouter();

  useEffect(() => {
    setLocalOrderStatus(orderStatus);
  }, [orderStatus]);

  async function handleAction(newStatus) {
    if (!confirm(`Are you sure you want to mark this return request as ${newStatus}?`)) {
      return;
    }
    
    setIsPending(true);
    const res = await processReturnRequest(requestId, newStatus, notes);
    setIsPending(false);

    if (res.success) {
      setStatus(newStatus);
      if (newStatus === 'approved') {
        setLocalOrderStatus('return_approved');
      }
      router.refresh();
    } else {
      alert(res.error || 'Failed to process return request');
    }
  }

  async function handleRefund() {
    if (!confirm('Are you sure you want to process the refund for this order? This will mark the order and payment as refunded.')) {
      return;
    }

    setIsRefunding(true);
    const res = await refundReturnOrder(requestId);
    setIsRefunding(false);

    if (res.success) {
      setLocalOrderStatus('refunded');
      router.refresh();
    } else {
      alert(res.error || 'Failed to process refund');
    }
  }

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    approved: 'bg-green-50 text-green-800 border-green-200',
    rejected: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-6">
      <h3 className="font-bold text-lg text-primary-900 border-b border-primary-100 pb-3 flex items-center gap-2">
        <FileText className="w-5 h-5 text-accent" /> Moderation Panel
      </h3>

      <div className="space-y-4">
        <div>
          <span className="block text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
            Current Status
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        {status === 'pending' ? (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
                Admin Notes (Internal / Customer Feedback)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes about this return request (reason for approval/rejection)..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAction('approved')}
                className="flex-1 btn-primary bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-green-900/10 font-bold text-sm"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Approve Return
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAction('rejected')}
                className="flex-1 btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reject Return
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div>
              <span className="block text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
                Admin Notes
              </span>
              <div className="p-4 bg-primary-50 rounded-xl text-sm text-primary-700 italic border border-primary-100 min-h-[80px]">
                {notes || 'No notes provided.'}
              </div>
            </div>

            {status === 'approved' && localOrderStatus !== 'refunded' && (
              <div className="pt-2 border-t border-primary-100 space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <span className="font-bold">Refund Action Required:</span> This return is approved. Click below to finalize and process the refund.
                </div>
                <button
                  type="button"
                  disabled={isRefunding}
                  onClick={handleRefund}
                  className="w-full btn-primary bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-amber-900/10 font-bold text-sm"
                >
                  {isRefunding ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Process Refund
                </button>
              </div>
            )}

            {status === 'approved' && localOrderStatus === 'refunded' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 font-medium text-center">
                Refund has been processed and finalized.
              </div>
            )}

            <p className="text-xs text-primary-400 text-center italic">
              This request was resolved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
