"use client"

import { useState, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Cookie, ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { useCookieConsent } from "@/lib/cookie-consent"

export function CookieBanner() {
  const { consent, acceptAll, acceptNecessary, saveCustom, isOpen, closeBanner } =
    useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [analyticsChecked, setAnalyticsChecked] = useState(false)
  const [marketingChecked, setMarketingChecked] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted || !isOpen) return null

  const handleSaveCustom = () => {
    saveCustom({
      analytics: analyticsChecked,
      marketing: marketingChecked,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4"
        >
          <div className="mx-auto max-w-4xl rounded-xl border border-navy/10 bg-white/95 backdrop-blur-md shadow-[0_-8px_40px_rgba(23,58,87,0.12)]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/8">
                  <Cookie className="h-5 w-5 text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-gothic text-[16px] font-bold text-navy mb-1.5">
                    Wir verwenden Cookies
                  </h3>
                  <p className="font-gothic text-[13px] leading-relaxed text-navy/70 mb-4 max-w-xl">
                    Wir nutzen Cookies und ähnliche Technologien, um dir die beste
                    Erfahrung auf unserer Website zu bieten. Erforderliche Cookies
                    sind für den Betrieb der Seite notwendig. Mit deiner Zustimmung
                    verwenden wir zusätzlich Cookies für Analyse und Marketing.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <button
                      onClick={acceptAll}
                      className="cursor-pointer rounded-full bg-navy px-5 py-2.5 font-gothic text-[13px] font-bold text-white transition hover:bg-navy/90 active:scale-[0.98]"
                    >
                      Alle akzeptieren
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="cursor-pointer rounded-full border border-navy/20 px-5 py-2.5 font-gothic text-[13px] font-medium text-navy transition hover:bg-navy/5 active:scale-[0.98]"
                    >
                      Nur erforderliche
                    </button>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="cursor-pointer flex items-center gap-1 rounded-full px-3 py-2.5 font-gothic text-[13px] text-navy/70 transition hover:text-navy"
                    >
                      {showDetails ? (
                        <>
                          Weniger anzeigen <ChevronUp className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Details <ChevronDown className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                    <button
                      onClick={closeBanner}
                      aria-label="Schließen"
                      className="cursor-pointer ml-auto flex h-8 w-8 items-center justify-center rounded-full text-navy/40 transition hover:bg-navy/5 hover:text-navy/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-t border-navy/8 pt-4 space-y-3">
                      <CategoryRow
                        title="Erforderlich"
                        description="Diese Cookies sind für die grundlegende Funktionalität der Website notwendig und können nicht deaktiviert werden. Dazu gehören der Shop (Subbly), das Affiliate-Tracking (GoAffPro) und Sicherheitsfunktionen."
                        checked={true}
                        disabled={true}
                      />
                      <CategoryRow
                        title="Statistiken & Analyse"
                        description="Hilft uns zu verstehen, wie Besucher mit der Website interagieren, indem anonyme Informationen gesammelt werden."
                        checked={analyticsChecked}
                        disabled={false}
                        onChange={setAnalyticsChecked}
                      />
                      <CategoryRow
                        title="Marketing"
                        description="Werden verwendet, um Besuchern relevante Werbung anzuzeigen und die Effektivität von Marketingkampagnen zu messen."
                        checked={marketingChecked}
                        disabled={false}
                        onChange={setMarketingChecked}
                      />
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSaveCustom}
                          className="cursor-pointer rounded-full bg-navy px-5 py-2.5 font-gothic text-[13px] font-bold text-white transition hover:bg-navy/90 active:scale-[0.98]"
                        >
                          Auswahl speichern
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-navy/[0.03] p-3">
      <button
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition ${
          checked
            ? "border-navy bg-navy"
            : "border-navy/25 bg-white"
        } ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
        aria-label={title}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </button>
      <div className="min-w-0">
        <p className="font-gothic text-[13px] font-bold text-navy">{title}</p>
        <p className="font-gothic text-[12px] leading-relaxed text-navy/60 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  )
}
