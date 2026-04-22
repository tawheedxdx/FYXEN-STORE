'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, deleteProductImage } from '@/app/(admin)/admin/products/actions';
import { Upload, X, Loader2, ImagePlus, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProductForm({ categories, product }) {
  const router = useRouter();
  const isEditing = !!product;
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(
    product?.product_images?.sort((a, b) => a.sort_order - b.sort_order) || []
  );
  const [titleValue, setTitleValue] = useState(product?.title || '');
  const [highlights, setHighlights] = useState(product?.highlights || []);

  const addHighlight = () => {
    setHighlights([...highlights, { icon: 'Zap', text: '' }]);
  };

  const updateHighlight = (index, field, value) => {
    const newHighlights = [...highlights];
    newHighlights[index][field] = value;
    setHighlights(newHighlights);
  };

  const removeHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setImagePreviews(prev => {
      const newPrev = [...prev];
      URL.revokeObjectURL(newPrev[index].url);
      newPrev.splice(index, 1);
      return newPrev;
    });
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeExistingImage = async (imageId, imageUrl) => {
    const res = await deleteProductImage(imageId, imageUrl);
    if (res?.success) {
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target);

    // Attach file previews to form data
    formData.delete('images'); // clear
    imagePreviews.forEach(p => formData.append('images', p.file));
    if (isEditing) {
      formData.set('existingSortMax', String(existingImages.length));
    }

    if (isEditing) {
      const res = await updateProduct(product.id, formData);
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        setSuccess(true);
        setImagePreviews([]);
        setIsLoading(false);
      }
    } else {
      // createProduct redirects on success
      await createProduct(formData);
      // If we reach here, it means redirect happened — but handle error
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error / Success */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Product updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Product Details</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Product Title *</label>
              <input name="title" required className="input-field" placeholder="e.g. Premium Leather Wallet"
                value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Slug *</label>
              <div className="input-field bg-primary-50 text-primary-500 cursor-not-allowed">
                {slugify(titleValue) || 'auto-generated-from-title'}
              </div>
              <input type="hidden" name="slug" value={slugify(titleValue)} readOnly />
              <p className="text-xs text-primary-400 mt-1">Auto-generated from title.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <input name="shortDescription" className="input-field" placeholder="One-liner product description" defaultValue={product?.short_description || ''} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Description</label>
              <textarea name="description" rows={6} className="input-field resize-none" placeholder="Detailed product description..." defaultValue={product?.description || ''} />
            </div>
          </div>
          
          {/* Product Highlights */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-primary-100 pb-3">
              <h2 className="font-bold text-lg">Product Highlights</h2>
              <button 
                type="button" 
                onClick={addHighlight}
                className="text-sm font-bold text-primary-600 hover:text-primary-900 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5 rotate-180" /> Add Highlight
              </button>
            </div>

            {highlights.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-primary-50 rounded-xl">
                <p className="text-sm text-primary-400">No highlights added yet. Click the button above to add one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-4 items-start bg-primary-50/50 p-4 rounded-xl border border-primary-50">
                    <div className="shrink-0 pt-1">
                      <div className="w-8 h-8 rounded-lg bg-white border border-primary-200 flex items-center justify-center text-primary-500 font-bold text-xs">
                        {i + 1}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Icon Name (Lucide)</label>
                        <input 
                          className="input-field py-1.5 text-sm" 
                          placeholder="e.g. Battery, Zap, Bluetooth" 
                          value={h.icon}
                          onChange={(e) => updateHighlight(i, 'icon', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Highlight Text</label>
                        <input 
                          className="input-field py-1.5 text-sm" 
                          placeholder="e.g. Fast Charging Support" 
                          value={h.text}
                          onChange={(e) => updateHighlight(i, 'text', e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeHighlight(i)}
                      className="shrink-0 p-2 text-red-400 hover:text-red-600 transition-colors mt-5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <input type="hidden" name="highlights" value={JSON.stringify(highlights)} />
            <p className="text-xs text-primary-400">
              Icons use Lucide React names. Common ones: <strong>Battery, Zap, Speaker, Bluetooth, Music, Shield, Truck</strong>.
            </p>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <h2 className="font-bold text-lg border-b border-primary-100 pb-3">SEO (Optional)</h2>
            <div>
              <label className="block text-sm font-medium mb-2">SEO Title</label>
              <input name="seoTitle" className="input-field" placeholder="Defaults to product title" defaultValue={product?.seo_title || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SEO Description</label>
              <textarea name="seoDescription" rows={3} className="input-field resize-none" placeholder="Defaults to short description" defaultValue={product?.seo_description || ''} />
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Panels */}
        <div className="space-y-6">

          {/* Pricing */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Pricing & Promotions</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input name="price" type="number" step="0.01" required min="0" className="input-field" placeholder="0.00" defaultValue={product?.price || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Compare At Price (₹)</label>
              <input name="compareAtPrice" type="number" step="0.01" min="0" className="input-field" placeholder="0.00 (for sale badge)" defaultValue={product?.compare_at_price || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Promo Tag (Deal Badge)</label>
              <input name="promoTag" className="input-field" placeholder="e.g. SUPER DEALS, LIMITED OFFER" defaultValue={product?.promo_tag || ''} />
              <p className="text-[10px] text-primary-400 mt-1">Leave empty to hide the badge.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Shipping Price (₹)</label>
              <input name="shippingPrice" type="number" step="0.01" min="0" className="input-field" placeholder="0.00" defaultValue={product?.shipping_price ?? 0} />
              <p className="text-[10px] text-primary-400 mt-1">Enter 0 for "Zero Shipping Charges".</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax / GST (%)</label>
              <input name="taxRate" type="number" step="0.01" min="0" className="input-field" placeholder="0" defaultValue={product?.tax_rate ?? 0} />
              <p className="text-[10px] text-primary-400 mt-1">Percentage of tax to apply (e.g. 18 for 18% GST).</p>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Inventory</h2>
            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input name="sku" className="input-field" placeholder="e.g. FYX-001" defaultValue={product?.sku || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
              <input name="stockQuantity" type="number" min="0" required className="input-field" placeholder="0" defaultValue={product?.stock_quantity ?? 0} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input name="brand" className="input-field" placeholder="e.g. Fyxen" defaultValue={product?.brand || ''} />
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Organization</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select name="categoryId" className="input-field" defaultValue={product?.category_id || ''}>
                <option value="">No Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Featured Product</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="featured" value="true" className="sr-only peer"
                  defaultChecked={product?.featured || false} />
                <div className="w-10 h-5 bg-primary-200 rounded-full peer peer-checked:bg-primary-900 transition-colors"></div>
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active (visible in store)</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" value="true" className="sr-only peer"
                  defaultChecked={product?.is_active ?? true} />
                <div className="w-10 h-5 bg-primary-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-4">
            <h2 className="font-bold text-lg border-b border-primary-100 pb-3">Product Images</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-primary-500 font-medium uppercase">Current Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, i) => (
                    <div key={img.id} className="relative aspect-square rounded-md overflow-hidden group border border-primary-200">
                      <img src={img.image_url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id, img.image_url)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 bg-primary-900 text-white text-xs px-1 rounded">Main</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-primary-500 font-medium uppercase">New Images (to upload)</p>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden group border-2 border-dashed border-accent">
                      <img src={preview.url} alt={`New image ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-primary-200 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-8 h-8 text-primary-400" />
              <span className="text-sm font-medium text-primary-600">Click to upload images</span>
              <span className="text-xs text-primary-400">PNG, JPG, WebP supported. First image will be main image.</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
        <Link href="/admin/products" className="btn-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <button type="submit" disabled={isLoading} className="btn-primary min-w-[160px] h-11">
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
          ) : (
            isEditing ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
}
