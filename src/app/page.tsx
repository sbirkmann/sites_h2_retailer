"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Check, Stethoscope, Award, Shield, Truck, Sparkles, Flame, Plus, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import ContactWidget from "../components/ContactWidget";
import OfferModal from "../components/OfferModal";
import CalendlyModal from "../components/CalendlyModal";
import Footer from "../components/Footer";
import { CartProvider, useCart } from "../lib/CartContext";
import { STATIC_PRODUCTS, type DisplayProduct } from "../lib/products";
import { fetchProducts, type ApiProduct } from "../lib/api";
import { TextReveal, FadeUp, BlurIn, GlowButton, FloatingElement } from "../components/home/animations";

// ==========================================================================
// HERO SECTION COMPONENT HELPERS (PORTED FROM B2C HERO SECTION)
// ==========================================================================

interface CssBubble {
  id: number;
  x: string;
  startY: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  wobbleAmp: number;
  highlightAngle: number;
  riseDistance: number;
  peakOpacity: number;
  gradient: string;
  border: string;
}

function generateBubbles(count: number): CssBubble[] {
  const bubbles: CssBubble[] = [];
  for (let i = 0; i < count; i++) {
    const size = i < 4 ? 36 + Math.random() * 28 : i < 12 ? 14 + Math.random() * 22 : 4 + Math.random() * 14;
    const isLarge = size > 30;
    const isMedium = size > 14;
    const ha = 20 + Math.random() * 25;
    const baseOpacity = isLarge ? 0.18 : isMedium ? 0.25 : 0.35;

    const gradient = isLarge
      ? `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 20%, rgba(23,58,87,${baseOpacity}) 50%, rgba(23,58,87,${baseOpacity * 0.6}) 75%, rgba(23,58,87,${baseOpacity * 0.3}) 100%)`
      : isMedium
      ? `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.45) 0%, rgba(23,58,87,${baseOpacity}) 45%, rgba(23,58,87,${baseOpacity * 0.5}) 80%, transparent 100%)`
      : `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.6) 0%, rgba(23,58,87,${baseOpacity}) 60%, transparent 100%)`;

    const border = isLarge ? "1px solid rgba(255,255,255,0.2)" : `1px solid rgba(23,58,87,${isMedium ? 0.18 : 0.12})`;

    bubbles.push({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      startY: `${75 + Math.random() * 20}%`,
      size,
      duration: size > 30 ? 10 + Math.random() * 6 : 6 + Math.random() * 5,
      delay: Math.random() * 10,
      driftX: (Math.random() - 0.5) * 50,
      wobbleAmp: 8 + Math.random() * 20,
      highlightAngle: ha,
      riseDistance: -(650 + size * 5),
      peakOpacity: baseOpacity * 4,
      gradient,
      border,
    });
  }
  return bubbles;
}

interface CssParticle {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  riseY: number;
  color: string;
  glow: string;
}

