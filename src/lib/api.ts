const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://h2vitaldash.x900.3az.de/api";

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
  shipping_config_id?: string | number | null;
  shipping_combine?: boolean;
  shipping_tiers?: { from: number; to: number | null; price: number }[];
  shipping_multiplier?: number;
  raw_shipping_cost?: number;
  raw_shipping_tiers?: { from: number; to: number | null; price: number }[];
  // ── Reichhaltige Produktdaten (von API) ──────────────────────────────────
  subtitle?: string;
  description?: string;
  image?: string;
  units_per_item?: number;  // Einheiten pro Karton (z.B. 30 Dosen)
  step_size?: number;       // Bestell-Schrittweite in Kartons (z.B. 30 = nur Vielfache von 30)
  benefits?: string[];
  use_cases?: string[];
  targets?: string[];
  tiers?: ProductTier[];    // Staffelpreise (price = pro Karton)
  uvp?: number;
}

/** Bestell-Schrittweite eines Produkts, immer >= 1. */
export function getStepSize(product: Pick<ApiProduct, "step_size">): number {
  const step = Math.floor(Number(product.step_size));
  return Number.isFinite(step) && step > 0 ? step : 1;
}

/** Rundet eine Menge auf das nächste Vielfache der Schrittweite (min. ein Schritt). */
export function snapToStep(qty: number, step: number): number {
  return Math.max(step, Math.round(qty / step) * step);
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
  vat_id?: string | null;
  vat_checked?: boolean;
  vat_document_path?: string | null;
  is_affiliate?: boolean;
  referral_code?: string | null;
  referral_link?: string | null;
  recruiter_code?: string | null;
  recruiter_link?: string | null;
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

export interface RetailerInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_retailer: boolean;
  info_name: string | null;
  info_website: string | null;
  info_tel: string | null;
  info_retaileraddress?: string | null;
  show_map: boolean;
  show_address?: boolean;
  map_lat: number | null;
  map_lng: number | null;
  vat_id?: string | null;
  vat_checked?: boolean;
  vat_document_path?: string | null;
  is_affiliate?: boolean;
  referral_code?: string | null;
  referral_link?: string | null;
  recruiter_code?: string | null;
  recruiter_link?: string | null;
  address?: {
    street: string | null;
    zip: string | null;
    city: string | null;
    country_code: string | null;
  } | null;
}

export interface RetailerAccessCodeResponse {
  success: boolean;
  message: string;
  code?: string;
}

export interface RetailerCheckCodeResponse {
  success: boolean;
  code_valid: boolean;
  customer_exists: boolean;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    company: string | null;
    vat_id?: string | null;
    vat_checked?: boolean;
    vat_document_path?: string | null;
    address: {
      street: string | null;
      zip: string | null;
      city: string | null;
      country_code: string | null;
    } | null;
  };
  message?: string;
}

