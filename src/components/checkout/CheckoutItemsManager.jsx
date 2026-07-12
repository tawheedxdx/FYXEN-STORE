'use client';

import { useState, useTransition } from 'react';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { updateCartItemQuantity, removeCartItem } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function CheckoutItemsManager({ items }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdate = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    
    setUpdatingId(id);
    const res = await updateCartItemQuantity(id, newQty);
    if (res?.success) {
      startTransition(() => {
        router.refresh();
      });
    }
    setUpdatingId(null);
  };

  const handleRemove = async (id) => {
    setUpdatingId(id);
    const res = await removeCartItem(id);
    if (res?.success) {
      startTransition(() => {
        router.refresh();
      });
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 group relative">
          {(updatingId === item.id || isPending) && (
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            </div>
          )}
          
          <div className="w-16 h-20 bg-primary-100 dark:bg-primary-800 rounded overflow-hidden shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-primary-400">No Image</div>
            )}
          </div>
          
          <div className="flex-1 text-sm flex flex-col justify-between">
            <div>
              <p className="font-medium line-clamp-1">{item.title}</p>
              <p className="font-semibold mt-0.5">₹{item.price}</p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center border border-primary-200 dark:border-white/10 rounded-md bg-white dark:bg-black overflow-hidden">
                <button 
                  onClick={() => handleUpdate(item.id, item.quantity, -1)}
                  disabled={item.quantity <= 1 || updatingId === item.id || isPending}
                  className="p-1 hover:bg-primary-50 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdate(item.id, item.quantity, 1)}
                  disabled={updatingId === item.id || isPending}
                  className="p-1 hover:bg-primary-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              <button 
                onClick={() => handleRemove(item.id)}
                disabled={updatingId === item.id || isPending}
                className="text-primary-400 hover:text-red-500 transition-colors p-1"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
