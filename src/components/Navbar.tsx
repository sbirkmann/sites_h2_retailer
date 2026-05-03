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
      {/* Main Navbar */}
      <nav className="navbar" style={{ position: "relative", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", padding: "15px 0", borderBottom: "1px solid rgba(23,58,87,0.05)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menü" style={{ background: "none", border: "none", color: "var(--bg-dark)", cursor: "pointer", padding: "4px" }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
            <Link href="/" className="nav-brand" style={{ color: "var(--bg-dark)", fontSize: "28px", fontWeight: 800, letterSpacing: "2px" }}>
              AWAKE
            </Link>
          </div>
          
          <div className="nav-links-desktop" style={{ display: "flex", gap: "32px" }}>
            <a href="#shop" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>Shop</a>
            <a href="#h2-guide" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>H2 Guide</a>
            <a href="#partner" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>Partnerprogramm</a>
            <a href="#faq" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>FAQs</a>
          </div>

          <button onClick={toggleCart} className="cart-button" aria-label="Warenkorb" style={{ color: "var(--bg-dark)", display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && <span className="cart-badge" style={{ backgroundColor: "var(--accent-yellow)", color: "var(--bg-dark)", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", fontWeight: "bold", marginLeft: "4px" }}>{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-nav-menu" style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#fff", borderBottom: "1px solid rgba(23,58,87,0.05)", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
          <div className="container" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <a href="#shop" onClick={handleLinkClick} style={{ color: "var(--bg-dark)", fontWeight: 600, fontSize: "18px" }}>Shop</a>
            <a href="#h2-guide" onClick={handleLinkClick} style={{ color: "var(--bg-dark)", fontWeight: 600, fontSize: "18px" }}>H2 Guide</a>
            <a href="#partner" onClick={handleLinkClick} style={{ color: "var(--bg-dark)", fontWeight: 600, fontSize: "18px" }}>Partnerprogramm</a>
            <a href="#faq" onClick={handleLinkClick} style={{ color: "var(--bg-dark)", fontWeight: 600, fontSize: "18px" }}>FAQs</a>
          </div>
        </div>
      )}
    </div>
  );
}
