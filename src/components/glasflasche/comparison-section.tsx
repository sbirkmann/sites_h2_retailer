"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeRight, BlurIn, TextReveal } from "./animations";

const BG_IMAGE = "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/46042c05-0e70-4f5c-8643-8991b07c639c-download.png";
const FLASCHE_IMAGE = "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69db4f360c3cdb165a1054a5_flasche-awake.avif";

const AWAKE_DATA = {
  h2Konzentration: "~ 11 ppm",
  reinheit: "100% rein - keine chemische Belastung",
  stabilitaet: "Sehr stabil dank Nanobubble-Technologie",
  antioxidante: "Sehr hoch, da extrem viel H2",
  bioverfuegbarkeit: "Extrem hoch",
  komfort: "Sofort trinkfertig - zuhause und unterwegs",
};

const COMPETITORS = [
  {
    name: "H2-GENERATOREN",
    h2Konzentration: "< 3 ppm",
    reinheit: { value: "Risiko von Ozon, Chlor & PFAS", missing: true },
    stabilitaet: "Makrobubbles - extrem flüchtig",
    antioxidante: "Gering, da wenig H2",
    bioverfuegbarkeit: "Sehr gering",
    komfort: "Aufladen, warten, herstellen",
  },
  {
    name: "H2-TABLETTEN",
    h2Konzentration: "Inkonsistent",
    reinheit: { value: "Enthält schädliche Magnesium-Metalle", missing: true },
    stabilitaet: "Makrobubbles - extrem flüchtig",
    antioxidante: "Gering, da wenig H2",
    bioverfuegbarkeit: "Sehr gering",
    komfort: "Mehrere Komponenten nötig",
  },
  {
    name: "ENERGY DRINKS",
    h2Konzentration: "0 ppm",
    reinheit: { value: "Hoher Zuckergehalt, künstliches Koffein", missing: true },
    stabilitaet: "Nicht zutreffend",
    antioxidante: "Nicht zutreffend",
    bioverfuegbarkeit: "Nicht zutreffend",
    komfort: "Aufmachen und trinken",
  },
  {
    name: "NORMALES WASSER",
    h2Konzentration: "0 ppm",
    reinheit: "Je nach Anbieter unterschiedlich",
    stabilitaet: "Nicht zutreffend",
    antioxidante: "Nicht zutreffend",
    bioverfuegbarkeit: "Nicht zutreffend",
    komfort: "Aufmachen und trinken",
  },
];

const slideVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const slideTransition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export function ComparisonSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const competitor = COMPETITORS[selectedIndex];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 lg:px-8 bg-white">
      <div className="mx-auto max-w-[1350px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <BlurIn className="lg:col-span-3 flex flex-col justify-center">
            <TextReveal>
              <h2 className="font-gothic text-[26px] text-[#333333] mb-4 sm:mb-6 leading-[1.1] font-bold sm:text-[30px] lg:text-[36px]">
                AWAKE im<br />Vergleich.
              </h2>
            </TextReveal>
            <p className="text-[14px] text-[#173A57] leading-relaxed">
              Nicht alle Wasserstoffprodukte sind gleich. Hier siehst du warum.
            </p>
          </BlurIn>

          <FadeRight delay={150} className="lg:col-span-9">
            <ComparisonTable
              competitor={competitor}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              dropdownRef={dropdownRef}
            />
          </FadeRight>
        </div>
      </div>
    </section>
  );
}

