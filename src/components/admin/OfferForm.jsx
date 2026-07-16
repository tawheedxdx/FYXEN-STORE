'use client';

import { useState, useEffect } from 'react';
import { createOffer, updateOffer } from '@/app/(admin)/admin/offers/actions';
import { Loader2, Plus, X, Upload, Search, Check, AlertCircle } from 'lucide-react';

export default function OfferForm({ offer = null, products = [], onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(offer?.image_url || null);
  
  // Search and select state for eligible products
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState(offer?.eligible_product_ids || []);

  useEffect(() => {
    if (offer) {
      setSelectedProductIds(offer.eligible_product_ids || []);
      setImagePreview(offer.image_url || null);
    }
  }, [offer]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleProduct = (id) => {
    setSelectedProductIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedProductIds(products.map(p => p.id));
  };

  const handleClearAll = () => {
    setSelectedProductIds([]);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parse ISO Dates to local datetime-local format
  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target);
    formData.set('eligible_product_ids', JSON.stringify(selectedProductIds));
    
    // Add current image url in case we are editing and not replacing the file
    if (offer) {
      formData.set('current_image_url', offer.image_url || '');
    }

    const res = offer ? await updateOffer(offer.id, formData) : await createOffer(formData);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 800);
    }
    setIsLoading(false);
  }

  // Trigger modal open
  const triggerButton = offer ? (
    <button 
      onClick={() => setIsOpen(true)}
      className="p-2 text-primary-600 hover:text-accent hover:bg-primary-50 rounded-lg transition-all"
      title="Edit Offer"
    >
      Edit
    </button>
  ) : (
    <button 
      onClick={() => setIsOpen(true)}
      className="btn-primary flex items-center gap-2"
    >
      <Plus className="w-4 h-4" /> Create Offer
    </button>
  );

  if (!isOpen) return triggerButton;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-primary-950 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-primary-100 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-900 dark:text-white">
            {offer ? 'Edit Giveaways & Offers' : 'New Giveaways & Offers'}
          </h2>
          <button 
            type="button"
            onClick={() => setIsOpen(false)} 
            className="p-2 hover:bg-primary-100 dark:hover:bg-white/5 rounded-full transition-colors text-primary-400 hover:text-primary-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Offer {offer ? 'updated' : 'created'} successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Offer Title *</label>
                <input 
                  name="title" 
                  type="text" 
                  required 
                  defaultValue={offer?.title || ''} 
                  placeholder="e.g. Win ₹5000 Giveaway" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Subtitle</label>
                <input 
                  name="subtitle" 
                  type="text" 
                  defaultValue={offer?.subtitle || ''} 
                  placeholder="e.g. Free entry on eligible purchases" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea 
                  name="description" 
                  defaultValue={offer?.description || ''} 
                  rows={3}
                  placeholder="Tell customers about the giveaway, rewards, and how to participate..." 
                  className="input-field resize-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Terms & Conditions</label>
                <textarea 
                  name="terms" 
                  defaultValue={offer?.terms || ''} 
                  rows={3}
                  placeholder="List official terms, entry conditions, eligibility rules, and lucky draw dates..." 
                  className="input-field resize-none text-xs font-mono" 
                />
              </div>
            </div>

            {/* Visual Uploads & Date controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Banner Image</label>
                <div className="border-2 border-dashed border-primary-200 hover:border-primary-400 dark:border-white/10 dark:hover:border-white/30 rounded-xl p-4 transition-all relative flex flex-col items-center justify-center min-h-[140px] bg-primary-50/20 dark:bg-white/2 cursor-pointer group">
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-[120px] rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-bold">
                        Replace Image
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-primary-300 group-hover:text-primary-500 mb-2 transition-colors" />
                      <span className="text-xs text-primary-500 font-bold uppercase tracking-wider">Choose Banner Photo</span>
                      <span className="text-[10px] text-primary-400 mt-1">PNG, JPG, or WebP up to 5MB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Starts At *</label>
                  <input 
                    name="starts_at" 
                    type="datetime-local" 
                    required
                    defaultValue={formatDateTime(offer?.starts_at) || formatDateTime(new Date().toISOString())}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5 uppercase tracking-wider">Ends At *</label>
                  <input 
                    name="ends_at" 
                    type="datetime-local" 
                    required
                    defaultValue={formatDateTime(offer?.ends_at)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer group py-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="active"
                      value="true"
                      defaultChecked={offer ? offer.active : true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </div>
                  <span className="text-xs font-bold text-primary-900 dark:text-primary-200 uppercase tracking-wider group-hover:text-primary-700 transition-colors">
                    Make Offer Active
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Eligibility Selector */}
          <div className="border-t border-primary-100 dark:border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-sm text-primary-900 dark:text-white uppercase tracking-wider">Eligible Products Selection</h3>
                <p className="text-xs text-primary-500 mt-0.5">
                  {selectedProductIds.length === 0 
                    ? '🌟 Applies to ALL products (Site-wide)' 
                    : `Selected ${selectedProductIds.length} of ${products.length} products`}
                </p>
              </div>
              <div className="flex gap-2 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 bg-primary-100 hover:bg-primary-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors text-primary-700 dark:text-primary-200"
                >
                  Select All
                </button>
                <button 
                  type="button" 
                  onClick={handleClearAll}
                  className="px-3 py-1.5 bg-primary-100 hover:bg-primary-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors text-primary-700 dark:text-primary-200"
                >
                  Applies to All (Site-wide)
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                type="text" 
                placeholder="Search products by title or SKU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>

            {/* Search results scroll area */}
            <div className="border border-primary-100 dark:border-white/10 rounded-xl divide-y divide-primary-50 dark:divide-white/5 max-h-[180px] overflow-y-auto bg-primary-50/10">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-xs text-primary-400 font-medium">
                  No matching products found
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <label 
                      key={p.id} 
                      className={`flex items-center justify-between p-3 cursor-pointer text-xs transition-colors hover:bg-primary-50/50 dark:hover:bg-white/5 ${isChecked ? 'bg-primary-50/20 dark:bg-white/2' : ''}`}
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleProduct(p.id)}
                          className="w-4 h-4 rounded text-accent accent-accent shrink-0 cursor-pointer"
                        />
                        <span className="font-semibold text-primary-800 dark:text-primary-200 line-clamp-1">{p.title}</span>
                      </div>
                      {p.sku && (
                        <span className="font-mono text-primary-400 text-[10px] uppercase tracking-wider shrink-0">{p.sku}</span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-primary-100 dark:border-white/10 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 border border-primary-200 hover:border-primary-450 dark:border-white/10 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors hover:bg-primary-50 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : offer ? 'Update Offer' : 'Save Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
