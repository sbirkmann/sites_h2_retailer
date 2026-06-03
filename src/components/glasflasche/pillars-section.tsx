"use client";

import { FadeUp, FadeLeft, FadeRight, PopIn, TextReveal, ParallaxFloat } from "./animations";

export function PillarsSection() {
  const leftPillars = [
    {
      number: "1",
      title: "~ 11 ppm Wasserstoff",
      desc: "Molekularer Wasserstoff ist das Kernelement von AWAKE. Mit bis zu 11 ppm bietet es eine wissenschaftlich fundierte Dosierung für dein Wohlbefinden.",
    },
    {
      number: "2",
      title: "Sofort trinkfertig",
      desc: "Kein Mischen, kein Warten. Einfach öffnen und trinken – genau dann, wenn du es brauchst.",
    },
    {
      number: "3",
      title: "Qualität & Kontrolle",
      desc: "Jede Charge wird streng laborgeprüft – für garantierte Reinheit und eine sichere, hochwertige Anwendung.",
    },
  ];

  const rightPillars = [
    {
      number: "4",
      title: "Tägliches Ritual",
      desc: "Konsistenz ist der Schlüssel. AWAKE lässt sich nahtlos in deinen Alltag integrieren – für langfristige Unterstützung und ein stabiles Energielevel.",
    },
    {
      number: "5",
      title: "Hergestellt in Deutschland",
      desc: "Höchste Standards. AWAKE wird unter strengsten Qualitätsrichtlinien in Deutschland gefertigt.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 lg:px-8 bg-[#F5F5F5] relative overflow-hidden">
      <div className="mx-auto max-w-[1350px]">
        <div className="text-center mb-10 sm:mb-16 relative z-10">
          <TextReveal>
            <h2 className="font-gothic text-[26px] font-bold text-[#173A57] mb-4 sm:text-[30px] lg:text-[36px]">
              5 SÄULEN VON AWAKE
            </h2>
          </TextReveal>
          <FadeUp delay={100}>
            <p className="text-[14px] text-[#173A57] max-w-lg mx-auto">
              Was AWAKE ausmacht - 5 zentrale Säulen, die Qualität, Innovation und Alltag miteinander verbinden.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-[35%] z-10">
            {leftPillars.map((pillar, idx) => (
              <FadeLeft key={pillar.number} delay={idx * 150} className="flex justify-center">
                <div className="relative bg-white border border-[#C3C9CD] rounded-lg p-5 sm:p-6 lg:p-8 text-center z-10 sm:hover:-translate-y-2 sm:hover:shadow-lg transition-all duration-300 w-full max-w-[376px] min-h-[180px] lg:h-[206px] flex flex-col items-center justify-center">
                  <PopIn delay={idx * 200} className="absolute -left-4 -top-4 w-9 h-9 rounded-full bg-[#173A57] text-white flex items-center justify-center text-[20px] font-bold z-20 sm:-left-5 sm:-top-5 sm:w-10 sm:h-10 sm:text-[24px]">
                    {pillar.number}
                  </PopIn>
                  <h3 className="font-gothic font-bold text-[22px] text-[#333333] mb-2 sm:text-[26px] sm:mb-3">{pillar.title}</h3>
                  <p className="text-[13px] text-[#173A57] leading-relaxed sm:text-[14px]">
                    {pillar.desc}
                  </p>
                </div>
              </FadeLeft>
            ))}
          </div>

          <PopIn delay={200} className="hidden w-full max-w-[300px] lg:block lg:w-[30%] relative z-0">
            <ParallaxFloat speed={0.12}>
              <div className="relative aspect-[1/2] w-full">
                <img alt="AWAKE Wasserstoffwasser Glasflasche"
                  src="https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69db4f360c3cdb165a1054a5_flasche-awake.avif"
                  className="w-full h-full object-contain"
                />
              </div>
            </ParallaxFloat>
          </PopIn>

          <div className="flex flex-col justify-center gap-6 lg:gap-8 w-full lg:w-[35%] z-10">
            {rightPillars.map((pillar, idx) => (
              <FadeRight key={pillar.number} delay={idx * 150} className="flex justify-center">
                <div className="relative bg-white border border-[#C3C9CD] rounded-lg p-5 sm:p-6 lg:p-8 text-center z-10 sm:hover:-translate-y-2 sm:hover:shadow-lg transition-all duration-300 w-full max-w-[376px] min-h-[180px] lg:h-[206px] flex flex-col items-center justify-center">
                  <PopIn delay={300 + idx * 200} className="absolute -left-4 -top-4 w-9 h-9 rounded-full bg-[#173A57] text-white flex items-center justify-center text-[20px] font-bold z-20 sm:-left-5 sm:-top-5 sm:w-10 sm:h-10 sm:text-[24px]">
                    {pillar.number}
                  </PopIn>
                  <h3 className="font-gothic font-bold text-[22px] text-[#333333] mb-2 sm:text-[26px] sm:mb-3">{pillar.title}</h3>
                  <p className="text-[14px] text-[#173A57] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </FadeRight>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
