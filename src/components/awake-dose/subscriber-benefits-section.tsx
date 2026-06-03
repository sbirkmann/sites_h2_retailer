"use client";

import { SectionBadge } from "@/components/shared/section-badge"
import { FadeUp, PopIn, BlurIn, TextReveal } from "./animations";

export function SubscriberBenefitsSection() {
  const benefits = [
    {
      alt: "AWAKE Monatsvorrat",
      desc: "Dein Monatsvorrat an AWAKE direkt an deine Haustür geliefert. Entwickelt für die tägliche Anwendung und eine konstante Routine.",
      image: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bbffa7ebfaae1ab4225aac_trinken_awake_dose%20(7).avif",
      list: ["30 Dosen pro Monat", "Rabattiertes Upgrade auf 60 Dosen möglich", "Direkt nach Hause geliefert"]
    },
    {
      alt: "AWAKE H2 Guide",
      desc: "Unser Großer H2-Guide erklärt, was molekularer Wasserstoff ist, was die Forschung dazu sagt und wie du AWAKE optimal in deinen Alltag integrierst.",
      image: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc0d8dd312dbafcf68e8e8_guide_awake_dose%20(1).avif",
      list: ["Exklusives H2-Wissen", "Wissenschaftliche Studien über Wasserstoff", "Anwendungs-Tipps und mehr"]
    },
    {
      alt: "Dr. med. Spiekermann",
      desc: "90 Minuten Wissen rund um Gesundheit, Longevity und molekularen Wasserstoff – inklusive offener Fragerunde, in der du deine Fragen direkt stellen kannst.",
      image: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bce68239e16d45f61fab33_dr.%20sedat%20spiekermann.avif",
      list: ["Nur für die AWAKE Community", "Stelle deine Fragen, direkt an einen Arzt", "Mit Dr. med. Spiekermann"]
    }
  ];

  return (
    <section className="bg-[#173A57] py-12 sm:py-16 lg:py-24 px-4 lg:px-8 text-white relative overflow-hidden">

      
      <div className="mx-auto max-w-[1350px] relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <BlurIn>
            <SectionBadge className="mb-4 sm:mb-6">
              Deine Abo-Vorteile
            </SectionBadge>
          </BlurIn>
          <TextReveal delay={50}>
            <h2 className="font-gothic text-[24px] font-bold mb-4 text-white sm:text-[30px] lg:text-[36px]">
              EXKLUSIVES BUNDLE ANGEBOT
            </h2>
          </TextReveal>
          <FadeUp delay={100}>
            <p className="text-white max-w-2xl mx-auto text-[14px]">
              Mit deinem AWAKE-Abo sicherst du dir Premium-Wasserstoffwasser, exklusives H2-Wissen und den direkten Kontakt zu unserem medizinischen Partner.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8 mb-12 sm:mb-16">
          {benefits.map((benefit, idx) => (
            <PopIn key={idx} delay={idx * 150} className="bg-transparent border border-[#C3C9CD] rounded-lg overflow-hidden flex flex-col h-full group sm:hover:-translate-y-2 hover:border-[#FDF277]/50 transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img src={benefit.image} alt={benefit.alt} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1 items-center text-center">
                <p className="text-[16px] text-white leading-relaxed mb-6">
                  {benefit.desc}
                </p>
                <div className="flex flex-col gap-2.5">
                  {benefit.list.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#FDF277] flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-[#173A57]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span className="text-[14px] font-bold text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PopIn>
          ))}
        </div>

        <FadeUp delay={400} className="flex justify-center">
          <a href="#angebot" className="bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[15px] py-3.5 px-6 rounded-full transition-all duration-300 w-full cursor-pointer active:scale-95 sm:py-4 sm:px-8 sm:text-[21px] sm:w-auto sm:min-w-[320px] sm:px-12 sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(253,242,119,0.4)] text-center">
            JETZT ABO WÄHLEN
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
