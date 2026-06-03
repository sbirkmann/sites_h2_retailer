"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { DisplayProduct } from "./products";

// ─── Cart Item ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: DisplayProduct;
  quantity: number; // Anzahl Kartons
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

// ─── Tier Price Helper ───────────────────────────────────────────────────────

/**
 * Ermittelt den Preis pro Karton anhand der Staffelpreise des Produkts.
 * @returns Preis pro Karton oder 0 (Fallback: retailer_price)
 */
function getTierPrice(product: DisplayProduct, qty: number): number {
  const tiers = product.tiers;
  if (tiers && tiers.length > 0) {
    const tier = tiers.find(
      (t) => qty >= t.min && (t.max === null || qty <= t.max)
    );
    if (tier) return tier.price;
  }
  // Legacy slug-basierte Tiers als Fallback
  const slug = product.slug;
  if (slug === "dose-tray") {
    const p = qty >= 20 ? 1.25 : qty >= 10 ? 1.35 : 1.45;
    return parseFloat((p * 30).toFixed(2));
  }
  if (slug === "flasche-kiste") {
    const p = qty >= 20 ? 1.2 : qty >= 10 ? 1.3 : 1.4;
    return parseFloat((p * 24).toFixed(2));
  }
  if (slug.startsWith("quetsch")) {
    const p = qty >= 10 ? 1.0 : qty >= 5 ? 1.2 : 1.35;
    return parseFloat((p * 50).toFixed(2));
  }
  return 0;
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((product: DisplayProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug);
      if (existing) {
        const newQty = existing.quantity + qty;
        const tierPrice = getTierPrice(product, newQty) || product.retailer_price;
        return prev.map((i) =>
          i.product.slug === product.slug
            ? { ...i, quantity: newQty, product: { ...i.product, retailer_price: tierPrice } }
            : i
        );
      }
      const tierPrice = getTierPrice(product, qty) || product.retailer_price;
      return [...prev, { product: { ...product, retailer_price: tierPrice }, quantity: qty }];
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
      prev.map((i) => {
        if (i.product.slug === slug) {
          const tierPrice = getTierPrice(i.product, qty) || i.product.retailer_price;
          return { ...i, quantity: qty, product: { ...i.product, retailer_price: tierPrice } };
        }
        return i;
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // ─── Computed Values ────────────────────────────────────────────────────

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // subtotal = Summe (Preis pro Karton × Anzahl Kartons)
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.retailer_price * i.quantity,
    0
  );

  // totalDeposit = Pfand pro Karton × Anzahl Kartons
  const totalDeposit = items.reduce(
    (sum, i) => sum + i.product.deposit * i.quantity,
    0
  );

  // Versandkosten
  const totalShipping = items.reduce(
    (sum, i) => sum + (i.product.shipping_cost ?? 0) * i.quantity,
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
