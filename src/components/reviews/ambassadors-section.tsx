"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { FadeUp, HoverLift } from "@/components/home/animations";

interface Ambassador {
  name: string;
  role: string;
  quote: string;
  image: string;
}

const ambassadors: Ambassador[] = [
  {
    name: "Sören Schumann",
    role: "Sportwissenschaftler & Gesundheitsberater",
    quote:
      "Ich trinke AWAKE schon seit vielen Monaten. Die Wirkung auf meine Energie und Regeneration ist spürbar und nachhaltig.",
    image: "/images/soeren-schumann.avif"
  },
  {
    name: "Marvin Alberg",
    role: "Gründer von neowake · Biohacker",
    quote:
      "AWAKE gibt mir den täglichen Boost, den ich brauche – ohne Kompromisse bei der Reinheit. Das ist echter Biohacking-Standard.",
    image: "/images/marvin-alberg.webp"
  },
  {
    name: "Sabine Vierneisel",
    role: "Erlebnispädagogin & Gesundheits-Enthusiastin",
    quote:
      "AWAKE ist mein morgendliches Ritual geworden. Klarer Kopf, mehr Energie – und das ganz natürlich. Ich möchte es nicht mehr missen.",
    image: "/images/sabine-awake.avif"
  },
  {
    name: "Arne Derricks",
    role: "Fitnessexperte & Personal Trainer",
    quote:
      "Ich nutze AWAKE vor und nach dem Training für maximale Power und Regeneration. Der Unterschied ist im Workout und am nächsten Tag deutlich spürbar.",
    image: "/images/arne-derricks.avif"
  }
];

function AmbassadorCard({ ambassador, index }: { ambassador: Ambassador; index: number }) {
  return (
    <FadeUp delay={index * 100} className="h-full">
      <HoverLift lift={-4} className="h-full">
        <motion.div
          className="group relative h-full overflow-hidden bg-white border border-navy/10 rounded-lg flex flex-col cursor-default transition-colors duration-300 hover:border-cta-yellow"
          whileHover={{ boxShadow: "0 24px 60px -24px rgba(23,58,87,0.25)" }}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              alt={`${ambassador.name} – ${ambassador.role}`}
              src={ambassador.image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="font-gothic font-bold uppercase text-white text-[16px] sm:text-[18px] tracking-tight leading-tight">
                {ambassador.name}
              </p>
              <p className="font-gothic text-cta-yellow text-[11px] font-bold uppercase tracking-[0.18em] mt-1">
                {ambassador.role}
              </p>
            </div>
          </div>

          <div className="relative flex-1 p-6 sm:p-7">
            <Quote className="absolute top-4 right-5 w-7 h-7 text-cta-yellow/30" strokeWidth={2} />
            <p className="font-gothic text-[15px] leading-[1.7] text-navy/85 italic">
              &ldquo;{ambassador.quote}&rdquo;
            </p>
          </div>
        </motion.div>
      </HoverLift>
    </FadeUp>
  );
}

export function ReviewsAmbassadorsSection() {
  return (
    <section className="relative overflow-hidden text-base font-normal leading-none bg-[#F5F5F5] rounded-none py-0">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 will-change-transform"
          style={{
            top: "10%",
            left: "-10%",
            background: "radial-gradient(circle, rgba(23,58,87,0.08) 0%, transparent 70%)",
            animation: "bg-drift-1 32s ease-in-out infinite"
          }}
        />
      </div>

      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch auto-rows-fr">
          {ambassadors.map((ambassador, index) => (
            <AmbassadorCard key={ambassador.name} ambassador={ambassador} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
