import type { ApiProduct } from "./api";

export interface DisplayProduct extends ApiProduct {
  // Alle ApiProduct-Felder werden geerbt.
  // Folgende Felder werden für den Cart als required behandelt:
  slug: string;
  image: string;
  subtitle: string;
  description: string;
  unitsPerItem: number;
  // Optional
  badge?: string;
  isBestseller?: boolean;
  secondImage?: string;
}

/**
 * Baut ein DisplayProduct aus einem ApiProduct.
 * Verwendet API-Daten direkt, fällt auf Leerwerte zurück wenn nötig.
 */
export function apiProductToDisplay(
  product: ApiProduct,
  overrides?: Partial<DisplayProduct>
): DisplayProduct {
  return {
    ...product,
    slug: product.slug,
    image: product.image ?? "",
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    unitsPerItem: product.units_per_item ?? 1,
    ...overrides,
  };
}

// Legacy static products (für ältere Komponenten die noch STATIC_PRODUCTS importieren)
export const STATIC_PRODUCTS: DisplayProduct[] = [];
