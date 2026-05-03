"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import ContactWidget from "../components/ContactWidget";
import OfferModal from "../components/OfferModal";
import CalendlyModal from "../components/CalendlyModal";
import Bubbles from "../components/Bubbles";
import { CartProvider, useCart } from "../lib/CartContext";
import { STATIC_PRODUCTS, type DisplayProduct } from "../lib/products";
import { fetchProducts, type ApiProduct } from "../lib/api";

function PageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [refCode, setRefCode] = useState("");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      localStorage.setItem('refCode', refParam);
      setRefCode(refParam);
    } else {
      const storedRef = localStorage.getItem('refCode');
      if (storedRef) setRefCode(storedRef);
    }

    fetchProducts("DE").then(setApiProducts).catch(() => {});

    const interval = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % 2);
    }, 4000);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.animate-fade-up').forEach(el => obs.observe(el));
    
    return () => {
      obs.disconnect();
      clearInterval(interval);
    };
  }, []);

  const products = useMemo(() => {
    if (apiProducts.length === 0) return STATIC_PRODUCTS;
    return STATIC_PRODUCTS.map((sp) => {
      const apiMatch = apiProducts.find(ap => ap.id === sp.id && ap.type === sp.type);
      if (!apiMatch) return sp;
      return { ...sp, retailer_price: apiMatch.retailer_price, deposit: apiMatch.deposit, shipping_cost: apiMatch.shipping_cost };
    });
  }, [apiProducts]);

  const fmt = (n: number) => "€" + n.toFixed(2).replace(".", ",");

  const faqs = [
    { q: 'Wie hoch ist die Mindestbestellmenge (MOQ)?', a: 'Für die AWAKE Dose beginnt die Mindestbestellmenge bei nur einem Händler-Tray (30 Dosen), für die Flasche bei einer Gastro-Kiste (24 Flaschen).' },
    { q: 'Wie lange sind die Produkte haltbar?', a: 'Ungeöffnet sind die Dosen und Flaschen ab dem Produktionsdatum mindestens 18 Monate haltbar.' },
    { q: 'Wie schnell erfolgt die Lieferung?', a: 'Bestellungen bis 14:00 Uhr werden am selben Werktag versandt. Zustellung innerhalb von 1-3 Werktagen. Ab 2 Paletten entfallen die Versandkosten.' },
    { q: 'Gibt es Werbematerial (POS)?', a: 'Bei Erstbestellung über das Premium Starter-Kit erhalten Sie einen Acryl-Aufsteller, Flyer und Sticker kostenfrei dazu.' },
    { q: 'Wie funktioniert das Pfandsystem?', a: 'Alle Gebinde unterliegen dem regulären deutschen DPG-Pfandsystem. Der Pfandbetrag wird im Checkout separat ausgewiesen.' },
  ];

  return (
    <>
      <OfferModal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} />
      <CalendlyModal isOpen={isCalendlyModalOpen} onClose={() => setIsCalendlyModalOpen(false)} />
      <main style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease', backgroundColor: '#ffffff', color: '#173A57', overflowX: 'clip' }}>
        <Navbar />
        <CartDrawer />
        <ContactWidget />

        {/* HERO SECTION */}
        <section className="hero" style={{ paddingTop: "160px", paddingBottom: "100px", background: "radial-gradient(circle at center, #1C4B72 0%, #0A1C2C 100%)", color: "#ffffff", position: "relative" }}>
        <Bubbles />
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px", position: "relative", zIndex: 1 }}>
          <div className="hero-content" style={{ flex: "1 1 500px" }}>
            <div className="hero-badge animate-fade-up" style={{ display: "inline-block", backgroundColor: "rgba(253, 242, 119, 0.15)", color: "#FDF277", padding: "8px 20px", borderRadius: "50px", fontWeight: "800", fontSize: "20px", letterSpacing: "2px", marginBottom: "32px", textTransform: "uppercase", border: "1px solid rgba(253, 242, 119, 0.3)" }}>
              AWAKE Retailer Portal
            </div>
            <h1 className="hero-title animate-fade-up delay-100">
              <span style={{ display: "inline-block", animation: "float 6s ease-in-out infinite" }}>
                <span className="animate-text-shine-light" style={{ fontFamily: "IntroRust, sans-serif", fontSize: "110%", paddingRight: "4px" }}>AWAKE</span>
              </span> - Das innovativste<br/>Getränk für dein <span style={{ color: "#FDF277" }}>Sortiment.</span>
            </h1>
            <p className="animate-fade-up delay-200" style={{ fontSize: "20px", color: "rgba(255,255,255,0.8)", marginBottom: "48px", maxWidth: "600px", lineHeight: 1.6 }}>
              Werde exklusiver AWAKE Retailer. Erweitere dein Angebot um hochdosiertes Wasserstoffwasser, erziele hohe Margen vor Ort und profitiere langfristig von unserem Affiliate-Modell.
            </p>
            <div className="hero-buttons animate-fade-up delay-300" style={{ display: "flex", gap: "16px" }}>
              <a href="#produkte" className="btn" style={{ padding: "18px 40px", fontSize: "18px", backgroundColor: "#FDF277", color: "#173A57", borderRadius: "50px", textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px", border: "none", cursor: "pointer", transition: "transform 0.2s" }}>B2B Sortiment ansehen</a>
            </div>
          </div>
          
          <div className="hero-image-wrapper animate-float" style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", position: "relative", minHeight: "550px", alignItems: "center", maxWidth: "100%" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "600px", height: "600px", background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)", borderRadius: "50%", zIndex: 1 }}></div>

            <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "450px" }}>
              <img src="/images/hero-slide-1.webp" alt="AWAKE Dose" className="hero-can" style={{ position: "absolute", height: "400px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.5))", zIndex: 3, opacity: heroImageIndex === 0 ? 1 : 0, transition: "opacity 1.5s ease-in-out" }} />
              <img src="/images/awake-bottle.png" alt="AWAKE Flasche" className="hero-bottle" style={{ position: "absolute", height: "400px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.4))", zIndex: 3, opacity: heroImageIndex === 1 ? 1 : 0, transition: "opacity 1.5s ease-in-out" }} />
            </div>

            <div className="animate-fade-up delay-200" style={{ position: "absolute", top: "15%", left: "20px", backgroundColor: "#ffffff", width: "120px", height: "120px", borderRadius: "50%", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", border: "4px solid #ffffff", padding: "5px" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: "1px solid #173A57", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "8px", color: "#173A57", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "2px" }}>QUALITÄTSSIEGEL</span>
                <span style={{ fontSize: "22px", color: "#173A57", fontWeight: "900", lineHeight: 1 }}>11 ppm</span>
                <span style={{ fontSize: "16px", color: "#173A57", fontWeight: "800" }}>H₂</span>
              </div>
            </div>

            <div className="animate-fade-up delay-300" style={{ position: "absolute", bottom: "15%", right: "20px", backgroundColor: "#78B833", width: "110px", height: "110px", borderRadius: "50%", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", border: "4px solid #ffffff", color: "#ffffff" }}>
              <span style={{ fontSize: "20px", fontWeight: "900", lineHeight: 1.1 }}>BPA</span>
              <span style={{ fontSize: "18px", fontWeight: "800" }}>FREE</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: "4px" }}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v8c0 7 4 8 7 8z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 2v8c0 7 4 8 7 8z"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section" style={{ backgroundColor: "#F0F4F8", padding: "60px 0", borderBottom: "1px solid rgba(23,58,87,0.05)" }}>
        <div className="container stats-grid">
          {[["3.000+","Zufriedene Kunden"],["11 ppm","Maximaler H₂-Gehalt"],["18 Monate","Stabile Haltbarkeit"],["200%","Mögliche Handelsmarge"]].map(([v,l],i)=>(
            <div key={i} className={`animate-fade-up delay-${i*100||''}`}>
              <div className="stat-value" style={{ fontSize: "42px", fontWeight: "900", color: "#173A57", marginBottom: "8px", lineHeight: 1 }}>{v}</div>
              <div style={{ color: "#173A57", opacity: 0.7, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "800" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HYBRID MODEL */}
      <section id="vorteile" style={{ padding: "120px 0", backgroundColor: "#ffffff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div className="animate-fade-up" style={{ color: "#173A57", opacity: 0.7, fontWeight: "700", fontSize: "14px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>Das AWAKE Hybrid-Modell</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ color: "#173A57", maxWidth: "800px", marginInline: "auto", fontWeight: "800", hyphens: "auto", wordBreak: "break-word" }}>Zwei Einkommensströme. Maximaler Umsatz.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            {[
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />, title: "B2B-Direktverkauf vor Ort", desc: "Verkaufe AWAKE exklusiv an deiner Theke oder Kasse. Durch unsere B2B-Konditionen erzielst du attraktive Margen bei jedem Impulskauf." },
              { icon: <><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4M12 8v8" /></>, title: "Affiliate-Verkauf Online", desc: "Deine Kunden wollen AWAKE auch zu Hause trinken? Empfehle es über deinen persönlichen Link und sichere dir 20% Lifetime-Provision." },
              { icon: <polyline strokeLinecap="round" strokeLinejoin="round" points="22 12 18 12 15 21 9 3 6 12 2 12" />, title: "Win-Win für dein Business", desc: "AWAKE ist das erste stabile Wasserstoffgetränk in Deutschland. Biete deinen Kunden eine echte Innovation und maximiere profitabel deinen Umsatz." },
            ].map((c, i) => (
              <div key={i} className={`animate-fade-up delay-${(i+1)*100}`} style={{ backgroundColor: "#F0F4F8", padding: "50px 40px", borderRadius: "24px", boxShadow: "0 10px 20px rgba(23,58,87,0.05)" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", backgroundColor: "#173A57", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px", color: "#FDF277" }}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{c.icon}</svg>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "16px", color: "#173A57" }}>{c.title}</h3>
                <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: "16px", color: "#173A57" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 PILLARS FROM H2-AWAKE.DE */}
      <section style={{ padding: "120px 0", backgroundColor: "#173A57", color: "#ffffff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div className="animate-fade-up" style={{ color: "#FDF277", fontWeight: "700", fontSize: "21px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>Wettbewerbsvorteil</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ fontSize: "48px", fontWeight: "800", fontFamily: "Century Gothic, sans-serif" }}>Was AWAKE ausmacht</h2>
            <p className="animate-fade-up delay-200" style={{ fontSize: "20px", color: "rgba(255,255,255,0.8)", maxWidth: "700px", marginInline: "auto", marginTop: "24px", lineHeight: 1.6 }}>
              5 zentrale Säulen, die Qualität, Innovation und Alltag miteinander verbinden – und deine Kunden überzeugen werden.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
            {[
              { title: "~ 11 ppm Wasserstoff", desc: "Molekularer Wasserstoff ist das Kernelement von AWAKE. Mit bis zu 11 ppm bieten wir eine wissenschaftlich fundierte Dosierung." },
              { title: "Sofort trinkfertig", desc: "Kein Mischen, kein Warten. Einfach öffnen und trinken – genau das, was Kunden im Alltag und beim Sport suchen." },
              { title: "Qualität & Kontrolle", desc: "Jede Charge wird streng laborgeprüft – für garantierte Reinheit und eine sichere, hochwertige Anwendung." },
              { title: "Tägliches Ritual", desc: "AWAKE lässt sich nahtlos in den Alltag integrieren – was für dich als Retailer eine extrem hohe Wiederkaufsrate bedeutet." },
              { title: "Hergestellt in Deutschland", desc: "Höchste Standards. AWAKE wird unter strengsten Qualitätsrichtlinien lokal in Deutschland gefertigt." },
              { title: "Premium-Design", desc: "Das cleane und moderne Design der Dose sticht im Regal hervor und generiert automatisch lukrative Impulskäufe." },
              { title: "Nachhaltigkeit", desc: "Unsere Aluminiumdosen sind zu 100% recycelbar. Wir setzen auf kurze Lieferketten und umweltfreundliche Logistik." },
              { title: "Zusätzliche Provision", desc: "Durch unser Hybrid-Modell profitierst du nicht nur vor Ort, sondern verdienst auch an Online-Folgekäufen deiner Kunden." }
            ].map((pillar, i) => (
              <div key={i} className={`animate-fade-up delay-${(i)*100}`} style={{ padding: "30px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "48px", fontWeight: "900", color: "var(--accent-yellow)", opacity: 1, marginBottom: "16px", lineHeight: 0.8 }}>0{i+1}</div>
                <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "16px" }}>{pillar.title}</h3>
                <p style={{ opacity: 0.8, lineHeight: 1.6 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="produkte" style={{ backgroundColor: "#ffffff", padding: "140px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div className="animate-fade-up" style={{ color: "#173A57", opacity: 0.7, fontWeight: "700", fontSize: "21px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>Bestellung</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ fontSize: "48px", fontWeight: "800", color: "#173A57", fontFamily: "Century Gothic, sans-serif" }}>B2B Sortiment & Gebinde</h2>
            <p className="animate-fade-up delay-200" style={{ maxWidth: "700px", marginInline: "auto", color: "#173A57", opacity: 0.8, fontSize: "20px", marginTop: "24px" }}>
              Wähle die passenden Gebindegrößen für dein Geschäft. Alle Preise verstehen sich als Nettopreise exkl. Pfand.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px", marginBottom: "60px" }}>
            {products.map((p, i) => (
              <div key={`${p.name}-${i}`} className={`product-card animate-fade-up delay-${((i%3)+1)*100}`} style={{ position: "relative", backgroundColor: "#F0F4F8", borderRadius: "24px", padding: "40px 30px", display: "flex", flexDirection: "column", border: p.isBestseller ? "2px solid #FDF277" : "none", transition: "transform 0.3s, box-shadow 0.3s" }} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
                {p.badge && !p.isBestseller && <div style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "#FDF277", color: "#173A57", fontSize: "12px", fontWeight: "800", padding: "6px 16px", borderRadius: "20px", letterSpacing: "1px", zIndex: 10 }}>{p.badge}</div>}
                {p.isBestseller && <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#FDF277", color: "#173A57", fontSize: "13px", fontWeight: "900", padding: "8px 20px", borderRadius: "50px", letterSpacing: "1px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", whiteSpace: "nowrap", zIndex: 10 }}>{p.badge}</div>}
                
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px", height: "200px", alignItems: "center", position: "relative", zIndex: 1 }}>
                  <img src={p.image} alt={p.name} style={{ maxHeight: "100%", filter: "drop-shadow(0 20px 25px rgba(0,0,0,0.15))" }} />
                </div>
                
                <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", fontFamily: "Century Gothic, sans-serif" }}>{p.name}</h3>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "30px" }}>{p.description}</p>
                
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontWeight: "800", letterSpacing: "1px", marginBottom: "4px" }}>{p.subtitle}</div>
                    <div style={{ fontSize: "32px", fontWeight: "900", color: "#FDF277", lineHeight: 1 }}>{fmt(p.retailer_price)} <span style={{ fontSize: "14px", fontWeight: "600", opacity: 0.7, color: "#ffffff" }}>netto</span></div>
                  </div>
                  <button onClick={() => addItem(p)} style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#FDF277", color: "#173A57", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} title="In den Warenkorb" onMouseEnter={(e) => {e.currentTarget.style.transform = 'scale(1.1)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'scale(1)';}}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-fade-up delay-300" style={{ textAlign: "center", backgroundColor: "rgba(23,58,87,0.03)", padding: "40px", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "16px", color: "#173A57", fontFamily: "Century Gothic, sans-serif" }}>Individueller Bedarf?</h3>
            <p style={{ opacity: 0.8, fontSize: "16px", marginBottom: "30px", maxWidth: "600px", marginInline: "auto", lineHeight: 1.6 }}>
              Du hast eine größere Kette, mehrere Standorte oder benötigst ein spezielles Angebot? Kontaktiere uns direkt für maßgeschneiderte B2B-Konditionen oder buche ein Gespräch mit unserem Team.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => setIsOfferModalOpen(true)} className="btn" style={{ backgroundColor: "#173A57", color: "#ffffff", padding: "16px 30px", borderRadius: "50px", fontWeight: "800", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", border: "none", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: "transform 0.2s" }} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-3px)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)';}}>
                Individuelles Angebot
              </button>
              <button onClick={() => setIsCalendlyModalOpen(true)} className="btn" style={{ backgroundColor: "#FDF277", color: "#173A57", padding: "16px 30px", borderRadius: "50px", fontWeight: "800", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", border: "2px solid #173A57", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: "transform 0.2s" }} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-3px)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)';}}>
                Beratungstermin buchen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SCIENCE SECTION */}
      <section id="wissen" className="section-padding" style={{ backgroundColor: "#F0F4F8" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div className="animate-fade-up" style={{ color: "#173A57", opacity: 0.7, fontWeight: "700", fontSize: "21px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>Die Wissenschaft</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ fontSize: "48px", fontWeight: "800", color: "#173A57", maxWidth: "800px", marginInline: "auto", fontFamily: "Century Gothic, sans-serif" }}>Ein kleines Molekül mit großer Wirkung</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
            {[
              { title: "Antioxidativer Effekt", desc: "Wie Wasserstoff die Zellen deiner Kunden schützt und den oxidativen Stress messbar reduziert." },
              { title: "Anti-inflammatorisch", desc: "H₂ wirkt entzündungshemmend und unterstützt die schnelle Regeneration nach dem Sport." },
              { title: "Zellstoffwechsel", desc: "Fördert die mitochondriale Funktion und sorgt so für eine effizientere Energiebereitstellung." },
              { title: "Epigenetischer Schutz", desc: "Zelleigene Schutzmechanismen werden für eine langfristige Leistungsbereitschaft hochreguliert." },
              { title: "Laktatabbau", desc: "Beschleunigt den Abbau von Milchsäure und verringert so die muskuläre Ermüdung während intensiver Belastungen." },
              { title: "Zelluläre Hydration", desc: "Dank der molekularen Größe dringt H₂ tief in die Zellen ein und optimiert den zellulären Feuchtigkeitshaushalt." }
            ].map((info, i) => (
              <div key={i} className="animate-fade-up delay-100" style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(23,58,87,0.05)" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(23, 58, 87, 0.05)", color: "#173A57", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "16px", color: "#173A57" }}>{info.title}</h3>
                <p style={{ color: "#173A57", opacity: 0.8, fontSize: "16px", lineHeight: 1.6 }}>{info.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="section-padding" style={{ backgroundColor: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "1400px" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div className="animate-fade-up" style={{ backgroundColor: "#173A57", color: "#ffffff", padding: "8px 20px", borderRadius: "50px", fontWeight: "700", fontSize: "14px", letterSpacing: "1px", marginBottom: "24px", textTransform: "uppercase", display: "inline-block" }}>Erfahrungsberichte</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ fontSize: "48px", fontWeight: "800", color: "#173A57", textTransform: "uppercase", letterSpacing: "1px" }}>Das sagen unsere Kunden</h2>
            <p className="animate-fade-up delay-200" style={{ maxWidth: "700px", marginInline: "auto", color: "#173A57", opacity: 0.7, fontSize: "18px", marginTop: "16px" }}>
              Über 3.000+ zufriedene Kunden vertrauen bereits auf die Kraft von AWAKE.
            </p>
          </div>
          <div className="reviews-grid">
            {[
              { label: "GAME CHANGER", text: "Ich war zunächst skeptisch, aber ich bin unendlich froh, dass ich AWAKE bestellt habe. Seit ich AWAKE trinke, hat sich mein allgemeines Wohlbefinden deutlich verbessert.", author: "Sarah M.", initials: "SM", color: "#22C55E" },
              { label: "DOCTOR APPROVED", text: "Als Arzt bin ich von der wissenschaftlichen Basis überzeugt. 11+ PPM molekularer Wasserstoff ist beeindruckend. Ich habe AWAKE meinen Patienten empfohlen und die Rückmeldungen sind durchweg positiv. Die antioxidative Wirkung ist spürbar und der Geschmack stimmt auch.", author: "Dr. Martin B.", initials: "MB", color: "#10B981" },
              { label: "ENERGY & FOCUS", text: "Das einzige Getränk, das mich spürbar besser fühlen lässt - und das täglich. Ich habe vor etwa zwei Monaten angefangen und definitiv einen Anstieg an Energie und Fokus bemerkt. Es schmeckt auch großartig. Ich habe es bereits mehreren Freunden empfohlen und kann es kaum erwarten, die Glasflasche als nächstes zu probieren!", author: "Thomas K.", initials: "TK", color: "#059669" },
              { label: "IMMEDIATE RESULTS", text: "Seit 10 Monaten dabei – das erste Getränk, das tatsächlich wirkt und bei dem man sofortige Ergebnisse sieht. Mein Energielevel ist konstant hoch und der Nachmittags-Crash ist komplett verschwunden.", author: "Anna S.", initials: "AS", color: "#34D399" },
              { label: "WHOLE FAMILY", text: "Ich wollte schon lange das ultimative Erlebnis durch Nahrungsergänzung erleben. Ich war frustriert, weil ich mehrere Produkte benutzte und oft vergaß, sie einzunehmen. Mein Blähbauch hat sich deutlich verringert. Ich bemerke auch den Unterschied bei meiner Haut. Ich habe meinem Vater ebenfalls ein Abo geholt und er möchte unbedingt weitermachen.", author: "Lisa W.", initials: "LW", color: "#10B981" },
              { label: "REGENERATION", text: "Mein Trainingspensum hat sich verbessert. Nicht auf eine unnatürliche Art, sondern eine nachhaltige Steigerung der Leistungsfähigkeit. Die Regeneration nach dem Sport ist deutlich besser geworden.", author: "Michael R.", initials: "MR", color: "#059669" },
              { label: "TRAVEL FRIENDLY", text: "Schmeckt gut und lässt sich einfach pur oder im Smoothie trinken. Auch super einfach für unterwegs, da die Dosen überall hinpassen.", author: "Henrik P.", initials: "HP", color: "#34D399" },
              { label: "PREMIUM QUALITY", text: "Ich trinke AWAKE jetzt seit 60 Tagen und bin wirklich zufrieden mit den Ergebnissen. Der Geschmack ist großartig, die Qualität fühlt sich premium an und die Balance ist perfekt für den täglichen Gebrauch. Was wirklich hervorsticht, ist der Kundenservice.", author: "Julia F.", initials: "JF", color: "#10B981" },
              { label: "CLEAR MIND", text: "Der Fokus beim Arbeiten am Laptop ist spürbar klarer. Ich ersetze mittlerweile meinen Nachmittagskaffee komplett durch eine Dose AWAKE. Kein Zittern, einfach nur klare Energie.", author: "Markus T.", initials: "MT", color: "#059669" },
              { label: "GYM FAVORITE", text: "Meine Kunden im Studio greifen immer öfter zu AWAKE. Die Dose sieht nicht nur extrem hochwertig aus, sondern das Produkt hält, was es verspricht. Eine absolute Bereicherung für unser Sortiment.", author: "Elena V.", initials: "EV", color: "#22C55E" }
            ].map((review, i) => (
              <div key={i} className="animate-fade-up" style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "20px", marginBottom: "30px", display: "inline-block", width: "100%", boxShadow: "0 10px 30px rgba(23,58,87,0.05)", border: "1px solid rgba(23,58,87,0.05)", breakInside: "avoid" }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <div key={star} style={{ width: "22px", height: "22px", backgroundColor: "#10B981", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                  ))}
                </div>
                <div style={{ display: "inline-block", border: "1px solid rgba(23,58,87,0.2)", color: "#173A57", fontSize: "10px", fontWeight: "800", padding: "4px 12px", borderRadius: "20px", letterSpacing: "1px", marginBottom: "20px" }}>{review.label}</div>
                <p style={{ fontSize: "14px", color: "#173A57", lineHeight: 1.6, marginBottom: "24px", opacity: 0.8 }}>"{review.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: review.color, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800" }}>{review.initials}</div>
                  <div style={{ fontWeight: "700", color: "#173A57", fontSize: "14px", opacity: 0.9 }}>{review.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFFILIATE */}
      <section id="partner" style={{ padding: "120px 0", backgroundColor: "#173A57", color: "#ffffff" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px" }}>
          <div className="animate-fade-up" style={{ flex: "1 1 500px" }}>
            <div style={{ color: "#FDF277", fontWeight: "700", fontSize: "21px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>Skalierung ohne Risiko</div>
            <h2 className="section-title" style={{ marginBottom: "24px", fontSize: "48px", fontWeight: "800", fontFamily: "Century Gothic, sans-serif", textAlign: "left" }}>Das Affiliate-Modell</h2>
            <p style={{ opacity: 0.8, fontSize: "20px", lineHeight: 1.6, marginBottom: "40px" }}>Nutze deine Reichweite. Empfehle AWAKE an Kunden und verdiene an jeder ihrer Online-Bestellungen passiv mit. Dauerhaft.</p>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "18px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {["Individueller Affiliate-Link & QR-Codes für dein Geschäft", "20% Lifetime-Vergütung (inklusive aller Folgekäufe)", "Keine Lagerhaltung, kein Versand – wir übernehmen das Fulfillment"].map((t, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "rgba(253,242,119,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <svg width="16" height="16" fill="none" stroke="#FDF277" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span style={{ lineHeight: 1.4 }}>{t}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "40px" }}>
               <a href={`https://partners.h2-awake.de/create-account${refCode ? '?ref=' + refCode : ''}`} target="_blank" rel="noopener noreferrer" className="btn boost-btn" style={{ backgroundColor: "#FDF277", color: "#173A57", padding: "18px 40px", borderRadius: "50px", fontWeight: "900", textTransform: "uppercase", textDecoration: "none", display: "inline-block", letterSpacing: "1px", fontSize: "16px", boxShadow: "0 10px 25px rgba(253, 242, 119, 0.2)" }}>
                 Partnerprogramm Anmelden
               </a>
            </div>
          </div>
          <div className="animate-fade-up delay-200" style={{ flex: "1 1 350px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "320px", height: "320px", borderRadius: "50%", background: "#1C4B72", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px solid rgba(253,242,119,0.3)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
              <div style={{ fontSize: "96px", fontWeight: "900", color: "#FDF277", lineHeight: 1 }}>20<span style={{ fontSize: "60px" }}>%</span></div>
              <div style={{ color: "#ffffff", fontWeight: "700", fontSize: "18px", letterSpacing: "2px", marginTop: "10px" }}>LIFETIME MARGE</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "140px 0", backgroundColor: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 className="section-title animate-fade-up" style={{ color: "#173A57", fontSize: "48px", fontWeight: "800" }}>Häufige Fragen (B2B)</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="animate-fade-up delay-200">
            {faqs.map((faq, index) => (
              <div key={index} style={{ backgroundColor: "#F0F4F8", borderRadius: "16px", overflow: "hidden", transition: "all 0.3s" }}>
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", backgroundColor: "transparent", border: "none", textAlign: "left", fontSize: "18px", fontWeight: "800", cursor: "pointer", color: "#173A57" }}>
                  {faq.q}
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: openFaq === index ? "#173A57" : "rgba(23,58,87,0.1)", color: openFaq === index ? "#ffffff" : "#173A57", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openFaq === index ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </button>
                <div style={{ display: "grid", gridTemplateRows: openFaq === index ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease" }}>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ padding: "0 24px 24px 24px", color: "#173A57", opacity: 0.8, lineHeight: 1.6, fontSize: "16px" }}>
                      <div style={{ borderTop: "1px solid rgba(23, 58, 87, 0.1)", paddingTop: "16px" }}>{faq.a}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#173A57", color: "rgba(255,255,255,0.7)", padding: "80px 0 40px" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "40px" }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "900", letterSpacing: "2px", marginBottom: "16px" }}>AWAKE Retailer</div>
            <p style={{ lineHeight: 1.6, maxWidth: "300px" }}>Der exklusive B2B Hub für das erste Wasserstoffgetränk Deutschlands.</p>
          </div>
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>Bestellungen</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><a href="#produkte" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Händler-Tray (Dose)</a></li>
              <li><a href="#produkte" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Gastro-Kiste (Flasche)</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>Partner Info</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><a href="#partner" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Affiliate Programm</a></li>
              <li><a href="#wissen" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Die Wissenschaft</a></li>
            </ul>
          </div>
        </div>
        <div className="container" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "60px", paddingTop: "30px", textAlign: "center", fontSize: "14px" }}>
          © 2026 H2 Vital GmbH. AWAKE Retailer Portal.
        </div>
      </footer>
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
