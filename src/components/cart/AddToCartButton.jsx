'use client';

import { useState } from 'react';
import { ShoppingBag, Minus, Plus, Loader2, Check } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product, selectedVariant = null, showQuantity = true }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { openCart, refreshCart } = useCart();

  const currentStock = selectedVariant ? (selectedVariant.stock_quantity || 0) : (product.stock_quantity || 0);
  const isOutOfStock = currentStock <= 0;

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => Math.min(currentStock || 10, q + 1));

  const handleAddToCart = async () => {
    setIsAdding(true);
    setError(null);
    
    const res = await addToCart(product.id, quantity, selectedVariant?.id || null);
    
    if (res?.error) {
      if (res.error.includes('sign in')) {
        router.push('/login?redirect=/product/' + product.slug);
      } else {
        setError(res.error);
      }
      setIsAdding(false);
    } else {
      setIsSuccess(true);
      await refreshCart();
      openCart();
      setTimeout(() => {
        setIsAdding(false);
        setIsSuccess(false);
      }, 1500);
    }
  };

  // If product has variants but none is selected, disable button
  const requiresSelection = product.product_variants?.length > 0 && !selectedVariant;

  return (
    <div className={`flex flex-col gap-2 ${showQuantity ? 'flex-[1.2]' : 'flex-1'}`}>
      {error && <p className="text-rose-500 text-xs font-semibold">{error}</p>}
      <div className="flex gap-2">
        {showQuantity && (
          <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl h-12 w-28 shrink-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
            <button 
              type="button"
              onClick={handleDecrease}
              disabled={isOutOfStock || requiresSelection}
              className="flex-1 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Decrease"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-black text-sm text-neutral-900 dark:text-white">{quantity}</span>
            <button 
              type="button"
              onClick={handleIncrease}
              disabled={isOutOfStock || requiresSelection || quantity >= currentStock}
              className="flex-1 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Increase"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        
        <button 
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || requiresSelection || isAdding}
          className={`btn-primary flex-1 h-12 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
            isSuccess ? 'bg-emerald-600 dark:bg-emerald-600 text-white' : ''
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Adding...
            </span>
          ) : isSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Added to Bag
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {requiresSelection ? 'Select Options' : isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