function generateParticles(count: number): CssParticle[] {
  const particles: CssParticle[] = [];
  const colors = [
    { bg: "rgba(23,58,87,0.8)", glow: "0 0 10px 3px rgba(23,58,87,0.5)" },
    { bg: "rgba(23,58,87,0.8)", glow: "0 0 10px 3px rgba(23,58,87,0.5)" },
    { bg: "rgba(23,58,87,0.9)", glow: "0 0 8px 3px rgba(23,58,87,0.4)" },
    { bg: "rgba(23,58,87,0.7)", glow: "0 0 8px 2px rgba(23,58,87,0.4)" },
  ];

  for (let i = 0; i < count; i++) {
    const c = colors[i % colors.length];
    particles.push({
      id: i,
      x: `${40 + Math.random() * 40}%`,
      y: `${45 + Math.random() * 45}%`,
      size: 2 + Math.random() * 4,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 6,
      driftX: (Math.random() - 0.5) * 50,
      riseY: -(180 + Math.random() * 300),
      color: c.bg,
      glow: c.glow,
    });
  }
  return particles;
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute w-[800px] h-[800px] md:w-[1100px] md:h-[1100px] rounded-full will-change-transform"
        style={{
          top: "-25%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(23,58,87,0.18) 0%, rgba(23,58,87,0.08) 40%, transparent 75%)",
          animation: "bg-drift-1 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full will-change-transform"
        style={{
          bottom: "-20%",
          left: "-15%",
          background: "radial-gradient(circle, rgba(23,58,87,0.15) 0%, rgba(23,58,87,0.06) 45%, transparent 75%)",
          animation: "bg-drift-2 30s ease-in-out infinite 5s",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] md:w-[750px] md:h-[750px] rounded-full will-change-transform"
        style={{
          top: "15%",
          left: "20%",
          background: "radial-gradient(circle, rgba(253,242,119,0.08) 0%, rgba(23,58,87,0.04) 45%, transparent 70%)",
          animation: "bg-drift-3 28s ease-in-out infinite 10s",
        }}
      />
    </div>
  );
}

function AuroraWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <div
        className="absolute w-[220%] h-[50%] md:h-[60%] will-change-transform"
        style={{
          top: "8%",
          left: "-60%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(23,58,87,0.06) 30%, rgba(23,58,87,0.1) 50%, rgba(23,58,87,0.05) 70%, transparent 100%)",
          borderRadius: "50%",
          animation: "aurora-sway-1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[200%] h-[45%] md:h-[55%] will-change-transform"
        style={{
          bottom: "5%",
          left: "-40%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(23,58,87,0.04) 30%, rgba(23,58,87,0.07) 50%, rgba(23,58,87,0.04) 70%, transparent 100%)",
          borderRadius: "50%",
          animation: "aurora-sway-2 24s ease-in-out infinite 6s",
        }}
      />
    </div>
  );
}

function HydrogenBubbles({ bubbles }: { bubbles: CssBubble[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full will-change-transform"
          style={
            {
              left: b.x,
              top: b.startY,
              width: b.size,
              height: b.size,
              background: b.gradient,
              border: b.border,
              "--b-rise": `${b.riseDistance}px`,
              "--b-wobble": `${b.wobbleAmp}px`,
              "--b-drift": `${b.driftX}px`,
              "--b-peak-opacity": `${b.peakOpacity}`,
              animation: `bubble-rise ${b.duration}s ease-in-out ${b.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ProductHalo() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3]">
      <div
        className="w-[340px] h-[340px] md:w-[500px] md:h-[500px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(23,58,87,0.2) 0%, rgba(23,58,87,0.1) 35%, rgba(23,58,87,0.04) 60%, transparent 80%)",
          animation: "halo-pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-[-30%] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(253,242,119,0.05) 0%, rgba(23,58,87,0.03) 45%, transparent 70%)",
          animation: "halo-outer 8s ease-in-out infinite 2s",
        }}
      />
    </div>
  );
}

function EnergyParticles({ particles }: { particles: CssParticle[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full will-change-transform"
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: p.glow,
              "--p-rise": `${p.riseY}px`,
              "--p-drift": `${p.driftX}px`,
              animation: `particle-rise ${p.duration}s ease-out ${p.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function WaterRipples() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2] hidden md:block">
      {[0, 2, 4].map((delay, i) => (
        <div
          key={i}
          className="absolute top-1/2 right-[20%] w-[480px] h-[480px] rounded-full border border-awake-blue/[0.08] will-change-transform"
          style={{
            animation: `hero-ripple 5.5s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ==========================================================================
// MAIN PAGE COMPONENT
// ==========================================================================

function PageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [refCode, setRefCode] = useState("");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const { addItem } = useCart();

  const particles = useMemo(() => generateParticles(8), []);
  const bubbles = useMemo(() => generateBubbles(15), []);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref");
    if (refParam) {
      localStorage.setItem("refCode", refParam);
      setRefCode(refParam);
    } else {
      const storedRef = localStorage.getItem("refCode");
      if (storedRef) setRefCode(storedRef);
    }

    fetchProducts("DE").then(setApiProducts).catch(() => {});

    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % 2);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const products = useMemo(() => {
    if (apiProducts.length === 0) return STATIC_PRODUCTS;
    return STATIC_PRODUCTS.map((sp) => {
      const apiMatch = apiProducts.find((ap) => ap.id === sp.id && ap.type === sp.type);
      if (!apiMatch) return sp;
      return {
        ...sp,
        retailer_price: apiMatch.retailer_price,
        deposit: apiMatch.deposit,
        shipping_cost: apiMatch.shipping_cost,
      };
    });
  }, [apiProducts]);

  const fmt = (n: number) => "€" + n.toFixed(2).replace(".", ",");

  const faqs = [
    {
      q: "Wie hoch ist die Mindestbestellmenge (MOQ)?",
      a: "Für die AWAKE Dose beginnt die Mindestbestellmenge bei nur einem Händler-Tray (30 Dosen), für die Flasche bei einer Gastro-Kiste (24 Flaschen).",
    },
    {
      q: "Wie lange sind die Produkte haltbar?",
      a: "Ungeöffnet sind die Dosen und Flaschen ab dem Produktionsdatum mindestens 18 Monate haltbar.",
    },
    {
      q: "Wie schnell erfolgt die Lieferung?",
      a: "Bestellungen bis 14:00 Uhr werden am selben Werktag versandt. Zustellung innerhalb von 1-3 Werktagen. Ab 2 Paletten entfallen die Versandkosten.",
    },
    {
      q: "Gibt es Werbematerial (POS)?",
      a: "Bei Erstbestellung über das Premium Starter-Kit erhalten Sie einen Acryl-Aufsteller, Flyer und Sticker kostenfrei dazu.",
    },
    {
      q: "Wie funktioniert das Pfandsystem?",
      a: "Alle Gebinde unterliegen dem deutschen DPG-Pfandsystem. Der Pfandbetrag wird im Checkout separat ausgewiesen.",
    },
  ];

  return (
    <>
      <OfferModal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} />
      <CalendlyModal isOpen={isCalendlyModalOpen} onClose={() => setIsCalendlyModalOpen(false)} />
      
      <main
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease",
          backgroundColor: "#ffffff",
          color: "#173A57",
          overflowX: "clip",
        }}
        className="font-sans antialiased"
      >
        <Navbar />
        <CartDrawer />
        <ContactWidget />

        {/* ==========================================================================
            1. HERO SECTION (B2C STYLE SHELL WITH B2B CONTENT)
            ========================================================================== */}
        <section className="relative overflow-hidden bg-[#F0F4F8] film-grain vignette pt-12 pb-20 md:pt-20 md:pb-28">
          <AnimatedBackground />
          <AuroraWaves />
          <HydrogenBubbles bubbles={bubbles} />
          <WaterRipples />

          <div className="relative mx-auto max-w-[1350px] px-4 lg:px-8 z-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">
              
              {/* Left Column: B2B Info */}
              <div className="relative z-20 w-full text-center md:text-left">
                <BlurIn delay={50}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#173A57]/20 bg-[#173A57]/95 backdrop-blur-sm px-4 py-1.5 font-gothic text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-sm sm:text-[12px]">
                    <span
                      className="animate-gradient-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #ffffff 0%, #ffffff 25%, #FDF277 50%, #ffffff 75%, #ffffff 100%)",
                      }}
                    >
                      AWAKE Retailer Portal
                    </span>
                  </span>
                </BlurIn>

                <TextReveal delay={150}>
                  <h1 className="mt-5 font-gothic font-bold uppercase leading-[0.95] tracking-tight text-[#173A57] text-[40px] sm:text-[54px] lg:text-[62px]">
                    AWAKE - Das innovativste Getränk für dein Sortiment
                  </h1>
                </TextReveal>

                <FadeUp delay={250}>
                  <p className="mx-auto max-w-xl font-gothic text-[#173A57]/85 sm:text-[16px] md:mx-0 lg:text-[17px] text-base leading-relaxed font-normal mt-5">
                    Werde exklusiver AWAKE Retailer. Erweitere dein Angebot um hochdosiertes Wasserstoffwasser, erziele hohe Margen vor Ort und profitiere langfristig von unserem Affiliate-Modell.
                  </p>
                </FadeUp>

                <FadeUp delay={350}>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:justify-start">
                    <GlowButton className="rounded-full">
                      <a
                        href="#produkte"
                        className="inline-flex cursor-pointer items-center rounded-full bg-[#FDF277] px-7 py-3.5 text-center font-gothic text-[14px] font-bold uppercase tracking-wide text-[#173A57] sm:px-9 sm:py-4 sm:text-[15px]"
                      >
                        B2B Sortiment ansehen
                      </a>
                    </GlowButton>
                  </div>
                </FadeUp>

                <FadeUp delay={550}>
                  <div className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold text-[#173A57]/80 sm:text-[13px]">
                    <Stethoscope className="h-4 w-4 text-[#173A57]" strokeWidth={2.2} />
                    Empfohlen von Ärzten & Sportlern
                  </div>
                </FadeUp>

                <BlurIn delay={600}>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-[#173A57] sm:text-[13px] md:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FDF277] text-[#FDF277]" />
                        ))}
                      </div>
                      <span className="font-bold">4,8 / 5</span>
                    </div>
                    <span className="hidden h-3 w-px bg-[#173A57]/25 sm:inline-block" aria-hidden />
                    <span className="text-[#173A57]/75">437 verifizierte Bewertungen</span>
                    <span className="hidden h-3 w-px bg-[#173A57]/25 sm:inline-block" aria-hidden />
                    <span className="text-[#173A57]/75">300.000+ AWAKE getrunken</span>
                  </div>
                </BlurIn>
              </div>

              {/* Right Column: Visual Product Elements with Badges */}
              <div className="relative mx-auto w-full max-w-[400px] flex h-[350px] items-end justify-center md:h-[500px] md:max-w-none lg:h-[560px]">
                <ProductHalo />
                <EnergyParticles particles={particles} />

                {/* Animated Can & Bottle Images */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-[320px] md:h-[460px] flex items-center justify-center">
                    <img
                      src="/images/product-dose.webp"
                      alt="AWAKE Dose"
                      className="hero-can absolute object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-1000"
                      style={{
                        height: "85%",
                        opacity: heroImageIndex === 0 ? 1 : 0,
                        transform: heroImageIndex === 0 ? "scale(1)" : "scale(0.95)",
                      }}
                    />
                    <img
                      src="/images/product-flasche.webp"
                      alt="AWAKE Flasche"
                      className="hero-bottle absolute object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-1000"
                      style={{
                        height: "85%",
                        opacity: heroImageIndex === 1 ? 1 : 0,
                        transform: heroImageIndex === 1 ? "scale(1)" : "scale(0.95)",
                      }}
                    />
                  </div>
                </div>

                {/* Quality Seal Badge */}
                <div className="absolute top-[10%] left-[-5%] sm:left-[5%] bg-white w-[110px] h-[110px] rounded-full z-10 flex flex-col items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.12)] border-[3px] border-white p-2">
                  <div className="w-full h-full rounded-full border border-[#173A57] flex flex-col items-center justify-center">
                    <span className="text-[7px] text-[#173A57] font-bold tracking-wide">QUALITÄTSSIEGEL</span>
                    <span className="text-[19px] text-[#173A57] font-black leading-none">11 ppm</span>
                    <span className="text-[14px] text-[#173A57] font-extrabold">H₂</span>
                  </div>
                </div>

                {/* BPA Free Badge */}
                <div className="absolute bottom-[10%] right-[-5%] sm:right-[5%] bg-[#78B833] w-[100px] h-[100px] rounded-full z-10 flex flex-col items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.12)] border-[3px] border-white text-white p-1">
                  <span className="text-[18px] font-black leading-none">BPA</span>
                  <span className="text-[15px] font-extrabold leading-none">FREE</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v8c0 7 4 8 7 8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 2v8c0 7 4 8 7 8z" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. STATS SECTION (B2C TYPOGRAPHY STYLE)
            ========================================================================== */}
        <section className="bg-white py-12 md:py-16 border-b border-border/40">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                ["3.000+", "Zufriedene Kunden"],
                ["11 ppm", "Maximaler H₂-Gehalt"],
                ["18 Monate", "Stabile Haltbarkeit"],
                ["200%", "Mögliche Handelsmarge"],
              ].map(([val, label], idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-[36px] sm:text-[44px] font-black text-[#173A57] tracking-tight leading-none mb-2">
                    {val}
                  </div>
                  <div className="text-[#173A57]/65 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.15em]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            3. Vorteils-Modell Section (B2C CARD SHADOW & STYLE)
            ========================================================================== */}
        <section id="vorteile" className="py-20 md:py-28 bg-[#F8FAFC]">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#173A57]/60 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] block mb-3">
                Das AWAKE Hybrid-Modell
              </span>
              <h2 className="text-[#173A57] text-[34px] sm:text-[44px] font-extrabold tracking-tight max-w-2xl mx-auto uppercase">
                Zwei Einkommensströme. Maximaler Umsatz.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  ),
                  title: "B2B-Direktverkauf vor Ort",
                  desc: "Verkaufe AWAKE exklusiv an deiner Theke oder Kasse. Durch unsere Händler-B2B-Konditionen erzielst du attraktive Margen bei jedem Impulskauf.",
                },
                {
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4M12 8v8" />
                    </>
                  ),
                  title: "Affiliate-Verkauf Online",
                  desc: "Deine Kunden wollen AWAKE auch zu Hause trinken? Empfehle es über deinen persönlichen QR-Code und sichere dir 20% Lifetime-Provision auf alle Online-Abos.",
                },
                {
                  icon: <polyline strokeLinecap="round" strokeLinejoin="round" points="22 12 18 12 15 21 9 3 6 12 2 12" />,
                  title: "Win-Win für dein Business",
                  desc: "AWAKE ist das erste stabile H2-Getränk in Deutschland. Biete deinen Kunden eine echte Innovation und maximiere ohne Risiko deine Umsätze.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-border/60 rounded-2xl p-8 sm:p-10 shadow-[0_4px_25px_rgba(23,58,87,0.03)] hover:shadow-[0_12px_30px_rgba(23,58,87,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#173A57] flex items-center justify-center text-[#FDF277] mb-8">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="text-[#173A57] text-[20px] sm:text-[22px] font-extrabold mb-4 font-gothic">
                    {item.title}
                  </h3>
                  <p className="text-[#173A57]/75 font-gothic leading-relaxed text-[15px] sm:text-[16px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4. Pillars Section (B2C PILLARS GRID WITH GOLD NUMBERS)
            ========================================================================== */}
        <section className="bg-[#173A57] text-white py-20 md:py-28">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#FDF277] text-[13px] font-bold uppercase tracking-[0.2em] block mb-3">
                Wettbewerbsvorteil
              </span>
              <h2 className="text-[34px] sm:text-[44px] font-extrabold tracking-tight max-w-xl mx-auto uppercase">
                Was AWAKE ausmacht
              </h2>
              <p className="text-white/70 font-gothic text-[16px] sm:text-[18px] max-w-xl mx-auto mt-4 leading-relaxed">
                8 zentrale Säulen, die Qualität, Innovation und Alltag miteinander verbinden – und deine Kunden im Regal überzeugen werden.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "~ 11 ppm Wasserstoff",
                  desc: "Molekularer Wasserstoff ist das Kernelement von AWAKE. Mit bis zu 11 ppm bieten wir eine wissenschaftlich fundierte Dosierung.",
                },
                {
                  title: "Sofort trinkfertig",
                  desc: "Kein Mischen, kein Warten. Einfach öffnen und trinken – genau das, was Kunden im Alltag und beim Sport suchen.",
                },
                {
                  title: "Qualität & Kontrolle",
                  desc: "Jede Charge wird streng laborgeprüft – für garantierte Reinheit und eine sichere, hochwertige Anwendung.",
                },
                {
                  title: "Tägliches Ritual",
                  desc: "AWAKE lässt sich nahtlos in den Alltag integrieren – was für dich als Retailer eine extrem hohe Wiederkaufsrate bedeutet.",
                },
                {
                  title: "Hergestellt in Deutschland",
                  desc: "Höchste Standards. AWAKE wird unter strengsten Qualitätsrichtlinien lokal in Deutschland gefertigt.",
                },
                {
                  title: "Premium-Design",
                  desc: "Das cleane und moderne Design der Dose sticht im Regal hervor und generiert automatisch lukrative Impulskäufe.",
                },
                {
                  title: "Nachhaltigkeit",
                  desc: "Unsere Aluminiumdosen sind zu 100% recycelbar. Wir setzen auf kurze Lieferketten und umweltfreundliche Logistik.",
                },
                {
                  title: "Zusätzliche Provision",
                  desc: "Durch unser Hybrid-Modell profitierst du nicht nur vor Ort, sondern verdienst auch an Online-Folgekäufen deiner Kunden.",
                },
              ].map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
                >
                  <div className="text-[36px] font-black text-[#FDF277] opacity-80 leading-none mb-5 font-gothic">
                    0{idx + 1}
                  </div>
                  <h3 className="text-[18px] sm:text-[20px] font-extrabold mb-3 font-gothic">
                    {pillar.title}
                  </h3>
                  <p className="text-white/70 font-gothic text-[14px] leading-relaxed flex-grow">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            5. PRODUCTS SECTION (B2C PRODUCT CARD DESIGN)
            ========================================================================== */}
        <section id="produkte" className="py-20 md:py-28 bg-white">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#173A57]/60 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] block mb-3">
                Bestellung
              </span>
              <h2 className="text-[#173A57] text-[34px] sm:text-[44px] font-extrabold tracking-tight uppercase">
                B2B Sortiment & Gebinde
              </h2>
              <p className="text-[#173A57]/70 font-gothic text-[16px] sm:text-[18px] max-w-xl mx-auto mt-4 leading-relaxed">
                Wähle die passenden Gebindegrößen für dein Geschäft. Alle Preise verstehen sich als Nettopreise exkl. Pfand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {products.map((p, idx) => {
                // Image mapping for nicer high-res product renders
                let displayImg = p.image;
                if (p.slug === "dose-tray") displayImg = "/images/product-dose.webp";
                if (p.slug === "starter-kit") displayImg = "/images/product-dose.webp";
                if (p.slug === "palette-dose") displayImg = "/images/product-dose.webp";
                if (p.slug === "flasche-kiste") displayImg = "/images/product-flasche.webp";
                if (p.slug === "palette-flasche") displayImg = "/images/product-flasche.webp";
                
                return (
                  <div
                    key={p.slug}
                    className={`relative bg-[#F8FAFC] border rounded-2xl p-8 sm:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${
                      p.isBestseller
                        ? "border-[#FDF277] shadow-[0_4px_30px_rgba(253,242,119,0.15)]"
                        : "border-border/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                    }`}
                  >
                    {/* Bestseller Badge */}
                    {p.isBestseller && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDF277] text-[#173A57] text-[11px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full shadow-md z-10 whitespace-nowrap">
                        {p.badge}
                      </div>
                    )}
                    {/* Standard Badge */}
                    {p.badge && !p.isBestseller && (
                      <div className="absolute top-4 left-4 bg-[#173A57] text-white text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full z-10">
                        {p.badge}
                      </div>
                    )}

                    {/* Image Wrapper */}
                    <div className="relative h-[200px] w-full flex items-center justify-center mb-8 z-0">
                      <div className="absolute w-[180px] h-[180px] bg-gradient-to-tr from-[#173A57]/5 to-[#173A57]/0 rounded-full blur-xl pointer-events-none" />
                      <img
                        src={displayImg}
                        alt={p.name}
                        className="max-h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-[#173A57] text-[20px] sm:text-[22px] font-extrabold mb-3 font-gothic">
                      {p.name}
                    </h3>
                    <p className="text-[#173A57]/70 font-gothic text-[14px] leading-relaxed mb-6 flex-grow">
                      {p.description}
                    </p>

                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="text-[10px] text-[#173A57]/50 font-bold uppercase tracking-wider mb-1">
                          {p.subtitle}
                        </div>
                        <div className="text-[26px] sm:text-[30px] font-black text-[#173A57] leading-none">
                          {fmt(p.retailer_price)}
                          <span className="text-[12px] font-bold text-[#173A57]/60 ml-1">netto</span>
                        </div>
                      </div>

                      {/* Add to Cart Icon Button */}
                      <button
                        onClick={() => addItem(p)}
                        className="w-12 h-12 rounded-full bg-[#FDF277] text-[#173A57] hover:bg-[#FDF277]/80 hover:scale-110 flex items-center justify-center transition-all shadow-[0_4px_10px_rgba(253,242,119,0.4)] cursor-pointer"
                        title="In den Warenkorb"
                      >
                        <Plus size={22} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom / Bulk Inquiries Banner */}
            <div className="bg-[#F8FAFC] border border-border/60 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-sm">
              <h3 className="text-[#173A57] text-[22px] sm:text-[26px] font-extrabold mb-4 font-gothic uppercase">
                Individueller Bedarf?
              </h3>
              <p className="text-[#173A57]/70 font-gothic text-[15px] sm:text-[16px] max-w-2xl mx-auto leading-relaxed mb-8">
                Du hast eine größere Kette, mehrere Standorte oder benötigst ein spezielles Angebot? Kontaktiere uns direkt für maßgeschneiderte B2B-Konditionen oder buche ein Gespräch mit unserem Team.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="bg-[#173A57] text-white hover:bg-[#173A57]/90 px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-[13px] transition-all shadow-md cursor-pointer"
                >
                  Individuelles Angebot
                </button>
                <button
                  onClick={() => setIsCalendlyModalOpen(true)}
                  className="bg-transparent border-2 border-[#173A57] text-[#173A57] hover:bg-[#173A57] hover:text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-[13px] transition-all cursor-pointer"
                >
                  Beratungstermin buchen
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            6. SCIENCE SECTION (B2C GRID LAYOUT & COLORING)
            ========================================================================== */}
        <section id="wissen" className="py-20 md:py-28 bg-[#F8FAFC]">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#173A57]/60 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] block mb-3">
                Die Wissenschaft
              </span>
              <h2 className="text-[#173A57] text-[34px] sm:text-[44px] font-extrabold tracking-tight max-w-2xl mx-auto uppercase">
                Ein kleines Molekül mit großer Wirkung
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Antioxidativer Effekt",
                  desc: "Wie Wasserstoff die Zellen deiner Kunden schützt und den oxidativen Stress messbar reduziert.",
                },
                {
                  title: "Anti-inflammatorisch",
                  desc: "H₂ wirkt entzündungshemmend und unterstützt die schnelle Regeneration nach dem Sport.",
                },
                {
                  title: "Zellstoffwechsel",
                  desc: "Fördert die mitochondriale Funktion und sorgt so für eine effizientere Energiebereitstellung.",
                },
                {
                  title: "Epigenetischer Schutz",
                  desc: "Zelleigene Schutzmechanismen werden für eine langfristige Leistungsbereitschaft hochreguliert.",
                },
                {
                  title: "Laktatabbau",
                  desc: "Beschleunigt den Abbau von Milchsäure und verringert so die muskuläre Ermüdung während intensiver Belastungen.",
                },
                {
                  title: "Zelluläre Hydration",
                  desc: "Dank der molekularen Größe dringt H₂ tief in die Zellen ein und optimiert den zellulären Feuchtigkeitshaushalt.",
                },
              ].map((info, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-border/60 rounded-2xl p-8 shadow-[0_4px_25px_rgba(23,58,87,0.02)] hover:shadow-[0_10px_30px_rgba(23,58,87,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-full bg-[#173A57]/5 text-[#173A57] flex items-center justify-center mb-6">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-[#173A57] text-[18px] sm:text-[20px] font-extrabold mb-3 font-gothic">
                    {info.title}
                  </h3>
                  <p className="text-[#173A57]/70 font-gothic leading-relaxed text-[14px] sm:text-[15px] flex-grow">
                    {info.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            7. REVIEWS SECTION (B2C MASONRY LAYOUT)
            ========================================================================== */}
        <section className="py-20 md:py-28 bg-white border-b border-border/20">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block bg-[#173A57] text-white text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-4">
                Erfahrungsberichte
              </span>
              <h2 className="text-[#173A57] text-[34px] sm:text-[44px] font-extrabold tracking-tight uppercase">
                Das sagen unsere Kunden
              </h2>
              <p className="text-[#173A57]/60 font-gothic text-[16px] sm:text-[18px] max-w-xl mx-auto mt-3 leading-relaxed">
                Über 3.000+ zufriedene Kunden vertrauen bereits auf die Kraft von AWAKE.
              </p>
            </div>

            <div className="reviews-grid">
              {[
                {
                  label: "GAME CHANGER",
                  text: "Ich war zunächst skeptisch, aber ich bin unendlich froh, dass ich AWAKE bestellt habe. Seit ich AWAKE trinke, hat sich mein allgemeines Wohlbefinden deutlich verbessert.",
                  author: "Sarah M.",
                  initials: "SM",
                  color: "#22C55E",
                },
                {
                  label: "DOCTOR APPROVED",
                  text: "Als Arzt bin ich von der wissenschaftlichen Basis überzeugt. 11+ PPM molekularer Wasserstoff ist beeindruckend. Ich habe AWAKE meinen Patienten empfohlen und die Rückmeldungen sind durchweg positiv. Die antioxidative Wirkung ist spürbar und der Geschmack stimmt auch.",
                  author: "Dr. Martin B.",
                  initials: "MB",
                  color: "#10B981",
                },
                {
                  label: "ENERGY & FOCUS",
                  text: "Das einzige Getränk, das mich spürbar besser fühlen lässt - und das täglich. Ich habe vor etwa zwei Monaten angefangen und definitiv einen Anstieg an Energie und Fokus bemerkt. Es schmeckt auch großartig. Ich habe es bereits mehreren Freunden empfohlen und kann es kaum erwarten, die Glasflasche als nächstes zu probieren!",
                  author: "Thomas K.",
                  initials: "TK",
                  color: "#059669",
                },
                {
                  label: "IMMEDIATE RESULTS",
                  text: "Seit 10 Monaten dabei – das erste Getränk, das tatsächlich wirkt und bei dem man sofortige Ergebnisse sieht. Mein Energielevel ist konstant hoch und der Nachmittags-Crash ist komplett verschwunden.",
                  author: "Anna S.",
                  initials: "AS",
                  color: "#34D399",
                },
                {
                  label: "WHOLE FAMILY",
                  text: "Ich wollte schon lange das ultimative Erlebnis durch Nahrungsergänzung erleben. Ich war frustriert, weil ich mehrere Produkte benutzte und oft vergaß, sie einzunehmen. Mein Blähbauch hat sich deutlich verringert. Ich bemerke auch den Unterschied bei meiner Haut. Ich habe meinem Vater ebenfalls ein Abo geholt und er möchte unbedingt weitermachen.",
                  author: "Lisa W.",
                  initials: "LW",
                  color: "#10B981",
                },
                {
                  label: "REGENERATION",
                  text: "Mein Trainingspensum hat sich verbessert. Nicht auf eine unnatürliche Art, sondern eine nachhaltige Steigerung der Leistungsfähigkeit. Die Regeneration nach dem Sport ist deutlich besser geworden.",
                  author: "Michael R.",
                  initials: "MR",
                  color: "#059669",
                },
                {
                  label: "TRAVEL FRIENDLY",
                  text: "Schmeckt gut und lässt sich einfach pur oder im Smoothie trinken. Auch super einfach für unterwegs, da die Dosen überall hinpassen.",
                  author: "Henrik P.",
                  initials: "HP",
                  color: "#34D399",
                },
                {
                  label: "PREMIUM QUALITY",
                  text: "Ich trinke AWAKE jetzt seit 60 Tagen und bin wirklich zufrieden mit den Ergebnissen. Der Geschmack ist großartig, die Qualität fühlt sich premium an und die Balance ist perfekt für den täglichen Gebrauch. Was wirklich hervorsticht, ist der Kundenservice.",
                  author: "Julia F.",
                  initials: "JF",
                  color: "#10B981",
                },
                {
                  label: "CLEAR MIND",
                  text: "Der Fokus beim Arbeiten am Laptop ist spürbar klarer. Ich ersetze mittlerweile meinen Nachmittagskaffee komplett durch eine Dose AWAKE. Kein Zittern, einfach nur klare Energie.",
                  author: "Markus T.",
                  initials: "MT",
                  color: "#059669",
                },
                {
                  label: "GYM FAVORITE",
                  text: "Meine Kunden im Studio greifen immer öfter zu AWAKE. Die Dose sieht nicht nur extrem hochwertig aus, sondern das Produkt hält, was es verspricht. Eine absolute Bereicherung für unser Sortiment.",
                  author: "Elena V.",
                  initials: "EV",
                  color: "#22C55E",
                },
              ].map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 mb-6 break-inside-avoid shadow-[0_4px_20px_rgba(23,58,87,0.02)] flex flex-col"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-5.5 h-5.5 bg-[#10B981] rounded flex items-center justify-center"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  <div className="inline-block border border-[#173A57]/20 text-[#173A57] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-5">
                    {review.label}
                  </div>

                  <p className="text-[#173A57] font-gothic text-[14px] leading-relaxed mb-6 italic opacity-85">
                    "{review.text}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                      style={{ backgroundColor: review.color }}
                    >
                      {review.initials}
                    </div>
                    <div className="text-[#173A57] font-bold text-[14px] font-gothic">{review.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            8. AFFILIATE SECTION (B2C STYLED CONTAINER WITH BADGES)
            ========================================================================== */}
        <section id="partner" className="py-20 md:py-28 bg-[#173A57] text-white">
          <div className="max-w-[1350px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
              
              <div>
                <span className="text-[#FDF277] text-[13px] font-bold uppercase tracking-[0.2em] block mb-3">
                  Skalierung ohne Risiko
                </span>
                <h2 className="text-[34px] sm:text-[44px] font-extrabold tracking-tight mb-5 font-gothic uppercase">
                  Das Affiliate-Modell
                </h2>
                <p className="text-white/80 font-gothic text-[16px] sm:text-[18px] leading-relaxed mb-8 max-w-xl">
                  Nutze deine Reichweite. Empfehle AWAKE an deine Händler-Kunden und verdiene an jeder ihrer Online-Bestellungen passiv mit. Dauerhaft.
                </p>

                <ul className="space-y-4 font-gothic text-[15px] sm:text-[16px]">
                  {[
                    "Individueller Affiliate-Link & QR-Codes für dein Geschäft",
                    "20% Lifetime-Vergütung (inklusive aller Folgekäufe)",
                    "Keine Lagerhaltung, kein Versand – wir übernehmen das Fulfillment",
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#FDF277]" strokeWidth={3} />
                      </div>
                      <span className="text-white/90 leading-normal">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <a
                    href={`https://partners.h2-awake.de/create-account${refCode ? "?ref=" + refCode : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#FDF277] text-[#173A57] hover:scale-105 transition-all px-8 py-4 rounded-full font-black uppercase tracking-wider text-[13px] shadow-[0_10px_25px_rgba(253,242,119,0.2)] cursor-pointer"
                  >
                    Partnerprogramm Anmelden
                  </a>
                </div>
              </div>

              {/* Big Lifetime Marge Circle Badge */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full bg-[#1C4B72] border-2 border-[#FDF277]/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center will-change-transform animate-float">
                  <div className="text-[80px] md:text-[96px] font-black text-[#FDF277] leading-none font-gothic">
                    20<span className="text-[50px] md:text-[60px] font-extrabold">%</span>
                  </div>
                  <div className="text-white font-bold text-[14px] md:text-[16px] tracking-[0.15em] mt-2 uppercase font-gothic">
                    Lifetime Marge
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================================
            9. FAQ SECTION (B2C ACCORDION ACCENTED STYLING)
            ========================================================================== */}
        <section id="faq" className="py-20 md:py-28 bg-white">
          <div className="max-w-[800px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-[#173A57] text-[34px] sm:text-[44px] font-extrabold tracking-tight uppercase">
                Häufige Fragen (B2B)
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] border border-border/60 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-6 text-left font-gothic text-[16px] sm:text-[18px] font-bold text-[#173A57] cursor-pointer hover:bg-[#F0F4F8] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        openFaq === idx ? "bg-[#173A57] text-white" : "bg-[#173A57]/5 text-[#173A57]"
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      openFaq === idx ? "max-h-[250px] opacity-100 border-t border-border/40" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 text-[#173A57]/80 font-gothic text-[15px] sm:text-[16px] leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <PageContent />
    </CartProvider>
  );
}
