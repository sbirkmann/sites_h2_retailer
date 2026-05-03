"use client";

import { useState } from "react";
import { useCart } from "../lib/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const { items, totalItems, subtotal, totalDeposit, totalShipping, grandTotal, updateQuantity, removeItem, closeCart, isCartOpen } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const fmt = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

  return (
    <>
      {/* Backdrop */}
      <div onClick={closeCart} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(11,35,58,0.6)", backdropFilter: "blur(4px)", zIndex: 998, opacity: isCartOpen ? 1 : 0, pointerEvents: isCartOpen ? "auto" : "none", transition: "opacity 0.3s" }} />

      {/* Drawer */}
      <aside style={{ position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "460px", height: "100vh", backgroundColor: "#F0F4F8", color: "#173A57", zIndex: 999, transform: isCartOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", boxShadow: isCartOpen ? "-10px 0 40px rgba(0,0,0,0.15)" : "none" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", borderBottom: "1px solid rgba(23,58,87,0.08)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'Century Gothic','Jost',sans-serif" }}>
            Warenkorb <span style={{ fontSize: "14px", fontWeight: 500, opacity: 0.6 }}>({totalItems} Artikel)</span>
          </h2>
          <button onClick={closeCart} aria-label="Schließen" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(23,58,87,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
            <svg width="20" height="20" fill="none" stroke="#173A57" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "80px", opacity: 0.5 }}>
              <svg width="56" height="56" fill="none" stroke="#173A57" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: "16px", opacity: 0.3 }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              <p style={{ fontSize: "16px" }}>Ihr Warenkorb ist leer.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.slug} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px 0", borderBottom: "1px solid rgba(23,58,87,0.06)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product.name}</div>
                  <div style={{ fontSize: "13px", opacity: 0.6 }}>
                    {fmt(item.product.retailer_price)} / Stk.
                    {item.product.deposit > 0 && <span> · Pfand {fmt(item.product.deposit)}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fff", borderRadius: "12px", padding: "4px", border: "1px solid rgba(23,58,87,0.08)" }}>
                  <button onClick={() => updateQuantity(item.product.slug, item.quantity - 1)} style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, cursor: "pointer", border: "none", backgroundColor: "transparent", color: "#173A57" }}>−</button>
                  <span style={{ width: "28px", textAlign: "center", fontSize: "15px", fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.slug, item.quantity + 1)} style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, cursor: "pointer", border: "none", backgroundColor: "transparent", color: "#173A57" }}>+</button>
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, minWidth: "70px", textAlign: "right" }}>{fmt(item.product.retailer_price * item.quantity)}</div>
                <button onClick={() => removeItem(item.product.slug)} aria-label="Entfernen" style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", backgroundColor: "transparent", opacity: 0.4 }}>
                  <svg width="16" height="16" fill="none" stroke="#173A57" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(23,58,87,0.08)", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", opacity: 0.7 }}><span>Zwischensumme (netto)</span><span>{fmt(subtotal)}</span></div>
            {totalDeposit > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", opacity: 0.7 }}><span>Pfand</span><span>{fmt(totalDeposit)}</span></div>}
            {totalShipping > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", opacity: 0.7 }}><span>Versand (geschätzt)</span><span>{fmt(totalShipping)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(23,58,87,0.08)", fontSize: "18px", fontWeight: 700 }}><span>Gesamt (netto)</span><span>{fmt(grandTotal)}</span></div>
            <button className="btn" onClick={() => { closeCart(); setCheckoutOpen(true); }} style={{ width: "100%", marginTop: "20px", padding: "16px", fontSize: "16px" }}>Zur Kasse</button>
          </div>
        )}
      </aside>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
