"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Lock, 
  Unlock, 
  Mail, 
  Key, 
  Building, 
  Globe, 
  Phone, 
  MapPin, 
  Map, 
  LogOut, 
  Download, 
  Check, 
  AlertCircle, 
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  FileText,
  Truck,
  Clock,
  CreditCard,
  Plus,
  Minus,
  ShoppingCart,
  TrendingDown,
  Package,
  Upload,
  Trash2,
  Edit3,
  HelpCircle
} from "lucide-react";
import { 
  getRetailerPortalAccessCode, 
  checkRetailerPortalAccessCode, 
  getRetailerInfo, 
  updateRetailerInfo,
  getRetailerOrders,
  getRetailerDownloads,
  fetchProducts,
  getRetailerAddresses,
  createRetailerAddress,
  updateRetailerAddress,
  deleteRetailerAddress,
  createSupportTicket,
  ApiProduct,
  RetailerInfo,
  RetailerOrder,
  MarketingDownload,
  uploadVatDocument,
  getCachedDiscountTiers,
  getCachedMinOrderValue,
  type CustomerAddressDb
} from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import { apiProductToDisplay } from "@/lib/products";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

// ─── Cookie Helpers ──────────────────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const rawVal = parts.pop()?.split(";").shift();
    return rawVal ? decodeURIComponent(rawVal) : undefined;
  }
  return undefined;
}

