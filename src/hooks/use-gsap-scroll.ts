"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function isMobile() {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}

const defaultScrollTriggerConfig = {
  fastScrollEnd: true,
  preventOverlaps: true,
}

export function useScrollParallax<T extends HTMLElement>(
  speed: number = 0.3,
  direction: "y" | "x" = "y",
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isMobile()) return

    const distance = 100 * speed
    const prop = direction === "y" ? { y: distance } : { x: distance }
    const propFrom = direction === "y" ? { y: -distance } : { x: -distance }

    const ctx = gsap.context(() => {
      gsap.fromTo(el, propFrom, {
        ...prop,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          ...defaultScrollTriggerConfig,
        },
      })
    })

    return () => ctx.revert()
  }, [speed, direction])

  return ref
}

export function useScrollFade<T extends HTMLElement>(
  startOpacity: number = 1,
  endOpacity: number = 0,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isMobile()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: startOpacity },
        {
          opacity: endOpacity,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
            ...defaultScrollTriggerConfig,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [startOpacity, endOpacity])

  return ref
}

export function useScrollScale<T extends HTMLElement>(
  startScale: number = 1,
  endScale: number = 0.85,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isMobile()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: startScale },
        {
          scale: endScale,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
            ...defaultScrollTriggerConfig,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [startScale, endScale])

  return ref
}

export function useScrollReveal<T extends HTMLElement>(
  options: {
    y?: number
    x?: number
    opacity?: number
    scale?: number
    rotation?: number
    duration?: number
    delay?: number
    start?: string
  } = {},
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 80,
      x = 0,
      opacity = 0,
      scale = 1,
      rotation = 0,
      duration = 1.2,
      delay = 0,
      start = "top 85%",
    } = options

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y,
          x,
          opacity,
          scale,
          rotation,
        },
        {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
            ...defaultScrollTriggerConfig,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [options])

  return ref
}

export function useScrollScrub<T extends HTMLElement>(
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  triggerOptions: {
    start?: string
    end?: string
  } = {},
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isMobile()) return

    const { start = "top bottom", end = "bottom top" } = triggerOptions

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        ...toVars,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
          ...defaultScrollTriggerConfig,
        },
      })
    })

    return () => ctx.revert()
  }, [fromVars, toVars, triggerOptions])

  return ref
}

export { gsap, ScrollTrigger }
