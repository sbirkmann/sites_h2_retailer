import type { ApiProduct } from "./api";

export interface DisplayProduct extends ApiProduct {
  /** Unique key for cart identification (since same product ID can appear for different sizes) */
  slug: string;
  image: string;
  subtitle: string;
  description: string;
  badge?: string;
  isBestseller?: boolean;
  secondImage?: string;
  /** Quantity per unit (e.g. 30 cans per tray) – used for deposit calculations in cart */
  unitsPerItem: number;
}

// Static product definitions with real backend IDs
// type "product" → product_id, type "bundle" → bunde_product_id in API
export const STATIC_PRODUCTS: DisplayProduct[] = [
  {
    slug: "dose-tray",
    type: "product", id: 27, name: "Händler-Tray (Dose)",
    retailer_price: 49.90, deposit: 7.50, shipping_cost: 4.90,
    image: "/hero.png", subtitle: "Preis / Tray (30 Stk.)",
    description: "30 x AWAKE Dose (Zitrone-Limette). Konzipiert für schnelle Impulskäufe an der Kasse oder im POS-Kühlschrank.",
    unitsPerItem: 30,
  },
  {
    slug: "flasche-kiste",
    type: "product", id: 26, name: "Gastro-Kiste (Flasche)",
    retailer_price: 54.90, deposit: 3.60, shipping_cost: 4.90,
    image: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/e0404161-0015-4ed3-8eff-8f97c005a472-awake-bottle.png", subtitle: "Preis / Kiste (24 Stk.)",
    description: "24 x AWAKE Glasflasche (Pur). Der edle Hingucker für die gehobene Gastronomie, Spas und Konferenzen.",
    unitsPerItem: 24,
  },
  {
    slug: "starter-kit",
    type: "bundle", id: 2, name: "Premium Starter-Kit",
    retailer_price: 149.90, deposit: 1.50, shipping_cost: 5.90,
    image: "/hero.png", secondImage: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/e0404161-0015-4ed3-8eff-8f97c005a472-awake-bottle.png", subtitle: "Preis / Starter-Kit",
    description: "Der optimale Einstieg: 60 Dosen + 24 Flaschen inkl. hochwertigem POS-Acryl-Aufsteller und Kunden-Infomaterial.",
    badge: "BESTSELLER EMPFEHLUNG", isBestseller: true,
    unitsPerItem: 1,
  },
  {
    slug: "palette-dose",
    type: "product", id: 27, name: "Palette Dose (10x30)",
    retailer_price: 469.00, deposit: 75.00, shipping_cost: 0,
    image: "/palette-dose.png", subtitle: "Preis / Palette",
    description: "Insgesamt 300 Dosen. Maximale Marge für starken Abverkauf in großen Gyms und Supermärkten.",
    badge: "GROSSMENGE",
    unitsPerItem: 300,
  },
  {
    slug: "palette-flasche",
    type: "product", id: 26, name: "Palette Flasche (10x24)",
    retailer_price: 449.00, deposit: 36.00, shipping_cost: 0,
    image: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/e0404161-0015-4ed3-8eff-8f97c005a472-awake-bottle.png", subtitle: "Preis / Palette",
    description: "Insgesamt 240 Flaschen. Perfekt für den konstanten, planbaren Bedarf im exklusiven Spa oder der Gastro.",
    badge: "GROSSMENGE",
    unitsPerItem: 240,
  },
  {
    slug: "palette-quetschbeutel",
    type: "product", id: 27, name: "Palette Quetschbeutel",
    retailer_price: 499.00, deposit: 0, shipping_cost: 0,
    image: "/pouch.png", subtitle: "Preis / Palette",
    description: "Insgesamt 500 Beutel (10x50). Die ideale, bruchsichere Sport-Nutrition Größe für unterwegs oder im aktiven Gym.",
    badge: "GROSSMENGE",
    unitsPerItem: 500,
  },
];
