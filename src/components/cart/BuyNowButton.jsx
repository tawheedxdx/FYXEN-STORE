'use client';

import { useState, useTransition } from 'react';
import { CreditCard } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function BuyNowButton({ product, selectedVariant = null }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentStock = selectedVariant ? (selectedVariant.stock_quantity || 0) : (product.stock_quantity || 0);
  const isOutOfStock = currentStock <= 0;
  const requiresSelection = product.product_variants?.length > 0 && !selectedVariant;

  const handleBuyNow = async () => {
    setIsProcessing(true);
    
    // 1. Add to cart
    const res = await addToCart(product.id, 1, selectedVariant?.id || null);
    
    if (res?.error) {
      if (res.error.includes('sign in')) {
        router.push('/login?redirect=/product/' + product.slug);
      } else {
        alert(res.error);
      }
      setIsProcessing(false);
    } else {
      // 2. Redirect to checkout immediately
      startTransition(() => {
        router.push('/checkout');
      });
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleBuyNow}
      disabled={isOutOfStock || requiresSelection || isProcessing || isPending}
      className="btn-outline flex-1 h-12 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-all px-2 text-xs md:text-sm whitespace-nowrap"
    >
      <span className="flex items-center justify-center gap-1.5 font-bold">
        <CreditCard className="w-4 h-4" />
        {isProcessing || isPending 
          ? 'Processing...' 
          : requiresSelection 
            ? 'Select Option' 
            : isOutOfStock 
              ? 'Out of Stock' 
              : 'Buy Now'}
      </span>
    </button>
  );
}
