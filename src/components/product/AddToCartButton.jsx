"use client";

import { useState } from 'react';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ productId, stockQuantity = 0, className = '' }) {
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const { openCart, refreshCart } = useCart();

  const isOutOfStock = stockQuantity <= 0;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setState('loading');
    setErrorMsg('');

    const result = await addToCart(productId, 1);

    if (result?.error) {
      if (result.error.includes('sign in')) {
        router.push('/login');
        return;
      }
      setErrorMsg(result.error);
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    } else {
      setState('success');
      await refreshCart();
      openCart();
      setTimeout(() => setState('idle'), 1500);
    }
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-xl cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm
          ${state === 'success'
            ? 'bg-emerald-600 text-white'
            : state === 'error'
            ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800'
            : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-black dark:hover:bg-neutral-100 active:scale-98'
          }`}
      >
        {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {state === 'success' && <Check className="w-3.5 h-3.5" />}
        {state === 'idle' && <ShoppingBag className="w-3.5 h-3.5" />}
        {state === 'loading' ? 'Adding...' : state === 'success' ? 'Added to Bag' : state === 'error' ? 'Failed' : 'Add to Bag'}
      </button>
      {state === 'error' && errorMsg && (
        <p className="text-[10px] text-rose-500 mt-1 text-center font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
