"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Bubbles from "../components/Bubbles";
import ContactWidget from "../components/ContactWidget";
import { CartProvider, useCart } from "../lib/CartContext";
import { STATIC_PRODUCTS, type DisplayProduct } from "../lib/products";
import { fetchProducts, type ApiProduct } from "../lib/api";

function PageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [refCode, setRefCode] = useState("");
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const { addItem } = useCart();

  const heroImages = ["/hero-slide-1-user.webp", "/hero-slide-2-user.webp"];

  useEffect(() => {
    setMounted(true);

    // Capture 'ref' parameter and store in localStorage
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

    // Image Swapper
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroImages.length);
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

  // Merge API prices into static product display data
  const products = useMemo(() => {
    if (apiProducts.length === 0) return STATIC_PRODUCTS;
    return STATIC_PRODUCTS.map((sp) => {
      const apiMatch = apiProducts.find(
        (ap) => ap.id === sp.id && ap.type === sp.type
      );
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
    { q: 'Wie hoch ist die Mindestbestellmenge (MOQ)?', a: 'Für die AWAKE Dose beginnt die Mindestbestellmenge bei nur einem Händler-Tray (30 Dosen), für die Flasche bei einer Gastro-Kiste (24 Flaschen).' },
    { q: 'Wie lange sind die Produkte haltbar?', a: 'Ungeöffnet sind die Dosen und Flaschen ab dem Produktionsdatum mindestens 18 Monate haltbar.' },
    { q: 'Wie schnell erfolgt die Lieferung?', a: 'Bestellungen bis 14:00 Uhr werden am selben Werktag versandt. Zustellung innerhalb von 1-3 Werktagen. Ab 2 Paletten entfallen die Versandkosten.' },
    { q: 'Gibt es Werbematerial (POS)?', a: 'Bei Erstbestellung über das Premium Starter-Kit erhalten Sie einen Acryl-Aufsteller, Flyer und Sticker kostenfrei dazu.' },
    { q: 'Wie funktioniert das Pfandsystem?', a: 'Alle Gebinde unterliegen dem regulären deutschen DPG-Pfandsystem. Der Pfandbetrag wird im Checkout separat ausgewiesen.' },
  ];

  return (
    <main style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease', overflowX: 'hidden' }}>
      <Navbar />
      <CartDrawer />
      <ContactWidget />

      {/* HERO */}
      <section className="hero" style={{ padding: '160px 0 120px', background: 'radial-gradient(circle at center, #F0F4F8 0%, #ffffff 100%)', position: 'relative', overflow: 'hidden' }}>
        <Bubbles />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div className="hero-content" style={{ flex: '1 1 300px', maxWidth: '600px', textAlign: 'left' }}>
            <h1 className="hero-title animate-fade-up" style={{ fontSize: '64px', lineHeight: 1.1, marginBottom: '24px', color: 'var(--bg-dark)', fontWeight: 800 }}>
              ERLEBE DEN<br />
              <span className="animate-text-shine" style={{ display: 'inline-block', paddingRight: '10px', fontFamily: 'IntroRust', fontSize: '110%' }}>AWAKE</span><br />
              EFFEKT
            </h1>
            <p className="animate-fade-up delay-100" style={{ fontSize: '18px', opacity: 0.8, marginBottom: '24px', maxWidth: '500px', lineHeight: 1.6, color: 'var(--text-dark)' }}>
              Ein erfrischendes Getränk mit reinem molekularem Wasserstoff – Natürlich. Innovativ. Belebend.
            </p>
            <div className="animate-fade-up delay-200" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', color: 'var(--accent-yellow)', fontSize: '20px' }}>
                ★★★★★
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>4.8 von 487 Bewertungen</span>
            </div>
            <div className="hero-buttons animate-fade-up delay-300">
              <a href="#shop" className="btn" style={{ padding: '16px 40px', fontSize: '16px', backgroundColor: 'var(--accent-yellow)', color: 'var(--bg-dark)', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, display: 'inline-block', boxShadow: '0 10px 20px rgba(253, 242, 119, 0.3)' }}>
                ZUM B2B PORTAL
              </a>
            </div>
          </div>
          
          <div className="hero-image-wrapper animate-float" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <img key={heroImages[heroImageIdx]} src={heroImages[heroImageIdx]} alt="AWAKE Produkt" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '600px', animation: 'fadeInImage 0.5s ease', mixBlendMode: 'multiply' }} />
          </div>
        </div>
      </section>

      {/* DEIN WASSERSTOFF BOOST SECTION */}
      <section className="boost-section" style={{ backgroundColor: 'var(--bg-dark)', color: '#fff', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container boost-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '120px', flexWrap: 'wrap' }}>
          {/* Left Side: Image with badges */}
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '450px', display: 'flex', justifyContent: 'center', minHeight: '500px', alignItems: 'center' }}>
             
             {/* Background Smoke */}
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '140%', zIndex: 1, pointerEvents: 'none', opacity: 0.9 }}>
                <img src="/images/boost-smoke.webp" alt="Background Smoke" style={{ width: '100%', animation: 'fadeInImage 4s ease-in-out infinite alternate' }} />
             </div>
             
             {/* Boost Can */}
             <div style={{ zIndex: 2, position: 'relative', transform: 'rotate(-10deg)', width: '100%', maxWidth: '220px' }}>
                <img className="animate-float" src="/images/boost-can.webp" alt="AWAKE Dose" style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }} />
             </div>
             
             {/* Badges as images */}
             <div className="badge-koffein" style={{ position: 'absolute', top: '5%', left: '0%', width: '120px', zIndex: 3 }}>
                <img className="animate-float" src="/images/badge-koffein.webp" alt="Ohne Koffein" style={{ width: '100%', animationDelay: '0.5s', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
             </div>
             <div className="badge-zucker" style={{ position: 'absolute', top: '15%', right: '-5%', width: '110px', zIndex: 3 }}>
                <img className="animate-float" src="/images/badge-zucker.webp" alt="Ohne Zucker" style={{ width: '100%', animationDelay: '1.2s', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
             </div>
             <div className="badge-h2" style={{ position: 'absolute', bottom: '25%', left: '-5%', width: '110px', zIndex: 3 }}>
                <img className="animate-float" src="/images/badge-h2.webp" alt="Max H2 Boost" style={{ width: '100%', animationDelay: '2.5s', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
             </div>
             <div className="badge-lemon" style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '120px', zIndex: 3 }}>
                <img className="animate-float" src="/images/badge-lemon.webp" alt="Frischer Lemon Kick" style={{ width: '100%', animationDelay: '1.8s', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
             </div>
          </div>

          {/* Right Side: Text & Button */}
          <div style={{ flex: '1 1 300px', maxWidth: '550px' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'var(--accent-yellow)', color: 'var(--bg-dark)', padding: '8px 20px', borderRadius: '50px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>Wasserstoff-Power</div>
            <h2 className="boost-heading" style={{ fontSize: '42px', marginBottom: '24px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '0.5px' }}>DEIN WASSERSTOFF BOOST</h2>
            <p style={{ opacity: 0.9, lineHeight: 1.7, marginBottom: '40px', fontSize: '17px' }}>
              Der Wasserstoffgehalt in handelsüblichem Wasserstoffwasser liegt oft zwischen 0,5 und 1,2 PPM. Mit unserer speziellen Technologie hält AWAKE mehr als 11 PPM pro Liter konstant und stabil - ein erfrischendes Getränk, das neue Maßstäbe setzt.
            </p>
            <a href={`https://partners.h2-awake.de/create-account${refCode ? '?ref=' + refCode : ''}`} target="_blank" rel="noopener noreferrer" className="btn boost-btn" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--bg-dark)', padding: '18px 36px', borderRadius: '50px', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', letterSpacing: '1.5px', fontSize: '14px', boxShadow: '0 10px 25px rgba(253, 242, 119, 0.2)' }}>
              PARTNERPROGRAMM ANMELDEN
            </a>
          </div>
        </div>

        <div className="awake-footer-container" style={{ textAlign: 'center', marginTop: '120px' }}>
          <h3 className="awake-footer" style={{ fontFamily: 'IntroRust, sans-serif', fontSize: '64px', fontWeight: 'normal', marginBottom: '16px', letterSpacing: '2px', color: '#fff' }}>AWAKE</h3>
          <p style={{ fontSize: '26px', opacity: 0.9, lineHeight: 1.4 }}>Natürlich. Innovativ.<br/>Belebend.</p>
        </div>
      </section>

      {/* STATS */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-dark)', padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px', textAlign: 'center' }}>
          {[["1000+","Zufriedene B2B Kunden"],["50%","Wiederverkaufsrate"],["18 Monate","Stabile Haltbarkeit"],["200%","Mögliche Handelsmarge"]].map(([v,l],i)=>(
            <div key={i} className={`animate-fade-up delay-${i*100||''}`}>
              <div className="stat-value" style={{ fontSize: '42px', fontWeight: 'bold', color: 'var(--accent-yellow)', marginBottom: '8px', lineHeight: 1 }}>{v}</div>
              <div style={{ color: 'var(--text-light)', opacity: 0.7, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY AWAKE */}
      <section style={{ padding: '140px 0', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="animate-fade-up" style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Ihr Wettbewerbsvorteil</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ color: 'var(--text-dark)', maxWidth: '800px', marginInline: 'auto', fontSize: '40px' }}>Warum AWAKE das perfekte Produkt für Ihren Standort ist</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {[
              { icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>, title: "Hochmargiges Premium-Produkt", desc: "Exzellente Händlerkonditionen ermöglichen eine hohe Gewinnspanne bei jedem Verkauf." },
              { icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, title: "Impulskäufe an der Theke", desc: "Das cleane Design der Dose zieht Blicke auf sich. Optimal platziert generiert AWAKE konstante Spontankäufe." },
              { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, title: "Einzigartiges Alleinstellungsmerkmal", desc: "AWAKE ist das erste stabile Wasserstoffgetränk in Deutschland. Echte Innovation statt Standard-Drinks." },
            ].map((c, i) => (
              <div key={i} className={`animate-fade-up delay-${(i+1)*100}`} style={{ backgroundColor: '#fff', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(23,58,87,0.05)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--bg-dark)', border: '2px solid var(--accent-yellow)', boxShadow: '0 10px 20px rgba(253,242,119,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', color: 'var(--accent-yellow)' }}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{c.icon}</svg>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--bg-dark)' }}>{c.title}</h3>
                <p style={{ opacity: 0.75, lineHeight: 1.7, fontSize: '16px' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="shop" className="products-section" style={{ backgroundColor: '#ffffff', padding: '140px 0', color: 'var(--text-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="animate-fade-up" style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Bestellung</div>
            <h2 className="section-title animate-fade-up delay-100" style={{ fontSize: '40px', color: 'var(--text-dark)' }}>B2B Sortiment &amp; Gebinde</h2>
            <p className="section-subtitle animate-fade-up delay-200" style={{ maxWidth: '700px', marginInline: 'auto', color: 'var(--text-dark)' }}>
              Wählen Sie die passenden Gebindegrößen für Ihr Geschäft. Alle Preise verstehen sich als Nettopreise exkl. Pfand.
            </p>
          </div>
          <div className="products-grid">
            {products.map((p, i) => (
              <div key={`${p.name}-${i}`} className={`product-card animate-fade-up delay-${((i%3)+1)*100}`} style={{ position: 'relative', border: p.isBestseller ? '2px solid var(--accent-yellow)' : '1px solid rgba(0,0,0,0.08)' }}>
                {p.badge && !p.isBestseller && <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'var(--accent-yellow)', color: 'var(--bg-dark)', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px', letterSpacing: '1px' }}>{p.badge}</div>}
                {p.isBestseller && <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-yellow)', color: 'var(--bg-dark)', fontSize: '12px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '20px', letterSpacing: '1px', boxShadow: '0 10px 20px rgba(253,242,119,0.3)', whiteSpace: 'nowrap' }}>{p.badge}</div>}
                <div className="product-image" style={{ padding: '30px 0', position: 'relative' }}>
                  <img src={p.image} alt={p.name} style={{ maxHeight: '200px', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))', ...(p.secondImage ? { transform: 'translateX(-15px)' } : {}) }} />
                  {p.secondImage && <img src={p.secondImage} alt={p.name} style={{ maxHeight: '180px', position: 'absolute', transform: 'translateX(25px) scale(0.9)', zIndex: -1, filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.1))' }} />}
                </div>
                <h3 className="product-title" style={{ fontSize: '24px' }}>{p.name}</h3>
                <p className="product-desc" style={{ fontSize: '15px', lineHeight: 1.6 }}>{p.description}</p>
                <div className="product-footer" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{p.subtitle}</div>
                    <div className="product-price">{fmt(p.retailer_price)} <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.7 }}>netto</span></div>
                  </div>
                  <button className="btn-icon" style={{ width: '50px', height: '50px' }} title="In den Warenkorb" onClick={() => addItem(p)}>
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP PROCESS */}
      <section style={{ padding: '140px 0', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="animate-fade-up" style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Ablauf</div>
          <h2 className="section-title animate-fade-up delay-100" style={{ color: 'var(--text-dark)', fontSize: '40px' }}>Der Weg zur Retail-Partnerschaft</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '80px' }}>
            {[["1","Anmelden & Bestellen","Wählen Sie Ihr Gebinde und bestellen Sie direkt über unser Portal."],["2","Lieferung & POS Setup","Schnelle Lieferung plus kostenfreie Werbematerialien."],["3","Umsatz Profitieren","Begeistern Sie Kunden und maximieren Sie Ihren Gewinn."]].map(([n,t,d],i)=>(
              <div key={i} className={`animate-fade-up delay-${(i+1)*100}`} style={{ backgroundColor: '#fff', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(23,58,87,0.05)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-yellow)', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 15px 30px rgba(23,58,87,0.2)' }}>{n}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>{t}</h3>
                <p style={{ opacity: 0.75, fontSize: '16px', lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFFILIATE */}
      <section id="partner" style={{ padding: '120px 0', backgroundColor: 'var(--bg-dark)', color: 'var(--text-light)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '60px' }}>
          <div className="animate-fade-up" style={{ flex: '1 1 450px' }}>
            <div style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Zusatzeinnahmen Generieren</div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '24px', fontSize: '40px' }}>Das AWAKE Affiliate Programm</h2>
            <p style={{ opacity: 0.8, fontSize: '18px', lineHeight: 1.7, marginBottom: '40px' }}>Empfehlen Sie AWAKE weiter und profitieren Sie langfristig von jedem Sale.</p>
            <ul style={{ listStyle: 'none', marginBottom: '40px', fontSize: '18px', opacity: 0.9 }}>
              {["Bis zu 20% Provision","Lifetime-Vergütung für Folgebestellungen","30-Tage Cookie-Laufzeit"].map((t,i)=>(
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(253,242,119,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" fill="none" stroke="var(--accent-yellow)" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  </div>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up delay-200" style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '280px', height: '280px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(253,242,119,0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '84px', fontWeight: 'bold', color: 'var(--accent-yellow)' }}>20<span style={{ fontSize: '50px' }}>%</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* H2 GUIDE */}
      <section id="h2-guide" style={{ padding: '140px 0', backgroundColor: '#eef3f8', color: 'var(--text-dark)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div className="animate-fade-up">
            <div style={{ display: 'inline-block', backgroundColor: 'var(--bg-dark)', color: 'var(--accent-yellow)', padding: '6px 18px', borderRadius: '50px', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px', marginBottom: '24px' }}>WISSEN IST UMSATZ</div>
            <h2 className="section-title" style={{ color: 'var(--text-dark)', textAlign: 'left', marginBottom: '24px', fontSize: '40px' }}>Der H2 Wasserstoff Guide</h2>
            <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.8, lineHeight: 1.7 }}>Unser wissenschaftlich fundierter Guide liefert Ihnen die essenziellen Verkaufsargumente auf einen Blick.</p>
          </div>
          <div className="animate-fade-up delay-200" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(23,58,87,0.15)' }}>
            <img src="/guide.avif" alt="AWAKE H2 Guide" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '140px 0', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title animate-fade-up" style={{ color: 'var(--text-dark)', fontSize: '40px' }}>Häufige Fragen (B2B)</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-up delay-200">
            {faqs.map((faq, index) => (
              <div key={index} style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 40px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--primary-color)' }}>
                  {faq.q}
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: openFaq === index ? 'var(--accent-yellow)' : 'rgba(23,58,87,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 }}>
                    <svg className={`faq-icon ${openFaq === index ? 'open' : ''}`} width="24" height="24" fill="none" stroke={openFaq === index ? '#0B233A' : '#173A57'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </button>
                <div className={`faq-content ${openFaq === index ? 'open' : ''}`}>
                  <p style={{ padding: '0 40px 30px', opacity: 0.8, lineHeight: 1.8, fontSize: '16px' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">AWAKE Retailer</div>
              <p className="footer-text" style={{ lineHeight: 1.8 }}>Ihr B2B Partner für das erste Wasserstoffgetränk Deutschlands.</p>
            </div>
            <div>
              <h4 className="footer-title">Bestellungen</h4>
              <ul className="footer-links"><li><a href="#shop">Händler-Tray (Dose)</a></li><li><a href="#shop">Gastro-Kiste (Flasche)</a></li><li><a href="#shop">Palettenware</a></li></ul>
            </div>
            <div>
              <h4 className="footer-title">Partner Info</h4>
              <ul className="footer-links"><li><a href="#partner">Affiliate Programm</a></li><li><a href="#h2-guide">H2 Guide</a></li><li><a href="#faq">Händler-FAQ</a></li></ul>
            </div>
            <div>
              <h4 className="footer-title">Rechtliches</h4>
              <ul className="footer-links"><li><a href="#">B2B AGB</a></li><li><a href="#">Impressum</a></li><li><a href="#">Datenschutz</a></li></ul>
            </div>
          </div>
          <div className="footer-bottom" style={{ marginTop: '60px', paddingTop: '30px' }}>© 2026 H2 Vital GmbH. Retailer Portal.</div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <PageContent />
    </CartProvider>
  );
}
