'use client';

import { useState } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
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
    } else {
      router.push('/cart');
    }
    
    setIsAdding(false);
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center border border-primary-200 dark:border-white/20 rounded-md h-12 w-full sm:w-32">
          <button 
            onClick={handleDecrease}
            disabled={isOutOfStock}
            className="px-4 h-full flex items-center justify-center text-primary-500 hover:text-primary-900 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="flex-1 text-center font-medium">{quantity}</span>
          <button 
            onClick={handleIncrease}
            disabled={isOutOfStock || quantity >= product.stock_quantity}
            className="px-4 h-full flex items-center justify-center text-primary-500 hover:text-primary-900 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="btn-primary flex-1 h-12"
        >
          {isAdding ? (
            <span className="flex items-center gap-2">Adding...</span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
