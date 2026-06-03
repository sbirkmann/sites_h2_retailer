"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { HOME_FAQS } from "@/data/page-faqs";
import type { PageFaqItem } from "@/data/page-faqs";

const canImage =
"https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/ad857bad-6a1c-4f12-a55d-766261ddba42-AWAKE__3_.png";

const chevronSpring = { type: "spring" as const, stiffness: 300, damping: 15 };
const contentSpring = { type: "spring" as const, stiffness: 200, damping: 26, mass: 0.8 };

function FaqAccordionItem({
  faq,
  isOpen,
  onToggle
}: {faq: PageFaqItem; isOpen: boolean; onToggle: () => void;}) {
  return (
    <motion.div
      className="border-b border-gray-200"
      animate={{
        borderColor: isOpen ? "rgba(23,58,87,0.35)" : "rgba(229,231,235,1)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}>
      
      <button
        className="w-full flex justify-between items-center py-5 text-left cursor-pointer sm:py-6"
        onClick={onToggle}>
        
        <span className="font-bold text-[16px] text-navy pr-4 sm:text-[18px] lg:text-[20px]">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={chevronSpring}
          className="shrink-0">
          
          <ChevronDown className="w-5 h-5 text-navy" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen &&
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={contentSpring}
          className="overflow-hidden">
          
            <p className="text-navy text-[15px] leading-relaxed pb-6 whitespace-pre-line">
              {faq.answer}
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-2 lg:py-3 bg-white relative overflow-hidden">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_4fr] lg:gap-0 items-center">
        <div className="flex flex-col justify-center px-4 lg:pl-8 lg:pr-12 xl:pl-[calc((100vw-1350px)/2+2rem)]">
          <div className="mb-10">
            <h2 className="font-gothic text-navy sm:text-[30px] lg:text-[36px] text-base font-bold leading-none rounded-none mb-4">
              HÄUFIG GESTELLTE FRAGEN
            </h2>
            <p className="text-[14px] text-navy leading-relaxed max-w-md">
              AWAKE ist das erste Wasserstoffgetränk in Deutschland und bietet dir alle Vorteile dieser innovativen Technologie.
              <br />
              <br />
              Bei weiteren Fragen schreib uns an:{" "}
              <a href="mailto:info@h2-awake.de?subject=Fragen%20zu%20AWAKE" className="cursor-pointer text-navy underline-offset-2 text-base font-normal leading-none underline rounded-none">
                support@h2-awake.de
              </a>
            </p>
          </div>

          <div className="flex flex-col border-t border-gray-200">
            {HOME_FAQS.map((faq, idx) =>
            <FaqAccordionItem
              key={idx}
              faq={faq}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)} />
            )}
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-lg">
          <Image alt="AWAKE Dose"
            src={canImage}
            width={800}
            height={800}
            className="mx-auto block h-auto w-[75%] sm:w-[65%] lg:mx-0 lg:w-[85%]" />
        </div>
      </div>
    </section>
  );
}
