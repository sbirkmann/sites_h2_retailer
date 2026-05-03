"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { DisplayProduct } from "./products";

// ─── Cart Item ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: DisplayProduct;
  quantity: number;
}

// ─── Context Value ──────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalDeposit: number;
  totalShipping: number;
  grandTotal: number;
  addItem: (product: DisplayProduct, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((product: DisplayProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.product.slug === product.slug
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.product.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.slug !== slug));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.slug === slug ? { ...i, quantity: qty } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // ─── Computed Values ────────────────────────────────────────────────────

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.retailer_price * i.quantity,
    0
  );

  const totalDeposit = items.reduce(
    (sum, i) => sum + i.product.deposit * i.quantity,
    0
  );

  // Shipping: highest shipping cost across all items (not summed)
  const totalShipping = items.reduce(
    (max, i) => Math.max(max, i.product.shipping_cost ?? 0),
    0
  );

  const grandTotal = subtotal + totalDeposit + totalShipping;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        totalDeposit,
        totalShipping,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((v) => !v),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
