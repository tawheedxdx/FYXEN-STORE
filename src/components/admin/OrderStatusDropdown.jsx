'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'return_approved', 'refunded'];

export default function OrderStatusDropdown({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    const oldStatus = status;
    setLoading(true);

    const supabase = createClient();
    const updatePayload = { 
      order_status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (newStatus === 'delivered') {
      updatePayload.delivered_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updatePayload.delivered_at = null;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (!error) {
      setStatus(newStatus);
    } else {
      alert('Failed to update status: ' + error.message);
    }
    
    setLoading(false);
  };

  const colors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
    packed: 'bg-purple-50 text-purple-800 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    delivered: 'bg-green-50 text-green-800 border-green-200',
    cancelled: 'bg-red-50 text-red-800 border-red-200',
    return_approved: 'bg-amber-50 text-amber-800 border-amber-200',
    refunded: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-bold uppercase rounded-md px-2 py-1.5 border ${colors[status] || 'bg-gray-50'} cursor-pointer focus:outline-none disabled:opacity-70`}
    >
      {ORDER_STATUSES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
