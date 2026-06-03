"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionBadge } from "@/components/shared/section-badge";

const BG_IMAGE =
"https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/46042c05-0e70-4f5c-8643-8991b07c639c-download.png";
const CAN_IMAGE =
"https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/842cb6c5-6df2-442b-9f11-b724a2bbc940-AWAKE__1_.png";
const ARROW_IMAGE =
"https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/ccf4e91e-2c14-4453-b971-f213dc2c7b90-Vector.png";

const AWAKE_DATA = {
  h2Concentration: "~ 11 ppm",
  purity: "100 % rein – keine chemische Belastung",
  stability: "Sehr stabil dank Nanobubble-Technologie",
  antioxidant: "Sehr hoch, da extrem viel H₂",
  bioavailability: "Extrem hoch",
  comfort: "Sofort trinkfertig – zuhause und unterwegs"
};

const COMPETITORS = [
{
  name: "H2-Generatoren",
  h2Concentration: "< 3 ppm",
  purity: "Risiko von Ozon, Chlor & PFAS",
  stability: "Makrobubbles – extrem flüchtig",
  antioxidant: "Gering, da wenig H₂",
  bioavailability: "Sehr gering",
  comfort: "Aufladen, warten, herstellen"
},
{
  name: "H2-Tabletten",
  h2Concentration: "Inkonsistent",
  purity: "Enthält schädliche Magnesium-Metalle",
  stability: "Makrobubbles – extrem flüchtig",
  antioxidant: "Gering, da wenig H₂",
  bioavailability: "Sehr gering",
  comfort: "Mehrere Komponenten nötig"
},
{
  name: "Energy Drinks",
  h2Concentration: "0 ppm",
  purity: "Zucker, künstliches Koffein, Taurin, Aromen",
  stability: "Nicht zutreffend",
  antioxidant: "Nicht zutreffend",
  bioavailability: "Nicht zutreffend",
  comfort: "Aufmachen und trinken"
},
{
  name: "Normales Wasser",
  h2Concentration: "0 ppm",
  purity: "Je nach Anbieter unterschiedlich",
  stability: "Nicht zutreffend",
  antioxidant: "Nicht zutreffend",
  bioavailability: "Nicht zutreffend",
  comfort: "Aufmachen und trinken"
}];


const FEATURES = [
{ label: "H₂-Konzentration", awakeKey: "h2Concentration" as const, compKey: "h2Concentration" as const },
{ label: "Reinheit", awakeKey: "purity" as const, compKey: "purity" as const },
{ label: "Stabilität", awakeKey: "stability" as const, compKey: "stability" as const },
{ label: "Antioxidante Wirkung", awakeKey: "antioxidant" as const, compKey: "antioxidant" as const },
{ label: "Bioverfügbarkeit", awakeKey: "bioavailability" as const, compKey: "bioavailability" as const },
{ label: "Komfort", awakeKey: "comfort" as const, compKey: "comfort" as const }];


const slideVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

const slideTransition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as const
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
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-base font-normal leading-none bg-[#F5F5F5] rounded-none">
      <div className="relative z-10 mx-auto max-w-[1350px] px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14">
          <SectionBadge className="mb-4 self-center mx-auto">Vergleich</SectionBadge>
          <h2 className="font-gothic text-[26px] font-bold uppercase leading-tight text-navy sm:text-[34px] lg:text-[42px]">
            <span className="relative inline-block">
              AWAKE
            </span>{" "}
            im Vergleich
          </h2>
          <p className="homenew-subheading mt-4 max-w-xl text-[14px] leading-relaxed text-navy/60 sm:text-[16px]">
            Nicht alle Wasserstoffprodukte sind gleich. Hier siehst du, warum.
          </p>
        </div>

        <ComparisonTable
          competitor={competitor}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dropdownRef={dropdownRef} />

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/vergleich/wasserstoffwasser-vergleich"
            className="group inline-flex items-center gap-2 rounded-full bg-cta-yellow px-6 py-3.5 text-[14px] font-bold uppercase tracking-wide text-navy shadow-[0_10px_30px_-12px_rgba(253,242,119,0.6)] transition-transform hover:scale-[1.02] hover:bg-[#f5e751] cursor-pointer sm:px-8 sm:py-4 sm:text-[15px]">
            Wasserstoffwasser im Vergleich
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>);

}

