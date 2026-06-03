"use client";

import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";

const SPIEKERMANN_IMAGE =
"https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/eaeb261b-32ba-40e3-b728-8913f7e2151b-dr._sedat_spiekermann.jpg";

function CircularPortrait() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full text-cta-yellow/30"
        style={{ animation: "spin 60s linear infinite" }}
        aria-hidden>
        
        <circle
          cx="200"
          cy="200"
          r="195"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 9" />
        
      </svg>

      <div className="relative aspect-square w-[78%] overflow-hidden rounded-full border-4 border-cta-yellow/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] sm:w-[72%] lg:w-[78%]">
        <Image alt="Dr. med. Sedat Spiekermann"
        src={SPIEKERMANN_IMAGE}
        fill
        sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 80vw"
        className="object-cover object-top" />
        
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
            "linear-gradient(180deg, rgba(23,58,87,0) 60%, rgba(23,58,87,0.45) 100%)"
          }}
          aria-hidden />
        
      </div>

    </div>);

}

export function ExpertSpotlightSection() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="relative z-10 mx-auto max-w-[1300px] px-4 py-16 sm:py-20 lg:px-8 lg:py-28">
        <div className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <CircularPortrait />
          </div>

          <div className="lg:col-span-7">
            <SectionBadge className="mb-5" style={{ alignSelf: 'flex-start', marginLeft: 0, marginRight: 0 }}>
              Medizinischer Beirat
            </SectionBadge>

            <h2 className="font-gothic text-[26px] font-bold uppercase leading-[1.05] text-white sm:text-[34px] lg:text-[42px]">
              Dr. med. Sedat Spiekermann
            </h2>

            <p className="homenew-subheading mt-2 font-gothic text-[14px] text-white/55 sm:text-[15px]">
              Medizinische Osteopathie &amp; Integrative Schmerztherapie
            </p>

            <blockquote className="mt-4 sm:mt-5">
              <p className="font-gothic text-white text-base font-normal leading-snug italic rounded-none">
                „Entzündungen und oxidativer Stress gelten als zentrale Belastungen unseres modernen Körpers. Genau deshalb rückt molekularer Wasserstoff immer stärker in den Fokus der Wissenschaft.“
              </p>
            </blockquote>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <a
                href="/wasserstoff-erklaert"
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-cta-yellow px-6 py-3.5 font-gothic text-[13px] font-bold uppercase tracking-wide text-navy transition-colors hover:bg-[#f5e751] sm:text-[14px]">
                
                <Play className="h-3.5 w-3.5 fill-navy text-navy" strokeWidth={2.5} />
                Interview ansehen
              </a>
              <a
                href="/wasserstoffwasser-studien"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-gothic text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:border-white/50 hover:bg-white/5 sm:text-[14px]">
                
                Studien-Übersicht
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5} />
                
              </a>
            </div>

            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-cta-yellow/25 bg-cta-yellow/[0.06] p-5 sm:mt-10">
              <div className="flex-1">
                <p className="font-gothic text-[12px] font-bold uppercase tracking-[0.18em] text-cta-yellow sm:text-[13px]">
                  Live Q&amp;A · Monatlich
                </p>
                <p className="mt-1.5 font-gothic text-[14px] leading-relaxed text-white/80 sm:text-[15px]">
                  Stelle Dr. Spiekermann jeden Monat persönlich deine Fragen – kostenfrei in jedem AWAKE-Abo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>);

}
