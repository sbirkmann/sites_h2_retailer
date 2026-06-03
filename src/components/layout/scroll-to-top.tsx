"use client"

import { useEffect } from "react"

export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  return null
}
