'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ChevronDown } from 'lucide-react';

export default function PaymentStatusDropdown({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setIsLoading(true);
    
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setStatus(newStatus);
    } else {
      console.error(error);
      alert('Failed to update status');
    }
    setIsLoading(false);
  }

  const colors = {
    cod: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isLoading}
        className={`appearance-none pl-2 pr-8 py-1 rounded text-xs font-bold uppercase cursor-pointer border-none focus:ring-2 focus:ring-accent outline-none transition-all ${colors[status] || 'bg-primary-100'}`}
      >
        <option value="cod">CoD</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
        <option value="refunded">Refunded</option>
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary-500">
        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
      </div>
    </div>
  );
}
