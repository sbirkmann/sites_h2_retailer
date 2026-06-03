"use client"

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
} from "motion/react"
import { useEffect, useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react"

const springPreset = { stiffness: 80, damping: 22, mass: 0.8 }
const snappySpring = { stiffness: 200, damping: 28, mass: 0.5 }
const gentleSpring = { stiffness: 50, damping: 18, mass: 1 }

export function FadeUp({
  children,
  delay = 0,
  className = "",
  distance = 40,
}: {
  children: ReactNode
  delay?: number
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{
        ...springPreset,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: "-100%" }}
        transition={{
          ...snappySpring,
          delay: delay / 1000,
        }}
      >
        {children}
      </motion.div>
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{
        ...springPreset,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{
        ...springPreset,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{
        ...gentleSpring,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}

export function PopIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 0.6,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
      animate={isInView ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -8, scale: 0.9 }}
      transition={{
        ...springPreset,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)", y: 24 }}
      animate={
        isInView
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : { opacity: 0, filter: "blur(10px)", y: 24 }
      }
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "120%" }}
        animate={isInView ? { y: 0 } : { y: "120%" }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 0.8,
          delay: delay / 1000,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  staggerMs = 30,
}: {
  text: string
  className?: string
  delay?: number
  staggerMs?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const words = text.split(" ")

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="overflow-hidden inline-block mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotateX: 40 }}
            animate={isInView ? { y: 0, rotateX: 0 } : { y: "110%", rotateX: 40 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: delay / 1000 + wIdx * (staggerMs / 1000),
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
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
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now() + delay
    const animate = (now: number) => {
      const elapsed = Math.max(0, now - startTime)
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const overshoot = progress < 1 ? 0 : Math.sin((progress - 1) * Math.PI * 2) * 0.05
      setCount(Math.round((eased + overshoot) * end))
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(end)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration, delay])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ ...snappySpring, delay: delay / 1000 }}
    >
      {prefix}{count}{suffix}
    </motion.span>
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
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed])
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 })

  return (
    <motion.div ref={ref} className={className} style={{ y: smoothY }}>
      {children}
    </motion.div>
  )
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, snappySpring)
  const springY = useSpring(y, snappySpring)
  const rectCache = useRef<DOMRect | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (ref.current && window.innerWidth >= 768) {
      rectCache.current = ref.current.getBoundingClientRect()
    }
  }, [])

  const handleMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = rectCache.current
      if (!rect || window.innerWidth < 768) return
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * strength)
      y.set((e.clientY - centerY) * strength)
    },
    [x, y, strength],
  )

  const handleLeave = useCallback(() => {
    rectCache.current = null
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}

export function GlowButton({
  children,
  className = "",
  glowColor = "rgba(253,242,119,0.5)",
  fullWidth = false,
}: {
  children: ReactNode
  className?: string
  glowColor?: string
  fullWidth?: boolean
}) {
  return (
    <MagneticButton className={fullWidth ? "block" : "inline-block"} strength={0.2}>
      <motion.div
        className={`relative ${className}`}
        whileHover={{
          scale: 1.05,
          boxShadow: `0 0 30px ${glowColor}`,
        }}
        whileTap={{ scale: 0.96 }}
        transition={snappySpring}
      >
        {children}
      </motion.div>
    </MagneticButton>
  )
}

export function TiltCard({
  children,
  className = "",
  tiltAmount = 8,
}: {
  children: ReactNode
  className?: string
  tiltAmount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, snappySpring)
  const springRotateY = useSpring(rotateY, snappySpring)
  const rectCache = useRef<DOMRect | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (ref.current && window.innerWidth >= 768) {
      rectCache.current = ref.current.getBoundingClientRect()
    }
  }, [])

  const handleMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = rectCache.current
      if (!rect || window.innerWidth < 768) return
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const percentX = (e.clientX - centerX) / (rect.width / 2)
      const percentY = (e.clientY - centerY) / (rect.height / 2)
      rotateX.set(-percentY * tiltAmount)
      rotateY.set(percentX * tiltAmount)
    },
    [rotateX, rotateY, tiltAmount],
  )

  const handleLeave = useCallback(() => {
    rectCache.current = null
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}

export function FloatingElement({
  children,
  className = "",
  amplitude = 8,
  duration = 4,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}

const slideVariants = {
  enter: (d: number) => ({
    opacity: 0,
    x: d > 0 ? 300 : -300,
    scale: 0.95,
  }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d: number) => ({
    opacity: 0,
    x: d > 0 ? -300 : 300,
    scale: 0.95,
  }),
}

export function SlidePresence({
  children,
  activeKey,
  direction = 1,
  className = "",
}: {
  children: ReactNode
  activeKey: string | number
  direction?: number
  className?: string
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={activeKey}
        className={className}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 28,
          mass: 0.8,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function DrawLine({
  className = "",
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-full bg-current"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: delay / 1000,
        }}
      />
    </div>
  )
}

export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[3px] bg-cta-yellow z-[100] origin-left ${className}`}
      style={{ scaleX }}
    />
  )
}

export function StaggerChildren({
  children,
  className = "",
  staggerMs = 100,
}: {
  children: ReactNode
  className?: string
  staggerMs?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerMs / 1000,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function ShimmerImage({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export function HoverLift({
  children,
  className = "",
  lift = -8,
}: {
  children: ReactNode
  className?: string
  lift?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: lift,
        transition: snappySpring,
      }}
    >
      {children}
    </motion.div>
  )
}
