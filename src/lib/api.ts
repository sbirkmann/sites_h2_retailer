const API_BASE = "https://h2vitaldash.x900.3az.de/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProductTier {
  min: number;        // Mindestmenge Kartons (inkl.)
  max: number | null; // Maximalmenge Kartons (inkl.), null = unbegrenzt
  price: number;      // Preis pro Karton (netto)
}

export interface ApiProduct {
  type: "product" | "bundle";
  id: number;
  slug: string;
  name: string;
  retailer_price: number;   // Basispreis pro Karton (netto)
  deposit: number;          // Pfand pro Karton
  shipping_cost: number | null;
  // ── Reichhaltige Produktdaten (von API) ──────────────────────────────────
  subtitle?: string;
  description?: string;
  image?: string;
  units_per_item?: number;  // Einheiten pro Karton (z.B. 30 Dosen)
  benefits?: string[];
  use_cases?: string[];
  targets?: string[];
  tiers?: ProductTier[];    // Staffelpreise (price = pro Karton)
}

export interface CustomerAddress {
  street: string;
  zip: string;
  city: string;
  country_code: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: CustomerAddress | null;
}

export interface SendCodeResponse {
  success: boolean;
  code: string;
  customer_exists: boolean;
}

export interface VerifyCodeResponse {
  success: boolean;
  code_valid: boolean;
  customer_exists: boolean;
  customer: Customer | null;
}

export interface OrderItem {
  product_id?: number;
  bunde_product_id?: number;
  quantity: number;
  include_deposit?: boolean;
}

export interface CreateOrderPayload {
  email: string;
  login_code: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  street?: string;
  zip?: string;
  city?: string;
  country_code?: string;
  items: OrderItem[];
  include_shipping_cost?: boolean;
  ref_code?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  delivery_id: number;
  customer_id: number;
  is_new_customer: boolean;
  affiliate_id: number | null;
  easybill_document_id: number | null;
  is_finalized: boolean;
  payment_amount: number | null;
  payment_url: string | null;
  status: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function fetchProducts(countryCode = "DE"): Promise<ApiProduct[]> {
  const res = await fetch(`${API_BASE}/retailer/products?country_code=${countryCode}`);
  if (!res.ok) throw new Error("Produkte konnten nicht geladen werden.");
  const data = await res.json();
  return data.products;
}

export async function sendLoginCode(email: string): Promise<SendCodeResponse> {
  const res = await fetch(`${API_BASE}/login-code/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Login-Code konnte nicht gesendet werden.");
  return res.json();
}

export async function verifyLoginCode(email: string, code: string): Promise<VerifyCodeResponse> {
  const res = await fetch(`${API_BASE}/login-code/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw new Error("Code-Verifizierung fehlgeschlagen.");
  return res.json();
}

/**
 * Create order via internal Next.js API route (which adds Bearer token server-side).
 */
export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || "Bestellung fehlgeschlagen.");
  }
  return res.json();
}
