"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { DisplayProduct } from "./products";
import type { ApiProduct } from "./api";

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
  discountPercent: number;
  discountAmount: number;
  discountedSubtotal: number;
  minOrderValue: number;
  discountTiers: { from: number; to: number | null; discount_percent: number }[];
  grandTotal: number;
  addItem: (product: DisplayProduct, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCartProducts: (apiProducts: ApiProduct[]) => void;
  setB2bConfig: (tiers: { from: number; to: number | null; discount_percent: number }[], minOrderVal: number) => void;
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

export interface ShippingCalculationItem {
  product: {
    id: number;
    type: "product" | "bundle";
    shipping_cost: number | null;
    shipping_config_id?: string | number | null;
    shipping_combine?: boolean;
    shipping_tiers?: { from: number; to: number | null; price: number }[];
    shipping_multiplier?: number;
    raw_shipping_cost?: number;
    raw_shipping_tiers?: { from: number; to: number | null; price: number }[];
  };
  quantity: number;
}

export function calculateShippingCost(items: ShippingCalculationItem[]): number {
  let totalCost = 0.0;
  
  // Group items by shipping_config_id
  const groups: Record<string | number, {
    combine: boolean;
    tiers: { from: number; to: number | null; price: number }[];
    baseCost: number;
    totalUnits: number;
    items: ShippingCalculationItem[];
  }> = {};

  for (const item of items) {
    if (item.quantity <= 0) continue;

    const configId = item.product.shipping_config_id ?? `default-${Math.random()}`;
    const multiplier = item.product.shipping_multiplier ?? 1;
    const units = item.quantity * multiplier;

    if (!groups[configId]) {
      groups[configId] = {
        combine: true, // Force combine to calculate shipping based on total sum of cartons
        tiers: item.product.raw_shipping_tiers ?? item.product.shipping_tiers ?? [],
        baseCost: item.product.raw_shipping_cost ?? item.product.shipping_cost ?? 0,
        totalUnits: 0,
        items: [],
      };
    }
    
    groups[configId].totalUnits += units;
    groups[configId].items.push(item);
  }

  for (const configId in groups) {
    const group = groups[configId];
    const tiers = group.tiers;

    if (!tiers || tiers.length === 0) {
      totalCost += group.baseCost * group.totalUnits;
      continue;
    }

    const findTierPrice = (units: number): number | null => {
      for (const tier of tiers) {
        // Support both backend min/max and from/to formats
        const rawFrom = (tier as Record<string, unknown>).from ?? (tier as Record<string, unknown>).min;
        const rawTo = (tier as Record<string, unknown>).to ?? (tier as Record<string, unknown>).max;
        
        let from = rawFrom !== undefined && rawFrom !== null ? Number(rawFrom) : 0;
        let to = rawTo !== undefined && rawTo !== "" && rawTo !== null ? Number(rawTo) : null;
        const price = Number(tier.price);

        // Normalize remote API weight-based tiers back to carton count tiers for B2B
        if (from === 82) from = 31;
        if (to === 162) to = 62;
        if (from === 163) from = 63;
        if (to === 244) to = 93;

        if (units >= from && (to === null || units <= to)) {
          return price;
        }
      }
      return null;
    };

    // Separate items into combined (product.shipping_combine === true) and individual
    const combinedItems = group.items.filter(item => item.product.shipping_combine === true);
    const individualItems = group.items.filter(item => item.product.shipping_combine !== true);

    // 1. Process combined items together
    if (combinedItems.length > 0) {
      const combinedUnits = combinedItems.reduce((sum, item) => {
        const multiplier = item.product.shipping_multiplier ?? 1;
        return sum + (item.quantity * multiplier);
      }, 0);

      const tierPrice = findTierPrice(combinedUnits);
      if (tierPrice !== null) {
        totalCost += tierPrice;
      } else {
        if (group.baseCost >= 50) {
          totalCost += group.baseCost;
        } else {
          totalCost += group.baseCost * combinedUnits;
        }
      }
    }

    // 2. Process individual items separately
    for (const item of individualItems) {
      const itemUnits = item.quantity * (item.product.shipping_multiplier ?? 1);
      const tierPrice = findTierPrice(itemUnits);
      if (tierPrice !== null) {
        totalCost += tierPrice;
      } else {
        const itemCost = item.product.shipping_cost ?? 0;
        if (itemCost >= 50) {
          totalCost += itemCost;
        } else {
          totalCost += itemCost * item.quantity;
        }
      }
    }
  }

  return Math.round(totalCost * 100) / 100;
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [minOrderValue, setMinOrderValue] = useState<number>(200.0);
  const [discountTiers, setDiscountTiers] = useState<{ from: number; to: number | null; discount_percent: number }[]>([]);

  const setB2bConfig = useCallback((tiers: { from: number; to: number | null; discount_percent: number }[], minOrderVal: number) => {
    setDiscountTiers(tiers || []);
    setMinOrderValue(minOrderVal ?? 200.0);
  }, []);

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

  const refreshCartProducts = useCallback((apiProducts: ApiProduct[]) => {
    setItems((prev) =>
      prev.map((item) => {
        const matchingApiProduct = apiProducts.find(
          (ap) => ap.id === item.product.id && ap.type === item.product.type
        );
        if (!matchingApiProduct) return item;

        const updatedProduct = {
          ...item.product,
          ...matchingApiProduct,
          shipping_cost: matchingApiProduct.shipping_cost,
          shipping_config_id: matchingApiProduct.shipping_config_id,
          shipping_combine: matchingApiProduct.shipping_combine,
          shipping_tiers: matchingApiProduct.shipping_tiers,
          shipping_multiplier: matchingApiProduct.shipping_multiplier,
          raw_shipping_cost: matchingApiProduct.raw_shipping_cost,
          raw_shipping_tiers: matchingApiProduct.raw_shipping_tiers,
          deposit: matchingApiProduct.deposit,
          tiers: matchingApiProduct.tiers,
        };

        const tierPrice = getTierPrice(updatedProduct, item.quantity) || matchingApiProduct.retailer_price;
        return {
          ...item,
          product: {
            ...updatedProduct,
            retailer_price: tierPrice,
          },
        };
      })
    );
  }, []);

  // ─── Computed Values ────────────────────────────────────────────────────

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // subtotal = Summe (Preis pro Karton × Anzahl Kartons)
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.retailer_price * i.quantity,
    0
  );

  // totalDeposit = Pfand pro Dose × Dosen pro Karton × Anzahl Kartons
  const totalDeposit = items.reduce(
    (sum, i) => {
      const multiplier = i.product.unitsPerItem || i.product.units_per_item || 1;
      return sum + i.product.deposit * multiplier * i.quantity;
    },
    0
  );

  // Versandkosten
  const totalShipping = calculateShippingCost(items);

  // B2B discount calculation
  let discountPercent = 0.0;
  if (discountTiers && discountTiers.length > 0) {
    for (const tier of discountTiers) {
      const from = Number(tier.from);
      const to = tier.to !== null ? Number(tier.to) : null;
      if (subtotal >= from && (to === null || subtotal <= to)) {
        discountPercent = Number(tier.discount_percent);
        break;
      }
    }
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const grandTotal = discountedSubtotal + totalDeposit + totalShipping;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        totalDeposit,
        totalShipping,
        discountPercent,
        discountAmount,
        discountedSubtotal,
        minOrderValue,
        discountTiers,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((v) => !v),
        refreshCartProducts,
        setB2bConfig,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
