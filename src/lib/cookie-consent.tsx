"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react"

const STORAGE_KEY = "awake-cookie-consent-v1"

export type ConsentCategory = "essential" | "analytics" | "marketing"

export interface ConsentState {
  essential: boolean
  analytics: boolean
  marketing: boolean
  hasDecided: boolean
  timestamp?: number
}

const defaultConsent: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  hasDecided: false,
}

interface CookieConsentContextType {
  consent: ConsentState
  acceptAll: () => void
  acceptNecessary: () => void
  saveCustom: (prefs: Partial<ConsentState>) => void
  openSettings: () => void
  isOpen: boolean
  closeBanner: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null)

function loadConsent(): ConsentState {
  if (typeof window === "undefined") return defaultConsent
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ConsentState
      return { ...defaultConsent, ...parsed }
    }
  } catch {
    // ignore
  }
  return defaultConsent
}

function saveConsent(state: ConsentState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [consent, setConsent] = useState<ConsentState>(() => loadConsent())
  const [isOpen, setIsOpen] = useState(() => !loadConsent().hasDecided)

  const acceptAll = useCallback(() => {
    const state: ConsentState = {
      essential: true,
      analytics: true,
      marketing: true,
      hasDecided: true,
      timestamp: Date.now(),
    }
    setConsent(state)
    saveConsent(state)
    setIsOpen(false)
  }, [])

  const acceptNecessary = useCallback(() => {
    const state: ConsentState = {
      essential: true,
      analytics: false,
      marketing: false,
      hasDecided: true,
      timestamp: Date.now(),
    }
    setConsent(state)
    saveConsent(state)
    setIsOpen(false)
  }, [])

  const saveCustom = useCallback((prefs: Partial<ConsentState>) => {
    setConsent((prev) => {
      const state: ConsentState = {
        ...prev,
        ...prefs,
        essential: true,
        hasDecided: true,
        timestamp: Date.now(),
      }
      saveConsent(state)
      return state
    })
    setIsOpen(false)
  }, [])

  const openSettings = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeBanner = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        acceptAll,
        acceptNecessary,
        saveCustom,
        openSettings,
        isOpen,
        closeBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent(): CookieConsentContextType {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    )
  }
  return ctx
}
