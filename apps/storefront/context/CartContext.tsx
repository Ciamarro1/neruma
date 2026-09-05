'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string; // unique item id (often variantId or productId)
  productId: string;
  variantId: string;
  title: string;
  handle: string;
  thumbnail: string;
  price: number; // in cents (BRL)
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    variantId?: string;
    price?: number;
  }, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'neruma_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar dados do localStorage após montagem
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Falha silenciosa em ambientes com restrição de storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sincronizar com localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items, isHydrated]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const addItem = useCallback(
    (
      product: {
        id: string;
        title: string;
        handle: string;
        thumbnail?: string;
        variantId?: string;
        price?: number;
      },
      quantity = 1
    ) => {
      const variantId = product.variantId || `var_${product.id}`;
      const itemId = `${product.id}_${variantId}`;
      const price = product.price || 0;
      const thumbnail = product.thumbnail || '/images/products/luminaria-macrame-algodao.jpg';

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === itemId);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [
            ...prevItems,
            {
              id: itemId,
              productId: product.id,
              variantId,
              title: product.title,
              handle: product.handle,
              thumbnail,
              price,
              quantity,
            },
          ];
        }
      });

      // Abre automaticamente o drawer para feedback instantâneo
      setIsDrawerOpen(true);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
