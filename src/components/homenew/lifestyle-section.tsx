"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { SectionBadge } from "@/components/shared/section-badge";

const slides = [
{
  image: "/images/lifestyle-morgens-wasserstoffwasser-awake.avif",
  title: "MORGENS.",
  desc: "Starte den Tag mit klarem Fokus und natürlicher Energie.",
  alt: "AWAKE Wasserstoffwasser am Morgen – frischer Start in den Tag mit molekularem Wasserstoff für Energie und Fokus",
  accent: "from-[#173A57]/60"
},
{
  image: "/images/lifestyle-training-wasserstoffwasser-awake.avif",
  title: "BEIM TRAINING.",
  desc: "Ausdauer und Regeneration auf höchstem Niveau – Für den nächsten Rekord.",
  alt: "AWAKE H2-Wasser beim Training – Wasserstoffwasser für Sport, mehr Ausdauer, Leistung und schnelle Regeneration",
  accent: "from-[#FDF277]/50"
},
{
  image: "/images/lifestyle-3.avif",
  title: "BEI DER ARBEIT.",
  desc: "Fokus und Konzentration – Dein Performance-Drink am Schreibtisch.",
  alt: "AWAKE Wasserstoffwasser bei der Arbeit – mehr Konzentration und mentale Klarheit im Büroalltag",
  accent: "from-[#173A57]/60"
},
{
  image: "/images/lifestyle-unterwegs-wasserstoffwasser-awake.avif",
  title: "FÜR UNTERWEGS.",
  desc: "Immer dabei – Wasserstoffwasser to go für jede Situation.",
  alt: "AWAKE H2-Wasser für unterwegs – Wasserstoffwasser-Dose im Rucksack als idealer Begleiter für Reise, Outdoor und Alltag",
  accent: "from-[#FDF277]/50"
},
{
  image: "/images/lifestyle-abends-wasserstoffwasser-awake.avif",
  title: "ABENDS.",
  desc: "Entspanne und regeneriere – Für erholsame Nächte.",
  alt: "AWAKE H2-Wasser am Abend – molekularer Wasserstoff für Entspannung, Regeneration und erholsamen Schlaf",
  accent: "from-[#FDF277]/50"
}];


const tiltSpring = { stiffness: 300, damping: 30 };

function CarouselCard({
  slide,
  index



}: {slide: (typeof slides)[number];index: number;}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, tiltSpring);
  const springRotateY = useSpring(rotateY, tiltSpring);
  const rectCache = useRef<DOMRect | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current && window.innerWidth >= 768) {
      rectCache.current = cardRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = rectCache.current;
      if (!rect || window.innerWidth < 768) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);
      rotateX.set(-percentY * 12);
      rotateY.set(percentX * 12);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rectCache.current = null;
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <div
      className={`min-w-0 flex-[0_0_85%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] ${index % 2 === 1 ? "md:mt-16" : ""}`}>
      
      <motion.div
        ref={cardRef}
        className="group cursor-pointer"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hovered"
        initial="idle">
        
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
          <motion.div
            className="absolute inset-0"
            variants={{
              idle: { scale: 1 },
              hovered: { scale: 1.15 }
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20
            }}>
            
            <Image alt={slide.alt}
            src={slide.image}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
            className="object-cover"
            loading="lazy" />
            
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h3 className="font-gothic uppercase tracking-wider text-white sm:text-[36px] lg:text-[42px] text-base leading-none rounded-none font-bold">
              {slide.title}
            </h3>
            <p className="font-gothic text-[13px] text-white/80 leading-relaxed sm:text-[14px] mt-1">
              {slide.desc}
            </p>
            <div className="mt-3 h-[2px] w-[60px] bg-cta-yellow rounded-full" />

          </div>
        </div>
      </motion.div>
    </div>);

}

export function LifestyleSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F5F5] overflow-hidden text-base font-normal leading-none rounded-none">
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <SectionBadge className="mb-4 sm:mb-6 self-center mx-auto">
            Lifestyle
          </SectionBadge>
          <h2 className="font-gothic text-[42px] font-bold text-[#173A57] mb-4">
            DEIN <span className="font-rust">AWAKE</span> LIFESTYLE
          </h2>
          <p className="homenew-subheading text-[16px] text-[#173A57] max-w-2xl mx-auto">
            AWAKE begleitet dich in jeder Situation. Erlebe den Effekt von Wasserstoffwasser,
            teile besondere Momente mit Freunden und bleibe aktiv, wann immer du es brauchst.
          </p>
        </div>

        <div className="flex justify-end gap-3 mb-8">
          <button
            onClick={scrollPrev}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-[#173A57] shadow-md sm:h-12 sm:w-12 hover:bg-awake-blue hover:text-white transition-colors"
            aria-label="Zurück">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-[#173A57] shadow-md sm:h-12 sm:w-12 hover:bg-awake-blue hover:text-white transition-colors"
            aria-label="Weiter">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <div className="mx-auto max-w-[1350px] overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {slides.map((slide, idx) =>
            <CarouselCard key={slide.title} slide={slide} index={idx} />
            )}
          </div>
        </div>
      </div>
    </section>);

}