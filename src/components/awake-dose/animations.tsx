"use client"

import { useInViewport, useParallax } from "@/hooks/use-scroll-animation"
import { useEffect, useRef, useState, type ReactNode } from "react"

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.15)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function FadeLeft({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.15)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-60px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function FadeRight({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.15)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(60px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function ScaleIn({
  children,
  className = "",
  delay = 0,
  onClick,
}: {
  children: ReactNode
  className?: string
  delay?: number
  onClick?: () => void
}) {
  const { ref, isVisible } = useInViewport(0.15)

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.6)",
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function PopIn({
  children,
  delay = 0,
  className = "",
  onClick,
}: {
  children: ReactNode
  delay?: number
  className?: string
  onClick?: () => void
}) {
  const { ref, isVisible } = useInViewport(0.15)

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.5)",
        transition: `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function BlurIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.1)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "blur(0px)" : "blur(12px)",
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease-out ${delay}ms, filter 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
        willChange: "filter, opacity, transform",
      }}
    >
      {children}
    </div>
  )
}

export function StaggerContainer({
  children,
  className = "",
  staggerMs = 100,
}: {
  children: ReactNode
  className?: string
  staggerMs?: number
}) {
  const { ref, isVisible } = useInViewport(0.1)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ["--stagger-ms" as string]: `${staggerMs}ms`,
        ["--visible" as string]: isVisible ? "1" : "0",
      }}
    >
      {children}
    </div>
  )
}

export function StaggerItem({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        opacity: "var(--visible, 0)",
        transform: "var(--visible, 0) === '1' ? 'translateY(0)' : 'translateY(30px)'",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--stagger-ms, 100ms) * ${index}), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--stagger-ms, 100ms) * ${index})`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  delay = 0,
  className = "",
}: {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.3)
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now() + delay
    const animate = (now: number) => {
      const elapsed = Math.max(0, now - startTime)
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration, delay])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}

export function ParallaxFloat({
  children,
  speed = 0.15,
  className = "",
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const { ref, offset } = useParallax(speed)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        transition: "transform 0.1s linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}

export function TextReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.2)

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
    >
      <div
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(110%)",
          transition: `transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function RotateIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.15)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "rotate(0deg) scale(1)" : "rotate(-8deg) scale(0.9)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}

export function SlideReveal({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode
  direction?: "left" | "right"
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useInViewport(0.15)
  const x = direction === "left" ? "-100%" : "100%"

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: isVisible ? "translateX(0)" : `translateX(${x})`,
          transition: `transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  )
}
