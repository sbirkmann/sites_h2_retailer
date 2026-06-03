"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FadeUp, FadeLeft, FadeRight, BlurIn, PopIn } from "./animations";

// Icon components matching the live site
function EnergyIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13,2 5,13 11,13 11,22 19,11 13,11" fill="none"></polygon>
    </svg>
  );
}

function BrainIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20 C12 20 5 17 5 11 C5 8 6.5 6 8.5 5.5 C8.5 4 9.5 3 11 3 C11.5 3 12 3.2 12 3.2"></path>
      <path d="M12 3.2 C12 3.2 12.5 3 13 3 C14.5 3 15.5 4 15.5 5.5 C17.5 6 19 8 19 11 C19 17 12 20 12 20"></path>
      <line x1="12" y1="3.2" x2="12" y2="20" strokeDasharray="1.5 2" strokeWidth="1"></line>
      <path d="M7 10 C8 9 9.5 9.5 9 11" strokeWidth="1.2"></path>
      <path d="M7.5 14 C8.5 13 10 13.5 9.5 15" strokeWidth="1.2"></path>
      <path d="M17 10 C16 9 14.5 9.5 15 11" strokeWidth="1.2"></path>
      <path d="M16.5 14 C15.5 13 14 13.5 14.5 15" strokeWidth="1.2"></path>
    </svg>
  );
}

function DumbbellIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="8.5" y1="12" x2="15.5" y2="12"></line>
      <rect x="4" y="9" width="2.5" height="6" rx="1"></rect>
      <rect x="1.5" y="10" width="2.5" height="4" rx="1"></rect>
      <rect x="17.5" y="9" width="2.5" height="6" rx="1"></rect>
      <rect x="20" y="10" width="2.5" height="4" rx="1"></rect>
    </svg>
  );
}

function SmileyIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9"></circle>
      <circle cx="9" cy="10" r="0.8" fill={stroke} stroke="none"></circle>
      <circle cx="15" cy="10" r="0.8" fill={stroke} stroke="none"></circle>
      <path d="M8.5 14.5 Q12 17.5 15.5 14.5" fill="none"></path>
    </svg>
  );
}

function ShieldIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2 L20 5.5 L20 11 C20 15.5 16.5 19.5 12 21.5 C7.5 19.5 4 15.5 4 11 L4 5.5 Z" fill="none"></path>
      <polygon points="12,7 13.2,10.5 17,10.5 14,12.7 15.2,16.2 12,14 8.8,16.2 10,12.7 7,10.5 10.8,10.5" fill="none" strokeWidth="1"></polygon>
    </svg>
  );
}

function MicrobiomeIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 4 C15.5 4 19 7 19 11 C19 15.5 16 19.5 12 20 C8 19.5 5 15.5 5 11 C5 7 8.5 4 12 4 Z"></path>
      <circle cx="12" cy="11.5" r="3"></circle>
      <path d="M17.5 7 C19 5.5 21 5 21 3" strokeWidth="1.2"></path>
      <path d="M16 4.5 C17 3 17.5 1.5 16.5 1" strokeWidth="1.2"></path>
      <path d="M7 5.5 C5.5 4 4.5 2 5.5 1" strokeWidth="1.2"></path>
      <circle cx="9" cy="15" r="0.7" fill={stroke} stroke="none"></circle>
      <circle cx="14.5" cy="15.5" r="0.7" fill={stroke} stroke="none"></circle>
      <circle cx="8.5" cy="8.5" r="0.5" fill={stroke} stroke="none"></circle>
    </svg>
  );
}

function MoonIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z" fill="none"></path>
      <line x1="17" y1="4" x2="17" y2="5.5" strokeWidth="1.2"></line>
      <line x1="16.25" y1="4.75" x2="17.75" y2="4.75" strokeWidth="1.2"></line>
      <line x1="20" y1="7" x2="20" y2="8.5" strokeWidth="1.2"></line>
      <line x1="19.25" y1="7.75" x2="20.75" y2="7.75" strokeWidth="1.2"></line>
    </svg>
  );
}

function CocktailIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 3 L12 13 L20 3 Z" fill="none"></path>
      <line x1="12" y1="13" x2="12" y2="20"></line>
      <line x1="8" y1="20" x2="16" y2="20"></line>
      <line x1="19" y1="7" x2="19" y2="11"></line>
      <line x1="17" y1="9" x2="21" y2="9"></line>
    </svg>
  );
}

