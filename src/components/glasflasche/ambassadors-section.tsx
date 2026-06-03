"use client";

import { SectionBadge } from "@/components/shared/section-badge";
import { PopIn, TextReveal, BlurIn } from "./animations";

export function AmbassadorsSection() {
  const ambassadors = [
    {
      name: "Sören Schumann",
      image: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9b0bacd76a4148f04ac4b_soeren-schumann_full.avif",
      role: "Sportwissenschaftler, ganzheitlicher Gesundheitsberater, Autor und Moderator",
      badge: "Ich trinke AWAKE schon seit vielen Monaten...",
    },
    {
      name: "Marvin Alberg",
      image: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/67e6aec0ba1857a826d1e636_Marvin%20Alberg%20(1).webp",
      role: "Gesundheitsexperte, Unternehmer und Gründer von neowake",
      badge: "AWAKE gibt mir den täglichen Boost...",
    },
    {
      name: "Sabine Vierneisel",
      image: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69c117ee281f92db5f1d27eb_sabine-awake.avif",
      role: "Erlebnispädagogin und Gesundheits-Enthusiastin",
      badge: "AWAKE ist mein morgentliches Ritual...",
    },
    {
      name: "Arne Derricks",
      image: "/images/arne-derricks.avif",
      role: "Fitnessexperte & Personal Trainer",
      badge: "AWAKE gibt mir den Boost vor jedem Training...",
    },
  ];

  return (
    <section className="bg-[#173A57] pt-12 pb-8 sm:pt-16 lg:pt-24 lg:pb-12 text-white px-4 lg:px-8">
      <div className="mx-auto max-w-[1350px]">
        <div className="text-center mb-8 lg:mb-12">
          <TextReveal>
            <h2 className="font-gothic font-bold text-[18px] mb-2 tracking-wide text-white sm:text-[24px] lg:text-[60px]">
              BIOHACKER. ÄRZTE. SPORTLER.
            </h2>
          </TextReveal>
          <BlurIn delay={200}>
            <p className="text-[20px] text-[#FDF277] sm:text-[24px] lg:text-[36px] italic">
              Sie alle trinken AWAKE.
            </p>
          </BlurIn>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:gap-8">
          {ambassadors.map((ambassador, idx) => (
            <PopIn key={ambassador.name} delay={idx * 150} className={`relative group overflow-hidden rounded-lg aspect-[4/5] md:aspect-auto md:h-[500px] sm:hover:-translate-y-2 transition-transform duration-500 ${ambassador.name === "Marvin Alberg" ? "md:hidden" : ""}`}>
              <img alt={ambassador.name}
                src={ambassador.image}
                className="absolute inset-0 w-full h-full object-cover object-top md:object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 lg:p-8">
                <h3 className="font-gothic font-bold text-[14px] mb-1 leading-tight sm:text-[20px]">{ambassador.name}</h3>
                <p className="text-[11px] text-gray-300 mb-2 leading-snug line-clamp-2 sm:line-clamp-none sm:text-[14px] sm:mb-4">
                  {ambassador.role}
                </p>
                <div className="hidden sm:inline-block">
                  <SectionBadge variant="outline-solid" size="sm">{ambassador.badge?.toUpperCase()}</SectionBadge>
                </div>
              </div>
            </PopIn>
          ))}
        </div>
      </div>
    </section>
  );
}
