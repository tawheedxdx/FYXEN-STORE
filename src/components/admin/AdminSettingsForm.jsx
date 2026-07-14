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

      {/* Partial Payment Settings */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
        <h2 className="font-bold text-lg border-b border-primary-100 pb-3 flex items-center gap-2">
          Partial Payment Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold block">Enable Partial Payment</label>
              <span className="text-xs text-primary-400">If enabled, COD option will be replaced with Partial Payment.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="partialPaymentEnabled"
                value="true"
                defaultChecked={settings?.partial_payment_enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Partial Payment Percentage (%)</label>
            <input 
              name="partialPaymentPercentage" 
              type="number"
              min="1"
              max="100"
              className="input-field" 
              placeholder="e.g. 10"
              defaultValue={settings?.partial_payment_percentage || 10} 
            />
            <p className="text-xs text-primary-400 mt-2">
              * The percentage of the grand total amount that the customer pays online at checkout. The remaining balance is paid on delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Homepage Customization */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-6">
        <h2 className="font-bold text-lg border-b border-primary-100 pb-3 flex items-center justify-between">
          <span>Homepage Curated Section</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="curatedSectionEnabled"
              value="true"
              defaultChecked={settings?.curated_section_enabled ?? true}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Section Badge / Title</label>
            <input 
              name="curatedSectionTitle" 
              className="input-field" 
              defaultValue={settings?.curated_section_title || 'Curated For You'} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section Heading</label>
            <input 
              name="curatedSectionHeading" 
              className="input-field" 
              defaultValue={settings?.curated_section_heading || 'Fyxen Favourites'} 
            />
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-primary-100">
          {[0, 1, 2].map((idx) => {
            const b = settings?.curated_banners_json?.[idx] || {};
            const num = idx + 1;
            return (
              <div key={idx} className="p-4 bg-primary-50/50 dark:bg-primary-950/20 rounded-xl space-y-4 border border-primary-100/50">
                <h3 className="font-bold text-sm text-primary-800 dark:text-primary-200 font-bold">Banner {num}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-primary-600">Label</label>
                    <input 
                      name={`banner${num}_label`} 
                      className="input-field bg-white" 
                      defaultValue={b.label || ''} 
                      placeholder={idx === 0 ? 'Best Sellers' : idx === 1 ? 'New Arrivals' : 'On Sale'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-primary-600">CTA (Button Text)</label>
                    <input 
                      name={`banner${num}_cta`} 
                      className="input-field bg-white" 
                      defaultValue={b.cta || ''} 
                      placeholder={idx === 0 ? 'Shop the Collection' : idx === 1 ? 'View New Arrivals' : 'Shop the Sale'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-primary-600">Tagline / Description</label>
                  <input 
                    name={`banner${num}_tagline`} 
                    className="input-field bg-white" 
                    defaultValue={b.tagline || ''} 
                    placeholder="Brief description line..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-primary-600">Link URL</label>
                    <input 
                      name={`banner${num}_href`} 
                      className="input-field bg-white" 
                      defaultValue={b.href || ''} 
                      placeholder="/category/slug"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-primary-600">Image URL</label>
                    <input 
                      name={`banner${num}_image`} 
                      className="input-field bg-white" 
                      defaultValue={b.image || ''} 
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
