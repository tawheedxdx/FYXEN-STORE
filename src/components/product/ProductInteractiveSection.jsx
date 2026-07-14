'use client';

import { useState } from 'react';
import ImageGallery from '@/components/product/ImageGallery';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';
import RazorpayAffordabilityWidget from '@/components/common/RazorpayAffordabilityWidget';
import ShareButton from '@/components/product/ShareButton';
import { ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductBoxContents from '@/components/product/ProductBoxContents';

export default function ProductInteractiveSection({ product }) {
  // Parse available options and values
  const optionsMap = {};
  product.product_variants?.forEach(v => {
    Object.entries(v.attributes_json || {}).forEach(([name, val]) => {
      if (!optionsMap[name]) {
        optionsMap[name] = new Set();
      }
      optionsMap[name].add(val);
    });
  });

  const options = Object.entries(optionsMap).map(([name, set]) => ({
    name,
    values: Array.from(set),
  }));

  // Initial selection is the first variant or empty if no variants
  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (product.product_variants?.length > 0) {
      return product.product_variants[0].attributes_json || {};
    }
    return {};
  });

  // Find currently active variant matching all selected options
  const selectedVariant = product.product_variants?.find(v => {
    return Object.entries(selectedOptions).every(
      ([name, val]) => v.attributes_json?.[name] === val
    );
  });

  const handleSelectOption = (name, value) => {
    const newOptions = { ...selectedOptions, [name]: value };
    const exactMatch = product.product_variants.find(v =>
      Object.entries(newOptions).every(([k, val]) => v.attributes_json?.[k] === val)
    );

    if (exactMatch) {
      setSelectedOptions(newOptions);
    } else {
      // Find any variant that matches this new option value to preserve validity
      const anyMatch = product.product_variants.find(
        v => v.attributes_json?.[name] === value
      );
      if (anyMatch) {
        setSelectedOptions(anyMatch.attributes_json || {});
      } else {
        setSelectedOptions(newOptions);
      }
    }
  };

  // Resolve values based on variant selection
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeComparePrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
  const activeStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;

  const discount = activeComparePrice > activePrice
    ? Math.round(((activeComparePrice - activePrice) / activeComparePrice) * 100)
    : 0;

  // Resolve gallery images
  const activeImages = selectedVariant?.images?.length > 0
    ? selectedVariant.images.map((url, i) => ({ id: `${selectedVariant.id}-${i}`, image_url: url }))
    : product.product_images;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
      {/* Left: Product Images */}
      <ImageGallery
        key={selectedVariant?.id || 'base'}
        images={activeImages}
        title={product.title}
      />

      {/* Right: Product Info */}
      <div className="flex flex-col">
        <div className="mb-6 border-b border-primary-100 dark:border-white/10 pb-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.promo_tag && (
              <span className="badge badge-promo px-3 py-1 text-[11px] rounded-full">
                {product.promo_tag}
              </span>
            )}
            {(discount > 0 || product.is_on_sale) && (
              <span className="badge badge-sale px-3 py-1 text-[11px] rounded-full">
                {discount > 0 ? `${discount}% OFF` : 'SALE'}
              </span>
            )}
            {product.is_best_seller && (
              <span className="badge badge-best px-3 py-1 text-[11px] rounded-full text-black">
                Best Seller
              </span>
            )}
            {product.is_new_arrival && (
              <span className="badge badge-new px-3 py-1 text-[11px] rounded-full">
                New
              </span>
            )}
            {product.featured && !product.promo_tag && !product.is_best_seller && !product.is_new_arrival && (
              <span className="badge badge-featured px-3 py-1 text-[11px] rounded-full">
                Featured
              </span>
            )}
          </div>

          <span className="text-sm font-bold tracking-widest uppercase text-primary-400 mb-2 block">
            {product.brand || 'Fyxen'}
          </span>
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900 dark:text-white">
              {product.title}
            </h1>
            <ShareButton
              title={product.title}
              text={product.short_description || product.description?.substring(0, 100)}
            />
          </div>

          <div className="flex items-center gap-4 mb-2">
            {discount > 0 && (
              <div className="flex items-center gap-1.5 text-green-600 font-bold text-2xl md:text-3xl">
                <span className="text-xl md:text-2xl">↓</span>
                {discount}%
              </div>
            )}
            {activeComparePrice > activePrice && (
              <span className="text-xl md:text-2xl text-primary-400 line-through">
                ₹{activeComparePrice}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-primary-900 dark:text-white">
                ₹{activePrice}
              </span>
              {product.tax_rate > 0 && (
                <span className="text-sm md:text-base text-primary-400 font-medium">+ GST</span>
              )}
            </div>
          </div>

          {activeSku && (
            <div className="text-xs text-primary-400 mb-2">
              SKU: <span className="font-mono">{activeSku}</span>
            </div>
          )}

          <div className="mb-6">
            {product.shipping_price > 0 ? (
              <span className="text-sm font-medium text-primary-500 flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Shipping: ₹{product.shipping_price}
              </span>
            ) : (
              <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Zero Shipping Charges
              </span>
            )}
          </div>

          <p className="text-primary-600 dark:text-primary-300 text-lg leading-relaxed">
            {product.short_description || product.description}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="font-medium text-primary-900 dark:text-white">Availability:</span>
            {activeStock > 0 ? (
              <span className="text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                {activeStock <= 5 ? `Only ${activeStock} left!` : 'In Stock'}
              </span>
            ) : (
              <span className="text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Render option selectors */}
          {options.length > 0 && (
            <div className="space-y-4 mb-6 border-t border-primary-100 dark:border-white/10 pt-4">
              {options.map(option => (
                <div key={option.name}>
                  <span className="block text-sm font-bold text-primary-900 dark:text-white mb-2">
                    Select {option.name}:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {option.values.map(val => {
                      const isSelected = selectedOptions[option.name] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSelectOption(option.name, val)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                            isSelected
                              ? 'border-primary-900 bg-primary-900 text-white dark:border-white dark:bg-white dark:text-black shadow-sm'
                              : 'border-primary-200 dark:border-white/10 hover:border-primary-400 text-primary-600 dark:text-primary-300 bg-white dark:bg-primary-950/20'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <RazorpayAffordabilityWidget price={activePrice} />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <AddToCartButton product={product} selectedVariant={selectedVariant} />
            <BuyNowButton product={product} selectedVariant={selectedVariant} />
          </div>
        </div>

        {/* Trust Highlights */}
        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-4 text-primary-900 dark:text-primary-300">
            <Truck className="w-5 h-5" />
            <span className="text-sm font-medium">Fast Shipping across India</span>
          </div>
          <div className="flex items-center gap-4 text-primary-900 dark:text-primary-300">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">1 Year Premium Warranty</span>
          </div>
          <div className="flex items-center gap-4 text-primary-900 dark:text-primary-300">
            <RotateCcw className="w-5 h-5" />
            <span className="text-sm font-medium">15-Day Hassle-Free Returns</span>
          </div>
        </div>

        {/* Dynamic Product Highlights */}
        <ProductHighlights highlights={product.highlights} />

        {/* What's Inside The Box */}
        <ProductBoxContents boxContents={product.box_contents} />

        {/* Full Description */}
        <div className="mt-8 prose prose-primary dark:prose-invert max-w-none">
          <h3 className="text-xl font-bold mb-4">Description</h3>
          <div className="text-primary-600 dark:text-primary-300 whitespace-pre-wrap leading-loose">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
