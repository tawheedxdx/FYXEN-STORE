'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageGallery from '@/components/product/ImageGallery';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';
import RazorpayAffordabilityWidget from '@/components/common/RazorpayAffordabilityWidget';
import ShareButton from '@/components/product/ShareButton';
import { ShieldCheck, Truck, RotateCcw, CheckCircle2, MapPin, Sparkles, Star } from 'lucide-react';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductBoxContents from '@/components/product/ProductBoxContents';
import ProductOfferBadge from '@/components/product/ProductOfferBadge';

export default function ProductInteractiveSection({ product, offers = [] }) {
  // Parse available options and values
  const optionsMap = {};
  product.product_variants?.forEach((v) => {
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

  const mainCtaRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // PIN code delivery estimator state
  const [pincode, setPincode] = useState('');
  const [pinStatus, setPinStatus] = useState(null); // null | 'valid' | 'invalid'

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPinStatus('valid');
    } else {
      setPinStatus('invalid');
    }
  };

  useEffect(() => {
    const target = mainCtaRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Find currently active variant matching all selected options
  const selectedVariant = product.product_variants?.find((v) => {
    return Object.entries(selectedOptions).every(
      ([name, val]) => v.attributes_json?.[name] === val
    );
  });

  const handleSelectOption = (name, value) => {
    const newOptions = { ...selectedOptions, [name]: value };
    const exactMatch = product.product_variants?.find((v) =>
      Object.entries(newOptions).every(([k, val]) => v.attributes_json?.[k] === val)
    );

    if (exactMatch) {
      setSelectedOptions(newOptions);
    } else {
      const anyMatch = product.product_variants?.find(
        (v) => v.attributes_json?.[name] === value
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

  const discount =
    activeComparePrice > activePrice
      ? Math.round(((activeComparePrice - activePrice) / activeComparePrice) * 100)
      : 0;

  // Resolve gallery images
  const activeImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images.map((url, i) => ({ id: `${selectedVariant.id}-${i}`, image_url: url }))
      : product.product_images;

  // Calculate dynamic estimated delivery (3-4 days from today)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateFormatted = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 relative">
      {/* Left Column: Image Gallery */}
      <ImageGallery
        key={selectedVariant?.id || 'base'}
        images={activeImages}
        title={product.title}
      />

      {/* Right Column: Interactive Product Configuration */}
      <div className="flex flex-col">
        <div className="mb-6 border-b border-neutral-200/80 dark:border-neutral-800 pb-6">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.promo_tag && (
              <span className="badge-luxury bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                {product.promo_tag}
              </span>
            )}
            {discount > 0 && (
              <span className="badge-sale px-2.5 py-1 text-[10px] font-black uppercase rounded-md">
                {discount}% OFF
              </span>
            )}
            {product.is_best_seller && (
              <span className="badge-best px-2.5 py-1 text-[10px] font-black uppercase rounded-md">
                Best Seller
              </span>
            )}
            {product.is_new_arrival && (
              <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2.5 py-1 text-[10px] font-black uppercase rounded-md">
                New
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 ml-auto">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.9 / 5</span>
              <span className="text-neutral-400 font-normal">(148 Reviews)</span>
            </div>
          </div>

          <span className="text-xs font-bold tracking-widest uppercase text-[#c6a87c] mb-1.5 block">
            {product.brand || 'FYXEN'}
          </span>

          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              {product.title}
            </h1>
            <ShareButton
              title={product.title}
              text={product.short_description || product.description?.substring(0, 100)}
            />
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl md:text-4xl font-black text-neutral-950 dark:text-white">
              ₹{Number(activePrice).toLocaleString('en-IN')}
            </span>
            {activeComparePrice > activePrice && (
              <span className="text-lg md:text-xl text-neutral-400 line-through">
                ₹{Number(activeComparePrice).toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Save ₹{(activeComparePrice - activePrice).toLocaleString('en-IN')} ({discount}%)
              </span>
            )}
          </div>

          <p className="text-[11px] text-neutral-400 mb-4">
            Inclusive of all taxes &bull; Free express delivery available
          </p>

          {activeSku && (
            <div className="text-[11px] text-neutral-400 mb-4">
              SKU: <span className="font-mono text-neutral-600 dark:text-neutral-300">{activeSku}</span>
            </div>
          )}

          <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed font-light mb-6">
            {product.short_description || product.description}
          </p>

          <ProductOfferBadge offers={offers} />
        </div>

        {/* Configuration Area */}
        <div className="mb-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Availability:
            </span>
            {activeStock > 0 ? (
              <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                {activeStock <= 5 ? `Only ${activeStock} items remaining!` : 'In Stock • Ready to Dispatch'}
              </span>
            ) : (
              <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-bold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Variants Selector */}
          {options.length > 0 && (
            <div className="space-y-4 border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
              {options.map((option) => (
                <div key={option.name}>
                  <span className="block text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white mb-2">
                    {option.name}: <span className="text-[#c6a87c] font-semibold">{selectedOptions[option.name] || 'Select'}</span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {option.values.map((val) => {
                      const isSelected = selectedOptions[option.name] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSelectOption(option.name, val)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950 shadow-sm'
                              : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900'
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

          {/* Indian PIN Delivery Estimator */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-[#c6a87c]" />
              <span>Check Delivery Availability</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  setPinStatus(null);
                }}
                placeholder="Enter 6-digit Pincode (e.g. 400001)"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
              >
                Check
              </button>
            </form>
            {pinStatus === 'valid' && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Delivery available! Estimated by <strong>{deliveryDateFormatted}</strong> with Express Shipping.
              </p>
            )}
            {pinStatus === 'invalid' && (
              <p className="text-[11px] text-rose-500 font-medium">
                Please enter a valid 6-digit Indian PIN code.
              </p>
            )}
          </div>

          <RazorpayAffordabilityWidget price={activePrice} />

          {/* Main Action CTAs */}
          <div ref={mainCtaRef} className="flex flex-col sm:flex-row gap-3 pt-2">
            <AddToCartButton product={product} selectedVariant={selectedVariant} />
            <BuyNowButton product={product} selectedVariant={selectedVariant} />
          </div>
        </div>

        {/* Trust Highlight Cards */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/30 border border-neutral-200/80 dark:border-neutral-800 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-[#c6a87c] shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">Pan-India Express</span>
            <span className="text-[10px] text-neutral-400">2-4 Business Days</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">1 Year Warranty</span>
            <span className="text-[10px] text-neutral-400">100% Genuine</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-amber-500 shadow-xs">
              <RotateCcw className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">7-Day Return</span>
            <span className="text-[10px] text-neutral-400">Hassle-Free</span>
          </div>
        </div>

        {/* Dynamic Highlights */}
        <ProductHighlights highlights={product.highlights} />

        {/* In The Box */}
        <ProductBoxContents boxContents={product.box_contents} />

        {/* Description */}
        {product.description && (
          <div className="mt-8 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-3 text-neutral-950 dark:text-white">Product Overview</h3>
            <div className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-light">
              {product.description}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Buy Drawer on Scroll */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 shadow-2xl md:hidden flex items-center justify-between gap-3"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {product.title}
              </span>
              <span className="text-sm font-black text-neutral-950 dark:text-white">
                ₹{Number(activePrice).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AddToCartButton product={product} selectedVariant={selectedVariant} showQuantity={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
