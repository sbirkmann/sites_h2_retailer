"use client";

import { useRef, useEffect, useState } from "react";
import { FadeUp, TextReveal } from "./animations";

const AMBASSADORS = [
  {
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9b0bacd76a4148f04ac4b_soeren-schumann_full.avif",
    name: "Sören Schumann",
    quote: "Ich trinke AWAKE schon seit vielen Monaten und bin überzeugt. AWAKE ist für mich eine einfache und cleane Lösung, Wasserstoff in meinen Alltag zu integrieren.",
  },
  {
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/67e6aec0ba1857a826d1e636_Marvin%20Alberg%20(1).webp",
    name: "Marvin Alberg",
    quote: "AWAKE gibt mir den täglichen Boost, den ich brauche. Die Wirkung ist spürbar und hat meine tägliche Routine komplett verändert.",
  },
  {
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69c117ee281f92db5f1d27eb_sabine-awake.avif",
    name: "Sabine Vierneisel",
    quote: "AWAKE ist mein morgentliches Ritual. Seitdem ich es täglich trinke, fühle ich mich energiegeladener und ausgeglichener.",
  },
  {
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9b0bacd76a4148f04ac4b_soeren-schumann_full.avif",
    name: "Sören Schumann",
    quote: "Wasserstoff hat mein Verständnis von Gesundheit verändert. AWAKE macht es mir leicht, jeden Tag davon zu profitieren.",
  },
  {
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/67e6aec0ba1857a826d1e636_Marvin%20Alberg%20(1).webp",
    name: "Marvin Alberg",
    quote: "Als Unternehmer brauche ich Fokus und Klarheit. AWAKE ist die einfachste Gewohnheit mit dem größten Impact auf meinen Tag.",
  },
  {
    img: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69c117ee281f92db5f1d27eb_sabine-awake.avif",
    name: "Sabine Vierneisel",
    quote: "Ich empfehle AWAKE jedem, der nach einer natürlichen Möglichkeit sucht, sein Wohlbefinden zu steigern. Einfach großartig.",
  },
];

export function BottomAmbassadorsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>(0);
  const scrollPosRef = useRef(0);

  const halfWidthRef = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    halfWidthRef.current = container.scrollWidth / 2;

    const resizeObserver = new ResizeObserver(() => {
      if (container) halfWidthRef.current = container.scrollWidth / 2;
    });
    resizeObserver.observe(container);

    const speed = 0.5;

    function animate() {
      if (!isPaused && container) {
        scrollPosRef.current += speed;
        if (scrollPosRef.current >= halfWidthRef.current) {
          scrollPosRef.current = 0;
        }
        container.scrollLeft = scrollPosRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [isPaused]);

  const cards = [...AMBASSADORS, ...AMBASSADORS];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F5F5] overflow-hidden">
      <div className="text-center mb-12 px-4">
        <TextReveal>
          <h2 className="font-gothic text-[24px] font-bold text-[#173A57] mb-4 sm:text-[30px] lg:text-[36px]">
            TAUSENDE VERTRAUEN AUF AWAKE
          </h2>
        </TextReveal>
        <FadeUp delay={100}>
          <p className="text-[14px] text-[#173A57] max-w-lg mx-auto">
            Athleten, Biohacker, Gesundheitsbewusste - sie alle trinken AWAKE
          </p>
        </FadeUp>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-4 overflow-hidden px-4"
      >
        {cards.map((item, idx) => (
          <div
            key={idx}
            className="relative shrink-0 w-[240px] sm:w-[300px] md:w-[350px] aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer"
          >
            <img alt={item.name}
              src={item.img}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173A57]/90 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-[14px] leading-relaxed mb-4">
                &quot;{item.quote}&quot;
              </p>
              <p className="text-[20px]">
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
