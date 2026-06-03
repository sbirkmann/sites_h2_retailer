"use client"

import Image from "next/image"
import { Atom, ShieldCheck, Microscope, ArrowRight, type LucideIcon } from "lucide-react"
import {
  FloatingElement,
} from "@/components/home/animations"
import { SectionBadge } from "@/components/shared/section-badge"

const calloutImage =
  "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/7e5201f6-40f7-4119-97cb-8e98d2e1999e-flasche-und-dose-awake.png"

const smokeBgImage =
  "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/46042c05-0e70-4f5c-8643-8991b07c639c-download.png"

type BasicItem = {
  icon: LucideIcon
  title: string
  text: string
}

const items: BasicItem[] = [
  {
    icon: Atom,
    title: "Das kleinste Molekül der Welt",
    text: "H₂ ist das kleinste Molekül im Universum. Dadurch gelangt es mühelos durch Zellmembranen und wirkt direkt dort, wo es gebraucht wird – in jeder einzelnen Zelle deines Körpers.",
  },
  {
    icon: ShieldCheck,
    title: "Selektives Antioxidans",
    text: "H₂ neutralisiert gezielt die schädlichsten freien Radikale (Hydroxyl-Radikale) – und lässt die nützlichen Antioxidantien in Ruhe. Das macht ihn einzigartig unter allen bekannten Antioxidantien.",
  },
  {
    icon: Microscope,
    title: "3.000+ Studien seit 2007",
    text: "Molekularer Wasserstoff ist eines der meistuntersuchten Antioxidantien der letzten 20 Jahre. In Japan wird er bereits klinisch eingesetzt. AWAKE bringt diese Technologie nach Deutschland.",
  },
]

function BasicCard({ item, index }: { item: BasicItem; index: number }) {
  const Icon = item.icon
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-navy/10 bg-off-white p-6 shadow-[0_2px_14px_rgba(23,58,87,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-navy/15 hover:shadow-[0_10px_30px_rgba(23,58,87,0.1)] sm:p-7 lg:p-8">
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-[3px] rounded-full bg-gradient-to-r from-transparent via-cta-yellow to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#173A57] shadow-[0_6px_18px_-6px_rgba(23,58,87,0.45)]">
          <div
            className="pointer-events-none absolute inset-0 -m-1 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle, rgba(253,242,119,0.4) 0%, rgba(253,242,119,0) 70%)",
            }}
          />
          <Icon className="relative h-6 w-6 text-cta-yellow" strokeWidth={2} />
        </div>
        <h3 className="font-gothic text-[18px] font-bold leading-snug text-navy sm:text-[20px] lg:text-[22px]">
          {item.title}
        </h3>
      </div>
      <p className="font-gothic text-[14px] leading-relaxed text-navy/65 sm:text-[15px]">
        {item.text}
      </p>
    </div>
  )
}

function CalloutBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy p-6 shadow-[0_10px_40px_-12px_rgba(23,58,87,0.4)] sm:p-8 lg:p-10">
      <img
        src={smokeBgImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-40"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(253,242,119,0.18) 0%, rgba(253,242,119,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:text-left">
        <div className="max-w-xl lg:flex-1">
          <p className="font-gothic text-[19px] font-bold leading-[1.4] text-white sm:text-[22px] lg:text-[24px]">
            Genau deswegen haben wir Wasserstoffwasser in{" "}
            <span className="text-cta-yellow">Dosen und Flaschen</span> abgefüllt, sodass du die vielen positive Effekte für dich nutzen kannst.
          </p>
          <p className="mt-3 font-gothic text-[15px] leading-[1.55] text-white/70 sm:text-[16px] lg:text-[17px]">
            Willst du mehr wissen? Navigiere auf unsere Erklär-Seite und erfahre alles über Wasserstoff.
          </p>
        </div>

        <div className="relative flex h-[200px] w-[240px] shrink-0 items-center justify-center sm:h-[240px] sm:w-[300px] lg:h-[280px] lg:w-[340px]">
          <div
            className="pointer-events-none absolute inset-0 -m-4 rounded-full opacity-80 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(253,242,119,0.22) 0%, rgba(253,242,119,0) 70%)",
            }}
          />
          <div className="relative rotate-[8deg] transition-transform duration-500 hover:rotate-[4deg] hover:scale-[1.04]">
            <Image
              alt="AWAKE Flasche und Dose"
              src={calloutImage}
              width={640}
              height={640}
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 300px, 240px"
              className="h-[200px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] sm:h-[240px] lg:h-[280px]"
            />
          </div>
        </div>

        <a
          href="/h2-wissen/wasserstoffwasser-allgemein"
          className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-cta-yellow px-6 py-3.5 font-gothic text-[14px] font-bold uppercase tracking-wide text-navy transition-transform hover:scale-[1.03] sm:text-[15px]"
        >
          Hier erfährst du mehr über H₂
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
        </a>
      </div>
    </div>
  )
}

export function BasicsSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
      <div className="relative z-10 mx-auto max-w-[1350px] px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <SectionBadge className="mb-4 self-center mx-auto">Grundlagen</SectionBadge>
          <h2 className="font-gothic text-[26px] font-bold uppercase leading-tight text-navy sm:text-[34px] lg:text-[42px]">
            Was ist{" "}
            <span className="relative inline-block">
              Wasserstoff-Wasser
            </span>{" "}
            eigentlich?
          </h2>
          <p className="homenew-subheading mt-4 max-w-xl text-[14px] leading-relaxed text-navy/60 sm:text-[16px]">
            In 30 Sekunden verstanden – ohne Chemie-Studium.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 lg:gap-7">
          {items.map((item, idx) => (
            <BasicCard key={item.title} item={item} index={idx} />
          ))}
        </div>

        <div className="mt-12 lg:mt-14">
          <CalloutBanner />
        </div>
      </div>
    </section>
  )
}
