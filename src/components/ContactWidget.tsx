'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedRef = localStorage.getItem('refCode');
    if (storedRef) {
      requestAnimationFrame(() => {
        setRefCode(storedRef);
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      firma: formData.get('firma'),
      text: formData.get('text'),
      refCode: refCode
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--accent-yellow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(23,58,87,0.3)',
          cursor: 'pointer',
          zIndex: 990,
          border: '2px solid var(--accent-yellow)',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'scale(0)' : 'scale(1)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          zIndex: 991,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeUp 0.3s ease'
        }} ref={modalRef}>
          <div style={{ backgroundColor: 'var(--bg-dark)', color: '#fff', padding: '20px', position: 'relative' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Sie haben Fragen?</h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>Schreiben Sie uns eine Nachricht.</p>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>&times;</button>
          </div>
          
          <div style={{ padding: '20px' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--bg-dark)' }}>
                <svg style={{ margin: '0 auto 16px' }} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h4 style={{ margin: 0, fontSize: '18px' }}>Vielen Dank!</h4>
                <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: '14px' }}>Ihre Nachricht wurde gesendet.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <input required name="name" type="text" placeholder="Name *" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <input required name="firma" type="text" placeholder="Firma *" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <textarea required name="text" placeholder="Ihre Nachricht *" rows={4} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <input required type="checkbox" id="datenschutz" style={{ marginTop: '4px' }} />
                  <label htmlFor="datenschutz" style={{ fontSize: '12px', opacity: 0.8, lineHeight: 1.4 }}>
                    Ich stimme zu, dass meine Angaben zur Kontaktaufnahme gespeichert werden.
                  </label>
                </div>
                
                {status === 'error' && <div style={{ color: 'red', fontSize: '13px' }}>Fehler beim Senden. Bitte versuchen Sie es später erneut.</div>}
                
                <button disabled={status === 'loading'} type="submit" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--accent-yellow)', padding: '12px', borderRadius: '50px', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}>
                  {status === 'loading' ? 'Wird gesendet...' : 'Absenden'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
