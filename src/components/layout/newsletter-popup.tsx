"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { X, Loader2, Check } from "lucide-react"
import Image from "next/image"

const STORAGE_KEY = "newsletter-popup-dismissed"
const SHOW_DELAY_MS = 8000

const POPUP_IMAGE =
  "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/2fce2515-7bb7-4788-bde7-d180ff39f48c-lifestyle-2.jpeg"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    const timer = setTimeout(() => {
      setIsOpen(true)
    }, SHOW_DELAY_MS)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !consent) return

    setStatus("submitting")

    try {
      const res = await fetch("https://h2vitaldash.x900.3az.de/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: true }),
      })

      if (res.ok) {
        setStatus("success")
        localStorage.setItem(STORAGE_KEY, Date.now().toString())
        setTimeout(() => setIsOpen(false), 2500)
      } else {
        setStatus("idle")
      }
    } catch {
      setStatus("idle")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-popup-title"
        >
          <button
            type="button"
            aria-label="Schließen"
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-[900px] rounded-lg overflow-hidden shadow-[0_30px_80px_-20px_rgba(23,58,87,0.45)] bg-white font-gothic"
          >
            <button
              type="button"
              aria-label="Schließen"
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-navy transition-colors hover:bg-white hover:text-navy/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy shadow-sm"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 md:px-10 md:py-12">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-6"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="w-7 h-7 text-emerald-600" strokeWidth={2.5} />
                    </div>
                    <p className="text-navy font-bold text-[20px] text-center">
                      Vielen Dank!
                    </p>
                    <p className="text-navy/60 text-[15px] text-center leading-relaxed">
                      Dein 15€ Rabattcode ist unterwegs.<br />Schau in dein E-Mail Postfach.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h2
                      id="newsletter-popup-title"
                      className="text-[28px] sm:text-[32px] font-bold leading-[1.1] text-navy mb-5"
                    >
                      15€ geschenkt -
                      <br />
                      Dein Start mit
                      <br />
                      AWAKE!
                    </h2>

                    <p className="text-[15px] text-navy/80 leading-relaxed mb-4">
                      Du willst mehr Energie, mehr Fokus und ein besseres Körpergefühl. Dann ist jetzt der perfekte Moment:
                    </p>

                    <p className="text-[15px] text-navy/80 leading-relaxed mb-3">
                      Sichere Dir jetzt 15€ Rabatt auf Deine erste Bestellung des revolutionären Wasserstoff-Drinks AWAKE - Natürlich. Innovativ. Voller Power.
                    </p>

                    <p className="text-[13px] text-navy/50 font-medium mb-6">
                      Nur für kurze Zeit & nur für Neukunden
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="newsletter-email"
                          className="block font-gothic text-[14px] font-medium text-navy mb-1.5"
                        >
                          E-Mail Adresse
                        </label>
                        <input
                          id="newsletter-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Deine E-Mail Adresse"
                          className="w-full rounded-md border border-navy/15 bg-white px-4 py-3 font-gothic text-[15px] text-navy placeholder:text-navy/35 outline-none transition focus:border-navy/40 focus:ring-2 focus:ring-navy/8"
                        />
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-navy/30 bg-white transition group-hover:border-navy/50">
                          <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          <span
                            className={`h-3 w-3 rounded-sm bg-navy transition ${
                              consent ? "scale-100" : "scale-0"
                            }`}
                          />
                          <Check
                            className={`absolute h-3 w-3 text-cta-yellow transition ${
                              consent ? "scale-100" : "scale-0"
                            }`}
                            strokeWidth={3.5}
                          />
                        </span>
                        <span className="font-gothic text-[12px] leading-[1.5] text-navy/65">
                          Ich habe die{" "}
                          <a
                            href="/privacy"
                            className="font-medium text-navy underline underline-offset-2 hover:text-awake-blue transition-colors"
                          >
                            Datenschutzerklärung
                          </a>{" "}
                          gelesen und stimme der Verarbeitung meiner Daten zu.
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={status === "submitting" || !consent}
                        className="w-full cursor-pointer rounded-full bg-cta-yellow px-6 py-4 font-gothic text-[16px] font-bold text-navy shadow-[0_8px_24px_rgba(253,242,119,0.35)] transition hover:shadow-[0_12px_32px_rgba(253,242,119,0.5)] hover:bg-[#f5e751] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-[0_8px_24px_rgba(253,242,119,0.35)]"
                      >
                        {status === "submitting" ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Wird gesendet...
                          </span>
                        ) : (
                          "Jetzt 15€ Rabatt sichern"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>

              <div className="relative hidden md:block">
                <Image alt="AWAKE Lifestyle"
                  src={POPUP_IMAGE}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 0vw"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
