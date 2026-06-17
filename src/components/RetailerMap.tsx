"use client";

import { useEffect, useRef, useState } from "react";
import type Leaflet from "leaflet";

interface Retailer {
  id: number;
  info_name: string;
  info_tel: string | null;
  info_website: string | null;
  info_retaileraddress?: string | null;
  show_address?: boolean;
  map_lat: number;
  map_lng: number;
}

export default function RetailerMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let active = true;
    let map: L.Map | null = null;

    const initMap = async () => {
      try {
        // Load Leaflet dynamically to avoid SSR window-is-not-defined errors
        const L = (await import("leaflet")).default as typeof Leaflet;

        // Fetch retailers from the API
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://h2vitaldash.x900.3az.de/api";
        const res = await fetch(`${apiBase}/get_retailer`);
        if (!res.ok) throw new Error("Fehler beim Laden der Händlerdaten");
        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Ungültiges Datenformat erhalten");
        }

        const retailers = json.data as Retailer[];

        if (!active) return;

        const container = mapRef.current;
        if (!container || "_leaflet_id" in container) {
          // Map container is already initialized!
          return;
        }

        // Clear loading state
        setLoading(false);

        // Center of Germany
        map = L.map(container, {
          center: [51.1657, 10.4515],
          zoom: 5.5,
          scrollWheelZoom: false, // Prevent zoom-scroll hijacking
        });

        // Add premium light map style tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(map);

        // Custom premium SVG Pin Icon
        const svgIcon = `
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C10.4772 2 6 6.47715 6 12C6 19.5 16 30 16 30C16 30 26 19.5 26 12C26 6.47715 21.5228 2 16 2Z" fill="#173A57" stroke="#ffffff" stroke-width="2"/>
            <circle cx="16" cy="12" r="5" fill="#FDF277"/>
          </svg>
        `;

        const customIcon = L.divIcon({
          html: svgIcon,
          className: "custom-map-pin",
          iconSize: [36, 36],
          iconAnchor: [18, 34],
          popupAnchor: [0, -36],
        });

        // Render markers
        retailers.forEach((r) => {
          if (!r.map_lat || !r.map_lng) return;

          const marker = L.marker([r.map_lat, r.map_lng], { icon: customIcon }).addTo(map!);

          // Design premium popup card
          let popupContent = `
            <div class="custom-popup-content">
              <h4 class="popup-title">${r.info_name}</h4>
          `;

          if (r.show_address && r.info_retaileraddress) {
            popupContent += `
              <div class="popup-item align-start">
                <span class="icon">📍</span>
                <span class="address-text">${r.info_retaileraddress}</span>
              </div>
              <div class="popup-item">
                <span class="icon">🚗</span>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.info_retaileraddress)}" target="_blank" rel="noopener noreferrer" class="popup-link highlight">Route planen</a>
              </div>
            `;
          }

          if (r.info_tel) {
            popupContent += `
              <div class="popup-item">
                <span class="icon">📞</span>
                <a href="tel:${r.info_tel}" class="popup-link">${r.info_tel}</a>
              </div>
            `;
          }

          if (r.info_website) {
            let url = r.info_website;
            if (!/^https?:\/\//i.test(url)) {
              url = `https://${url}`;
            }
            popupContent += `
              <div class="popup-item">
                <span class="icon">🌐</span>
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="popup-link highlight">Website besuchen</a>
              </div>
            `;
          }

          popupContent += `</div>`;

          marker.bindPopup(popupContent);
        });

      } catch (err) {
        if (!active) return;
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Map initialization failed:", err);
        setError(errorMessage || "Karte konnte nicht geladen werden.");
        setLoading(false);
      }
    };

    initMap();

    return () => {
      active = false;
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-navy/10 shadow-md bg-[#f5f4ef]">
      {/* Leaflet CSS CDN */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />

      {/* Inline styling to customize default Leaflet design to AWAKE brand guidelines */}
      <style>{`
        .custom-popup-content {
          padding: 8px 4px;
          color: #173A57;
          min-width: 180px;
        }
        .popup-title {
          font-family: var(--font-century-gothic), sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          margin: 0 0 10px 0;
          border-bottom: 1px solid rgba(23, 58, 87, 0.1);
          padding-bottom: 6px;
          color: #173A57;
        }
        .popup-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 12px;
          font-family: var(--font-century-gothic), sans-serif;
        }
        .popup-item.align-start {
          align-items: flex-start;
        }
        .address-text {
          word-break: break-word;
          line-height: 1.4;
        }
        .popup-item:last-child {
          margin-bottom: 0;
        }
        .popup-link {
          color: #173A57;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .popup-link:hover {
          color: #2563EB;
        }
        .popup-link.highlight {
          color: #173A57;
          text-decoration: underline;
          text-decoration-color: #FDF277;
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }
        .popup-link.highlight:hover {
          color: #2563EB;
          text-decoration-color: #2563EB;
        }
        
        /* Overwrite default leaflet popup styles */
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          border-radius: 16px !important;
          border: 1px solid rgba(23, 58, 87, 0.08) !important;
          box-shadow: 0 10px 30px -10px rgba(23, 58, 87, 0.2) !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #173A57 !important;
          padding: 8px 8px 0 0 !important;
          font-size: 16px !important;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #ef4444 !important;
          background: transparent !important;
        }
        
        /* Keep pin style clean */
        .custom-map-pin {
          background: none !important;
          border: none !important;
        }
        .custom-map-pin svg {
          filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.15));
          transition: transform 0.2s ease;
        }
        .custom-map-pin:hover svg {
          transform: scale(1.1);
        }
      `}</style>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-navy/30" style={{ borderTopColor: "#173A57" }} />
            <p className="font-gothic text-xs text-navy/50">Händlerkarte wird geladen…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-4 text-center z-[1000]">
          <div className="max-w-xs">
            <p className="font-gothic text-sm font-bold text-navy mb-1">Fehler beim Laden</p>
            <p className="font-gothic text-xs text-navy/60">{error}</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "400px", height: "100%" }} />
    </div>
  );
}
