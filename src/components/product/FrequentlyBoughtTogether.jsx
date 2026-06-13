"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, ShoppingBag, Loader2 } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function FrequentlyBoughtTogether({ product, recommendations = [] }) {
  const router = useRouter();
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [checkProductB, setCheckProductB] = useState(true);

  if (recommendations.length === 0) return null;

  const productB = recommendations[0];
  const total = Number(product.price) + (checkProductB ? Number(productB.price) : 0);
  const compareTotal = Number(product.compare_at_price || product.price) + (checkProductB ? Number(productB.compare_at_price || productB.price) : 0);
  const isBOutOfStock = productB.stock_quantity <= 0;

  const handleAddBundle = async () => {
    setState('loading');
    setErrorMsg('');

    try {
      // Add current product
      const resA = await addToCart(product.id, 1);
      if (resA?.error) {
        if (resA.error.includes('sign in')) {
          router.push('/login');
          return;
        }
        throw new Error(resA.error);
      }

      // Add product B if checked and in stock
      if (checkProductB && !isBOutOfStock) {
        const resB = await addToCart(productB.id, 1);
        if (resB?.error) {
          throw new Error(resB.error);
        }
      }

      setState('success');
      setTimeout(() => {
        setState('idle');
        router.refresh();
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add bundle to cart.');
      setState('error');
      setTimeout(() => setState('idle'), 4000);
    }
  };

  return (
    <div className="py-10 border-t border-primary-100 dark:border-white/10 mt-12">
      <h3 className="text-xl font-bold tracking-tight text-primary-900 dark:text-white mb-6">Frequently Bought Together</h3>
      
      <div className="flex flex-col md:flex-row gap-6 md:items-center bg-primary-50/50 dark:bg-primary-950/10 p-6 rounded-2xl border border-primary-100 dark:border-white/10">
        
        {/* Bundle Products Display */}
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* Product A */}
          <div className="flex items-center gap-4 bg-white dark:bg-black p-3 rounded-xl border border-primary-100 dark:border-white/10 shadow-sm max-w-sm flex-1">
            <div className="relative w-16 h-20 bg-primary-50 rounded-lg overflow-hidden shrink-0">
              {product.product_images?.[0]?.image_url ? (
                <Image src={product.product_images[0].image_url} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-primary-300 font-bold">Fyxen</div>
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider block">{product.brand || 'Fyxen'}</span>
              <h4 className="font-semibold text-primary-900 dark:text-white text-xs truncate max-w-[150px]">{product.title}</h4>
              <span className="text-xs font-bold text-primary-900 dark:text-white block mt-1">₹{Number(product.price).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Plus className="w-5 h-5 text-primary-400 shrink-0 mx-auto" />

          {/* Product B */}
          <div className={`flex items-center gap-4 bg-white dark:bg-black p-3 rounded-xl border border-primary-100 dark:border-white/10 shadow-sm max-w-sm flex-1 ${!checkProductB ? 'opacity-60' : ''}`}>
            <div className="relative w-16 h-20 bg-primary-50 rounded-lg overflow-hidden shrink-0">
              {productB.product_images?.[0]?.image_url ? (
                <Image src={productB.product_images[0].image_url} alt={productB.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-primary-300 font-bold">Fyxen</div>
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider block">{productB.brand || 'Fyxen'}</span>
              <Link href={`/product/${productB.slug}`} className="font-semibold text-primary-900 dark:text-white text-xs truncate hover:underline block max-w-[150px]">{productB.title}</Link>
              <span className="text-xs font-bold text-primary-900 dark:text-white block mt-1">₹{Number(productB.price).toLocaleString('en-IN')}</span>
            </div>
            {!isBOutOfStock && (
              <input
                type="checkbox"
                checked={checkProductB}
                onChange={(e) => setCheckProductB(e.target.checked)}
                className="w-4 h-4 text-primary-900 border-primary-300 rounded focus:ring-primary-900 shrink-0 cursor-pointer ml-2"
              />
            )}
          </div>
        </div>

        {/* Bundle Price and Buy CTA */}
        <div className="flex-1 flex flex-col md:items-end justify-center border-t md:border-t-0 md:border-l border-primary-100 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="mb-4">
            <span className="text-xs text-primary-400 font-medium block md:text-right">Total Bundle Price</span>
            <div className="flex items-baseline gap-2 md:justify-end">
              {compareTotal > total && (
                <span className="text-sm text-primary-400 line-through">₹{compareTotal.toLocaleString('en-IN')}</span>
              )}
              <span className="text-2xl font-black text-primary-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
            </div>
            {compareTotal > total && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded mt-1 block w-max md:ml-auto">
                Save ₹{(compareTotal - total).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddBundle}
            disabled={state === 'loading' || state === 'success'}
            className={`w-full md:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer
              ${state === 'success'
                ? 'bg-green-600 text-white'
                : state === 'error'
                ? 'bg-red-100 text-red-600'
                : 'bg-primary-900 dark:bg-white text-white dark:text-primary-900 hover:bg-primary-700 dark:hover:bg-gray-100 active:scale-95'
              }`}
          >
            {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {state === 'success' && <Check className="w-3.5 h-3.5" />}
            {state === 'idle' && <ShoppingBag className="w-3.5 h-3.5" />}
            {state === 'loading' ? 'Adding Bundle...' : state === 'success' ? 'Bundle Added!' : state === 'error' ? 'Failed' : 'Add Bundle to Cart'}
          </button>
          {state === 'error' && errorMsg && (
            <p className="text-[10px] text-red-500 mt-1 text-center md:text-right">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