function setCookie(name: string, value: string) {
  if (typeof window === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

function eraseCookie(name: string) {
  if (typeof window === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

// ─── Leaflet Map Preview Component ───────────────────────────────────────────

function LocalRetailerMap({ 
  lat, 
  lng, 
  name, 
  website, 
  phone,
  showAddress,
  address
}: { 
  lat: number; 
  lng: number; 
  name: string; 
  website?: string; 
  phone?: string; 
  showAddress?: boolean;
  address?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    
    let active = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let L: any;

    const initMap = async () => {
      try {
        L = (await import("leaflet")).default;
        if (!active || !mapRef.current) return;

        // Clean up previous map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: 13,
          scrollWheelZoom: false,
        });
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(map);

        const svgIcon = `
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C10.4772 2 6 6.47715 6 12C6 19.5 16 30 16 30C16 30 26 19.5 26 12C26 6.47715 21.5228 2 16 2Z" fill="#173A57" stroke="#ffffff" stroke-width="2"/>
            <circle cx="16" cy="12" r="5" fill="#FDF277"/>
          </svg>
        `;

        const customIcon = L.divIcon({
          html: svgIcon,
          className: "custom-map-pin",
          iconSize: [36, 36],
          iconAnchor: [18, 34],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        
        let popupHtml = `
          <div style="font-family: var(--font-century-gothic), sans-serif; padding: 4px; color: #173A57; min-width: 160px;">
            <strong style="font-size:12px; display:block; margin-bottom:6px; text-transform: uppercase; border-bottom: 1px solid rgba(23,58,87,0.1); padding-bottom: 4px;">${name || "Händler-Standort"}</strong>
        `;
        if (showAddress && address) {
          popupHtml += `
            <div style="font-size:11px; margin-bottom:6px; display:flex; align-items:flex-start; gap:6px;">
              <span style="font-size:12px;">📍</span>
              <span style="word-break: break-word;">${address}</span>
            </div>
            <div style="font-size:11px; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span style="font-size:12px;">🚗</span>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="color:#173A57; text-decoration:underline; font-weight:600;">Route planen</a>
            </div>
          `;
        }
        if (phone) {
          popupHtml += `
            <div style="font-size:11px; margin-bottom:4px; display:flex; align-items:center; gap:4px;">
              <span>📞</span>
              <a href="tel:${phone}" style="color:#173A57; text-decoration:none; font-weight:600;">${phone}</a>
            </div>
          `;
        }
        if (website) {
          let url = website;
          if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
          }
          popupHtml += `
            <div style="font-size:11px; display:flex; align-items:center; gap:4px;">
              <span>🌐</span>
              <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#173A57; text-decoration:underline; font-weight:600;">Website</a>
            </div>
          `;
        }
        popupHtml += `</div>`;

        marker.bindPopup(popupHtml).openPopup();

      } catch (err) {
        console.error("Leaflet init error:", err);
      }
    };

    initMap();

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name, website, phone, showAddress, address]);

  return (
    <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-navy/10 shadow-inner bg-[#f5f4ef]">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <style>{`
        .custom-map-pin {
          background: none !important;
          border: none !important;
        }
        .custom-map-pin svg {
          filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.2));
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" style={{ height: "100%", minHeight: "280px" }} />
    </div>
  );
}

// ─── B2B Portal Product Card Component ───────────────────────────────────────

function PortalProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: ApiProduct; 
  onAddToCart: (product: ApiProduct, qty: number, pricePerKarton: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const tiers = product.tiers ?? [];
  const unitsPerBox = product.units_per_item ?? 1;

  // Find active tier
  const activeTierIndex = tiers.findIndex((t) => qty >= t.min && (t.max === null || qty <= t.max));
  const activeTier = tiers[activeTierIndex] ?? { min: 1, max: null, price: product.retailer_price };
  const pricePerKarton = activeTier.price;

  const productTotal = pricePerKarton * qty;
  const depositTotal = product.deposit * unitsPerBox * qty;
  const hasDeposit = product.deposit > 0;

  const pricePerUnit = pricePerKarton / unitsPerBox;
  const uvp = product.uvp;
  const profit = uvp ? uvp - pricePerUnit : null;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col bg-white border border-[#173A57]/10 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden flex-shrink-0 bg-[#f5f4ef]">
        {product.image ? (
          <Image unoptimized src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" style={{ objectPosition: "center top" }} />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Package size={44} className="text-[#173A57]/20" />
            <span className="font-gothic text-[10px] font-medium uppercase tracking-widest text-[#173A57]/30">Bild folgt</span>
          </div>
        )}
        {unitsPerBox > 1 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold font-gothic bg-[#FDF277] text-[#173A57]">
            {unitsPerBox} Stk. / Karton
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          {product.subtitle && (
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5 text-[#173A57]/50">{product.subtitle}</p>
          )}
          <h3 className="text-lg font-bold uppercase text-[#173A57]">{product.name}</h3>
        </div>

        {product.description && (
          <p className="text-xs leading-relaxed mb-4 text-[#173A57]/60">{product.description}</p>
        )}

        {/* Tiers List */}
        {tiers.length > 0 && (
          <div className="rounded-xl p-3 mb-4 bg-[#f5f4ef] border border-[#173A57]/5">
            <div className="flex items-center gap-1.5 mb-2.5 text-[#173A57]/50">
              <TrendingDown size={11} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Staffelpreise / Karton</span>
            </div>
            <div className="space-y-1">
              {tiers.map((tier, i) => {
                const isActive = i === activeTierIndex;
                const label = tier.max === null ? `ab ${tier.min} Kartons` : `${tier.min}–${tier.max} Karton${tier.max !== 1 ? "s" : ""}`;
                const tierPricePerUnit = tier.price / unitsPerBox;
                return (
                  <div key={i} className={`flex flex-col gap-1 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${isActive ? "bg-[#173A57] text-white" : "bg-white border border-[#173A57]/5"}`}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? "bg-[#FDF277]" : "bg-[#173A57]/10"}`}>
                          {isActive && <Check size={8} className="text-[#173A57]" />}
                        </div>
                        <span className={`text-[11px] font-medium ${isActive ? "text-white" : "text-[#173A57]/60"}`}>{label}</span>
                      </div>
                      <span className={`text-xs font-bold ${isActive ? "text-[#FDF277]" : "text-[#173A57]/80"}`}>
                        {tier.price.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </span>
                    </div>
                    <div className="flex justify-between w-full pl-5 text-[9px]">
                      <span className={`${isActive ? "text-white/70" : "text-[#173A57]/45"}`}>Einzelpreis pro Dose:</span>
                      <span className={`font-semibold ${isActive ? "text-[#FDF277]" : "text-[#173A57]/60"}`}>
                        {tierPricePerUnit.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex-grow" />
        <hr className="my-3 border-[#173A57]/5" />

        {/* Quantity Select and calculation */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 rounded-full px-4 flex-1 bg-[#f5f4ef] border border-[#173A57]/10 h-11">
              <button 
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))} 
                className="w-5 h-5 flex items-center justify-center rounded text-[#173A57]/60 hover:text-[#173A57] hover:bg-[#173A57]/5 transition-colors cursor-pointer border-none bg-transparent"
              >
                <Minus size={12} />
              </button>
              <div className="flex-1 text-center flex flex-col items-center justify-center">
                <div className="leading-none text-xs">
                  <span className="font-bold text-[#173A57]">{qty}</span>
                  <span className="ml-1 text-[#173A57]/50">Karton{qty !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setQty(qty + 1)} 
                className="w-5 h-5 flex items-center justify-center rounded text-[#173A57]/60 hover:text-[#173A57] hover:bg-[#173A57]/5 transition-colors cursor-pointer border-none bg-transparent"
              >
                <Plus size={12} />
              </button>
            </div>

            <div className="rounded-full px-4 text-right bg-[#f5f4ef] border border-[#173A57]/10 min-w-[95px] h-11 flex flex-col justify-center">
              <div className="text-[9px] text-[#173A57]/50 leading-none mb-0.5">Netto</div>
              <div className="text-xs font-bold text-[#173A57] leading-none">
                {productTotal.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          {hasDeposit && (
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] bg-[#f5f4ef] border border-[#173A57]/10">
              <span className="text-[#173A57]/60">♻ Pfand (steuerfrei)</span>
              <span className="text-[#173A57] font-semibold">
                +{depositTotal.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                <span className="text-[#173A57]/40 text-[9px]"> ({(product.deposit * unitsPerBox).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €/Karton)</span>
              </span>
            </div>
          )}

          <div className="rounded-lg p-2.5 text-left bg-[#f5f4ef] border border-[#173A57]/10 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#173A57]/60">Einzelpreis pro Dose:</span>
              <span className="font-semibold text-[#173A57]">
                {pricePerUnit.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € (netto)
              </span>
            </div>
            {uvp ? (
              <>
                <div className="border-t border-[#173A57]/5 my-1" />
                <div className="flex justify-between">
                  <span className="text-[#173A57]/60">UVP pro Dose:</span>
                  <span className="font-semibold text-[#173A57]">
                    {uvp.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € (brutto)
                  </span>
                </div>
                {profit !== null && (
                  <div className="flex justify-between text-[#173A57]">
                    <span className="font-semibold">Gewinn pro Dose:</span>
                    <span className="font-bold text-green-600">
                      {profit.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </div>
                )}
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product, qty, pricePerKarton)}
            className="w-full bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow active:scale-[0.98] text-xs cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider border-none"
          >
            <ShoppingCart size={13} />
            <span>In den Warenkorb</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Portal Page ────────────────────────────────────────────────────────

export default function RetailerPortalPage() {
  const { items, subtotal, minOrderValue, addItem, clearCart, setB2bConfig } = useCart();

  // Navigation & Login States
  const [emailInput, setEmailInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active Session info
  const [retailerInfo, setRetailerInfo] = useState<RetailerInfo | null>(null);
  const [activeTab, setActiveTab] = useState<"dummy" | "profile" | "orders" | "order" | "affiliate" | "addresses" | "support">("dummy");

  // Orders State
  const [orders, setOrders] = useState<RetailerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Addresses State
  const [addresses, setAddresses] = useState<CustomerAddressDb[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  
  // Address Form State
  const [addressEditMode, setAddressEditMode] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddressDb | null>(null);
  const [addrFirstName, setAddrFirstName] = useState("");
  const [addrLastName, setAddrLastName] = useState("");
  const [addrAddress1, setAddrAddress1] = useState("");
  const [addrAddress2, setAddrAddress2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrCountry, setAddrCountry] = useState("DE");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrSaveLoading, setAddrSaveLoading] = useState(false);
  const [addrSaveError, setAddrSaveError] = useState<string | null>(null);

  // Support Assistant State
  const [supportStep, setSupportStep] = useState<1 | 2 | 3 | 4>(1);
  const [supportCategory, setSupportCategory] = useState("");
  const [supportIssueType, setSupportIssueType] = useState("");
  const [supportOrderId, setSupportOrderId] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [supportTicketId, setSupportTicketId] = useState<string | null>(null);

  // Downloads State
  const [downloads, setDownloads] = useState<MarketingDownload[]>([]);
  const [downloadsLoading, setDownloadsLoading] = useState(false);
  const [downloadsError, setDownloadsError] = useState<string | null>(null);

  // B2B Catalog State
  const [catalog, setCatalog] = useState<ApiProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Direct Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // VAT states
  const [vatIdInput, setVatIdInput] = useState("");
  const [vatFile, setVatFile] = useState<File | null>(null);
  const [vatUploadLoading, setVatUploadLoading] = useState(false);
  const [vatUploadError, setVatUploadError] = useState<string | null>(null);
  const [vatUploadSuccess, setVatUploadSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (retailerInfo?.referral_link) {
      navigator.clipboard.writeText(retailerInfo.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle VAT upload submission
  async function handleVatUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!vatIdInput.trim()) {
      setVatUploadError("Bitte geben Sie Ihre USt-IdNr. ein.");
      return;
    }
    if (!vatFile) {
      setVatUploadError("Bitte wählen Sie ein Nachweis-Dokument aus.");
      return;
    }

    setVatUploadLoading(true);
    setVatUploadError(null);
    setVatUploadSuccess(null);

    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";

    if (!email || !code) {
      setVatUploadError("Sitzung abgelaufen. Bitte melden Sie sich erneut an.");
      setVatUploadLoading(false);
      return;
    }

    try {
      const res = await uploadVatDocument(email, code, vatIdInput.trim(), vatFile);
      if (res.success && res.data) {
        setVatUploadSuccess("Dokument erfolgreich hochgeladen. Unser Support wird es prüfen.");
        // Update local retailer info state
        if (retailerInfo) {
          setRetailerInfo({
            ...retailerInfo,
            vat_id: res.data.vat_id,
            vat_checked: res.data.vat_checked,
            vat_document_path: res.data.vat_document_path,
          });
        }
      }
    } catch (err) {
      setVatUploadError(err instanceof Error ? err.message : "Fehler beim Hochladen.");
    } finally {
      setVatUploadLoading(false);
    }
  }

  // Edit Form States
  const [infoName, setInfoName] = useState("");
  const [infoWebsite, setInfoWebsite] = useState("");
  const [infoTel, setInfoTel] = useState("");
  const [infoRetailerAddress, setInfoRetailerAddress] = useState("");
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [mapLat, setMapLat] = useState<string>("");
  const [mapLng, setMapLng] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);


  // Clear session details and logs out
  function handleLogout() {
    eraseCookie("retailer_email");
    eraseCookie("retailer_code");
    setIsLoggedIn(false);
    setRetailerInfo(null);
    setVatIdInput("");
    setStep("email");
    setCodeInput("");
    setEmailInput("");
    setError(null);
    setSuccessMsg(null);
    setInfoRetailerAddress("");
    setAddressSearchQuery("");
    setAddressSuggestions([]);
    setShowSuggestions(false);
    setShowAddress(false);
    setCatalog([]);
  }

  // Load B2B Catalog
  const loadCatalog = React.useCallback(async (email: string) => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const products = await fetchProducts("DE", email);
      setCatalog(products);
      setB2bConfig(getCachedDiscountTiers(), getCachedMinOrderValue());
    } catch (err) {
      console.error(err);
      setCatalogError(err instanceof Error ? err.message : "Produkte konnten nicht geladen werden.");
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  const handleAddToCart = React.useCallback((product: ApiProduct, qty: number, pricePerKarton: number) => {
    const displayProduct = apiProductToDisplay(product, { retailer_price: pricePerKarton });
    addItem(displayProduct, qty);
  }, [addItem]);

  const handleReorder = React.useCallback(async (order: RetailerOrder) => {
    clearCart();
    
    let currentCatalog = catalog;
    if (currentCatalog.length === 0) {
      const email = getCookie("retailer_email") || "";
      if (email) {
        try {
          currentCatalog = await fetchProducts("DE", email);
          setCatalog(currentCatalog);
        } catch (err) {
          console.error("Failed to load catalog for reorder", err);
          setError("Produkte konnten nicht geladen werden.");
          return;
        }
      } else {
        setError("Sitzung abgelaufen. Bitte melde dich erneut an.");
        return;
      }
    }

    let itemsAdded = 0;
    for (const item of order.items) {
      if (item.parent_item_id !== null) {
        continue;
      }

      const matchingProd = currentCatalog.find((p) => {
        if (item.bunde_product_id !== null && p.type === "bundle") {
          return p.id === item.bunde_product_id;
        }
        if (item.product_id !== null && p.type === "product") {
          return p.id === item.product_id;
        }
        return p.name.toLowerCase() === item.product_name.toLowerCase();
      });

      if (matchingProd) {
        const tiers = matchingProd.tiers ?? [];
        const activeTier = tiers.find((t) => item.quantity >= t.min && (t.max === null || item.quantity <= t.max));
        const resolvedPrice = activeTier ? activeTier.price : matchingProd.retailer_price;

        const displayProduct = apiProductToDisplay(matchingProd, { retailer_price: resolvedPrice });
        addItem(displayProduct, item.quantity);
        itemsAdded++;
      } else {
        console.warn(`Product ${item.product_name} not found in B2B catalog for reorder.`);
      }
    }

    if (itemsAdded > 0) {
      setIsCheckoutOpen(true);
    } else {
      setError("Die Artikel dieser Bestellung konnten im aktuellen Katalog nicht gefunden werden.");
    }
  }, [catalog, addItem, clearCart]);

  // Load profile data and standard customer address
  const loadInfo = React.useCallback(async (email: string, code: string) => {
    try {
      // Fetch both profile info and standard customer address via the access code check endpoint
      const [infoRes, checkRes] = await Promise.all([
        getRetailerInfo(email, code),
        checkRetailerPortalAccessCode(email, code)
      ]);

      if (infoRes.success && infoRes.data && checkRes.success && checkRes.customer) {
        // Merge the customer address into the retailerInfo object
        const mergedData: RetailerInfo = {
          ...infoRes.data,
          address: checkRes.customer.address
        };
        setRetailerInfo(mergedData);
        setIsLoggedIn(true);
        loadCatalog(email);

        // Pre-fill form fields
        setInfoName(infoRes.data.info_name || "");
        setInfoWebsite(infoRes.data.info_website || "");
        setInfoTel(infoRes.data.info_tel || "");
        setInfoRetailerAddress(infoRes.data.info_retaileraddress || "");
        setAddressSearchQuery(infoRes.data.info_retaileraddress || "");
        setShowMap(infoRes.data.show_map || false);
        setShowAddress(infoRes.data.show_address || false);
        setMapLat(infoRes.data.map_lat !== null ? infoRes.data.map_lat.toString() : "");
        setMapLng(infoRes.data.map_lng !== null ? infoRes.data.map_lng.toString() : "");
        setVatIdInput(infoRes.data.vat_id || "");
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
      handleLogout();
    } finally {
      setPageLoading(false);
    }
  }, [loadCatalog]);

  const loadOrders = React.useCallback(async () => {
    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";
    if (!email || !code) return;

    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await getRetailerOrders(email, code);
      setOrders(data);
    } catch (err) {
      console.error(err);
      setOrdersError(err instanceof Error ? err.message : "Bestellungen konnten nicht geladen werden.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadAddresses = React.useCallback(async () => {
    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";
    if (!email || !code) return;

    setAddressesLoading(true);
    setAddressesError(null);
    try {
      const data = await getRetailerAddresses(email, code);
      setAddresses(data);
    } catch (err) {
      console.error(err);
      setAddressesError(err instanceof Error ? err.message : "Adressen konnten nicht geladen werden.");
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrSaveLoading(true);
    setAddrSaveError(null);

    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";

    const payload = {
      first_name: addrFirstName.trim(),
      last_name: addrLastName.trim(),
      address1: addrAddress1.trim(),
      address2: addrAddress2.trim() || null,
      city: addrCity.trim(),
      zip: addrZip.trim(),
      country: addrCountry,
      phone: addrPhone.trim() || null,
    };

    try {
      if (editingAddress) {
        await updateRetailerAddress(email, code, editingAddress.id, payload);
      } else {
        await createRetailerAddress(email, code, payload);
      }
      setAddressEditMode(false);
      setEditingAddress(null);
      loadAddresses();
    } catch (err) {
      setAddrSaveError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setAddrSaveLoading(false);
    }
  };

  const handleStartEditAddress = (addr: CustomerAddressDb) => {
    setEditingAddress(addr);
    setAddrFirstName(addr.first_name || "");
    setAddrLastName(addr.last_name || "");
    setAddrAddress1(addr.address1 || "");
    setAddrAddress2(addr.address2 || "");
    setAddrCity(addr.city || "");
    setAddrZip(addr.zip || "");
    setAddrCountry(addr.country || "DE");
    setAddrPhone(addr.phone || "");
    setAddrSaveError(null);
    setAddressEditMode(true);
  };

  const handleStartAddAddress = () => {
    setEditingAddress(null);
    setAddrFirstName("");
    setAddrLastName("");
    setAddrAddress1("");
    setAddrAddress2("");
    setAddrCity("");
    setAddrZip("");
    setAddrCountry("DE");
    setAddrPhone("");
    setAddrSaveError(null);
    setAddressEditMode(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Möchten Sie diese Lieferadresse wirklich löschen?")) return;
    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";
    try {
      await deleteRetailerAddress(email, code, id);
      loadAddresses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
    }
  };

  const handleCreateSupportTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    setSupportError(null);
    setSupportTicketId(null);

    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";

    try {
      const res = await createSupportTicket(email, code, {
        category: supportCategory,
        issue_type: supportIssueType || undefined,
        order_id: supportOrderId || undefined,
        description: supportDescription,
      });

      if (res.success && res.ticket_id) {
        setSupportTicketId(res.ticket_id);
        setSupportStep(4);
        // Reset form
        setSupportDescription("");
        setSupportOrderId("");
        setSupportIssueType("");
      } else {
        setSupportError(res.message || "Erstellung fehlgeschlagen.");
      }
    } catch (err) {
      setSupportError(err instanceof Error ? err.message : "Verbindung fehlgeschlagen.");
    } finally {
      setSupportLoading(false);
    }
  };

  const loadDownloads = React.useCallback(async () => {
    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";
    if (!email || !code) return;

    setDownloadsLoading(true);
    setDownloadsError(null);
    try {
      const data = await getRetailerDownloads(email, code);
      setDownloads(data);
    } catch (err) {
      console.error(err);
      setDownloadsError(err instanceof Error ? err.message : "Downloads konnten nicht geladen werden.");
    } finally {
      setDownloadsLoading(false);
    }
  }, []);

  function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  useEffect(() => {
    if ((activeTab === "orders" || activeTab === "support") && isLoggedIn) {
      const timer = setTimeout(() => {
        loadOrders();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isLoggedIn, loadOrders]);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        loadDownloads();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, loadDownloads]);

  // Check session cookie on mount
  useEffect(() => {
    const savedEmail = getCookie("retailer_email");
    const savedCode = getCookie("retailer_code");

    // Defer execution to avoid synchronous state updates inside the effect body
    const timer = setTimeout(() => {
      if (savedEmail && savedCode) {
        loadInfo(savedEmail, savedCode);
      } else {
        setPageLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [loadInfo]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("retailer_auth_change"));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if ((activeTab === "addresses" || activeTab === "order") && isLoggedIn) {
      const timer = setTimeout(() => {
        loadAddresses();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isLoggedIn, loadAddresses]);

  // Login Code Request
  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await getRetailerPortalAccessCode(emailInput.trim());
      if (res.success) {
        setStep("code");
        setSuccessMsg(`Zugangscode wurde erfolgreich an ${emailInput} gesendet.`);
        // In local/test environment, we might get the code directly in the response
        if (res.code) {
          console.log("TEST CODE RECEIVED:", res.code);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Anforderung fehlgeschlagen. Bitte prüfe die E-Mail-Adresse.");
    } finally {
      setActionLoading(false);
    }
  }

  // Login Code Verification
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const email = emailInput.trim();
      const code = codeInput.trim();
      const res = await checkRetailerPortalAccessCode(email, code);
      
      if (res.success && res.code_valid) {
        setCookie("retailer_email", email);
        setCookie("retailer_code", code);
        setPageLoading(true);
        
        await loadInfo(email, code);
      } else {
        setError(res.message || "Code ungültig oder abgelaufen.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Code-Verifizierung fehlgeschlagen.");
    } finally {
      setActionLoading(false);
    }
  }

  // Geocoding & Address search
  async function searchAddress(query: string) {
    if (!query.trim()) return;
    setSearchLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
        headers: {
          "Accept-Language": "de,en"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAddressSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Nominatim error:", err);
    } finally {
      setSearchLoading(false);
    }
  }

  function selectSuggestion(item: { display_name: string; lat: string; lon: string }) {
    setInfoRetailerAddress(item.display_name);
    setAddressSearchQuery(item.display_name);
    setMapLat(item.lat);
    setMapLng(item.lon);
    setShowSuggestions(false);
  }

  // Profile Save
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSaveSuccess(false);

    const email = getCookie("retailer_email") || "";
    const code = getCookie("retailer_code") || "";

    if (!email || !code) {
      setError("Sitzung abgelaufen. Bitte melde dich erneut an.");
      handleLogout();
      setSaveLoading(false);
      return;
    }

    try {
      const lat = mapLat.trim() !== "" ? parseFloat(mapLat) : undefined;
      const lng = mapLng.trim() !== "" ? parseFloat(mapLng) : undefined;

      const res = await updateRetailerInfo({
        email,
        code,
        info_name: infoName.trim() || undefined,
        info_website: infoWebsite.trim() || undefined,
        info_tel: infoTel.trim() || undefined,
        info_retaileraddress: infoRetailerAddress.trim() || undefined,
        show_map: showMap,
        show_address: showAddress,
        map_lat: lat,
        map_lng: lng,
      });

      if (res.success && res.data) {
        // Merge the existing address from local state since update doesn't return it
        const mergedData: RetailerInfo = {
          ...res.data,
          address: retailerInfo?.address
        };
        setRetailerInfo(mergedData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Speichern fehlgeschlagen.");
    } finally {
      setSaveLoading(false);
    }
  }

  // Render Loader
  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-10 h-10 border-4 border-[#173A57]/20 border-t-[#173A57] rounded-full animate-spin mb-4" />
        <p className="font-gothic text-navy/60">Händlerportal lädt...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 md:py-16 text-[#173A57] font-gothic">
      
      {/* ─── Hero Header ────────────────────────────────────────────────────── */}
      <section className="mb-10 text-center border-b border-[#173A57]/10 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDF277]/10 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl md:text-5xl font-bold font-gothic tracking-tight uppercase mb-3 text-[#173A57]">
          Händler-Portal
        </h1>
        <p className="text-base md:text-lg text-navy/70 max-w-3xl leading-relaxed mx-auto">
          Willkommen im exklusiven B2B-Portal von AWAKE. Hier steht dir die gesamte Verwaltung deiner Partnerschaft zur Verfügung: Bestelle AWAKE zu attraktiven Händler-Konditionen und Staffelpreisen, passe dein Profil für unsere Händlerkarte an, greife auf aktuelle Marketingmaterialien und Werbemittel zu, verwalte deine Lieferadressen und behalte deine Bestellhistorie im Blick. Bei Fragen hilft dir unser Support-Assistent direkt weiter.
        </p>
      </section>

      {/* ─── Login Screen ───────────────────────────────────────────────────── */}
      {!isLoggedIn ? (
        <section className="max-w-md mx-auto my-12">
          <div className="bg-white rounded-2xl border border-navy/10 shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#173A57] to-[#FDF277]" />
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#173A57]/5 mb-6 mx-auto">
              <Lock className="h-6 w-6 text-[#173A57]" />
            </div>

            <h2 className="text-2xl font-bold font-gothic text-center uppercase mb-2">Händler-Login</h2>
            <p className="text-sm text-navy/60 text-center mb-6">
              Gib deine registrierte Händler-E-Mail-Adresse ein, um einen 6-stelligen Zugangscode zu erhalten.
            </p>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 text-green-700 text-xs flex items-start gap-2 border border-green-100">
                <Check className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
                    Händler E-Mail-Adresse
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="haendler@beispiel.de"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#f5f4ef]/50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 transition-all font-gothic text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Zugangscode anfordern</span>
                      <Key className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
                    6-stelliger Zugangscode
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      id="code"
                      type="text"
                      required
                      maxLength={6}
                      placeholder="300827"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-10 pr-4 py-3 bg-[#f5f4ef]/50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 tracking-[0.25em] text-center font-bold text-base transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#173A57] font-bold py-3 px-4 rounded-xl transition-all text-sm cursor-pointer text-center flex items-center justify-center"
                  >
                    Zurück
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-[2] bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Einloggen</span>
                        <Unlock className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-navy/5 text-center">
              <p className="text-xs text-navy/60 leading-relaxed font-gothic">
                Du willst Händler werden?{" "}
                <Link href="/#haendler-werden" className="text-[#173A57] font-semibold underline hover:text-[#2563EB] transition-colors">
                  Jetzt bewerben!
                </Link>
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* ─── Logged In Portal ─────────────────────────────────────────────── */
        <section className="space-y-8 animate-fadeIn">
          
          {/* Händler Info Bar */}
          <div className="bg-[#f5f4ef] border border-navy/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs uppercase font-bold tracking-wider text-green-700 font-gothic">Eingeloggt als Partner</span>
              </div>
              <h2 className="text-2xl font-bold font-gothic">
                {retailerInfo?.info_name || `${retailerInfo?.first_name} ${retailerInfo?.last_name}`}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy/60">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {retailerInfo?.email}
                </span>
                {retailerInfo?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {retailerInfo?.phone}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-200 rounded-xl px-5 py-2.5 transition-all text-sm font-semibold cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              <span>Abmelden</span>
            </button>
          </div>

          {/* USt-IdNr / VAT Status Alerts */}
          {retailerInfo && (() => {
            const countryCode = retailerInfo.address?.country_code ? retailerInfo.address.country_code.toUpperCase() : "DE";
            const isNonGermany = countryCode !== "DE" && countryCode !== "GERMANY" && countryCode !== "DEUTSCHLAND";

            if (!isNonGermany) return null;

            // Verified state
            if (retailerInfo.vat_checked) {
              return (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3.5 text-green-800">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">USt-IdNr. verifiziert</h4>
                    <p className="text-xs mt-1 text-green-700/90 leading-relaxed">
                      Ihre Umsatzsteuer-Identifikationsnummer (<strong>{retailerInfo.vat_id}</strong>) wurde erfolgreich geprüft. Sie bestellen in unserem Portal ab sofort steuerfrei (steuerfreie innergemeinschaftliche Lieferung).
                    </p>
                  </div>
                </div>
              );
            }

            // Pending state
            if (retailerInfo.vat_document_path) {
              return (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3.5 text-blue-800">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">USt-IdNr. Prüfung ausstehend</h4>
                    <p className="text-xs mt-1 text-blue-700/90 leading-relaxed">
                      Sie haben Ihre USt-IdNr. (<strong>{retailerInfo.vat_id}</strong>) und Ihr Nachweis-Dokument eingereicht. Unser Support-Team prüft Ihre Angaben in Kürze. Sobald die Freigabe erfolgt ist, bestellen Sie automatisch steuerfrei.
                    </p>
                  </div>
                </div>
              );
            }

            // Unsubmitted state
            return (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4 text-amber-900">
                <div className="flex items-start gap-3.5">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">Steuerfreie innergemeinschaftliche Lieferung</h4>
                    <p className="text-xs mt-1 text-amber-800/90 leading-relaxed">
                      Da sich Ihr Firmensitz außerhalb von Deutschland befindet, können Sie bei uns steuerfrei bestellen. Dazu müssen wir Ihre Umsatzsteuer-Identifikationsnummer (USt-IdNr.) sowie einen entsprechenden Nachweis (z.B. Gewerbenachweis oder Handelsregisterauszug) manuell prüfen. Bitte tragen Sie Ihre Daten unten ein.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVatUpload} className="bg-white rounded-xl border border-amber-200/50 p-4 space-y-4 max-w-xl">
                  {vatUploadError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{vatUploadError}</span>
                    </div>
                  )}
                  {vatUploadSuccess && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-xs flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{vatUploadSuccess}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/60 mb-1">
                        USt-IdNr. (VAT ID)
                      </label>
                      <input
                        type="text"
                        placeholder="z.B. ATU12345678"
                        value={vatIdInput}
                        onChange={(e) => setVatIdInput(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                        className="w-full px-3 py-2 bg-gray-50 border border-navy/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/60 mb-1">
                        Gewerbenachweis / Dokument
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.zip"
                        onChange={(e) => setVatFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-navy/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-[#173A57]/5 file:text-[#173A57] hover:file:bg-[#173A57]/10 file:cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={vatUploadLoading}
                    className="w-full sm:w-auto bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                  >
                    {vatUploadLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Nachweis einreichen</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            );
          })()}

          {/* ─── Portal Tabs ────────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Tab navigation */}
            <div className="flex border-b border-navy/10 gap-4">
              <button
                onClick={() => { setActiveTab("dummy"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "dummy"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Marketing & Downloads
              </button>
              <button
                onClick={() => { setActiveTab("profile"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Händler-Profil
              </button>
              <button
                onClick={() => { setActiveTab("orders"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Bestellungen
              </button>
              <button
                onClick={() => { setActiveTab("order"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "order"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Neue Bestellung
              </button>
              <button
                onClick={() => { setActiveTab("affiliate"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "affiliate"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Partnerprogramm
              </button>
              <button
                onClick={() => { setActiveTab("addresses"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Lieferadressen
              </button>
              <button
                onClick={() => { setActiveTab("support"); setError(null); }}
                className={`py-3 px-4 font-bold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === "support"
                    ? "border-[#173A57] text-[#173A57]"
                    : "border-transparent text-[#173A57]/40 hover:text-[#173A57]/60"
                }`}
              >
                Support-Assistent
              </button>
            </div>

            {/* Tab 1: Marketing & Downloads (Dummy) */}
            {activeTab === "dummy" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Benefits */}
                <div className="md:col-span-1 bg-white border border-navy/10 rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-bold uppercase border-b border-navy/10 pb-3 flex items-center gap-2">
                    <Building className="h-5 w-5 text-[#173A57]" />
                    <span>Deine B2B Vorteile</span>
                  </h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div>
                        <strong>Staffelpreise:</strong> Attraktive Preisnachlässe ab größeren Abnahmemengen.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div>
                        <strong>Schneller Versand:</strong> B2B-Bestellungen werden innerhalb von 48 Stunden versandt.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div>
                        <strong>POS Werbematerial:</strong> Kostenfreie Bereitstellung von Flyern und Aufstellern.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div>
                        <strong>Premium Support:</strong> Direkter Kontakt zu unserem Vertriebsteam für Anfragen.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Downloads */}
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-wide">Downloads für Handelspartner</h3>
                  
                  {downloadsLoading && (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                    </div>
                  )}

                  {downloadsError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                      {downloadsError}
                    </div>
                  )}

                  {!downloadsLoading && !downloadsError && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {downloads.map((download) => (
                        <div key={download.id} className="bg-white border border-navy/10 hover:border-navy/20 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md group">
                          <div className="space-y-2">
                            <span className="inline-block px-2.5 py-0.5 rounded bg-[#173A57]/5 text-[#173A57] text-[10px] font-bold uppercase tracking-wider">
                              {download.file_type_label}
                            </span>
                            <h4 className="font-bold text-sm uppercase group-hover:text-[#2563EB] transition-colors">{download.title}</h4>
                            {download.description && (
                              <p className="text-xs text-navy/60">
                                {download.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between border-t border-navy/5 pt-3">
                            <span className="text-[11px] text-navy/40">Größe: {formatBytes(download.file_size)}</span>
                            {download.file_url ? (
                              <a 
                                href={download.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#173A57] hover:text-[#2563EB] transition-colors cursor-pointer"
                              >
                                <span>Herunterladen</span>
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <span className="text-xs text-navy/30 italic">Datei fehlt</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {downloads.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-sm text-navy/40 italic">
                          Keine Downloads verfügbar.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Retailer Info (Profile Editor) */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Editor */}
                <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Händler-Profil bearbeiten</h3>
                    <p className="text-xs text-navy/60">
                      Aktualisiere die Profildaten deines Geschäfts. Die Felder werden selektiv in der Datenbank überschrieben.
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="p-4 rounded-xl bg-green-50 text-green-700 text-xs flex items-start gap-2 border border-green-100 animate-fadeIn">
                      <Check className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Händlerprofil erfolgreich aktualisiert! Die Änderungen sind sofort aktiv.</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    {/* info_name */}
                    <div>
                      <label htmlFor="info_name" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                        Firmenname / Geschäftsname
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                          <Building className="h-4 w-4" />
                        </span>
                        <input
                          id="info_name"
                          type="text"
                          placeholder="Muster GmbH"
                          value={infoName}
                          onChange={(e) => setInfoName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-sm"
                        />
                      </div>
                    </div>

                    {/* info_website */}
                    <div>
                      <label htmlFor="info_website" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                        Website URL
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                          <Globe className="h-4 w-4" />
                        </span>
                        <input
                          id="info_website"
                          type="url"
                          placeholder="https://mustergmbh.de"
                          value={infoWebsite}
                          onChange={(e) => setInfoWebsite(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-sm"
                        />
                      </div>
                    </div>

                    {/* info_tel */}
                    <div>
                      <label htmlFor="info_tel" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                        Telefonnummer (für Kunden sichtbar)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          id="info_tel"
                          type="text"
                          placeholder="+49987654321"
                          value={infoTel}
                          onChange={(e) => setInfoTel(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-sm"
                        />
                      </div>
                    </div>

                    {/* show_map Checkbox */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        id="show_map"
                        type="checkbox"
                        checked={showMap}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setShowMap(val);
                          if (!val) {
                            setShowAddress(false);
                          }
                        }}
                        className="h-4 w-4 rounded border-navy/10 text-[#173A57] focus:ring-[#173A57]/30 cursor-pointer"
                      />
                      <label htmlFor="show_map" className="text-xs font-bold uppercase tracking-wide text-navy cursor-pointer select-none">
                        Auf Händlerkarte anzeigen
                      </label>
                    </div>

                    {/* show_address Checkbox */}
                    {showMap && (
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          id="show_address"
                          type="checkbox"
                          checked={showAddress}
                          onChange={(e) => setShowAddress(e.target.checked)}
                          className="h-4 w-4 rounded border-navy/10 text-[#173A57] focus:ring-[#173A57]/30 cursor-pointer"
                        />
                        <label htmlFor="show_address" className="text-xs font-bold uppercase tracking-wide text-navy cursor-pointer select-none">
                          Meine Adresse soll veröffentlicht werden
                        </label>
                      </div>
                    )}

                    {/* Address Search */}
                    {showMap && (
                      <div className="space-y-2 pt-2 border-t border-navy/5 relative">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                          Händler-Adresse suchen (für die Karte)
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                              <MapPin className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              placeholder="z.B. Musterstraße 1, 10115 Berlin"
                              value={addressSearchQuery}
                              onChange={(e) => {
                                setAddressSearchQuery(e.target.value);
                                setInfoRetailerAddress(e.target.value); // also store what they type directly as fallback
                              }}
                              className="w-full pl-9 pr-4 py-2 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  searchAddress(addressSearchQuery);
                                }
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => searchAddress(addressSearchQuery)}
                            disabled={searchLoading}
                            className="bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold px-4 rounded-xl text-xs transition-all shadow cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            {searchLoading ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              "Suchen"
                            )}
                          </button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                            {addressSuggestions.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => selectSuggestion(item)}
                                className="w-full text-left px-4 py-2 hover:bg-[#f5f4ef] transition-colors border-b border-navy/5 last:border-none text-xs text-navy/80 flex flex-col gap-0.5"
                              >
                                <span className="font-semibold text-navy">{item.display_name}</span>
                                <span className="text-[10px] text-navy/50">Lat: {parseFloat(item.lat).toFixed(4)}, Lng: {parseFloat(item.lon).toFixed(4)}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Hidden Lat/Lng helper label or small indicator of matched coordinates */}
                        {mapLat && mapLng && (
                          <p className="text-[10px] text-navy/50 italic">
                            Koordinaten aufgelöst: {parseFloat(mapLat).toFixed(4)}, {parseFloat(mapLng).toFixed(4)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="w-full bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center gap-2"
                      >
                        {saveLoading ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Profil speichern</span>
                            <Check className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Map Preview */}
                <div className="bg-white border border-navy/10 rounded-2xl p-6 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Kartenvorschau</h3>
                    <p className="text-xs text-navy/60">
                      So wird dein Geschäft auf der öffentlichen AWAKE Händlerkarte dargestellt.
                    </p>
                  </div>

                  {showMap && parseFloat(mapLat) && parseFloat(mapLng) ? (
                    <LocalRetailerMap
                      lat={parseFloat(mapLat)}
                      lng={parseFloat(mapLng)}
                      name={infoName || `${retailerInfo?.first_name} ${retailerInfo?.last_name}`}
                      website={infoWebsite}
                      phone={infoTel}
                      showAddress={showAddress}
                      address={infoRetailerAddress}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-grow py-16 bg-[#f5f4ef] border border-navy/10 rounded-xl text-center p-6 gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#173A57]/5 flex items-center justify-center text-[#173A57]">
                        <Map className="h-6 w-6 opacity-60" />
                      </div>
                      <div className="space-y-1 max-w-xs">
                        <p className="text-sm font-bold">Keine Kartenvorschau aktiv</p>
                        <p className="text-xs text-navy/60">
                          Aktiviere die Option „Auf Händlerkarte anzeigen“ und trage gültige Koordinaten ein, um die Kartenvorschau zu aktivieren.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#173A57]/5 rounded-xl p-4 border border-[#173A57]/10 flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-[#173A57] shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed space-y-1">
                      <p className="font-bold">Deine eingetragene Adresse:</p>
                      <p>
                        {retailerInfo?.address?.street || "Hauptstraße 1"}, {" "}
                        {retailerInfo?.address?.zip || "12345"} {retailerInfo?.address?.city || "Musterstadt"},{" "}
                        {retailerInfo?.address?.country_code || "DE"}
                      </p>
                      <p className="text-navy/50 italic mt-1 font-gothic">
                        Hinweis: Für eine genaue Positionierung trage bitte die entsprechenden GPS-Koordinaten links ein.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Retailer Orders */}
            {activeTab === "orders" && (
              <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#173A57]/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-[#173A57]" />
                      <span>Bestellhistorie</span>
                    </h3>
                    <p className="text-xs text-navy/60">
                      Hier siehst du den Status deiner B2B-Bestellungen und kannst Rechnungen sowie Sendungsverfolgungen abrufen.
                    </p>
                  </div>
                  <button
                    onClick={loadOrders}
                    disabled={ordersLoading}
                    className="self-start sm:self-center flex items-center justify-center gap-1.5 bg-[#f5f4ef] hover:bg-[#173A57]/5 border border-navy/10 rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${ordersLoading ? "animate-spin" : ""}`} />
                    <span>Aktualisieren</span>
                  </button>
                </div>

                {ordersError && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{ordersError}</span>
                  </div>
                )}

                {ordersLoading && orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-10 h-10 border-4 border-[#173A57]/20 border-t-[#173A57] rounded-full animate-spin" />
                    <p className="text-sm text-navy/60">Lade Bestellungen...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#173A57]/5 flex items-center justify-center text-[#173A57]/60">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-wide">Keine Bestellungen gefunden</p>
                      <p className="text-xs text-navy/60 leading-relaxed">
                        Es wurden noch keine Bestellungen für dieses Händlerkonto erfasst. Sobald du Bestellungen tätigst, werden diese hier aufgelistet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      // Status mapping
                      let statusLabel = order.status;
                      let statusBg = "bg-gray-100 text-gray-700";
                      let statusIcon = <Clock className="h-3.5 w-3.5" />;

                      if (order.status === "shipped") {
                        statusLabel = "Versandt";
                        statusBg = "bg-green-50 text-green-700 border border-green-100";
                        statusIcon = <Check className="h-3.5 w-3.5 text-green-600" />;
                      } else if (order.status === "forwarded") {
                        statusLabel = "An Logistik übergeben";
                        statusBg = "bg-blue-50 text-blue-700 border border-blue-100";
                        statusIcon = <Truck className="h-3.5 w-3.5 text-blue-600" />;
                      } else if (order.status === "pending") {
                        if (order.is_paid) {
                          if (order.is_released) {
                            statusLabel = "In Bearbeitung";
                            statusBg = "bg-purple-50 text-purple-700 border border-purple-100";
                          } else {
                            statusLabel = "Wartet auf Freigabe";
                            statusBg = "bg-amber-50 text-amber-700 border border-amber-100";
                          }
                        } else {
                          statusLabel = "Wartet auf Zahlung";
                          statusBg = "bg-red-50 text-red-700 border border-red-100";
                        }
                      }

                      // Format date
                      const dateStr = order.created_at
                        ? new Date(order.created_at).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-";

                      return (
                        <div
                          key={order.id}
                          className="bg-white border border-navy/10 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                          {/* Order Header */}
                          <div className="bg-[#f5f4ef]/45 border-b border-navy/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">B2B Bestellung</span>
                              <div className="flex items-center gap-2.5">
                                <h4 className="font-bold text-base text-[#173A57]">
                                  #MAN-{order.id}
                                </h4>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBg}`}>
                                  {statusIcon}
                                  <span>{statusLabel}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-6 gap-y-2 text-xs md:text-sm">
                              <div>
                                <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">Bestelldatum</p>
                                <p className="font-semibold">{dateStr}</p>
                              </div>
                              {order.payment_amount !== null && (
                                <div>
                                  <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">Gesamtsumme</p>
                                  <p className="font-bold text-[#173A57]">
                                    {order.payment_amount.toLocaleString("de-DE", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}{" "}
                                    €
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Body / Items */}
                          <div className="p-6 space-y-4">
                            <div>
                              <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider mb-2">Bestellte Artikel</p>
                              <ul className="divide-y divide-navy/5">
                                {order.items.map((item) => (
                                  <li key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs md:text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-navy/60 min-w-[20px]">{item.quantity}x</span>
                                      <span className="font-semibold text-navy">{item.product_name}</span>
                                      {item.is_bundle_item && (
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded uppercase tracking-wider">
                                          Bundle
                                        </span>
                                      )}
                                    </div>
                                    {item.unit_price !== null && (
                                      <span className="text-navy/60 font-mono text-xs md:text-sm">
                                        {(item.unit_price * item.quantity).toLocaleString("de-DE", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}{" "}
                                        €
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {order.notes && (
                              <div className="bg-[#f5f4ef]/30 border-l-2 border-[#173A57]/30 rounded-r-xl p-3 text-xs italic text-navy/70">
                                <strong>Bemerkung:</strong> {order.notes}
                              </div>
                            )}

                            {/* Tracking and Actions */}
                            <div className="pt-4 border-t border-navy/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              {/* Tracking Section */}
                              <div className="text-xs space-y-1">
                                {order.vonexio_tracking_list && order.vonexio_tracking_list.length > 0 ? (
                                  <div>
                                    <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                      <Truck className="h-3 w-3" />
                                      <span>Sendungsverfolgung</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {order.vonexio_tracking_list.map((track, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5">
                                          {track.link ? (
                                            <a
                                              href={track.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[#173A57] font-semibold underline hover:text-[#2563EB] transition-colors flex items-center gap-0.5 font-mono bg-blue-50/50 border border-blue-100/50 rounded px-2 py-0.5 text-[11px]"
                                            >
                                              <span>{track.tracking_number}</span>
                                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                                            </a>
                                          ) : (
                                            <span className="font-mono bg-gray-50 border border-gray-150 rounded px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                                              {track.tracking_number}
                                            </span>
                                          )}
                                          {track.provider && (
                                            <span className="text-[9px] uppercase font-bold text-navy/40">
                                              ({track.provider})
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : order.vonexio_tracking_id ? (
                                  <div>
                                    <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                      <Truck className="h-3 w-3" />
                                      <span>DHL Sendungsverfolgung</span>
                                    </p>
                                    <a
                                      href={`https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${order.vonexio_tracking_id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#173A57] font-semibold underline hover:text-[#2563EB] transition-colors flex items-center gap-1 font-mono"
                                    >
                                      <span>{order.vonexio_tracking_id}</span>
                                      <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                  </div>
                                ) : order.status === "shipped" || order.status === "forwarded" ? (
                                  <p className="text-navy/50 italic text-[11px] flex items-center gap-1">
                                    <Truck className="h-3 w-3 opacity-60" />
                                    <span>Sendungsverfolgung wird vorbereitet.</span>
                                  </p>
                                ) : null}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap items-center gap-3">
                                {/* Stripe payment link */}
                                {!order.is_paid && order.payment_token && (
                                  <a
                                    href={`https://payment.h2-awake.de/paymanual/${order.payment_token}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                                  >
                                    <CreditCard className="h-3.5 w-3.5" />
                                    <span>Online bezahlen</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}

                                {/* Easybill Invoice PDF */}
                                {order.easybill_document_id && order.is_finalized && order.payment_token && (
                                  <a
                                    href={`https://h2vitaldash.x900.3az.de/paymanual/${order.payment_token}/invoice-pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-[#f5f4ef] text-[#173A57] border border-navy/10 hover:border-navy/20 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-navy/60" />
                                    <span>Rechnung (PDF)</span>
                                  </a>
                                )}

                                {/* Neu bestellen Button */}
                                <button
                                  type="button"
                                  onClick={() => handleReorder(order)}
                                  className="bg-white hover:bg-[#173A57]/5 text-[#173A57] border border-navy/10 hover:border-[#173A57]/20 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  <span>Neu bestellen</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Neue Bestellung */}
            {activeTab === "order" && (
              <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#173A57]" />
                    <span>Produkte nachbestellen</span>
                  </h3>
                  <p className="text-xs text-navy/60">
                    Wähle hier deine Produkte und lege sie in den Warenkorb. Die Staffelpreise gelten automatisch basierend auf der Menge.
                  </p>
                </div>

                {items.length > 0 && (
                  <div className="bg-[#f5f4ef] border border-[#173A57]/10 rounded-xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between text-xs font-bold gap-1">
                      <span className="text-[#173A57]">Mindestbestellwert: {minOrderValue.toLocaleString("de-DE", { style: "currency", currency: "EUR" })} (netto)</span>
                      {subtotal < minOrderValue ? (
                        <span className="text-red-600">Noch {(minOrderValue - subtotal).toLocaleString("de-DE", { style: "currency", currency: "EUR" })} bis zur Bestellung</span>
                      ) : (
                        <span className="text-green-600">Mindestbestellwert erreicht!</span>
                      )}
                    </div>
                    <div className="w-full h-2.5 bg-[#173A57]/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${subtotal < minOrderValue ? "bg-red-500" : "bg-green-600"}`}
                        style={{ width: `${Math.min(100, (subtotal / minOrderValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {catalogLoading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-10 h-10 border-4 border-[#173A57]/20 border-t-[#173A57] rounded-full animate-spin" />
                    <p className="text-sm text-navy/60">Lade Produktkatalog...</p>
                  </div>
                )}

                {catalogError && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{catalogError}</span>
                  </div>
                )}

                {!catalogLoading && !catalogError && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalog.map((product) => (
                        <PortalProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>

                    {catalog.length === 0 && (
                      <div className="text-center py-8 text-sm text-navy/40 italic">
                        Keine Produkte im B2B-Katalog verfügbar.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Tab 5: Partnerprogramm */}
            {activeTab === "affiliate" && (
              <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8 space-y-8 animate-fadeIn max-w-4xl">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Building className="h-5 w-5 text-[#173A57]" />
                    <span>Partnerprogramm</span>
                  </h3>
                  <p className="text-xs text-navy/60">
                    Empfehle AWAKE weiter und verdiene attraktive Provisionen.
                  </p>
                </div>

                {retailerInfo?.is_affiliate ? (
                  /* Case 1: Partner is himself an affiliate */
                  <div className="space-y-6">
                    <div className="bg-[#173A57]/5 border border-[#173A57]/10 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FDF277] text-[#173A57]">
                          Aktiver Partner
                        </span>
                        <span className="text-xs text-navy/60">Code: <strong>{retailerInfo.referral_code}</strong></span>
                      </div>
                      <h4 className="text-lg font-bold">Vielen Dank für deine Partnerschaft!</h4>
                      <p className="text-sm leading-relaxed text-navy/80">
                        Als registrierter AWAKE-Partner kannst du deinen exklusiven Empfehlungslink mit deinen Kunden, Bekannten und Partnern teilen. Jede Bestellung, die über diesen Link getätigt wird, wird dir gutgeschrieben und du erhältst dafür deine vertraglich vereinbarte Provision.
                      </p>
                    </div>

                    <div className="bg-[#f5f4ef] border border-navy/10 rounded-xl p-5 space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                        Dein Empfehlungslink
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          readOnly
                          value={retailerInfo.referral_link || ""}
                          className="flex-1 px-4 py-3 bg-white border border-navy/10 rounded-xl focus:outline-none text-sm font-mono text-navy select-all"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow active:scale-[0.98] text-xs cursor-pointer flex items-center justify-center gap-2 border-none shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 text-[#FDF277]" />
                              <span>Kopiert!</span>
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />
                              <span>Link kopieren</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Case 2: Partner is not an affiliate */
                  <div className="space-y-6">
                    <div className="bg-[#f5f4ef] border border-navy/10 rounded-2xl p-6 space-y-4">
                      <h4 className="text-lg font-bold">Werde Teil des AWAKE-Partnerprogramms!</h4>
                      <p className="text-sm leading-relaxed text-navy/80">
                        Du bist noch nicht als Partner in unserem Empfehlungssystem registriert? Profitiere von attraktiven Provisionen auf weitergeleitete Bestellungen. Unser Support schaltet dich gerne frei.
                      </p>
                    </div>

                    <div className="bg-[#173A57]/5 border border-[#173A57]/10 rounded-xl p-5 space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">
                          {retailerInfo?.recruiter_code ? "Dein Empfehlungs-Partnerlink" : "AWAKE Partnerseite"}
                        </span>
                        <p className="text-sm font-semibold">
                          {retailerInfo?.recruiter_code ? (
                            <>Du wurdest von Partner <strong>{retailerInfo.recruiter_code}</strong> geworben.</>
                          ) : (
                            <>Besuche die AWAKE Partnerseite:</>
                          )}
                        </p>
                        <div className="text-xs font-mono text-navy/70 select-all p-2.5 bg-white border border-navy/10 rounded-lg">
                          {retailerInfo?.recruiter_link || "https://h2-awake.de/partner"}
                        </div>
                      </div>
                      <a
                        href={retailerInfo?.recruiter_link || "https://h2-awake.de/partner"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow text-xs uppercase tracking-wider border-none text-center cursor-pointer shrink-0"
                      >
                        <span>AWAKE Partnerseite besuchen</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 6: Lieferadressen */}
            {activeTab === "addresses" && (
              <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#173A57]/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#173A57]" />
                      <span>Lieferadressen verwalten</span>
                    </h3>
                    <p className="text-xs text-navy/60">
                      Hinterlege hier zusätzliche Versandanschriften für deine Bestellungen.
                    </p>
                  </div>
                  {!addressEditMode && (
                    <button
                      onClick={handleStartAddAddress}
                      className="self-start sm:self-center flex items-center justify-center gap-1.5 bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow cursor-pointer border-none"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Adresse hinzufügen</span>
                    </button>
                  )}
                </div>

                {addressesError && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{addressesError}</span>
                  </div>
                )}

                {/* Address Form (Add / Edit) */}
                {addressEditMode && (
                  <div className="bg-[#f5f4ef]/50 border border-navy/10 rounded-2xl p-5 md:p-6 space-y-4 animate-fadeIn">
                    <h4 className="font-bold text-sm uppercase text-navy border-b border-navy/5 pb-2">
                      {editingAddress ? "Lieferadresse bearbeiten" : "Neue Lieferadresse hinzufügen"}
                    </h4>
                    
                    {addrSaveError && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-100">
                        {addrSaveError}
                      </div>
                    )}

                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            Vorname *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrFirstName}
                            onChange={(e) => setAddrFirstName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            Nachname *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrLastName}
                            onChange={(e) => setAddrLastName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            Straße & Hausnummer *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrAddress1}
                            onChange={(e) => setAddrAddress1(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            Adresszusatz (optional)
                          </label>
                          <input
                            type="text"
                            value={addrAddress2}
                            onChange={(e) => setAddrAddress2(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            PLZ *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrZip}
                            onChange={(e) => setAddrZip(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            Ort *
                          </label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                            Land *
                          </label>
                          <select
                            value={addrCountry}
                            onChange={(e) => setAddrCountry(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs cursor-pointer"
                          >
                            <option value="DE">Deutschland</option>
                            <option value="AT">Österreich</option>
                            <option value="CH">Schweiz</option>
                            <option value="NL">Niederlande</option>
                            <option value="BE">Belgien</option>
                            <option value="FR">Frankreich</option>
                            <option value="IT">Italien</option>
                            <option value="ES">Spanien</option>
                            <option value="PL">Polen</option>
                            <option value="CZ">Tschechien</option>
                            <option value="LU">Luxemburg</option>
                            <option value="DK">Dänemark</option>
                            <option value="SE">Schweden</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                          Telefonnummer (optional)
                        </label>
                        <input
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAddressEditMode(false);
                            setEditingAddress(null);
                          }}
                          className="flex-1 bg-white hover:bg-gray-100 text-[#173A57] border border-navy/10 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer text-center"
                        >
                          Abbrechen
                        </button>
                        <button
                          type="submit"
                          disabled={addrSaveLoading}
                          className="flex-1 bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                        >
                          {addrSaveLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            "Speichern"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address Cards List */}
                {addressesLoading && addresses.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 text-sm text-navy/40 italic bg-[#f5f4ef]/30 rounded-2xl border border-dashed border-navy/10">
                    Keine Lieferadresse hinterlegt. Klicken Sie auf „Adresse hinzufügen“, um eine anzulegen.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-white border border-navy/10 hover:border-navy/20 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md relative"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-navy">
                              {addr.first_name} {addr.last_name}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded bg-[#173A57]/5 text-[#173A57] text-[10px] font-bold font-mono">
                              {addr.country}
                            </span>
                          </div>
                          <div className="text-xs text-navy/70 space-y-0.5 leading-relaxed">
                            <p>{addr.address1}</p>
                            {addr.address2 && <p className="text-[11px] text-navy/50">{addr.address2}</p>}
                            <p>{addr.zip} {addr.city}</p>
                            {addr.phone && (
                              <p className="text-[11px] text-navy/50 flex items-center gap-1 pt-1 border-t border-navy/5">
                                📞 {addr.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-navy/5 pt-3 mt-1">
                          <button
                            onClick={() => handleStartEditAddress(addr)}
                            className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#173A57] hover:text-[#2563EB] transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Bearbeiten</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="flex items-center gap-1 text-[11px] font-bold uppercase text-red-600 hover:text-red-700 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Löschen</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 7: Support-Assistent */}
            {activeTab === "support" && (
              <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#173A57]" />
                    <span>Support-Assistent</span>
                  </h3>
                  <p className="text-xs text-navy/60">
                    Wir helfen dir schnell und unkompliziert. Folge den Schritten, um ein Zoho Support-Ticket zu erstellen.
                  </p>
                </div>

                {/* Progress Indicators */}
                {supportStep !== 4 && (
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-navy/40 border-b border-navy/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${supportStep >= 1 ? "bg-[#173A57] text-white" : "bg-navy/5"}`}>1</span>
                      <span className={supportStep >= 1 ? "text-navy" : ""}>Kategorie</span>
                    </div>
                    <div className="h-[2px] bg-navy/5 flex-1 mx-4" />
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${supportStep >= 2 ? "bg-[#173A57] text-white" : "bg-navy/5"}`}>2</span>
                      <span className={supportStep >= 2 ? "text-navy" : ""}>Details</span>
                    </div>
                    <div className="h-[2px] bg-navy/5 flex-1 mx-4" />
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${supportStep >= 3 ? "bg-[#173A57] text-white" : "bg-navy/5"}`}>3</span>
                      <span className={supportStep >= 3 ? "text-navy" : ""}>Beschreibung</span>
                    </div>
                  </div>
                )}

                {supportError && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{supportError}</span>
                  </div>
                )}

                {/* Support Step 1: Category Selection */}
                {supportStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold mb-2">Wähle den Bereich deiner Anfrage:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Category 1 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSupportCategory("Bestellung & Lieferung");
                          setSupportStep(2);
                        }}
                        className="text-left bg-white border border-navy/10 hover:border-navy/35 rounded-2xl p-5 hover:shadow-md transition-all group flex gap-4 cursor-pointer animate-fadeIn"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#173A57]/5 flex items-center justify-center shrink-0 text-[#173A57]">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs uppercase group-hover:text-[#2563EB] transition-colors">
                            Bestellung & Lieferung
                          </h4>
                          <p className="text-[11px] text-navy/60 leading-relaxed">
                            Lieferungsverzug, Transportschäden oder Fragen zur Sendungsverfolgung.
                          </p>
                        </div>
                      </button>

                      {/* Category 2 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSupportCategory("Rechnungen & Finanzen");
                          setSupportStep(2);
                        }}
                        className="text-left bg-white border border-navy/10 hover:border-navy/35 rounded-2xl p-5 hover:shadow-md transition-all group flex gap-4 cursor-pointer animate-fadeIn"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#173A57]/5 flex items-center justify-center shrink-0 text-[#173A57]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs uppercase group-hover:text-[#2563EB] transition-colors">
                            Rechnungen & Finanzen
                          </h4>
                          <p className="text-[11px] text-navy/60 leading-relaxed">
                            Fragen zu Zahlungsbelegen, Mehrwertsteuer oder der USt-IdNr.-Freigabe.
                          </p>
                        </div>
                      </button>

                      {/* Category 3 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSupportCategory("POS & Marketingmaterial");
                          setSupportStep(2);
                        }}
                        className="text-left bg-white border border-navy/10 hover:border-navy/35 rounded-2xl p-5 hover:shadow-md transition-all group flex gap-4 cursor-pointer animate-fadeIn"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#173A57]/5 flex items-center justify-center shrink-0 text-[#173A57]">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs uppercase group-hover:text-[#2563EB] transition-colors">
                            POS & Marketingmaterial
                          </h4>
                          <p className="text-[11px] text-navy/60 leading-relaxed">
                            Werbeaufsteller anfordern, Flyer bestellen oder Eintrag Händlerkarte bearbeiten.
                          </p>
                        </div>
                      </button>

                      {/* Category 4 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSupportCategory("Produkt & Sonstiges");
                          setSupportStep(2);
                        }}
                        className="text-left bg-white border border-navy/10 hover:border-navy/35 rounded-2xl p-5 hover:shadow-md transition-all group flex gap-4 cursor-pointer animate-fadeIn"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#173A57]/5 flex items-center justify-center shrink-0 text-[#173A57]">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs uppercase group-hover:text-[#2563EB] transition-colors">
                            Produkt & Sonstiges
                          </h4>
                          <p className="text-[11px] text-navy/60 leading-relaxed">
                            Qualitätsfeedback, allgemeine Produktfragen oder Partnerschaftliches.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Support Step 2: Specific Details */}
                {supportStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-[#173A57]/5 rounded-xl p-4 border border-[#173A57]/10 flex items-center gap-2 mb-4">
                      <span className="text-[11px] font-bold uppercase text-navy">Gewählte Kategorie:</span>
                      <span className="px-2.5 py-0.5 rounded bg-white text-navy font-bold text-xs border border-navy/10">
                        {supportCategory}
                      </span>
                    </div>

                    {(supportCategory === "Bestellung & Lieferung" || supportCategory === "Rechnungen & Finanzen") && (
                      <div className="space-y-4">
                        {/* Order Dropdown Selection */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                            Betroffene Bestellung
                          </label>
                          <select
                            value={supportOrderId}
                            onChange={(e) => setSupportOrderId(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs font-semibold cursor-pointer"
                          >
                            <option value="">-- Keine Bestellung ausgewählt --</option>
                            {orders.map((o) => (
                              <option key={o.id} value={o.id.toString()}>
                                #{o.id} vom {o.created_at ? new Date(o.created_at).toLocaleDateString("de-DE") : "-"} ({o.payment_amount !== null ? `${o.payment_amount.toLocaleString("de-DE")} €` : ""})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Issue Type Selector */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                            Thema der Anfrage
                          </label>
                          <select
                            value={supportIssueType}
                            onChange={(e) => setSupportIssueType(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs font-semibold cursor-pointer"
                            required
                          >
                            <option value="">-- Bitte wählen --</option>
                            {supportCategory === "Bestellung & Lieferung" ? (
                              <>
                                <option value="Lieferungsverzug">Lieferungsverzug / Versandstatus</option>
                                <option value="Transportschaden / Fehlende Artikel">Transportschaden / Fehlende Artikel</option>
                                <option value="Falsche Artikel geliefert">Falsche Artikel geliefert</option>
                                <option value="Sonstiges">Sonstiges</option>
                              </>
                            ) : (
                              <>
                                <option value="Falsche Rechnungsanschrift">Falsche Rechnungsanschrift</option>
                                <option value="Fehlende Rechnung">Fehlende Rechnung</option>
                                <option value="Zahlungsstatus klären">Zahlungsstatus klären</option>
                                <option value="VAT / USt-IdNr. Probleme">VAT / USt-IdNr. Probleme</option>
                                <option value="Sonstiges">Sonstiges</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    )}

                    {supportCategory === "POS & Marketingmaterial" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                          Was benötigen Sie?
                        </label>
                        <select
                          value={supportIssueType}
                          onChange={(e) => setSupportIssueType(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs font-semibold cursor-pointer"
                          required
                        >
                          <option value="">-- Bitte wählen --</option>
                          <option value="Händlerkarte Eintrag anpassen">Eintrag Händlerkarte anpassen</option>
                          <option value="Werbeaufsteller anfordern">Werbeaufsteller (Aufsteller) anfordern</option>
                          <option value="Flyer & Broschüren">Flyer / Broschüren bestellen</option>
                          <option value="Sonstiges">Sonstiges</option>
                        </select>
                      </div>
                    )}

                    {supportCategory === "Produkt & Sonstiges" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                          Betreff / Thema
                        </label>
                        <select
                          value={supportIssueType}
                          onChange={(e) => setSupportIssueType(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs font-semibold cursor-pointer"
                          required
                        >
                          <option value="">-- Bitte wählen --</option>
                          <option value="Produktqualität / Feedback">Produktqualität / Feedback</option>
                          <option value="Großhandelsanfrage">Großhandelsanfrage</option>
                          <option value="Sonstiges">Sonstiges Anliegen</option>
                        </select>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-navy/5">
                      <button
                        type="button"
                        onClick={() => setSupportStep(1)}
                        className="flex-1 bg-[#f5f4ef] hover:bg-[#173A57]/5 text-[#173A57] border border-navy/10 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Zurück
                      </button>
                      <button
                        type="button"
                        onClick={() => setSupportStep(3)}
                        disabled={!supportIssueType}
                        className="flex-1 bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer border-none"
                      >
                        Weiter
                      </button>
                    </div>
                  </div>
                )}

                {/* Support Step 3: Description */}
                {supportStep === 3 && (
                  <form onSubmit={handleCreateSupportTicketSubmit} className="space-y-4 animate-fadeIn">
                    <div className="bg-[#173A57]/5 rounded-xl p-4 border border-[#173A57]/10 flex flex-wrap gap-x-6 gap-y-2 mb-4 text-xs font-bold text-navy">
                      <div>
                        <span className="opacity-50 uppercase text-[10px] block">Kategorie</span>
                        <span>{supportCategory}</span>
                      </div>
                      <div className="h-6 w-[1px] bg-navy/10 hidden sm:block" />
                      <div>
                        <span className="opacity-50 uppercase text-[10px] block">Thema</span>
                        <span>{supportIssueType}</span>
                      </div>
                      {supportOrderId && (
                        <>
                          <div className="h-6 w-[1px] bg-navy/10 hidden sm:block" />
                          <div>
                            <span className="opacity-50 uppercase text-[10px] block">Bestellnummer</span>
                            <span>#{supportOrderId}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                        Ihre Nachricht / Details *
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Beschreiben Sie Ihr Anliegen so detailliert wie möglich..."
                        value={supportDescription}
                        onChange={(e) => setSupportDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173A57]/30 text-xs leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-navy/5">
                      <button
                        type="button"
                        onClick={() => setSupportStep(2)}
                        className="flex-1 bg-[#f5f4ef] hover:bg-[#173A57]/5 text-[#173A57] border border-navy/10 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Zurück
                      </button>
                      <button
                        type="submit"
                        disabled={supportLoading || !supportDescription.trim()}
                        className="flex-1 bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                      >
                        {supportLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Ticket senden"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Support Step 4: Success / Done */}
                {supportStep === 4 && (
                  <div className="text-center py-10 space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-100">
                      <Check className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h4 className="font-bold text-lg">Support-Ticket erstellt!</h4>
                      <p className="text-xs text-navy/70 leading-relaxed">
                        Ihre Anfrage wurde erfolgreich an unser Ticketsystem übermittelt. Wir haben das Ticket mit der ID <strong>#{supportTicketId}</strong> erfasst.
                      </p>
                      <p className="text-[11px] text-navy/50">
                        Wir prüfen Ihr Anliegen und melden uns in Kürze unter <strong>{retailerInfo?.email}</strong> bei Ihnen zurück.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSupportStep(1);
                        setSupportCategory("");
                        setSupportIssueType("");
                        setSupportOrderId("");
                        setSupportDescription("");
                        setSupportTicketId(null);
                      }}
                      className="bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border-none"
                    >
                      Neues Ticket erstellen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          prefilledCustomer={retailerInfo || undefined}
          initialCode={getCookie("retailer_code")}
        />
      )}

      <CartDrawer
        prefilledCustomer={retailerInfo || undefined}
        initialCode={getCookie("retailer_code")}
      />

    </main>
  );
}