function ComparisonTable({
  competitor,
  selectedIndex,
  setSelectedIndex,
  isOpen,
  setIsOpen,
  dropdownRef,
}: {
  competitor: (typeof COMPETITORS)[number];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative pt-12 sm:pt-14 lg:pt-16">
      <ClickHereCallout />

      <div className="rounded-lg overflow-visible relative border border-[#C3C9CD]">
        <div className="relative overflow-x-visible">
          <table className="w-full text-left border-collapse relative z-10 table-fixed">
            <colgroup>
              <col className="w-[26%] lg:w-1/3" />
              <col className="w-[37%] lg:w-1/3" />
              <col className="w-[37%] lg:w-1/3" />
            </colgroup>
            <thead>
              <tr>
                <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-5 border-b border-r border-[#C3C9CD] bg-white font-bold text-[11px] sm:text-xs lg:text-sm text-[#173A57] rounded-tl-lg">
                  FEATURES
                </th>
                <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-5 border-b border-[#C3C9CD] text-white font-bold text-base sm:text-lg lg:text-xl relative overflow-visible">
                  <span className="relative z-10">AWAKE</span>
                  <img alt="AWAKE Flasche"
                    src={FLASCHE_IMAGE}
                    className="absolute right-1 sm:right-2 bottom-1 h-[170%] sm:h-[180%] lg:h-[190%] object-contain z-30 rotate-6 pointer-events-none"
                  />
                </th>
                <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-5 border-b border-[#C3C9CD] bg-white rounded-tr-lg">
                  <div ref={dropdownRef} className="relative z-50">
                    <button
                      onClick={() => setIsOpen((prev: boolean) => !prev)}
                      className="flex items-center justify-between w-full bg-[#F5F5F5] rounded-full px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-5 lg:py-3 cursor-pointer relative z-10 gap-1"
                    >
                      <span className="font-bold text-[10px] sm:text-sm lg:text-xl text-[#173A57] truncate text-left">{competitor.name}</span>
                      <svg className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#173A57] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
                          className="absolute top-[calc(100%-12px)] left-0 right-0 bg-[#F5F5F5] rounded-b-lg shadow-lg pt-4 pb-2 px-2 flex flex-col gap-1"
                        >
                          {COMPETITORS.map((comp, index) => (
                            <button
                              key={comp.name}
                              onClick={() => {
                                setSelectedIndex(index);
                                setIsOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 sm:px-4 sm:py-2.5 font-bold text-[11px] sm:text-sm rounded-full transition-colors cursor-pointer ${
                                index === selectedIndex
                                  ? "bg-[#173A57] text-white"
                                  : "text-[#173A57] hover:bg-[#E8E8E8]"
                              }`}
                            >
                              {comp.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                key={selectedIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="text-[11px] sm:text-xs lg:text-sm font-medium align-top"
              >
                <tr>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-r border-[#C3C9CD] text-[#173A57] bg-white font-bold">H2-Konzentration</td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-white">
                    <span className="relative z-10">{AWAKE_DATA.h2Konzentration}</span>
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-[#173A57] bg-white">{competitor.h2Konzentration}</td>
                </tr>
                <tr>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-r border-[#C3C9CD] text-[#173A57] bg-white font-bold">Reinheit</td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-white">
                    <span className="relative z-10">{AWAKE_DATA.reinheit}</span>
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-[#173A57] bg-white">
                    {typeof competitor.reinheit === "object" && "missing" in competitor.reinheit ? (
                      <span className="flex items-start gap-1.5 sm:gap-2">
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{competitor.reinheit.value}</span>
                      </span>
                    ) : (
                      <span>{String(competitor.reinheit)}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-r border-[#C3C9CD] text-[#173A57] bg-white font-bold">Stabilität</td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-white">
                    <span className="relative z-10">{AWAKE_DATA.stabilitaet}</span>
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-[#173A57] bg-white">{competitor.stabilitaet}</td>
                </tr>
                <tr>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-r border-[#C3C9CD] text-[#173A57] bg-white font-bold">Antioxidante Wirkung</td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-white">
                    <span className="relative z-10">{AWAKE_DATA.antioxidante}</span>
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-[#173A57] bg-white">{competitor.antioxidante}</td>
                </tr>
                <tr>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-r border-[#C3C9CD] text-[#173A57] bg-white font-bold">Bioverfügbarkeit</td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-white">
                    <span className="relative z-10">{AWAKE_DATA.bioverfuegbarkeit}</span>
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-b border-[#C3C9CD] text-[#173A57] bg-white">{competitor.bioverfuegbarkeit}</td>
                </tr>
                <tr>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 border-r border-[#C3C9CD] font-bold text-[#173A57] bg-white rounded-bl-lg">Komfort</td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 text-white">
                    <span className="relative z-10">{AWAKE_DATA.komfort}</span>
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-4 text-[#173A57] bg-white rounded-br-lg">{competitor.komfort}</td>
                </tr>
              </motion.tbody>
            </AnimatePresence>
          </table>
          <div className="absolute -top-3 -bottom-3 left-[26%] w-[37%] lg:left-1/3 lg:w-1/3 bg-[#173A57] -z-0 rounded-lg overflow-hidden">
            <img src={BG_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 scale-125" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClickHereCallout() {
  return (
    <div className="absolute top-3 right-4 sm:top-4 sm:right-10 lg:top-5 lg:right-20 z-40 flex items-start gap-1.5 sm:gap-2">
      <img src="https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/ccf4e91e-2c14-4453-b971-f213dc2c7b90-Vector.png" alt="" className="w-8 sm:w-10 lg:w-14 h-auto mt-1" />
      <p className="text-[#173A57] text-[10px] sm:text-xs lg:text-sm leading-tight mt-0">
        Klicke hier um<br />mehr zu sehen
      </p>
    </div>
  );
}
