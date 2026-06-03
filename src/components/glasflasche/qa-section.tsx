"use client";

import { SectionBadge } from "@/components/shared/section-badge";
import { FadeUp, FadeLeft, FadeRight, PopIn, TextReveal } from "./animations";

export function QaSection() {
  const steps = [
    "Abonnenten senden ihre Fragen vor der Session.",
    "Dr. Spiekermann beantwortet ausgewählte Fragen live.",
    "Der letzte Teil ist für offene Fragen der Teilnehmer.",
  ];

  return (
    <section className="bg-[#FDF277] py-12 sm:py-16 lg:py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-[1350px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeLeft className="relative rounded-lg overflow-hidden aspect-[4/5] lg:aspect-square">
            <img alt="Dr. med. Spiekermann"
              src="https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bce68239e16d45f61fab33_dr.%20sedat%20spiekermann.avif"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12 text-white">
              <FadeUp delay={200}>
                <p className="text-[16px] font-medium leading-tight mb-4 sm:text-[20px] sm:mb-6 lg:text-[22px]">
                  &quot;Wasserstoff ist eines der vielversprechendsten Forschungsgebiete, wenn es um oxidativen Stress, Regeneration und Zellgesundheit geht.&quot;
                </p>
              </FadeUp>
              <FadeUp delay={300}>
                <h3 className="font-gothic font-bold text-[20px] mb-1">
                  Dr. med. Spiekermann
                </h3>
                <p className="text-[14px] text-gray-300">
                  Arzt für Medizinische Osteopathie & Integrative Schmerztherapie
                </p>
              </FadeUp>
            </div>
          </FadeLeft>

          <FadeRight className="flex flex-col text-[#173A57]">
            <div className="mb-6">
              <FadeUp delay={0}>
                <SectionBadge variant="pink" className="mb-6">EXKLUSIV FÜR UNSERE COMMUNITY</SectionBadge>
              </FadeUp>
              <TextReveal delay={50}>
                <h2 className="font-gothic text-[22px] font-bold text-[#333333] leading-tight mb-4 sm:text-[28px] sm:mb-6 lg:text-[36px]">
                  MONATLICHE LIVE-MEETINGS FÜR ABONNENTEN
                </h2>
              </TextReveal>
              <FadeUp delay={100}>
                <p className="text-[14px] font-medium mb-4">
                  Alle AWAKE-Abonnenten erhalten exklusiven Zugang zu einem 90-minütigen Live-Talk mit Dr. med. Spiekermann.
                </p>
              </FadeUp>
              <FadeUp delay={150}>
                <p className="text-[14px] font-medium">
                  Abonnenten können vorab Fragen einreichen. Während der Session beantwortet Dr. Spiekermann die relevantesten Themen zu Wasserstoff, Regeneration, Longevity und Gesundheit.
                </p>
              </FadeUp>
            </div>

            <div className="flex flex-col gap-6 mb-10">
              {steps.map((step, idx) => (
                <FadeUp key={idx} delay={200 + idx * 100} className="flex gap-4">
                  <PopIn delay={250 + idx * 100} className="w-10 h-10 shrink-0 bg-[#173A57] text-white rounded-full flex items-center justify-center font-bold text-[24px]">
                    {idx + 1}
                  </PopIn>
                  <div className="flex items-center">
                    <p className="text-[18px]">{step}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={500}>
              <a href="#angebot" className="bg-[#173A57] hover:bg-[#173A57] text-white font-bold text-[15px] py-3.5 rounded-full transition-all duration-300 w-full cursor-pointer active:scale-95 sm:py-4 sm:text-[21px] sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(23,58,87,0.4)] text-center inline-block">
                JETZT ABO WÄHLEN
              </a>
            </FadeUp>
          </FadeRight>
        </div>
      </div>
    </section>
  );
}
