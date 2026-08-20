'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, updateCartItemQuantity, removeCartItem } from '@/app/(store)/cart/actions';

const CartContext = createContext({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  cart: { items: [], subtotal: 0, totalShipping: 0, totalTax: 0 },
  cartCount: 0,
  isLoading: false,
  refreshCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
});

export function CartProvider({ children, initialCartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalShipping: 0, totalTax: 0 });
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getCart();
      if (res && Array.isArray(res.items)) {
        setCart(res);
        const count = res.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      console.error('Error refreshing cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
    refreshCart();
  }, [refreshCart]);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) refreshCart();
      return next;
    });
  }, [refreshCart]);

  const updateQuantity = useCallback(async (cartItemId, newQty) => {
    try {
      await updateCartItemQuantity(cartItemId, newQty);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  }, [refreshCart]);

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  }, [refreshCart]);

  // Lock body scroll when slidecart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        cart,
        cartCount,
        isLoading,
        refreshCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
