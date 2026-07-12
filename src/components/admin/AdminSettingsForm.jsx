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

      {/* Website Status */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
        <h2 className="font-bold text-lg border-b border-primary-100 pb-3 flex items-center gap-2">
          Website Status
        </h2>
        <div>
          <label className="block text-sm font-medium mb-2">Store Mode</label>
          <select 
            name="siteMode" 
            className="input-field" 
            defaultValue={settings?.site_mode || 'online'}
          >
            <option value="online">Online (Default - Publicly accessible)</option>
            <option value="maintenance">Maintenance Mode (Accessible to Admins only)</option>
            <option value="offline">Offline (Not accessible to anyone)</option>
          </select>
          <p className="text-xs text-primary-400 mt-2">
            * Maintenance mode allows you to work on the store while showing a notice to customers.
          </p>
        </div>
      </div>

      {/* Return Settings */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
        <h2 className="font-bold text-lg border-b border-primary-100 pb-3 flex items-center gap-2">
          Return Settings
        </h2>
        <div>
          <label className="block text-sm font-medium mb-2">Return Validity (Days)</label>
          <input 
            name="returnValidityDays" 
            type="number"
            min="1"
            className="input-field" 
            placeholder="e.g. 7"
            defaultValue={settings?.return_validity_days || 7} 
          />
          <p className="text-xs text-primary-400 mt-2">
            * The number of days a customer has to request a return after their order is marked as delivered.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Return Fee (Orders under ₹1,000)</label>
          <input 
            name="returnFeeUnder1000" 
            type="number"
            min="0"
            className="input-field" 
            placeholder="e.g. 100"
            defaultValue={settings?.return_fee_under_1000 || 0} 
          />
          <p className="text-xs text-primary-400 mt-2">
            * The fee charged for return requests on orders whose total value is less than ₹1,000.
          </p>
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
