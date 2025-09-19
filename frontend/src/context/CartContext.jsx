import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { calculateCart } from '../services/api.js';

const CartContext = createContext();

const EMPTY_SUMMARY = {
  items: [],
  subtotal: 0,
  tax: 0,
  taxRate: 0,
  total: 0,
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const stored = window.localStorage.getItem('cafe-aroma-cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cafe-aroma-cart', JSON.stringify(items));
    }
  }, [items]);

  const syncSummary = useCallback(async (currentItems) => {
    if (!currentItems || currentItems.length === 0) {
      setSummary(EMPTY_SUMMARY);
      setError(null);
      return;
    }

    setIsSyncing(true);
    try {
      const payload = currentItems.map((item) => ({ id: item.id, quantity: item.quantity }));
      const data = await calculateCart(payload);
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to update cart totals.');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncSummary(items);
  }, [items, syncSummary]);

  const addItem = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      summary,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      cartCount,
      isSyncing,
      error,
    }),
    [items, summary, addItem, updateQuantity, removeItem, clearCart, cartCount, isSyncing, error]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
