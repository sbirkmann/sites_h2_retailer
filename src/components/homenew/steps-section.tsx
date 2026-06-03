"use client"

import { SectionBadge } from "@/components/shared/section-badge"

const steps = [
  {
    label: "Schritt 1",
    title: "Öffnen",
    desc: "Mit dem Öffnen der Dose setzt du die hochkonzentrierten Nanobubbles frei. Trinke AWAKE zeitnah, um die maximale Sättigung an molekularem Wasserstoff für deine Zellen zu nutzen.",
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9e776fe003e12a20a3478_ezgif-21672f52535b0d10.avif",
  },
  {
    label: "Schritt 2",
    title: "Trinken",
    desc: "Genieße AWAKE in kleinen Schlücken. Dank der minimalen Molekülgröße diffundiert der Wasserstoff sofort durch die Zellmembranen und erreicht direkt die Mitochondrien, um dort oxidativen Stress zu reduzieren.",
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9e7aaee3f548817662f83_ezgif-27745e663eae536f.avif",
  },
  {
    label: "Schritt 3",
    title: "Erlebe den AWAKE Effekt",
    desc: "Spüre die Wirkung auf dein Energielevel und deine mentale Klarheit. Durch die zelluläre Unterstützung etablierst du eine Routine, die deine Performance langfristig und ohne Koffein-Crash verbessert.",
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9e7da6f434198cff38c6f_ezgif-27416389b5219982.avif",
  },
]

export function StepsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto max-w-[1350px] px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14">
          <SectionBadge className="mb-4 self-center mx-auto">So geht&apos;s</SectionBadge>
          <h2 className="font-gothic text-[26px] font-bold uppercase leading-tight text-navy sm:text-[34px] lg:text-[42px]">
            So{" "}
            <span className="relative inline-block">
              einfach
            </span>{" "}
            kannst du die Vorteile von Wasserstoff­wasser für dich nutzen
          </h2>
          <p className="homenew-subheading mt-4 max-w-xl text-[14px] leading-relaxed text-navy/60 sm:text-[16px]">
            Leicht, praktisch und ready to go: AWAKE ist die einfachste Entscheidung deines Tages – für mehr Fokus, schnellere Erholung und echte Energie.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:mb-14 sm:grid-cols-2 sm:gap-7 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <div key={step.label} className="group flex flex-col">
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img alt={step.title}
                  src={step.img}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-start">
                <SectionBadge className="mb-4" style={{ alignSelf: 'flex-start', marginLeft: 0, marginRight: 0 }}>{step.label}</SectionBadge>
                <h3 className="mb-2 font-gothic text-[18px] font-bold leading-snug text-navy sm:text-[20px] lg:text-[22px]">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-navy/65 sm:text-[15px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="#angebot"
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-cta-yellow px-8 py-4 text-center font-gothic text-[15px] font-bold uppercase tracking-wide text-navy transition-all duration-300 hover:bg-[#f5e751] active:scale-95 min-w-[280px] sm:px-10 sm:text-[16px] sm:hover:scale-[1.03] sm:hover:shadow-[0_0_30px_rgba(253,242,119,0.4)]"
          >
            Jetzt AWAKE testen
          </a>
        </div>
      </div>
    </section>
  )
}
