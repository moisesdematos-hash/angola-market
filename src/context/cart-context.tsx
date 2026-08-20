'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/mock-data';

export interface CartItem {
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string, variantName?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotalAmount: number;
  groupedBySeller: Record<string, { storeName: string; storeSlug: string; items: CartItem[] }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('angola_market_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // Ignore localstorage errors
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('angola_market_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1, variantId?: string, variantName?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variantId === variantId
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, variantId, variantName }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variantId === variantId))
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalAmount = items.reduce((acc, item) => {
    const itemPrice = item.product.promotional_price || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const groupedBySeller = items.reduce((acc, item) => {
    const sellerId = item.product.seller.id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        storeName: item.product.seller.store_name,
        storeSlug: item.product.seller.store_slug,
        items: []
      };
    }
    acc[sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { storeName: string; storeSlug: string; items: CartItem[] }>);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotalAmount,
        groupedBySeller
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
