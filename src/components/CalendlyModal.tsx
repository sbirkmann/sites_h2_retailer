"use client";

import { useEffect } from "react";
import Image from "next/image";
import julianSchneider from "../../public/images/julian-schneider.webp";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '1000px', height: '90vh', maxHeight: '700px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', overflow: 'hidden', animation: 'fadeUp 0.4s ease-out forwards' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f0f4f8', border: 'none', cursor: 'pointer', color: 'var(--bg-dark)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Left Side: Calendly */}
        <div style={{ flex: '2', height: '100%', borderRight: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <iframe 
            src="https://calendly.com/julian-h2-awake/30min?hide_event_type_details=1&hide_gdpr_banner=1" 
            width="100%" 
            height="100%" 
            frameBorder="0"
            style={{ borderRadius: '24px 0 0 24px' }}
          ></iframe>
        </div>

        {/* Right Side: CEO Profile */}
        <div className="desktop-only" style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-light)', padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <Image src={julianSchneider} alt="Julian Schneider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--bg-dark)', marginBottom: '4px' }}>Julian Schneider</h3>
          <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', marginBottom: '16px' }}>B2B Experte</div>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent-yellow)', marginBottom: '20px' }}></div>
          <p style={{ color: 'var(--text-dark)', opacity: 0.8, lineHeight: 1.6, fontSize: "15px", fontStyle: "italic" }}>
            {"Als Gesundheitsexperte und Wasserstoff-Pionier zeige ich dir, wie du AWAKE optimal in deinem Business einsetzt und deine Margen maximierst."}
          </p>
        </div>

      </div>
    </div>
  );
}