export interface RetailerInfoResponse {
  success: boolean;
  data?: RetailerInfo;
  message?: string;
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
  vat_id?: string;
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

// Cache for VAT rates loaded from the API
let cachedVatRates: Record<string, { label: string; rate: number }> = {};
let cachedMinOrderValue = 200.0;
let cachedDiscountTiers: { from: number; to: number | null; discount_percent: number }[] = [];

export function getCachedVatRates(): Record<string, { label: string; rate: number }> {
  return cachedVatRates;
}

export function getCachedMinOrderValue(): number {
  return cachedMinOrderValue;
}

export function getCachedDiscountTiers() {
  return cachedDiscountTiers;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function fetchProducts(countryCode = "DE", email?: string): Promise<ApiProduct[]> {
  let url = `${API_BASE}/retailer/products?country_code=${countryCode}`;
  if (email) {
    url += `&email=${encodeURIComponent(email)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Produkte konnten nicht geladen werden.");
  const data = await res.json();

  if (data.vat_rates) {
    cachedVatRates = data.vat_rates;
  }
  if (data.min_order_value !== undefined) {
    cachedMinOrderValue = Number(data.min_order_value);
  }
  if (data.discount_tiers) {
    cachedDiscountTiers = data.discount_tiers;
  }
  
  // Sanitize shipping_multiplier because the remote API might return vonexio_product_multiplicator (e.g. 30)
  // instead of own_shipping_units_per_package (which is 1 per box).
  const products = (data.products || []).map((prod: ApiProduct) => {
    let multiplier = prod.shipping_multiplier ?? 1;
    if (prod.type === "product") {
      if (multiplier > 10) {
        multiplier = 1;
      }
    } else if (prod.type === "bundle") {
      if (multiplier >= 28) {
        multiplier = Math.round(multiplier / 30);
        if (multiplier < 1) multiplier = 1;
      }
    }
    return {
      ...prod,
      shipping_multiplier: multiplier,
    };
  });

  return products;
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

export async function getRetailerPortalAccessCode(email: string): Promise<RetailerAccessCodeResponse> {
  const res = await fetch(`${API_BASE}/getRetailerPortalAccessCode`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Anfordern des Zugangscodes.");
  }
  return res.json();
}

export async function checkRetailerPortalAccessCode(email: string, code: string): Promise<RetailerCheckCodeResponse> {
  const res = await fetch(`${API_BASE}/checkRetailerPortalAccessCode`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Ungültiger oder abgelaufener Zugangscode.");
  }
  return res.json();
}

export async function getRetailerInfo(email: string, code: string): Promise<RetailerInfoResponse> {
  const params = new URLSearchParams({ email, code });
  const res = await fetch(`${API_BASE}/retailer/info?${params.toString()}`, {
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Laden des Händler-Profils.");
  }
  return res.json();
}

export async function updateRetailerInfo(
  payload: {
    email: string;
    code: string;
    info_name?: string;
    info_website?: string;
    info_tel?: string;
    info_retaileraddress?: string;
    show_map?: boolean;
    show_address?: boolean;
    map_lat?: number;
    map_lng?: number;
  }
): Promise<RetailerInfoResponse> {
  const res = await fetch(`${API_BASE}/retailer/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Aktualisieren des Händler-Profils.");
  }
  return res.json();
}

export interface RetailerTrackingItem {
  tracking_number: string;
  link?: string | null;
  provider?: string | null;
  delivery_note?: string | null;
}

export interface RetailerOrderItem {
  id: number;
  product_id: number | null;
  bunde_product_id: number | null;
  quantity: number;
  unit_price: number | null;
  is_bundle_item: boolean;
  parent_item_id: number | null;
  product_name: string;
}

export interface RetailerOrder {
  id: number;
  created_at: string | null;
  status: string;
  is_released: boolean;
  is_paid: boolean;
  payment_amount: number | null;
  payment_token: string | null;
  can_pay_stripe: boolean;
  easybill_document_id: number | null;
  is_finalized: boolean;
  vonexio_tracking_id: string | null;
  vonexio_tracking_list: RetailerTrackingItem[] | null;
  shipped_at: string | null;
  shipping_date: string | null;
  notes: string | null;
  items: RetailerOrderItem[];
}

export interface MarketingDownload {
  id: number;
  title: string;
  description: string | null;
  file_path: string | null;
  file_type_label: string;
  file_size: number | null;
  category: string;
  visibility: string;
  file_url: string | null;
}

export async function getRetailerOrders(email: string, code: string): Promise<RetailerOrder[]> {
  const params = new URLSearchParams({ email, code });
  const res = await fetch(`${API_BASE}/retailer/orders?${params.toString()}`, {
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Laden der Bestellungen.");
  }
  const body = await res.json();
  return body.data || [];
}

export async function getRetailerDownloads(email: string, code: string): Promise<MarketingDownload[]> {
  const params = new URLSearchParams({ email, code });
  const res = await fetch(`${API_BASE}/retailer/downloads?${params.toString()}`, {
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Laden der Downloads.");
  }
  const body = await res.json();
  return body.data || [];
}

export async function getPublicDownloads(): Promise<MarketingDownload[]> {
  const res = await fetch(`${API_BASE}/public/downloads`, {
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Laden der öffentlichen Downloads.");
  }
  const body = await res.json();
  return body.data || [];
}

export async function uploadVatDocument(
  email: string,
  code: string,
  vatId: string,
  file: File
): Promise<{ success: boolean; message: string; data?: { vat_id: string; vat_checked: boolean; vat_document_path: string } }> {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("code", code);
  formData.append("vat_id", vatId);
  formData.append("vat_file", file);

  const res = await fetch(`${API_BASE}/retailer/vat-upload`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Hochladen des USt-ID Nachweises.");
  }
  return res.json();
}

export interface ValidateVatResponse {
  valid: boolean;
  name?: string;
  reason?: string;
  country_code?: string;
  vat_number?: string;
}

export async function validateVatId(
  email: string,
  code: string,
  vatId: string,
  company?: string,
  firstName?: string,
  lastName?: string
): Promise<ValidateVatResponse> {
  const res = await fetch(`${API_BASE}/retailer/validate-vat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      email,
      code,
      vat_id: vatId,
      company,
      first_name: firstName,
      last_name: lastName,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "USt-IdNr.-Validierung fehlgeschlagen.");
  }
  return res.json();
}

// ─── Address & Ticket Management ─────────────────────────────────────────────

export interface CustomerAddressDb {
  id: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  address1: string;
  address2: string | null;
  city: string;
  zip: string;
  country: string;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getRetailerAddresses(email: string, code: string): Promise<CustomerAddressDb[]> {
  const params = new URLSearchParams({ email, code });
  const res = await fetch(`${API_BASE}/retailer/addresses?${params.toString()}`, {
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Laden der Adressen.");
  }
  const body = await res.json();
  return body.data || [];
}

export async function createRetailerAddress(
  email: string,
  code: string,
  addressData: Omit<CustomerAddressDb, "id" | "customer_id">
): Promise<CustomerAddressDb> {
  const res = await fetch(`${API_BASE}/retailer/addresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email, code, ...addressData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Erstellen der Adresse.");
  }
  const body = await res.json();
  return body.data;
}

export async function updateRetailerAddress(
  email: string,
  code: string,
  addressId: number,
  addressData: Omit<CustomerAddressDb, "id" | "customer_id">
): Promise<CustomerAddressDb> {
  const res = await fetch(`${API_BASE}/retailer/addresses/${addressId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email, code, ...addressData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Aktualisieren der Adresse.");
  }
  const body = await res.json();
  return body.data;
}

export async function deleteRetailerAddress(email: string, code: string, addressId: number): Promise<boolean> {
  const params = new URLSearchParams({ email, code });
  const res = await fetch(`${API_BASE}/retailer/addresses/${addressId}?${params.toString()}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Löschen der Adresse.");
  }
  const body = await res.json();
  return !!body.success;
}

export interface CreateSupportTicketPayload {
  category: string;
  issue_type?: string;
  order_id?: string;
  description: string;
}

export async function createSupportTicket(
  email: string,
  code: string,
  payload: CreateSupportTicketPayload
): Promise<{ success: boolean; message: string; ticket_id?: string }> {
  const res = await fetch(`${API_BASE}/retailer/support-ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ email, code, ...payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Fehler beim Senden des Support-Tickets.");
  }
  return res.json();
}

export interface RetailerApplicationPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  industry: string;
  customIndustry?: string;
  message?: string;
}

export interface RetailerApplicationResponse {
  success: boolean;
  message: string;
}

export async function submitRetailerApplication(payload: RetailerApplicationPayload): Promise<RetailerApplicationResponse> {
  const res = await fetch(`${API_BASE}/retailer/application`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Bewerbung konnte nicht gesendet werden.");
  }
  return res.json();
}
