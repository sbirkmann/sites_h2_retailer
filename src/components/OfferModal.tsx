"use client";

import { useState, useEffect } from "react";

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferModal({ isOpen, onClose }: OfferModalProps) {
  const [refCode, setRefCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    firma: "",
    email: "",
    phone: "",
    text: "Hallo, ich interessiere mich für ein individuelles B2B-Angebot für meinen Standort.",
    privacy: false
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Try to get ref from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlRef = urlParams.get('ref');
    
    if (urlRef) {
      requestAnimationFrame(() => {
        setRefCode(urlRef);
      });
      localStorage.setItem('refCode', urlRef);
    } else {
      const storedRef = localStorage.getItem('refCode');
      if (storedRef) {
        requestAnimationFrame(() => {
          setRefCode(storedRef);
        });
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.firma || !formData.text || !formData.privacy) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Angebot",
          name: formData.name,
          firma: formData.firma,
          email: formData.email,
          phone: formData.phone,
          text: formData.text,
          refCode: refCode || undefined
        }),
      });

      if (!res.ok) throw new Error("API Error");

      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeUp 0.4s ease-out forwards' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bg-dark)' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--bg-dark)', marginBottom: '10px' }}>Individuelles Angebot</h3>
        <p style={{ color: 'var(--bg-dark)', opacity: 0.8, marginBottom: '30px', fontSize: '15px' }}>
          Hinterlasse uns deine Daten und wir melden uns umgehend mit einem maßgeschneiderten Angebot für deine Location.
        </p>

        {status === "success" ? (
          <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '20px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold' }}>
            Vielen Dank! Deine Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="text"
                placeholder="Dein Name *"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(23,58,87,0.1)', fontSize: '15px' }}
              />
              <input
                type="text"
                placeholder="Firma / Studio *"
                required
                value={formData.firma}
                onChange={e => setFormData({...formData, firma: e.target.value})}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(23,58,87,0.1)', fontSize: '15px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="email"
                placeholder="E-Mail *"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(23,58,87,0.1)', fontSize: '15px' }}
              />
              <input
                type="tel"
                placeholder="Telefonnummer"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(23,58,87,0.1)', fontSize: '15px' }}
              />
            </div>

            <textarea
              placeholder="Deine Nachricht / Bedarfsmenge *"
              required
              rows={4}
              value={formData.text}
              onChange={e => setFormData({...formData, text: e.target.value})}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(23,58,87,0.1)', fontSize: '15px', resize: 'vertical' }}
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--bg-dark)', opacity: 0.8, cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                required 
                checked={formData.privacy}
                onChange={e => setFormData({...formData, privacy: e.target.checked})}
                style={{ marginTop: '3px' }}
              />
              Ich stimme zu, dass meine Angaben zur Kontaktaufnahme gespeichert werden.
            </label>

            {status === "error" && (
              <div style={{ color: 'red', fontSize: '13px' }}>Es gab einen Fehler beim Senden. Bitte versuche es später noch einmal.</div>
            )}

            <button 
              type="submit" 
              disabled={status === "loading" || !formData.privacy}
              style={{ 
                backgroundColor: 'var(--bg-dark)', 
                color: 'var(--accent-yellow)', 
                padding: '16px', 
                borderRadius: '50px', 
                fontWeight: 'bold', 
                fontSize: '16px',
                border: 'none',
                cursor: (status === "loading" || !formData.privacy) ? 'not-allowed' : 'pointer',
                opacity: (status === "loading" || !formData.privacy) ? 0.7 : 1,
                marginTop: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {status === "loading" ? "Wird gesendet..." : "Angebot anfordern"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
