'use client';

import { useState } from 'react';
import { createCoupon } from '@/app/(admin)/admin/coupons/actions';
import { Loader2, Plus, X } from 'lucide-react';

export default function CouponForm({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    const res = await createCoupon(formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsOpen(false);
      if (onSuccess) onSuccess();
    }
    setIsLoading(false);
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Create Coupon
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-primary-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-primary-100 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">New Discount Coupon</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-primary-100 dark:hover:bg-white/5 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <input name="code" type="text" required placeholder="SAVE20" className="input-field uppercase" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select name="discountType" className="input-field">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input name="discountValue" type="number" step="0.01" required className="input-field" placeholder="20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Order (₹)</label>
              <input name="minOrderAmount" type="number" step="0.01" className="input-field" placeholder="500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input name="usageLimit" type="number" className="input-field" placeholder="100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Starts At</label>
              <input name="startsAt" type="datetime-local" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ends At</label>
              <input name="endsAt" type="datetime-local" className="input-field" />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
