'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { updateCartItemQuantity, removeCartItem } from '@/app/(store)/cart/actions';

export default function CartList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [updating, setUpdating] = useState(null);

  const handleUpdate = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    
    setUpdating(id);
    const res = await updateCartItemQuantity(id, newQty);
    if (res?.success) {
      setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
    setUpdating(null);
  };

  const handleRemove = async (id) => {
    setUpdating(id);
    const res = await removeCartItem(id);
    if (res?.success) {
      setItems(items.filter(item => item.id !== id));
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.id} className="flex gap-6 py-6 border-b border-primary-100 dark:border-white/10 relative">
          {updating === item.id && (
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10 rounded-md">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          )}
          
          {/* Image */}
          <Link href={`/product/${item.slug}`} className="w-24 h-32 shrink-0 bg-primary-100 dark:bg-primary-800 rounded-md overflow-hidden relative">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-primary-400">Fyxen</div>
            )}
          </Link>
          
          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link href={`/product/${item.slug}`} className="font-bold text-lg hover:text-accent transition-colors">
                {item.title}
              </Link>
              <div className="font-medium text-primary-900 dark:text-white mt-1">₹{item.price}</div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              {/* Quantity */}
              <div className="flex items-center border border-primary-200 dark:border-white/20 rounded-md h-10">
                <button 
                  onClick={() => handleUpdate(item.id, item.quantity, -1)}
                  disabled={item.quantity <= 1}
                  className="px-3 h-full flex items-center justify-center text-primary-500 hover:text-primary-900 disabled:opacity-50 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdate(item.id, item.quantity, 1)}
                  className="px-3 h-full flex items-center justify-center text-primary-500 hover:text-primary-900 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              {/* Remove */}
              <button 
                onClick={() => handleRemove(item.id)}
                className="text-primary-400 hover:text-red-500 transition-colors p-2"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
