"use client";

import { SectionBadge } from "@/components/shared/section-badge";
import { FadeUp, PopIn, TextReveal } from "./animations";

export function StepsSection() {
  const steps = [
    {
      num: "1",
      label: "Schritt 1",
      title: "Öffnen",
      desc: "Mit dem Öffnen der Dose setzt du die hochkonzentrierten Nanobubbles frei. Trinke AWAKE zeitnah, um die maximale Sättigung an molekularem Wasserstoff für deine Zellen zu nutzen.",
      img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9e776fe003e12a20a3478_ezgif-21672f52535b0d10.avif",
    },
    {
      num: "2",
      label: "Schritt 2",
      title: "Trinken",
      desc: "Genieße AWAKE in kleinen Schlücken. Dank der minimalen Molekülgröße diffundiert der Wasserstoff sofort durch die Zellmembranen und erreicht direkt die Mitochondrien, um dort oxidativen Stress zu reduzieren.",
      img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9e7aaee3f548817662f83_ezgif-27745e663eae536f.avif",
    },
    {
      num: "3",
      label: "Schritt 3",
      title: "Erlebe den AWAKE Effekt",
      desc: "Spüre die Wirkung auf dein Energielevel und deine mentale Klarheit. Durch die zelluläre Unterstützung etablierst du eine Routine, die deine Performance langfristig und ohne Koffein-Crash verbessert.",
      img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9e7da6f434198cff38c6f_ezgif-27416389b5219982.avif",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 lg:px-8 bg-white">
      <div className="mx-auto max-w-[1350px]">
        <div className="text-center mb-10 sm:mb-16">
          <TextReveal>
            <h2 className="font-gothic text-[24px] font-bold text-[#173A57] mb-4 uppercase sm:text-[30px] lg:text-[36px]">
              So einfach geht&apos;s
            </h2>
          </TextReveal>
          <FadeUp delay={100}>
            <p className="text-[14px] text-[#173A57] max-w-lg mx-auto">
              Leicht, praktisch und ready to go: AWAKE in der Dose ist dein perfekter Hydration-Boost für zuhause &amp; unterwegs.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 mb-12 sm:mb-16">
          {steps.map((step, idx) => (
            <PopIn key={step.num} delay={idx * 150} className="flex flex-col group">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden mb-6">
                <img src={step.img} alt={step.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex flex-col items-start">
                <SectionBadge className="mb-4">
                  {step.label}
                </SectionBadge>
                <h3 className="font-gothic font-bold text-[20px] text-[#173A57] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#173A57] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </PopIn>
          ))}
        </div>

        <FadeUp delay={400} className="flex justify-center">
          <a href="#angebot" className="bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[15px] py-3.5 px-6 rounded-full transition-all duration-300 w-full cursor-pointer active:scale-95 sm:py-4 sm:px-8 sm:text-[21px] sm:w-auto sm:min-w-[320px] sm:px-12 sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(253,242,119,0.4)] text-center inline-block">
            Jetzt Abo wählen
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
