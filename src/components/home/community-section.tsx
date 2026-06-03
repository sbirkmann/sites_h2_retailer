"use client"

import { motion } from "motion/react"
import { FadeUp, TextReveal, BlurIn } from "@/components/home/animations"
import { SectionBadge } from "@/components/shared/section-badge"

const videos = [
  { id: "4b1aa0", src: "https://streamable.com/l/4b1aa0/mp4.mp4" },
  { id: "uw55ha", src: "https://streamable.com/l/uw55ha/mp4.mp4" },
  { id: "2jr0kc", src: "https://streamable.com/l/2jr0kc/mp4.mp4" },
  { id: "r0tmxq", src: "https://streamable.com/l/r0tmxq/mp4.mp4" },
  { id: "2ugsg9", src: "https://streamable.com/l/2ugsg9/mp4.mp4" },
  { id: "8bdzyy", src: "https://streamable.com/l/8bdzyy/mp4.mp4" },
]

function VideoMarquee() {
  // Duplicate videos multiple times for seamless infinite scroll
  const duplicatedVideos = [...videos, ...videos, ...videos, ...videos]

  return (
    <div className="relative w-full overflow-hidden group">
      <motion.div
        className="flex gap-4"
        animate={{
          x: [0, -(480 + 16) * videos.length * 2],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 70,
            ease: "linear",
          },
        }}
        whileHover={{
          transition: { duration: 0.3 }
        }}
        style={{
          willChange: "transform",
        }}
      >
        {duplicatedVideos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            className="relative flex-shrink-0 w-[320px] sm:w-[400px] lg:w-[480px] aspect-video rounded-lg overflow-hidden bg-gray-100"
          >
            <video
              src={video.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function CommunitySection() {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F5] py-12 sm:py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-[1350px] px-4 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <BlurIn>
            <SectionBadge className="mb-4 sm:mb-6">
              Community
            </SectionBadge>
          </BlurIn>
          <TextReveal>
            <h2 className="font-gothic text-[24px] font-bold text-[#173A57] mb-4 sm:text-[30px] lg:text-[36px] uppercase">
              TAUSENDE VERTRAUEN AUF AWAKE
            </h2>
          </TextReveal>
          <FadeUp delay={100}>
            <p className="font-gothic text-[14px] text-[#173A57]/70 max-w-xl mx-auto sm:text-[16px]">
              Athleten, Biohacker, Gesundheitsbewusste – sie alle trinken AWAKE
            </p>
          </FadeUp>
        </div>
      </div>

      <VideoMarquee />
    </section>
  )
}
