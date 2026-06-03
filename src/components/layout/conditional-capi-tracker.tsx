"use client"

import { useSyncExternalStore } from "react"
import { useCookieConsent } from "@/lib/cookie-consent"
import { CapiTracker } from "@/lib/capi-tracker"

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function ConditionalCapiTracker() {
  const { consent } = useCookieConsent()
  const isClient = useIsClient()

  if (!isClient) return null
  if (!consent.marketing) return null

  return <CapiTracker />
}
