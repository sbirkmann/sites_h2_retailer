"use client";

import Link from "next/link";
import { useCart } from "../lib/CartContext";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
      {/* Main Navbar */}
      <nav className="navbar" style={{ position: "relative", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", padding: "15px 0", borderBottom: "1px solid rgba(23,58,87,0.05)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" className="nav-brand" style={{ color: "var(--bg-dark)", fontSize: "28px", fontWeight: 800, letterSpacing: "2px" }}>
            AWAKE
          </Link>
          <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
            <a href="#shop" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>Shop</a>
            <a href="#h2-guide" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>H2 Guide</a>
            <a href="#partner" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>Partnerprogramm</a>
            <a href="#faq" style={{ color: "var(--bg-dark)", fontWeight: 600 }}>FAQs</a>
          </div>
          <button onClick={toggleCart} className="cart-button" aria-label="Warenkorb" style={{ color: "var(--bg-dark)", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </nav>
    </div>
  );
}