function ClockPlaneIcon({ className, stroke = "#7d7d7d" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="13" r="8" fill="none"></circle>
      <line x1="11" y1="13" x2="11" y2="8.5"></line>
      <line x1="11" y1="13" x2="14.5" y2="15"></line>
      <path d="M18 3 L21 5 L17 7 L16 6 Z" fill="none" strokeWidth="1.2"></path>
      <line x1="17" y1="7" x2="15" y2="9" strokeWidth="1.2"></line>
    </svg>
  );
}

const IMPACTS = [
  {
    name: "Energie im Alltag",
    title: "NACHHALTIGE VITALITÄT",
    description:
      "Genieße ein stabiles Energielevel über den ganzen Tag – ohne das typische „Nachmittagstief“. AWAKE unterstützt deine Wachheit auf sanfte Weise und sorgt für spürbare Ausgeglichenheit, ganz ohne die Schwankungen herkömmlicher Wachmacher.",
    Icon: EnergyIcon,
  },
  {
    name: "Fokus & Klarheit",
    title: "MENTALE KLARHEIT",
    description:
      "Verabschiede dich von mentaler Trägheit und genieße einen klaren, messerscharfen Fokus. AWAKE unterstützt dich bei anspruchsvollen Aufgaben mit natürlicher Performance – für kognitive Bestleistung ganz ohne das Zittern künstlicher Aufputschmittel.",
    Icon: BrainIcon,
  },
  {
    name: "Sport & Regeneration",
    title: "SCHNELLER REGENERIEREN",
    description:
      "Optimiere deine Erholungsphasen und starte schneller wieder durch. H2 AWAKE unterstützt dich dabei, nach intensiven Einheiten spürbar frisch zu bleiben und deine Ausdauer auf natürlichem Weg zu begleiten.",
    Icon: DumbbellIcon,
  },
  {
    name: "Stimmung & Wohlbefinden",
    title: "TIEFE BALANCE VON INNEN HERAUS",
    description:
      "Stärke deine innere Ausgeglichenheit und bleib auch bei Stress souverän. AWAKE unterstützt dein allgemeines Wohlbefinden und sorgt für eine harmonische Balance im Alltag.",
    Icon: SmileyIcon,
  },
  {
    name: "Zellschutz & Anti-Aging",
    title: "DER JUNGBRUNNEN AUF ZELLEBENE",
    description:
      "H₂ ist dein innovativer Begleiter für eine bewusste Routine. Es zielt darauf ab, dein natürliches Gleichgewicht zu unterstützen und fördert so ein vitales, strahlendes Hautbild. Ein Plus für dein tägliches Wohlbefinden.",
    Icon: ShieldIcon,
  },
  {
    name: "Darm & Mikrobiom",
    title: "HARMONIE IM BAUCH",
    description:
      "H2 kann ein positives Milieu für nützliche Mikroorganismen begünstigen und so die natürliche Balance deines Mikrobioms unterstützen. Ein gepflegtes inneres Ökosystem trägt maßgeblich zu deinem allgemeinen Wohlbefinden und einem starken Immunsystem bei.",
    Icon: MicrobiomeIcon,
  },
  {
    name: "Schlaf & Erholung",
    title: "ERHOLSAME NÄCHTE",
    description:
      "H2 kann dazu beitragen, das allgemeine Wohlbefinden am Abend zu fördern und die natürliche Entspannungsfähigkeit des Körpers zu unterstützen. Durch die Begünstigung erholsamer Ruhephasen kannst du morgens mit einem Gefühl von Frische und neuer Kraft in den Tag starten.",
    Icon: MoonIcon,
  },
  {
    name: "Lifestyle & Kater",
    title: "LIFESTYLE PROTECTION",
    description:
      "H2 kann die körpereigenen Regenerationsprozesse nach geselligen Abenden unterstützen und hilft dabei, schneller wieder in die gewohnte Form zu finden. Er unterstützt den Stoffwechsel dabei, tägliche Einflüsse effizient zu verarbeiten und die natürliche Vitalität zu bewahren.",
    Icon: CocktailIcon,
  },
  {
    name: "Jetlag & innere Uhr",
    title: "SANFTE BALANCE",
    description:
      "Molekularer Wasserstoff kann den Körper dabei unterstützen, sich harmonischer an neue Tagesrhythmen anzupassen und Belastungen durch Zeitumstellungen abzufedern. Er trägt dazu bei, das innere Gleichgewicht auch bei Reisen über verschiedene Zeitzonen hinweg aufrechtzuerhalten.",
    Icon: ClockPlaneIcon,
  },
];

const slideVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const slideTransition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export function ImpactSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  function handlePrev() {
    setActiveIndex((prev) => (prev - 1 + IMPACTS.length) % IMPACTS.length);
  }

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % IMPACTS.length);
  }

  const active = IMPACTS[activeIndex];
  const ActiveIcon = active.Icon;

  return (
    <section className="pt-10 bg-[#F5F5F5] overflow-hidden relative sm:pt-12 lg:pt-24">
      <div className="text-center mb-4 relative z-10 px-4 lg:mb-6">
        <BlurIn>
          <h2 className="font-gothic text-[24px] font-bold mb-4 text-[#173A57] uppercase sm:text-[30px] lg:text-[36px]">
            1 RITUAL, 9 WIRKBEREICHE.
          </h2>
        </BlurIn>
        <FadeUp delay={100}>
          <p className="text-[#173A57] max-w-lg mx-auto text-sm">
            Molekularer Wasserstoff wirkt nicht nur an einer Stelle – er unterstützt deinen Körper auf zellulärer Ebene, von der Energie am Morgen bis zur Erholung in der Nacht.
          </p>
        </FadeUp>
      </div>

      <div className="flex flex-col gap-6 px-4 lg:hidden">
        <FadeUp className="flex flex-wrap gap-2 justify-center">
          {IMPACTS.map((impact, index) => {
            const IconComponent = impact.Icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-bold border transition-colors cursor-pointer sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "bg-[#173A57] text-white border-[#173A57]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#173A57]"
                }`}
              >
                <IconComponent className="w-4 h-4" stroke={isActive ? "#ffffff" : "#7d7d7d"} />
                <span>{impact.name}</span>
              </button>
            );
          })}
        </FadeUp>

        <FadeUp delay={150} className="relative rounded-lg p-6 text-white sm:p-8 overflow-hidden">
          <img src="https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/ab78a853-5ed2-459c-b304-33e5312c14d9-Ellipse_18.png" alt="" className="absolute top-0 left-[10%] -translate-x-1/2 h-full w-auto max-w-none" />
          <div className="relative z-10">
            <div className="mt-4 w-12 h-12 border-2 border-white rounded-lg flex items-center justify-center mb-5 sm:mt-0">
              <ActiveIcon className="w-6 h-6" stroke="#ffffff" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                <h3 className="font-gothic font-bold text-2xl mb-3 sm:text-3xl uppercase">{active.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-3">
              <button onClick={handlePrev} className="w-11 h-11 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={handleNext} className="w-11 h-11 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="relative w-full h-[500px] hidden lg:block">
        <div className="relative h-full mx-auto max-w-[1200px]">
          <svg viewBox="0 -60 1200 540" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" className="absolute bottom-0 -right-[320px] h-[450px] w-[1000px]">
            <ellipse cx="520" cy="520" rx="640" ry="530" fill="#173A57" />
          </svg>

        <PopIn className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] z-20">
          <img src="https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/e9d3b4be-3080-4219-9f7e-b5d894a2a367-AWAKE.png" alt="AWAKE Can" className="w-full h-auto drop-shadow-2xl" />
        </PopIn>

        <FadeLeft className="absolute -left-12 bottom-8 w-[480px] z-30 pointer-events-auto hidden lg:block">
          <div className="flex flex-wrap gap-2">
            {IMPACTS.map((impact, index) => {
              const IconComponent = impact.Icon;
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#173A57] text-white border-[#173A57]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#173A57]"
                  }`}
                >
                  <IconComponent className="w-4 h-4" stroke={isActive ? "#ffffff" : "#7d7d7d"} />
                  <span>{impact.name}</span>
                </button>
              );
            })}
          </div>
        </FadeLeft>

        <FadeRight className="absolute -right-4 bottom-8 w-[380px] text-white z-30 pointer-events-auto hidden lg:block">
          <div className="flex flex-col gap-3">
            <div className="w-11 h-11">
              <ActiveIcon className="w-full h-full" stroke="#ffffff" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="flex flex-col gap-2"
              >
                <h3 className="font-gothic text-[28px] font-bold uppercase">{active.title}</h3>
                <p className="text-white text-sm leading-relaxed">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-8 justify-center pointer-events-auto">
              <button onClick={handlePrev} className="hover:opacity-70 transition-opacity cursor-pointer">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.3906 20.3125L5.07813 13L12.3906 5.6875M6.09375 13L20.9219 13" stroke="#FDF277" strokeWidth="2.4375" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <button onClick={handleNext} className="hover:opacity-70 transition-opacity cursor-pointer">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.6094 5.6875L20.9219 13L13.6094 20.3125M19.9062 13L5.07813 13" stroke="#FDF277" strokeWidth="2.4375" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
        </FadeRight>
        </div>
      </div>
    </section>
  );
}
