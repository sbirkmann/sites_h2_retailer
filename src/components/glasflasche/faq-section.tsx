"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeUp, FadeLeft, FadeRight, TextReveal } from "./animations";
import { AWAKE_FLASCHE_FAQS } from "@/data/page-faqs";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_4fr] lg:gap-0 items-center">
        <FadeLeft className="flex flex-col justify-center px-4 lg:pl-8 lg:pr-12 xl:pl-[calc((100vw-1350px)/2+2rem)]">
          <div className="mb-10">
            <TextReveal>
              <h2 className="font-gothic text-[24px] font-bold text-[#333333] mb-4 sm:text-[30px] lg:text-[36px]">
                FRAGEN &amp; ANTWORTEN
              </h2>
            </TextReveal>
            <FadeUp delay={100}>
              <p className="text-[14px] text-[#333333] leading-relaxed max-w-md">
                AWAKE ist das erste ready-to-drink Wasserstoffgetränk Europas und bietet dir alle Vorteile dieser innovativen Technologie. Bei weiteren Fragen schreib uns an: info@h2-awake.de
              </p>
            </FadeUp>
          </div>

          <div className="flex flex-col border-t border-gray-200">
            {AWAKE_FLASCHE_FAQS.map((faq, idx) => (
              <FadeUp key={idx} delay={150 + idx * 80} className="border-b border-gray-200">
                <button
                  className="w-full flex justify-between items-center py-5 text-left cursor-pointer sm:py-6"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <span className="font-bold text-[16px] text-[#173A57] pr-4 sm:text-[18px] lg:text-[20px]">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#173A57] transition-transform duration-400 shrink-0 ${openIndex === idx ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-400 ease-out ${openIndex === idx ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="text-[#173A57] text-[16px] whitespace-pre-line">{faq.answer}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeLeft>

        <div className="relative w-full overflow-hidden">
          <FadeRight delay={200}>
            <img alt="AWAKE Glasflasche"
              src="https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b7247eb73770a04d3cc550_420c68c935849abf75d39047c98f82eb3345d88e.png"
              className="block w-full h-auto lg:max-w-none lg:w-[90%] lg:ml-auto"
              width={600}
              height={800}
              loading="lazy"
              decoding="async"
            />
          </FadeRight>
        </div>
      </div>
    </section>
  );
}
