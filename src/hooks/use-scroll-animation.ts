"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useInViewport(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function cacheElementPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    height: rect.height,
    windowHeight: window.innerHeight,
  }
}

export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const rafId = useRef<number>(0)
  const cache = useRef({ top: 0, height: 0, windowHeight: 0 })
  const isVisible = useRef(false)
  const isMobileRef = useRef(false)

  const updateCache = useCallback(() => {
    const element = ref.current
    if (!element) return
    isMobileRef.current = window.innerWidth < 768
    const pos = cacheElementPosition(element)
    cache.current = pos
  }, [])

  const handleScroll = useCallback(() => {
    if (!isVisible.current) return
    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      if (isMobileRef.current) {
        setOffset(0)
        return
      }
      const { top, height, windowHeight } = cache.current
      const scrollY = window.scrollY
      const elementCenter = top + height / 2 - scrollY
      const viewportCenter = windowHeight / 2
      const distance = elementCenter - viewportCenter
      setOffset(distance * speed)
    })
  }, [speed])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    updateCache()

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting
        if (entry.isIntersecting) {
          handleScroll()
        }
      },
      { threshold: 0, rootMargin: "200px" }
    )
    observer.observe(element)

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateCache, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateCache)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll, updateCache])

  return { ref, offset }
}

export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const rafId = useRef<number>(0)
  const cache = useRef({ top: 0, height: 0, windowHeight: 0 })
  const isVisible = useRef(false)

  const updateCache = useCallback(() => {
    const element = ref.current
    if (!element) return
    const pos = cacheElementPosition(element)
    cache.current = pos
  }, [])

  const handleScroll = useCallback(() => {
    if (!isVisible.current) return
    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      const { top, height, windowHeight } = cache.current
      const scrollY = window.scrollY
      const totalTravel = windowHeight + height
      const traveled = windowHeight - (top - scrollY)
      const p = Math.max(0, Math.min(1, traveled / totalTravel))
      setProgress(p)
    })
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    updateCache()

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting
        if (entry.isIntersecting) {
          handleScroll()
        }
      },
      { threshold: 0, rootMargin: "200px" }
    )
    observer.observe(element)

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateCache, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateCache)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll, updateCache])

  return { ref, progress }
}
