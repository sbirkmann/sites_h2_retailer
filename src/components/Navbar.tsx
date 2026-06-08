"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../lib/CartContext";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();
  const [isRetailerLoggedIn, setIsRetailerLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      if (typeof window === "undefined") return;
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          const rawVal = parts.pop()?.split(";").shift();
          return rawVal ? decodeURIComponent(rawVal) : undefined;
        }
        return undefined;
      };
      const email = getCookie("retailer_email");
      const code = getCookie("retailer_code");
      setIsRetailerLoggedIn(!!(email && code));
    };

    checkLogin();

    window.addEventListener("retailer_auth_change", checkLogin);
    window.addEventListener("focus", checkLogin);

    let interval: ReturnType<typeof setInterval>;
    if (pathname === "/portal") {
      interval = setInterval(checkLogin, 500);
    }

    return () => {
      window.removeEventListener("retailer_auth_change", checkLogin);
      window.removeEventListener("focus", checkLogin);
      if (interval) clearInterval(interval);
    };
  }, [pathname]);

  const showCart = pathname !== "/" && (pathname !== "/portal" || isRetailerLoggedIn);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        setIsScrolled(y > 10);

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full"
      >
        {/* Main Navbar */}
        <div
          className={`w-full transition-[background-color,box-shadow] duration-300 ease-in-out ${
            isScrolled
              ? "bg-white/95 backdrop-blur shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-border/40"
              : "bg-white border-b border-border/20"
          }`}
        >
          <div
            className={`mx-auto px-3 sm:px-4 lg:px-6 max-w-[1498px] transition-[padding] duration-300 ${
              isScrolled ? "py-1.5 md:py-2.5" : "py-3.5 md:py-4.5"
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Left Desktop Nav (hidden on mobile) */}
              <nav className="hidden lg:flex flex-1 justify-start gap-8 lg:gap-10">
                <Link
                  href="/#dashboard"
                  className="text-[#173A57] text-[15px] font-bold font-gothic relative group py-2 flex items-center gap-1 transition-colors hover:text-[#173A57]/60 lg:text-[16px] cursor-pointer"
                >
                  Was wir bieten
                  <span className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/#produkte"
                  className="text-[#173A57] text-[15px] font-bold font-gothic relative group py-2 flex items-center gap-1 transition-colors hover:text-[#173A57]/60 lg:text-[16px] cursor-pointer"
                >
                  Sortiment
                  <span className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/#marketing"
                  className="text-[#173A57] text-[15px] font-bold font-gothic relative group py-2 flex items-center gap-1 transition-colors hover:text-[#173A57]/60 lg:text-[16px] cursor-pointer"
                >
                  Marketing
                  <span className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>

              {/* Mobile Menu Toggle Button (hidden on desktop) */}
              <div className="flex-1 lg:hidden flex justify-start">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menü öffnen"
                  className="p-2 text-[#173A57] hover:text-[#173A57]/60 transition-colors cursor-pointer"
                >
                  {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>

              {/* Center Logo */}
              <div className="flex-shrink-0 flex justify-center items-center px-4 lg:px-10">
                <Link href="/" className="inline-block cursor-pointer">
                  <img
                    alt="AWAKE Logo - Wasserstoff-Wasser"
                    src="/awake-logo.png"
                    title="AWAKE Logo - Wasserstoff-Wasser"
                    className={`object-contain transition-all duration-300 ${
                      isScrolled ? "h-[28px] sm:h-[32px]" : "h-[34px] sm:h-[40px]"
                    }`}
                  />
                </Link>
              </div>

              {/* Right Desktop Nav & Cart Button */}
              <div className="flex-1 flex justify-end items-center gap-6 lg:gap-8">
                <nav className="hidden lg:flex items-center gap-8 lg:gap-10">
                  <Link
                    href="/#retailer-locator"
                    className="text-[#173A57] text-[15px] font-bold font-gothic relative group py-2 flex items-center gap-1 transition-colors hover:text-[#173A57]/60 lg:text-[16px] cursor-pointer"
                  >
                    Retailer-Locator
                    <span className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link
                    href="/#haendler-werden"
                    className="text-[#173A57] text-[15px] font-bold font-gothic relative group py-2 flex items-center gap-1 transition-colors hover:text-[#173A57]/60 lg:text-[16px] cursor-pointer"
                  >
                    Händler werden
                    <span className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link
                    href="/portal"
                    className="text-[#173A57] text-[15px] font-bold font-gothic relative group py-2 flex items-center gap-1 transition-colors hover:text-[#173A57]/60 lg:text-[16px] cursor-pointer"
                  >
                    Login
                    <span className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#173A57] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </nav>

                {/* Shopping Cart Button */}
                {showCart && (
                  <button
                    onClick={toggleCart}
                    aria-label="Warenkorb öffnen"
                    className="relative p-2 text-[#173A57] hover:text-[#173A57]/60 transition-colors cursor-pointer flex items-center"
                  >
                    <ShoppingBag size={24} strokeWidth={2} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1.5 bg-[#FDF277] text-[#173A57] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm font-gothic animate-badge-pulse">
                        {totalItems}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-white border-b border-border/80 shadow-lg transition-all duration-300">
            <div className="px-6 py-6 flex flex-col gap-5">
              <Link
                href="/#dashboard"
                onClick={handleLinkClick}
                className="text-[#173A57] text-[18px] font-bold font-gothic uppercase tracking-wide hover:text-[#173A57]/60 py-2 border-b border-border/20 cursor-pointer"
              >
                Was wir bieten
              </Link>
              <Link
                href="/#produkte"
                onClick={handleLinkClick}
                className="text-[#173A57] text-[18px] font-bold font-gothic uppercase tracking-wide hover:text-[#173A57]/60 py-2 border-b border-border/20 cursor-pointer"
              >
                Sortiment
              </Link>
              <Link
                href="/#marketing"
                onClick={handleLinkClick}
                className="text-[#173A57] text-[18px] font-bold font-gothic uppercase tracking-wide hover:text-[#173A57]/60 py-2 border-b border-border/20 cursor-pointer"
              >
                Marketing
              </Link>
              <Link
                href="/#retailer-locator"
                onClick={handleLinkClick}
                className="text-[#173A57] text-[18px] font-bold font-gothic uppercase tracking-wide hover:text-[#173A57]/60 py-2 border-b border-border/20 cursor-pointer"
              >
                Retailer-Locator
              </Link>
              <Link
                href="/#haendler-werden"
                onClick={handleLinkClick}
                className="text-[#173A57] text-[18px] font-bold font-gothic uppercase tracking-wide hover:text-[#173A57]/60 py-2 border-b border-border/20 cursor-pointer"
              >
                Händler werden
              </Link>
              <Link
                href="/portal"
                onClick={handleLinkClick}
                className="text-[#173A57] text-[18px] font-bold font-gothic uppercase tracking-wide hover:text-[#173A57]/60 py-2 cursor-pointer"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>
      {/* Spacer for fixed Header */}
      <div className="h-[56px] sm:h-[64px] md:h-[70px]" />
    </>
  );
}
