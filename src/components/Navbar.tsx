"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../lib/CartContext";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
      {/* Top Announcement Bar */}
      <div style={{ backgroundColor: "#FDF277", color: "#173A57", textAlign: "center", padding: "8px", fontSize: "12px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase" }}>
        EXKLUSIVE B2B-KONDITIONEN | 20% LIFETIME AFFILIATE PROVISION
      </div>
      
      {/* Main Navbar */}
      <nav className="navbar" style={{ position: "relative", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", padding: "16px 0", borderBottom: "1px solid rgba(23, 58, 87, 0.1)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <div className="nav-links-desktop" style={{ flex: 1, display: "flex", gap: "32px", alignItems: "center" }}>
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menü" style={{ background: "none", border: "none", color: "#173A57", cursor: "pointer", padding: "4px" }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
            <div className="desktop-only" style={{ display: "flex", gap: "24px" }}>
              <a href="#vorteile" style={{ color: "#173A57", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Vorteile</a>
              <a href="#produkte" style={{ color: "#173A57", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Sortiment</a>
            </div>
          </div>
          
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Link href="/" className="nav-brand" style={{ color: "#173A57", fontSize: "32px", fontWeight: 900, letterSpacing: "3px" }}>
              AWAKE
            </Link>
          </div>

          <div className="nav-links-desktop" style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "24px", alignItems: "center" }}>
            <div className="desktop-only" style={{ display: "flex", gap: "24px" }}>
              <a href="#wissen" style={{ color: "#173A57", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Wissenschaft</a>
              <a href="#partner" style={{ color: "#173A57", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Partner</a>
            </div>
            <button onClick={toggleCart} className="cart-button" aria-label="Warenkorb" style={{ color: "#173A57", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && <span className="cart-badge" style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#FDF277", color: "#173A57", borderRadius: "50%", minWidth: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "900", border: "2px solid #ffffff" }}>{totalItems}</span>}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-nav-menu" style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#ffffff", borderBottom: "1px solid rgba(23,58,87,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
          <div className="container" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <a href="#vorteile" onClick={handleLinkClick} style={{ color: "#173A57", fontWeight: 800, fontSize: "20px" }}>Vorteile für Retailer</a>
            <a href="#produkte" onClick={handleLinkClick} style={{ color: "#173A57", fontWeight: 800, fontSize: "20px" }}>Sortiment</a>
            <a href="#wissen" onClick={handleLinkClick} style={{ color: "#173A57", fontWeight: 800, fontSize: "20px" }}>Die Wissenschaft</a>
            <a href="#partner" onClick={handleLinkClick} style={{ color: "#173A57", fontWeight: 800, fontSize: "20px" }}>Affiliate Partnerprogramm</a>
            <a href="#faq" onClick={handleLinkClick} style={{ color: "#173A57", fontWeight: 800, fontSize: "20px" }}>Häufige Fragen</a>
          </div>
        </div>
      )}
    </div>
  );
}
