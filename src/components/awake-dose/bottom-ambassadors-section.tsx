"use client";

import { useRef, useEffect, useState } from "react";
import { FadeUp, TextReveal } from "./animations";

const AMBASSADORS = [
  {
    img: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/07652c6f-c205-44a3-8164-3160817a0a58-Rectangle_30__2_.png",
    quote: "Lorem ipsum dolor sit amet consectetur. Eget arcu donec orci at ut integer est. Sed tellus quam vestibulum sagittis viverra posuere ac. Viverra et pretium tincidunt magna malesuada. Ornare cras.",
    name: "Aryna Sabalenka",
  },
  {
    img: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/7f7eced3-bffd-46c4-a56b-bd8209144357-Rectangle_29__1_.png",
    quote: "Hydrogen water has become a key part of my daily routine. It helps me stay focused and recover faster after intense training sessions on the track.",
    name: "Ollie Bearman",
  },
  {
    img: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/bdf1da95-76b1-4dd2-a41f-1a35995644c4-Rectangle_28__1_.png",
    quote: "The science behind molecular hydrogen is compelling. I recommend AWAKE to my patients as part of a comprehensive wellness approach.",
    name: "Dr. Dawn Mussallem",
  },
  {
    img: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/07652c6f-c205-44a3-8164-3160817a0a58-Rectangle_30__2_.png",
    quote: "Every match demands peak performance. AWAKE gives me that extra edge with clean hydration that supports my body at the cellular level.",
    name: "Aryna Sabalenka",
  },
  {
    img: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/7f7eced3-bffd-46c4-a56b-bd8209144357-Rectangle_29__1_.png",
    quote: "In Formula 1, recovery is everything. AWAKE has become an essential part of how I prepare and bounce back between races.",
    name: "Ollie Bearman",
  },
  {
    img: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/bdf1da95-76b1-4dd2-a41f-1a35995644c4-Rectangle_28__1_.png",
    quote: "As a clinician, I look for evidence-based solutions. Molecular hydrogen offers real promise for reducing oxidative stress and supporting overall health.",
    name: "Dr. Dawn Mussallem",
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
