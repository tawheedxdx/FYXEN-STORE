'use client';

import { useState } from 'react';
import { upsertPromoBanner } from '@/app/(admin)/admin/promo-banner/actions';
import { Loader2, Check, X, Palette } from 'lucide-react';

export default function PromoBannerForm({ banner = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target);
    if (banner) formData.set('id', banner.id);

    const res = await upsertPromoBanner(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      if (!banner) e.target.reset();
      setTimeout(() => window.location.reload(), 1000);
    }
    setLoading(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <Check className="w-4 h-4" /> Banner {banner ? 'updated' : 'created'} successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight">Badge Text</label>
              <input
                type="text"
                name="badge_text"
                defaultValue={banner?.badge_text || 'Limited Time Offer'}
                className="input-field"
                placeholder="e.g. New Arrival"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight">Main Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={banner?.title || ''}
                className="input-field"
                placeholder="e.g. Summer Collection Now Live."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight">Subtitle</label>
              <textarea
                name="subtitle"
                defaultValue={banner?.subtitle || ''}
                className="input-field resize-none"
                rows={3}
                placeholder="Banner description..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight">Button Text</label>
              <input
                type="text"
                name="button_text"
                defaultValue={banner?.button_text || 'Shop the Drop'}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight">Button Link</label>
              <input
                type="text"
                name="button_link"
                defaultValue={banner?.button_link || '/shop'}
                className="input-field"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Background
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    name="bg_color"
                    defaultValue={banner?.bg_color || '#E0FF00'}
                    className="h-10 w-10 rounded cursor-pointer border-none p-0"
                  />
                  <input
                    type="text"
                    defaultValue={banner?.bg_color || '#E0FF00'}
                    className="input-field py-2 text-xs"
                    onChange={(e) => {
                      const picker = e.target.previousSibling;
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) picker.value = e.target.value;
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary-900 mb-2 uppercase tracking-tight flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Text Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    name="text_color"
                    defaultValue={banner?.text_color || '#0F172A'}
                    className="h-10 w-10 rounded cursor-pointer border-none p-0"
                  />
                  <input
                    type="text"
                    defaultValue={banner?.text_color || '#0F172A'}
                    className="input-field py-2 text-xs"
                    onChange={(e) => {
                      const picker = e.target.previousSibling;
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) picker.value = e.target.value;
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="is_active"
                    value="true"
                    defaultChecked={banner ? banner.is_active : false}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
                <span className="text-sm font-bold text-primary-900 uppercase tracking-tight group-hover:text-primary-700 transition-colors">
                  Banner Active
                </span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : banner ? 'Update Banner' : 'Create Banner'}
        </button>
      </form>
    </div>
  );
}
