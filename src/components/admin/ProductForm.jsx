'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, deleteProductImage } from '@/app/(admin)/admin/products/actions';
import { Upload, X, Loader2, ImagePlus, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import IconPicker from './IconPicker';

const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // fallback to original
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        resolve(file);
      };
    };
    reader.onerror = () => {
      resolve(file);
    };
  });
};

const buildCategoryPath = (cat, allCategories) => {
  if (!cat) return '';
  const path = [cat.name];
  let current = cat;
  const visited = new Set();
  while (current.parent_id) {
    if (visited.has(current.parent_id)) break;
    visited.add(current.parent_id);
    const parent = allCategories.find(c => c.id === current.parent_id);
    if (!parent) break;
    path.unshift(parent.name);
    current = parent;
  }
  return path.join(' > ');
};

export default function ProductForm({ categories, product }) {
  const router = useRouter();
  const formattedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    parent_id: c.parent_id,
    path: buildCategoryPath(c, categories)
  })).sort((a, b) => a.path.localeCompare(b.path));
  const isEditing = !!product;
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(
    product?.product_images?.sort((a, b) => a.sort_order - b.sort_order) || []
  );
  const [titleValue, setTitleValue] = useState(product?.title || '');
  const [highlights, setHighlights] = useState(product?.highlights || []);
  const [boxContents, setBoxContents] = useState(product?.box_contents || []);

  // --- Variants State ---
  const [hasVariants, setHasVariants] = useState(
    product?.product_variants?.length > 0 || false
  );

  const getInitialOptions = (variants) => {
    if (!variants || variants.length === 0) {
      return [{ name: 'Size', values: [], rawInput: '' }];
    }
    const optionsMap = {};
    variants.forEach(v => {
      Object.entries(v.attributes_json || {}).forEach(([name, value]) => {
        if (!optionsMap[name]) {
          optionsMap[name] = new Set();
        }
        optionsMap[name].add(value);
      });
    });
    return Object.entries(optionsMap).map(([name, set]) => {
      const values = Array.from(set);
      return {
        name,
        values,
        rawInput: values.join(', ')
      };
    });
  };

  const [options, setOptions] = useState(() => getInitialOptions(product?.product_variants));

  const [variantsList, setVariantsList] = useState(() => {
    if (!product?.product_variants) return [];
    return product.product_variants.map(v => ({
      id: v.id,
      sku: v.sku || '',
      price: v.price || '',
      compareAtPrice: v.compare_at_price || '',
      stockQuantity: v.stock_quantity || 0,
      attributes: v.attributes_json || {},
      images: v.images || [],
      newFiles: [],
      previewUrls: []
    }));
  });

  const [basePrice, setBasePrice] = useState(product?.price || '');
  const [baseComparePrice, setBaseComparePrice] = useState(product?.compare_at_price || '');
  const [baseStock, setBaseStock] = useState(product?.stock_quantity || 0);

  const cartesianProduct = (arrays) => {
    return arrays.reduce((acc, curr) => {
      return acc.flatMap(d => curr.map(e => [...d, e]));
    }, [[]]);
  };

  const generateCombinations = () => {
    const activeOptions = options.filter(opt => opt.name.trim() && opt.values.length > 0);
    if (activeOptions.length === 0) {
      setVariantsList([]);
      return;
    }

    const arrays = activeOptions.map(opt => opt.values.map(val => ({ name: opt.name.trim(), value: val.trim() })));
    const combinations = cartesianProduct(arrays);

    const newList = combinations.map(combination => {
      const attributes = {};
      combination.forEach(item => {
        attributes[item.name] = item.value;
      });

      const match = variantsList.find(v => {
        return Object.entries(attributes).every(([key, value]) => v.attributes[key] === value) &&
               Object.keys(v.attributes).length === Object.keys(attributes).length;
      });

      if (match) {
        return match;
      } else {
        return {
          tempId: `var-${Math.random().toString(36).substr(2, 9)}`,
          attributes,
          price: basePrice || '',
          compareAtPrice: baseComparePrice || '',
          sku: '',
          stockQuantity: baseStock || 0,
          images: [],
          newFiles: [],
          previewUrls: []
        };
      }
    });

    setVariantsList(newList);
  };

  const addOption = () => {
    setOptions([...options, { name: '', values: [], rawInput: '' }]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOptionName = (index, name) => {
    const newOptions = [...options];
    newOptions[index].name = name;
    setOptions(newOptions);
  };

  const updateOptionValues = (index, valueString) => {
    const values = valueString.split(',').map(v => v.trim()).filter(Boolean);
    const newOptions = [...options];
    newOptions[index].values = values;
    newOptions[index].rawInput = valueString;
    setOptions(newOptions);
  };

  const updateVariantField = (index, field, value) => {
    const newVariants = [...variantsList];
    newVariants[index][field] = value;
    setVariantsList(newVariants);
  };

  const handleVariantImageChange = async (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsCompressing(true);
      try {
        const compressedFiles = await Promise.all(
          files.map(file => compressImage(file))
        );
        const newVariants = [...variantsList];
        const currentFiles = newVariants[index].newFiles || [];
        const currentPreviews = newVariants[index].previewUrls || [];
        
        newVariants[index].newFiles = [...currentFiles, ...compressedFiles];
        newVariants[index].previewUrls = [
          ...currentPreviews,
          ...compressedFiles.map(file => URL.createObjectURL(file))
        ];
        setVariantsList(newVariants);
      } catch (err) {
        console.error('Error compressing variant images:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removeUploadedVariantImage = (variantIndex, imageIndex) => {
    const newVariants = [...variantsList];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    setVariantsList(newVariants);
  };

  const removeNewVariantImage = (variantIndex, fileIndex) => {
    const newVariants = [...variantsList];
    const newFiles = [...(newVariants[variantIndex].newFiles || [])];
    const previewUrls = [...(newVariants[variantIndex].previewUrls || [])];
    
    if (previewUrls[fileIndex]) {
      URL.revokeObjectURL(previewUrls[fileIndex]);
    }
    
    newVariants[variantIndex].newFiles = newFiles.filter((_, i) => i !== fileIndex);
    newVariants[variantIndex].previewUrls = previewUrls.filter((_, i) => i !== fileIndex);
    setVariantsList(newVariants);
  };

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

  const addBoxContent = () => {
    setBoxContents([...boxContents, { icon: 'Package', text: '' }]);
  };

  const updateBoxContent = (index, field, value) => {
    const newBoxContents = [...boxContents];
    newBoxContents[index][field] = value;
    setBoxContents(newBoxContents);
  };

  const removeBoxContent = (index) => {
    setBoxContents(boxContents.filter((_, i) => i !== index));
  };

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsCompressing(true);
      try {
        const compressedFiles = await Promise.all(
          files.map(file => compressImage(file))
        );
        const previews = compressedFiles.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setImagePreviews(prev => [...prev, ...previews]);
      } catch (err) {
        console.error('Error compressing images:', err);
      } finally {
        setIsCompressing(false);
      }
    }
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

    // Attach variant images and variant JSON
    if (hasVariants) {
      const cleanVariants = variantsList.map(v => ({
        id: v.id,
        tempId: v.tempId,
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stockQuantity: v.stockQuantity,
        attributes: v.attributes,
        images: v.images
      }));
      formData.set('variants', JSON.stringify(cleanVariants));

      // Append files
      variantsList.forEach(v => {
        if (v.newFiles && v.newFiles.length > 0) {
          v.newFiles.forEach(file => {
            formData.append(`variant_images_${v.id || v.tempId}`, file);
          });
        }
      });
    } else {
      formData.set('variants', JSON.stringify([]));
    }

    try {
      if (isEditing) {
        const res = await updateProduct(product.id, formData);
        if (res?.error) {
          setError(res.error);
          setIsLoading(false);
        } else {
          setSuccess(true);
          setImagePreviews([]);
          setIsLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        const res = await createProduct(formData);
        if (res?.error) {
          setError(res.error);
          setIsLoading(false);
        }
        // If successful, createProduct handles the redirect via NEXT_REDIRECT error
      }
    } catch (err) {
      // Next.js redirect() throws an error, we must re-throw it so Next.js can handle the redirect
      if (err.message === 'NEXT_REDIRECT' || err.digest?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      console.error('Error saving product:', err);
      setError(err.message || 'An unexpected error occurred while saving the product. Please try again.');
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
                        <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Select Icon</label>
                        <IconPicker 
                          value={h.icon}
                          onChange={(newIcon) => updateHighlight(i, 'icon', newIcon)}
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
          </div>

          {/* What's Inside The Box */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-primary-100 pb-3">
              <h2 className="font-bold text-lg">What's Inside The Box</h2>
              <button 
                type="button" 
                onClick={addBoxContent}
                className="text-sm font-bold text-primary-600 hover:text-primary-900 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5 rotate-180" /> Add Item
              </button>
            </div>

            {boxContents.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-primary-50 rounded-xl">
                <p className="text-sm text-primary-400">No items added yet. Click the button above to add one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {boxContents.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start bg-primary-50/50 p-4 rounded-xl border border-primary-50">
                    <div className="shrink-0 pt-1">
                      <div className="w-8 h-8 rounded-lg bg-white border border-primary-200 flex items-center justify-center text-primary-500 font-bold text-xs">
                        {i + 1}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Select Icon</label>
                        <IconPicker 
                          value={item.icon}
                          onChange={(newIcon) => updateBoxContent(i, 'icon', newIcon)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Item Description / Name</label>
                        <input 
                          className="input-field py-1.5 text-sm" 
                          placeholder="e.g. Type-C charging cable, User manual" 
                          value={item.text}
                          onChange={(e) => updateBoxContent(i, 'text', e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeBoxContent(i)}
                      className="shrink-0 p-2 text-red-400 hover:text-red-600 transition-colors mt-5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <input type="hidden" name="boxContents" value={JSON.stringify(boxContents)} />
          </div>

          {/* Product Variants */}
          <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-primary-100 pb-3">
              <h2 className="font-bold text-lg">Product Variants</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary-500 font-medium">Enable Variants</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-primary-200 rounded-full peer peer-checked:bg-primary-900 transition-colors"></div>
                  <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></span>
                </label>
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-6">
                {/* Options Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-700">Configure Options</span>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-xs font-bold text-primary-600 hover:text-primary-900 bg-primary-50 px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      + Add Option (e.g. Size, Color)
                    </button>
                  </div>

                  {options.map((opt, index) => (
                    <div key={index} className="flex gap-4 items-start bg-primary-50/30 p-4 rounded-xl border border-primary-100">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Option Name</label>
                            <input
                              className="input-field py-1.5 text-sm"
                              placeholder="e.g. Size or Color"
                              value={opt.name}
                              onChange={(e) => updateOptionName(index, e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase font-bold text-primary-400 mb-1">Values (comma-separated)</label>
                            <input
                              className="input-field py-1.5 text-sm"
                              placeholder="e.g. Small, Medium, Large"
                              value={opt.rawInput !== undefined ? opt.rawInput : opt.values.join(', ')}
                              onChange={(e) => updateOptionValues(index, e.target.value)}
                            />
                          </div>
                        </div>

                        {opt.values.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {opt.values.map((v, valIdx) => (
                              <span key={valIdx} className="bg-primary-100 text-primary-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors mt-5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={generateCombinations}
                      className="w-full btn-outline py-2 text-xs font-bold border-primary-900 text-primary-900 dark:border-white dark:text-white hover:bg-primary-50 dark:hover:bg-white/10"
                    >
                      Generate/Update Combinations ({variantsList.length})
                    </button>
                  </div>
                </div>

                {/* Variants List / Combinations */}
                {variantsList.length > 0 && (
                  <div className="space-y-4 border-t border-primary-100 pt-4">
                    <span className="text-sm font-bold text-primary-700 block">Edit Variant Variations</span>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                      {variantsList.map((v, index) => {
                        const variantDisplayName = Object.entries(v.attributes)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(', ');

                        return (
                          <div key={v.id || v.tempId} className="p-4 rounded-xl border border-primary-100 bg-white dark:bg-primary-900/10 space-y-4 shadow-sm hover:border-primary-300 transition-all">
                            {/* Header: Title and Image Upload */}
                            <div className="flex flex-col gap-3 border-b border-primary-50 pb-3">
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-bold text-sm text-primary-950 dark:text-white">{variantDisplayName}</span>
                                
                                {/* Custom Upload Button */}
                                <label className="cursor-pointer text-xs font-bold text-primary-600 hover:text-primary-900 bg-primary-50 dark:bg-primary-800 px-2.5 py-1.5 rounded border border-primary-200 dark:border-white/10 dark:text-white">
                                  Upload Images
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handleVariantImageChange(index, e)}
                                  />
                                </label>
                              </div>

                              {/* Multi-Image Preview Container */}
                              <div className="flex flex-wrap gap-2 items-center">
                                {/* Already Uploaded Images */}
                                {v.images && v.images.map((imgUrl, imgIdx) => (
                                  <div key={`uploaded-${imgIdx}`} className="w-14 h-14 rounded-lg border border-primary-200 overflow-hidden bg-primary-50 shrink-0 relative group">
                                    <img src={imgUrl} alt="Variant" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeUploadedVariantImage(index, imgIdx)}
                                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-lg cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}

                                {/* New Image Previews */}
                                {v.previewUrls && v.previewUrls.map((prevUrl, prevIdx) => (
                                  <div key={`new-${prevIdx}`} className="w-14 h-14 rounded-lg border border-blue-300 overflow-hidden bg-primary-50 shrink-0 relative group">
                                    <img src={prevUrl} alt="New preview" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeNewVariantImage(index, prevIdx)}
                                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-lg cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                    <span className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] px-1 rounded-bl">New</span>
                                  </div>
                                ))}

                                {/* No Images Empty State */}
                                {(!v.images || v.images.length === 0) && (!v.previewUrls || v.previewUrls.length === 0) && (
                                  <div className="text-xs text-primary-400 font-medium italic">No images added</div>
                                )}
                              </div>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-primary-400 mb-0.5">Price (₹)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="input-field py-1 text-xs"
                                  placeholder="Price"
                                  value={v.price}
                                  onChange={(e) => updateVariantField(index, 'price', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-primary-400 mb-0.5">Compare (₹)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="input-field py-1 text-xs"
                                  placeholder="Compare"
                                  value={v.compareAtPrice}
                                  onChange={(e) => updateVariantField(index, 'compareAtPrice', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-primary-400 mb-0.5">SKU</label>
                                <input
                                  className="input-field py-1 text-xs"
                                  placeholder="SKU"
                                  value={v.sku}
                                  onChange={(e) => updateVariantField(index, 'sku', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-primary-400 mb-0.5">Stock</label>
                                <input
                                  type="number"
                                  min="0"
                                  className="input-field py-1 text-xs"
                                  placeholder="Stock"
                                  value={v.stockQuantity}
                                  onChange={(e) => updateVariantField(index, 'stockQuantity', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
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
              <input name="price" type="number" step="0.01" required min="0" className="input-field" placeholder="0.00" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Compare At Price (₹)</label>
              <input name="compareAtPrice" type="number" step="0.01" min="0" className="input-field" placeholder="0.00 (for sale badge)" value={baseComparePrice} onChange={(e) => setBaseComparePrice(e.target.value)} />
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
              <input name="stockQuantity" type="number" min="0" required className="input-field" placeholder="0" value={baseStock} onChange={(e) => setBaseStock(e.target.value)} />
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
                {formattedCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.path}</option>
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
              <label className="text-sm font-medium">Best Seller</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isBestSeller" value="true" className="sr-only peer"
                  defaultChecked={product?.is_best_seller || false} />
                <div className="w-10 h-5 bg-primary-200 rounded-full peer peer-checked:bg-primary-900 transition-colors"></div>
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">New Arrival</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isNewArrival" value="true" className="sr-only peer"
                  defaultChecked={product?.is_new_arrival || false} />
                <div className="w-10 h-5 bg-primary-200 rounded-full peer peer-checked:bg-primary-900 transition-colors"></div>
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">On Sale</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isOnSale" value="true" className="sr-only peer"
                  defaultChecked={product?.is_on_sale || false} />
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
        <button type="submit" disabled={isLoading || isCompressing} className="btn-primary min-w-[160px] h-11">
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
          ) : isCompressing ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Compressing...</span>
          ) : (
            isEditing ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
}
