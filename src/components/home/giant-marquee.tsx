"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

const words = [
  { text: "AWAKE", filled: true },
  { text: "•", filled: false },
  { text: "WASSERSTOFF", filled: false },
  { text: "•", filled: false },
  { text: "POWER", filled: true },
  { text: "•", filled: false },
  { text: "H₂", filled: false },
  { text: "•", filled: false },
  { text: "AWAKE", filled: false },
  { text: "•", filled: false },
  { text: "WASSERSTOFF", filled: true },
  { text: "•", filled: false },
  { text: "POWER", filled: false },
  { text: "•", filled: false },
  { text: "H₂", filled: true },
  { text: "•", filled: false },
]

const doubled = [...words, ...words]

export function GiantMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"])

  return (
    <section ref={ref} className="relative overflow-hidden bg-awake-blue py-8 sm:py-10 lg:py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy opacity-40" />
      </div>

      <motion.div className="flex items-center gap-6 sm:gap-10 w-max" style={{ x }}>
        {doubled.map((word, i) => (
          <span
            key={i}
            className={`font-rust text-[80px] sm:text-[120px] lg:text-[160px] xl:text-[200px] leading-none whitespace-nowrap tracking-wider select-none ${
              word.text === "•"
                ? "text-cta-yellow/40 text-[40px] sm:text-[60px] lg:text-[80px]"
                : word.filled
                  ? "text-cta-yellow"
                  : "text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.15)]"
            }`}
          >
            {word.text}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
