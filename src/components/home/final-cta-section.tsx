"use client"

import { motion } from "motion/react"
import { Star } from "lucide-react"
import {
  FadeUp,
  TextReveal,
  GlowButton,
  CountUp,
  DrawLine,
} from "@/components/home/animations"

const particles = [
  { size: 3, left: "10%", delay: 0, duration: 16, opacity: 0.05 },
  { size: 4, left: "30%", delay: 2, duration: 14, opacity: 0.04 },
  { size: 3, left: "50%", delay: 1, duration: 18, opacity: 0.05 },
  { size: 2, left: "70%", delay: 3, duration: 15, opacity: 0.04 },
  { size: 3, left: "90%", delay: 1.5, duration: 17, opacity: 0.06 },
]

const stats = [
  { end: 300, suffix: "k+ AWAKE", delay: 0 },
  { end: 3000, suffix: "+ Kunden", prefix: "", delay: 150 },
  { label: "4.8 Bewertung", icon: true, delay: 300 },
]

function StatItem({
  stat,
}: {
  stat: (typeof stats)[number]
}) {
  if ("label" in stat && stat.label) {
    return (
      <FadeUp delay={stat.delay}>
        <span className="font-gothic text-[14px] sm:text-[16px] font-bold text-white/90 inline-flex items-center gap-1.5">
          {"icon" in stat && stat.icon && <Star className="w-4 h-4 fill-[#FDF277] text-[#FDF277]" />}
          {stat.label}
        </span>
      </FadeUp>
    )
  }

  return (
    <FadeUp delay={stat.delay}>
      <span className="font-gothic text-[14px] sm:text-[16px] font-bold text-white/90">
        <CountUp
          end={stat.end!}
          suffix={stat.suffix}
          prefix={stat.prefix}
          delay={stat.delay + 200}
          className="font-gothic"
        />
      </span>
    </FadeUp>
  )
}

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#173A57] py-16 sm:py-20 lg:py-28 px-4 lg:px-8 film-grain vignette">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: "-5%",
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -900],
            opacity: [p.opacity, p.opacity * 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FDF277]/[0.04] blur-3xl sm:w-[700px] sm:h-[700px]" />
        <div
          className="absolute top-1/2 left-1/2 w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full border-2 border-cta-yellow/10 animate-glow-ring"
          style={{
            boxShadow:
              "0 0 80px rgba(253,242,119,0.1), inset 0 0 80px rgba(253,242,119,0.05)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-awake-blue/10 animate-glow-ring"
          style={{
            animationDelay: "2s",
            boxShadow: "0 0 60px rgba(23,58,87,0.08)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[720px] text-center">
        <TextReveal>
          <h2 className="font-gothic text-[28px] font-bold mb-6 sm:text-[36px] lg:text-[44px] text-white">
            ERLEBE DEN{" "}
            <span
              className="animate-gradient-text font-rust"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #FDF277 30%, #173A57 50%, #FDF277 70%, #ffffff 100%)",
              }}
            >
              AWAKE
            </span>{" "}
            <span className="text-white">EFFEKT.</span>
          </h2>
        </TextReveal>

        <FadeUp delay={100}>
          <p className="font-gothic text-[14px] text-white/80 max-w-xl mx-auto mb-10 leading-relaxed sm:text-[16px] sm:mb-12">
            Starte noch heute mit deinem täglichen Wasserstoff-Ritual. Flexibles
            Abo, monatlich kündbar – inklusive H₂-Guide und Live-Q&A mit Dr.
            Spiekermann.
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <GlowButton className="rounded-full">
              <a
                href="/awake-dose"
                className="block w-full sm:w-auto bg-[#FDF277] text-navy font-gothic font-bold text-[14px] tracking-wide py-3.5 px-8 rounded-full cursor-pointer whitespace-nowrap text-center sm:text-[16px] sm:py-4 sm:px-10"
              >
                ZUR DOSE →
              </a>
            </GlowButton>

            <motion.div
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-full"
            >
              <a
                href="/glasflasche"
                className="block w-full sm:w-auto border border-white text-white font-gothic font-bold text-[14px] tracking-wide py-3.5 px-8 rounded-full cursor-pointer whitespace-nowrap text-center sm:text-[16px] sm:py-4 sm:px-10"
              >
                ZUR FLASCHE
              </a>
            </motion.div>
          </div>
        </FadeUp>

        <div className="mt-12 sm:mt-16">
          <DrawLine className="h-[1px] text-white/10 mb-8" delay={400} />
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <StatItem key={i} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