function ComparisonTable({
  competitor,
  selectedIndex,
  setSelectedIndex,
  isOpen,
  setIsOpen,
  dropdownRef







}: {competitor: (typeof COMPETITORS)[number];selectedIndex: number;setSelectedIndex: (i: number) => void;isOpen: boolean;setIsOpen: (v: boolean | ((prev: boolean) => boolean)) => void;dropdownRef: React.RefObject<HTMLDivElement | null>;}) {
  return (
    <div className="relative pt-12 sm:pt-14 lg:pt-16">
      <ClickHereCallout />

      <div className="relative overflow-visible rounded-2xl border border-navy/10 shadow-[0_10px_40px_-20px_rgba(23,58,87,0.18)]">
        <div className="relative overflow-x-visible">
          <table className="relative z-10 w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[26%] lg:w-1/3" />
              <col className="w-[37%] lg:w-1/3" />
              <col className="w-[37%] lg:w-1/3" />
            </colgroup>
            <thead>
              <tr>
                <th className="rounded-tl-2xl border-b border-r border-navy/10 bg-white px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-navy sm:px-3 sm:py-4 sm:text-xs lg:px-4 lg:py-5 lg:text-sm">
                  Features
                </th>
                <th className="relative overflow-visible border-b border-navy/10 px-2 py-3 text-base font-bold uppercase text-white sm:px-3 sm:py-4 sm:text-lg lg:px-4 lg:py-5 lg:text-xl">
                  <span className="relative z-10">AWAKE</span>
                  <img alt="AWAKE Can"
                    src={CAN_IMAGE}
                    className="pointer-events-none absolute right-1 bottom-1 z-30 h-[170%] rotate-6 object-contain sm:right-2 sm:h-[180%] lg:h-[190%]" />
                  
                </th>
                <th className="rounded-tr-2xl border-b border-navy/10 bg-white px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-5">
                  <div ref={dropdownRef} className="relative z-50">
                    <button
                      onClick={() => setIsOpen((prev: boolean) => !prev)}
                      className="relative z-10 flex w-full cursor-pointer items-center justify-between gap-1 rounded-full bg-off-white px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-5 lg:py-3">
                      
                      <span className="truncate text-left text-[10px] font-bold text-navy sm:text-sm lg:text-xl">
                        {competitor.name}
                      </span>
                      <svg
                        className={`h-4 w-4 shrink-0 text-navy transition-transform duration-200 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {isOpen &&
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
                        className="absolute top-[calc(100%-12px)] left-0 right-0 flex flex-col gap-1 rounded-b-2xl bg-off-white px-2 pt-4 pb-2 shadow-lg">
                        
                          {COMPETITORS.map((comp, index) =>
                        <button
                          key={comp.name}
                          onClick={() => {
                            setSelectedIndex(index);
                            setIsOpen(false);
                          }}
                          className={`w-full cursor-pointer rounded-full px-3 py-2 text-left text-[11px] font-bold transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
                          index === selectedIndex ?
                          "bg-navy text-white" :
                          "text-navy hover:bg-navy/10"}`
                          }>
                          
                              {comp.name}
                            </button>
                        )}
                        </motion.div>
                      }
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
                className="align-top text-[12px] font-medium leading-relaxed sm:text-[13px] lg:text-[14px]">
                
                {FEATURES.map((feature, idx) =>
                <tr key={feature.label}>
                    <td
                    className={`border-r border-navy/10 bg-white px-2 py-3 font-bold text-navy sm:px-3 sm:py-4 lg:px-4 ${idx < FEATURES.length - 1 ? "border-b" : ""} ${idx === FEATURES.length - 1 ? "rounded-bl-2xl" : ""}`}>
                    
                      {feature.label}
                    </td>
                    <td
                    className={`px-2 py-3 text-white sm:px-3 sm:py-4 lg:px-4 ${idx < FEATURES.length - 1 ? "border-b border-white/15" : ""}`}>
                    
                      <span className="relative z-10">{AWAKE_DATA[feature.awakeKey]}</span>
                    </td>
                    <td
                    className={`bg-white px-2 py-3 text-navy/80 sm:px-3 sm:py-4 lg:px-4 ${idx < FEATURES.length - 1 ? "border-b border-navy/10" : ""} ${idx === FEATURES.length - 1 ? "rounded-br-2xl" : ""}`}>
                    
                      {String(competitor[feature.compKey as keyof typeof competitor])}
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </AnimatePresence>
          </table>
          <div className="absolute -top-3 -bottom-3 left-[26%] -z-0 w-[37%] overflow-hidden rounded-2xl bg-navy lg:left-1/3 lg:w-1/3">
            <img src={BG_IMAGE} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40" />
          </div>
        </div>
      </div>
    </div>);

}

function ClickHereCallout() {
  return (
    <div className="absolute top-3 right-4 z-40 flex items-start gap-1.5 sm:top-4 sm:right-10 sm:gap-2 lg:top-5 lg:right-20">
      <img src={ARROW_IMAGE} alt="" className="mt-1 h-auto w-8 sm:w-10 lg:w-14" />
      <p className="mt-0 text-[10px] leading-tight text-navy sm:text-xs lg:text-[13px]">
        Klicke hier um
        <br />
        mehr zu sehen
      </p>
    </div>);

}