"use client";

import { useState } from 'react';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ productId, stockQuantity = 0, className = '' }) {
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

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
      setTimeout(() => setState('idle'), 2000);
    }
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-100 dark:bg-primary-800 rounded-lg cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={state === 'loading' || state === 'success'}
        className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2
          ${state === 'success'
            ? 'bg-green-600 text-white'
            : state === 'error'
            ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
            : 'bg-primary-900 dark:bg-white text-white dark:text-primary-900 hover:bg-primary-700 dark:hover:bg-gray-100 active:scale-95'
          }`}
      >
        {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {state === 'success' && <Check className="w-3.5 h-3.5" />}
        {state === 'idle' && <ShoppingBag className="w-3.5 h-3.5" />}
        {state === 'loading' ? 'Adding...' : state === 'success' ? 'Added!' : state === 'error' ? 'Failed' : 'Add to Cart'}
      </button>
      {state === 'error' && errorMsg && (
        <p className="text-[10px] text-red-500 mt-1 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
