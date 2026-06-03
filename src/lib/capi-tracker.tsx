"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { sendCapiEvent } from "@/lib/capi"

declare global {
  interface Window {
    trackPurchase?: (value: number, currency: string, orderId: string) => void
    trackAddToCart?: (productId: string | number, value?: number, currency?: string) => void
    _capiLastProductId?: string | number | null
  }
}

function CapiTrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastWidgetVisible = useRef(false)
  const stripeBtn = useRef<Element | null>(null)
  const stripeHandler = useRef<(() => void) | null>(null)
  const confirmBtn = useRef<Element | null>(null)
  const confirmHandler = useRef<(() => void) | null>(null)
  const btnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const confirmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    sendCapiEvent("PageView")
  }, [pathname, searchParams])

  useEffect(() => {
    window.trackPurchase = (value, currency, orderId) => {
      sendCapiEvent("Purchase", { value, currency, order_id: orderId })
    }

    window.trackAddToCart = (productId, value, currency) => {
      window._capiLastProductId = productId
      sendCapiEvent("AddToCart", { product_id: productId, value, currency })
    }

    return () => {
      delete window.trackPurchase
      delete window.trackAddToCart
    }
  }, [])

  useEffect(() => {
    function cleanupStripe() {
      if (stripeHandler.current && stripeBtn.current) {
        stripeBtn.current.removeEventListener("click", stripeHandler.current)
      }
      stripeBtn.current = null
      stripeHandler.current = null
      if (btnIntervalRef.current) {
        clearInterval(btnIntervalRef.current)
        btnIntervalRef.current = null
      }
    }

    function cleanupConfirm() {
      if (confirmHandler.current && confirmBtn.current) {
        confirmBtn.current.removeEventListener("click", confirmHandler.current)
      }
      confirmBtn.current = null
      confirmHandler.current = null
      if (confirmIntervalRef.current) {
        clearInterval(confirmIntervalRef.current)
        confirmIntervalRef.current = null
      }
    }

    function startStripeInterval(widget: Element) {
      if (btnIntervalRef.current) return
      btnIntervalRef.current = setInterval(() => {
        const btn = widget.querySelector(".StripeCardElement button")
        if (btn && btn !== stripeBtn.current) {
          if (stripeHandler.current && stripeBtn.current) {
            stripeBtn.current.removeEventListener("click", stripeHandler.current)
          }
          const handler = () => sendCapiEvent("AddPaymentInfo")
          btn.addEventListener("click", handler)
          stripeBtn.current = btn
          stripeHandler.current = handler
          if (btnIntervalRef.current) clearInterval(btnIntervalRef.current)
          btnIntervalRef.current = null
        }
      }, 300)
    }

    function startConfirmInterval() {
      if (confirmIntervalRef.current) return
      confirmIntervalRef.current = setInterval(() => {
        const btn = Array.from(
          document.querySelectorAll('button[class*="_StepConfirm__container_"]')
        ).find((b) => b.className.includes("_StepConfirm__container_"))
        if (btn && btn !== confirmBtn.current) {
          if (confirmHandler.current && confirmBtn.current) {
            confirmBtn.current.removeEventListener("click", confirmHandler.current)
          }
          const handler = () => {
            if (!btn.className.includes("--disabled")) {
              sendCapiEvent("Purchase", {
                product_id: window._capiLastProductId ?? null,
              })
            }
          }
          btn.addEventListener("click", handler)
          confirmBtn.current = btn
          confirmHandler.current = handler
        }
        if (!btn && confirmBtn.current && confirmHandler.current) {
          confirmBtn.current.removeEventListener("click", confirmHandler.current)
          confirmBtn.current = null
          confirmHandler.current = null
        }
      }, 700)
    }

    const widgetPoll = setInterval(() => {
      const widget = document.querySelector(".SubblyAppWidget")
      let isVisible = false
      if (widget) {
        const style = window.getComputedStyle(widget)
        isVisible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0"
        if (!isVisible) {
          isVisible = (widget as HTMLElement).offsetParent !== null
        }
      }

      if (isVisible && !lastWidgetVisible.current) {
        cleanupStripe()
        cleanupConfirm()
        startStripeInterval(widget!)
        startConfirmInterval()
      }

      if (!isVisible && lastWidgetVisible.current) {
        cleanupStripe()
        cleanupConfirm()
      }

      lastWidgetVisible.current = isVisible
    }, 700)

    return () => {
      clearInterval(widgetPoll)
      cleanupStripe()
      cleanupConfirm()
    }
  }, [])

  return null
}

export function CapiTracker() {
  return (
    <Suspense>
      <CapiTrackerInner />
    </Suspense>
  )
}
