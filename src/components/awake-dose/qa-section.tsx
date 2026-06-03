"use client";

import { SectionBadge } from "@/components/shared/section-badge";
import { FadeUp, FadeLeft, FadeRight, PopIn, TextReveal } from "./animations";

const VIDEO_THUMBNAILS = [
  "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9b0bacd76a4148f04ac4b_soeren-schumann_full.avif",
  "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/67e6aec0ba1857a826d1e636_Marvin%20Alberg%20(1).webp",
  "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69c117ee281f92db5f1d27eb_sabine-awake.avif",
];

export function QaSection() {
  return (
    <section className="bg-[#FDF277] py-12 sm:py-16 lg:py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-[1350px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeLeft className="flex flex-col gap-6">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5] lg:aspect-square">
              <img alt="Dr. med. Spiekermann"
                src="https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bce68239e16d45f61fab33_dr.%20sedat%20spiekermann.avif"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12 text-white">
                <FadeUp delay={300}>
                  <h3 className="font-gothic font-bold text-[20px] mb-1">
                    Dr. med. Spiekermann
                  </h3>
                  <p className="text-[14px] text-gray-300">
                    Arzt für Medizinische Osteopathie & Integrative Schmerztherapie
                  </p>
                </FadeUp>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {VIDEO_THUMBNAILS.map((thumb, idx) => (
                <PopIn key={idx} delay={200 + idx * 100} className="relative rounded-lg overflow-hidden aspect-video">
                  <img alt={`Video ${idx + 1}`}
                    src={thumb}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center sm:w-12 sm:h-12">
                      <svg className="w-4 h-4 text-[#173A57] ml-0.5 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </PopIn>
              ))}
            </div>
          </FadeLeft>

          <FadeRight className="flex flex-col text-[#173A57]">
            <div className="mb-6">
              <FadeUp delay={0}>
                <SectionBadge variant="pink" className="mb-6">EXKLUSIV FÜR UNSERE COMMUNITY</SectionBadge>
              </FadeUp>
              <TextReveal delay={50}>
                <h2 className="font-gothic text-[22px] font-bold text-[#333333] leading-tight mb-4 sm:text-[28px] sm:mb-6 lg:text-[36px]">
                  Monatliche Live-Meetings
                </h2>
              </TextReveal>
              <FadeUp delay={100}>
                <p className="text-[14px] font-medium mb-4">
                  Jeden Monat bekommst du als Teil der AWAKE Community Zugang zu einem exklusiven Live-Talk mit Dr. med. Sedat Spiekermann.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={500}>
              <a href="#angebot" className="bg-[#173A57] hover:bg-[#173A57] text-white font-bold text-[15px] py-3.5 rounded-full transition-all duration-300 w-full cursor-pointer active:scale-95 sm:py-4 sm:text-[21px] sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(23,58,87,0.4)] text-center inline-block">
                Jetzt Abo wählen
              </a>
            </FadeUp>
          </FadeRight>
        </div>
      </div>
    </section>
  );
}
