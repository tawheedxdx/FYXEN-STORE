'use client';

import { useState, useTransition } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => Math.min(product.stock_quantity || 10, q + 1));

  const handleAddToCart = async () => {
    setIsAdding(true);
    setError(null);
    
    const res = await addToCart(product.id, quantity);
    
    if (res?.error) {
      if (res.error.includes('sign in')) {
        router.push('/login');
      } else {
        setError(res.error);
      }
      setIsAdding(false);
    } else {
      startTransition(() => {
        router.push('/cart');
      });
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="flex flex-col gap-2 flex-[1.2]">
      {error && <p className="text-red-500 text-[10px] absolute -top-4">{error}</p>}
      <div className="flex gap-2">
        <div className="flex items-center border border-primary-200 dark:border-white/20 rounded-lg h-12 w-24 shrink-0 overflow-hidden">
          <button 
            onClick={handleDecrease}
            disabled={isOutOfStock}
            className="flex-1 h-full flex items-center justify-center text-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold text-sm">{quantity}</span>
          <button 
            onClick={handleIncrease}
            disabled={isOutOfStock || quantity >= product.stock_quantity}
            className="flex-1 h-full flex items-center justify-center text-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding || isPending}
          className="btn-primary flex-1 h-12 px-2 text-xs md:text-sm whitespace-nowrap"
        >
          {isAdding || isPending ? 'Adding...' : (
            <span className="flex items-center justify-center gap-1.5 font-bold">
              <ShoppingBag className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
