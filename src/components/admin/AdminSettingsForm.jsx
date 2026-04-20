'use client';

import { useState } from 'react';
import { upsertSettings } from '@/app/(admin)/admin/settings/actions';
import { Loader2, Check } from 'lucide-react';

export default function AdminSettingsForm({ settings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    const res = await upsertSettings(formData);
    if (res?.error) setError(res.error);
    else setSuccess(true);
    setIsLoading(false);
  };

  return (
    <form action={handleSubmit} className="space-y-8 max-w-2xl">
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}

      {/* Brand Info */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
        <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Brand Information</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Store Name</label>
          <input name="companyName" className="input-field" defaultValue={settings?.company_name || 'Fyxen'} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Parent Company Name</label>
          <input name="parentCompanyName" className="input-field" defaultValue={settings?.parent_company_name || 'Bytread International Private Limited'} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">GST Number</label>
          <input name="gstNumber" className="input-field" placeholder="e.g. 27AABCU9603R1ZX" defaultValue={settings?.gst_number || ''} />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
        <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Contact & Support</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Support Email</label>
          <input name="supportEmail" type="email" className="input-field" placeholder="support@fyxen.com" defaultValue={settings?.support_email || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Support Phone</label>
          <input name="supportPhone" className="input-field" placeholder="+91 98765 43210" defaultValue={settings?.support_phone || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Business Address</label>
          <textarea name="address" rows={3} className="input-field resize-none" placeholder="Full business address..." defaultValue={settings?.address || ''} />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary h-11 min-w-[160px]">
        {isLoading ? (
          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
        ) : 'Save Settings'}
      </button>
    </form>
  );
}
