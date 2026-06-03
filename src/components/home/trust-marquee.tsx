"use client"

import { motion } from "motion/react"
import { Shield, Droplets, FlaskConical, Leaf, Truck, Award } from "lucide-react"

const trustItems = [
  { icon: Award, label: "Made in Germany" },
  { icon: Droplets, label: "11+ PPM pro Liter" },
  { icon: FlaskConical, label: "1000+ Studien" },
  { icon: Leaf, label: "Ohne Koffein" },
  { icon: Shield, label: "Ohne Zucker" },
  { icon: Truck, label: "Kostenloser Versand" },
]

const doubled = [...trustItems, ...trustItems]

export function TrustMarquee() {
  return (
    <section className="relative overflow-hidden bg-awake-blue py-4 sm:py-5">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-transparent to-navy z-10 pointer-events-none" />
      <div className="group">
        <motion.div
          className="flex w-max gap-8 sm:gap-12 group-hover:[animation-play-state:paused]"
          style={{
            animation: "marquee-scroll 30s linear infinite",
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 shrink-0 px-2"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cta-yellow/15">
                <item.icon className="w-4 h-4 text-cta-yellow" strokeWidth={2} />
              </div>
              <span className="text-white/90 font-gothic text-[13px] sm:text-[14px] font-bold tracking-wide whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
