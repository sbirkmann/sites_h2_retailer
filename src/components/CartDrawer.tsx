"use client";

import { useState, useEffect } from "react";
import { useCart } from "../lib/CartContext";
import CheckoutModal from "./CheckoutModal";
import Image from "next/image";

import { type RetailerInfo } from "../lib/api";

export default function CartDrawer({
  prefilledCustomer,
  initialCode
}: {
  prefilledCustomer?: RetailerInfo;
  initialCode?: string;
}) {
  const { items, totalItems, subtotal, totalDeposit, totalShipping, discountPercent, discountAmount, minOrderValue, grandTotal, updateQuantity, removeItem, closeCart, isCartOpen } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  useEffect(() => {
    if (isCartOpen || checkoutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, checkoutOpen]);

  const fmt = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

  return (
    <>
      {/* Backdrop */}
      <div onClick={closeCart} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(11,35,58,0.6)", backdropFilter: "blur(4px)", zIndex: 998, opacity: isCartOpen ? 1 : 0, pointerEvents: isCartOpen ? "auto" : "none", transition: "opacity 0.3s" }} />

      {/* Drawer */}
      <aside style={{ position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "460px", height: "100vh", backgroundColor: "#F0F4F8", color: "#173A57", zIndex: 999, transform: isCartOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", boxShadow: isCartOpen ? "-10px 0 40px rgba(0,0,0,0.15)" : "none" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(23,58,87,0.08)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, fontFamily: "'Century Gothic','Jost',sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Warenkorb <span style={{ fontSize: "14px", fontWeight: 600, opacity: 0.6 }}>({totalItems})</span>
          </h2>
          <button onClick={closeCart} aria-label="Schließen" style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(23,58,87,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
            <svg width="20" height="20" fill="none" stroke="#173A57" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Minimum Order Value Status Bar */}
        {items.length > 0 && (
          <div style={{ padding: "12px 24px 8px 24px", backgroundColor: "#fff", borderBottom: "1px solid rgba(23,58,87,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
              <span>Mindestbestellwert: {fmt(minOrderValue)} (netto)</span>
              {subtotal < minOrderValue ? (
                <span style={{ color: "#EF4444" }}>Noch {fmt(Math.max(0, minOrderValue - subtotal))} bis zur Bestellung</span>
              ) : (
                <span style={{ color: "#78B833" }}>Mindestbestellwert erreicht!</span>
              )}
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "#E2E8F0", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (subtotal / minOrderValue) * 100)}%`, height: "100%", backgroundColor: subtotal < minOrderValue ? "#EF4444" : "#78B833", transition: "width 0.3s ease-in-out" }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "80px", opacity: 0.5 }}>
              <svg width="56" height="56" fill="none" stroke="#173A57" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: "16px", opacity: 0.3 }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              <p style={{ fontSize: "16px" }}>Ihr Warenkorb ist leer.</p>
            </div>
          ) : (
            items.map((item) => {
              // Ensure we use the newly downloaded hero slide image instead of the old one
              const imgSrc = item.product.image === "/hero.png" ? "/images/hero-slide-1.webp" : item.product.image;
              
              return (
                <div key={item.product.slug} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 0", borderBottom: "1px solid rgba(23,58,87,0.06)" }}>
                  
                  {/* Image */}
                  <div style={{ width: "64px", height: "64px", flexShrink: 0, backgroundColor: "#fff", borderRadius: "12px", border: "1px solid rgba(23,58,87,0.08)", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", position: "relative" }}>
                    <Image src={imgSrc} alt={item.product.name} width={56} height={56} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px", lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.product.name}</div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                      {fmt(item.product.retailer_price)} / Stk.
                      {item.product.deposit > 0 && <div style={{ color: "#78B833", fontWeight: 600, marginTop: "2px" }}>+ Pfand {fmt(item.product.deposit)}</div>}
                    </div>
                  </div>

                  {/* Controls & Price */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: 0 }}>
                    <div style={{ fontSize: "16px", fontWeight: 800 }}>{fmt(item.product.retailer_price * item.quantity)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid rgba(23,58,87,0.1)", padding: "2px" }}>
                        <button onClick={() => updateQuantity(item.product.slug, item.quantity - 1)} style={{ width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor: "transparent", color: "#173A57" }}>−</button>
                        <span style={{ width: "20px", textAlign: "center", fontSize: "13px", fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.slug, item.quantity + 1)} style={{ width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor: "transparent", color: "#173A57" }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.product.slug)} aria-label="Entfernen" style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", borderRadius: "6px", transition: "0.2s" }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(23,58,87,0.08)", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", opacity: 0.7 }}><span>Produkte (netto)</span><span>{fmt(subtotal)}</span></div>
            {discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#78B833", fontWeight: 700 }}>
                <span>B2B Rabatt ({discountPercent}%)</span>
                <span>-{fmt(discountAmount)}</span>
              </div>
            )}
            {totalShipping > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", opacity: 0.7 }}><span>Versand (Deutschland)</span><span>{fmt(totalShipping)}</span></div>}
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed rgba(23,58,87,0.1)", fontSize: "15px", fontWeight: 700 }}><span>Zwischensumme (netto)</span><span>{fmt(subtotal - discountAmount + totalShipping)}</span></div>
            
            {totalDeposit > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "14px", opacity: 0.7 }}><span>Pfand (steuerfrei)</span><span>{fmt(totalDeposit)}</span></div>}
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(23,58,87,0.08)", fontSize: "20px", fontWeight: 800 }}><span>Gesamtsumme</span><span>{fmt(grandTotal)}</span></div>
            <button 
              className="btn" 
              disabled={subtotal < minOrderValue} 
              onClick={() => { closeCart(); setCheckoutOpen(true); }} 
              style={{ 
                width: "100%", 
                marginTop: "24px", 
                padding: "18px", 
                fontSize: "16px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "8px",
                opacity: subtotal < minOrderValue ? 0.5 : 1,
                cursor: subtotal < minOrderValue ? "not-allowed" : "pointer"
              }}
            >
              Zur Kasse
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}
      </aside>

      {checkoutOpen && (
        <CheckoutModal 
          onClose={() => setCheckoutOpen(false)} 
          prefilledCustomer={prefilledCustomer}
          initialCode={initialCode}
        />
      )}
    </>
  );
}
