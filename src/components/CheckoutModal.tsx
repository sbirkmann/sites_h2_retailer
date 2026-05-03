"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "../lib/CartContext";
import { sendLoginCode, verifyLoginCode, createOrder, fetchProducts, type Customer, type OrderItem } from "../lib/api";

// ─── VAT rates by country ───────────────────────────────────────────────────
const VAT_RATES: Record<string, { label: string; rate: number }> = {
  DE: { label: "Deutschland", rate: 0.19 },
  AT: { label: "Österreich", rate: 0.20 },
  CH: { label: "Schweiz", rate: 0.081 },
  NL: { label: "Niederlande", rate: 0.21 },
  BE: { label: "Belgien", rate: 0.21 },
  FR: { label: "Frankreich", rate: 0.20 },
  IT: { label: "Italien", rate: 0.22 },
  ES: { label: "Spanien", rate: 0.21 },
  PL: { label: "Polen", rate: 0.23 },
  CZ: { label: "Tschechien", rate: 0.21 },
  LU: { label: "Luxemburg", rate: 0.17 },
  DK: { label: "Dänemark", rate: 0.25 },
  SE: { label: "Schweden", rate: 0.25 },
};

type Step = "email" | "code" | "address" | "submitting" | "done";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 18px", borderRadius: "12px",
  border: "1px solid rgba(23,58,87,0.12)", fontSize: "15px",
  backgroundColor: "#fff", color: "#173A57", outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: 600,
  marginBottom: "6px", color: "#173A57", opacity: 0.7,
  textTransform: "uppercase", letterSpacing: "0.5px",
};

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { items, subtotal, totalDeposit, clearCart } = useCart();
  const fmt = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

  // ─── State ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [customerExists, setCustomerExists] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Address form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("DE");
  const [refCode, setRefCode] = useState("");

  // Initialize refCode from localStorage
  useEffect(() => {
    const storedRef = localStorage.getItem("refCode");
    if (storedRef) {
      setRefCode(storedRef);
    }
  }, []);

  // Live shipping cost based on selected country
  const [shippingForCountry, setShippingForCountry] = useState<number>(0);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Fetch shipping cost when country changes
  useEffect(() => {
    let cancelled = false;
    setShippingLoading(true);
    fetchProducts(countryCode)
      .then((apiProducts) => {
        if (cancelled) return;
        // Find max shipping cost among items in cart
        let maxShipping = 0;
        for (const cartItem of items) {
          const apiMatch = apiProducts.find(
            (ap) => ap.id === cartItem.product.id && ap.type === cartItem.product.type
          );
          if (apiMatch && apiMatch.shipping_cost != null) {
            maxShipping = Math.max(maxShipping, apiMatch.shipping_cost);
          }
        }
        setShippingForCountry(maxShipping);
      })
      .catch(() => {
        if (!cancelled) {
          // Fallback to cart's static shipping
          const maxStatic = items.reduce((max, i) => Math.max(max, i.product.shipping_cost ?? 0), 0);
          setShippingForCountry(maxStatic);
        }
      })
      .finally(() => { if (!cancelled) setShippingLoading(false); });
    return () => { cancelled = true; };
  }, [countryCode, items]);

  // ─── VAT calculation ────────────────────────────────────────────────────
  const vatRate = VAT_RATES[countryCode]?.rate ?? 0.19;
  const netTotal = subtotal + totalDeposit + shippingForCountry;
  const vatAmount = netTotal * vatRate;
  const grossTotal = netTotal + vatAmount;

  // ─── Step 1: Send login code ────────────────────────────────────────────
  const handleSendCode = async () => {
    if (!email.trim()) { setError("Bitte E-Mail eingeben."); return; }
    setLoading(true); setError("");
    try {
      const res = await sendLoginCode(email.trim());
      setCustomerExists(res.customer_exists);
      setStep("code");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Fehler beim Senden."); }
    finally { setLoading(false); }
  };

  // ─── Step 2: Verify code ───────────────────────────────────────────────
  const handleVerifyCode = async () => {
    if (!code.trim() || code.trim().length !== 6) { setError("Bitte 6-stelligen Code eingeben."); return; }
    setLoading(true); setError("");
    try {
      const res = await verifyLoginCode(email.trim(), code.trim());
      if (!res.code_valid) { setError("Code ungültig oder abgelaufen."); setLoading(false); return; }
      if (res.customer) {
        setCustomer(res.customer);
        setFirstName(res.customer.first_name);
        setLastName(res.customer.last_name);
        setCompany(res.customer.company || "");
        setPhone(res.customer.phone || "");
        if (res.customer.address) {
          setStreet(res.customer.address.street);
          setZip(res.customer.address.zip);
          setCity(res.customer.address.city);
          setCountryCode(res.customer.address.country_code || "DE");
        }
      }
      setStep("address");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Fehler bei Verifizierung."); }
    finally { setLoading(false); }
  };

  // ─── Step 3: Submit order ──────────────────────────────────────────────
  const handleSubmitOrder = async () => {
    if (!firstName.trim() || !lastName.trim()) { setError("Vor- und Nachname sind Pflicht."); return; }
    if (!street.trim() || !zip.trim() || !city.trim()) { setError("Bitte vollständige Adresse eingeben."); return; }
    setLoading(true); setError(""); setStep("submitting");
    try {
      const orderItems: OrderItem[] = items.map((i) => ({
        ...(i.product.type === "bundle" ? { bunde_product_id: i.product.id } : { product_id: i.product.id }),
        quantity: i.quantity,
        include_deposit: i.product.deposit > 0,
      }));

      const res = await createOrder({
        email: email.trim(),
        login_code: code.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        company: company.trim() || undefined,
        phone: phone.trim() || undefined,
        street: street.trim(),
        zip: zip.trim(),
        city: city.trim(),
        country_code: countryCode,
        items: orderItems,
        include_shipping_cost: true,
        ref_code: refCode.trim() || undefined,
      });

      if (res.payment_url) {
        setPaymentUrl(res.payment_url);
        setStep("done");
        clearCart();
      } else {
        setError("Keine Zahlungs-URL erhalten.");
        setStep("address");
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Bestellung fehlgeschlagen."); setStep("address"); }
    finally { setLoading(false); }
  };

  // ─── Order Summary (shown in address step) ────────────────────────────
  const OrderSummary = () => (
    <div style={{ backgroundColor: "rgba(23,58,87,0.03)", borderRadius: "16px", padding: "20px", marginBottom: "24px", border: "1px solid rgba(23,58,87,0.06)" }}>
      <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.5 }}>Ihre Bestellung</div>
      {items.map((item) => (
        <div key={item.product.slug} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
          <span style={{ opacity: 0.8 }}>{item.quantity}× {item.product.name}</span>
          <span style={{ fontWeight: 600 }}>{fmt(item.product.retailer_price * item.quantity)}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid rgba(23,58,87,0.08)", marginTop: "12px", paddingTop: "12px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", opacity: 0.7 }}><span>Zwischensumme (netto)</span><span>{fmt(subtotal)}</span></div>
        {totalDeposit > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", opacity: 0.7 }}><span>Pfand</span><span>{fmt(totalDeposit)}</span></div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", opacity: 0.7 }}>
          <span>Versand ({VAT_RATES[countryCode]?.label || countryCode})</span>
          <span>{shippingLoading ? "..." : shippingForCountry > 0 ? fmt(shippingForCountry) : "Kostenfrei"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", opacity: 0.7 }}><span>MwSt. ({(vatRate * 100).toFixed(1)}%)</span><span>{fmt(vatAmount)}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "16px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(23,58,87,0.08)" }}><span>Gesamt (brutto)</span><span>{fmt(grossTotal)}</span></div>
      </div>
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(11,35,58,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, animation: "fadeUp 0.3s ease forwards" }}>
      <div style={{ backgroundColor: "#F0F4F8", borderRadius: "24px", maxWidth: step === "address" ? "700px" : "480px", width: "92%", maxHeight: "90vh", overflowY: "auto", color: "#173A57", boxShadow: "0 40px 80px rgba(0,0,0,0.4)", transition: "max-width 0.3s" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 32px 0" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Century Gothic','Jost',sans-serif" }}>
            {step === "email" && "Anmelden"}
            {step === "code" && "Code eingeben"}
            {step === "address" && "Bestellung abschließen"}
            {step === "submitting" && "Wird verarbeitet..."}
            {step === "done" && "Bestellung erstellt!"}
          </h2>
          <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(23,58,87,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
            <svg width="18" height="18" fill="none" stroke="#173A57" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ padding: "24px 32px 32px" }}>
          {/* Progress indicator */}
          {step !== "done" && step !== "submitting" && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
              {["email", "code", "address"].map((s, i) => (
                <div key={s} style={{ flex: 1, height: "4px", borderRadius: "2px", backgroundColor: ["email", "code", "address"].indexOf(step) >= i ? "#173A57" : "rgba(23,58,87,0.1)", transition: "background-color 0.3s" }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: "rgba(220,53,69,0.08)", color: "#dc3545", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", border: "1px solid rgba(220,53,69,0.15)" }}>{error}</div>
          )}

          {/* ── Step: Email ──────────────────────────────────────────── */}
          {step === "email" && (
            <>
              <p style={{ marginBottom: "24px", opacity: 0.7, fontSize: "15px", lineHeight: 1.6 }}>
                Geben Sie Ihre E-Mail-Adresse ein. Sie erhalten einen 6-stelligen Anmeldecode per E-Mail.
              </p>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>E-Mail-Adresse</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendCode()} placeholder="ihre@email.de" style={inputStyle} autoFocus />
              </div>
              <button className="btn" onClick={handleSendCode} disabled={loading} style={{ width: "100%", padding: "16px", fontSize: "16px", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Sende..." : "Code senden"}
              </button>
            </>
          )}

          {/* ── Step: Code ──────────────────────────────────────────── */}
          {step === "code" && (
            <>
              <p style={{ marginBottom: "24px", opacity: 0.7, fontSize: "15px", lineHeight: 1.6 }}>
                Wir haben einen 6-stelligen Code an <strong>{email}</strong> gesendet.
                {customerExists ? " Sie sind bereits als Kunde registriert." : " Sie werden als Neukunde angelegt."}
              </p>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Login-Code</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()} placeholder="000000" maxLength={6} style={{ ...inputStyle, textAlign: "center", fontSize: "28px", letterSpacing: "8px", fontWeight: 700 }} autoFocus />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-secondary" onClick={() => { setStep("email"); setError(""); }} style={{ flex: 1, padding: "14px" }}>Zurück</button>
                <button className="btn" onClick={handleVerifyCode} disabled={loading} style={{ flex: 2, padding: "14px", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Prüfe..." : "Bestätigen"}
                </button>
              </div>
            </>
          )}

          {/* ── Step: Address + Order Summary ───────────────────────── */}
          {step === "address" && (
            <>
              <OrderSummary />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Vorname *</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nachname *</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Firma</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Straße + Hausnr. *</label>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>PLZ *</label>
                  <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ort *</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Land *</label>
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {Object.entries(VAT_RATES).map(([cc, { label }]) => (
                      <option key={cc} value={cc}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Empfehlungscode (optional)</label>
                <input type="text" value={refCode} onChange={(e) => setRefCode(e.target.value)} placeholder="z.B. PARTNER123" style={inputStyle} />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-secondary" onClick={() => { setStep("code"); setError(""); }} style={{ flex: 1, padding: "14px" }}>Zurück</button>
                <button className="btn" onClick={handleSubmitOrder} disabled={loading} style={{ flex: 2, padding: "14px", fontSize: "16px" }}>
                  Zahlungspflichtig bestellen
                </button>
              </div>
            </>
          )}

          {/* ── Step: Submitting ─────────────────────────────────────── */}
          {step === "submitting" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: "48px", height: "48px", border: "4px solid rgba(23,58,87,0.1)", borderTopColor: "#173A57", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
              <p style={{ fontSize: "16px", opacity: 0.7 }}>Bestellung wird erstellt...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {/* ── Step: Done ───────────────────────────────────────────── */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "rgba(40,167,69,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="36" height="36" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>Bestellung erfolgreich!</h3>
              <p style={{ opacity: 0.7, fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>Sie werden jetzt zur Zahlung weitergeleitet.</p>
              <a href={paymentUrl} className="btn" style={{ display: "inline-flex", padding: "16px 40px", fontSize: "16px" }} rel="noopener">Jetzt bezahlen</a>
              <p style={{ marginTop: "16px", fontSize: "13px", opacity: 0.5 }}>
                Falls keine Weiterleitung erfolgt,{" "}
                <a href={paymentUrl} style={{ textDecoration: "underline" }}>hier klicken</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
