"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";

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
  image:
  "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69b9b0bacd76a4148f04ac4b_soeren-schumann_full.avif"
},
{
  name: "Marvin Alberg",
  role: "Gründer von neowake · Biohacker",
  quote:
  "AWAKE gibt mir den täglichen Boost, den ich brauche – ohne Kompromisse bei der Reinheit. Das ist echter Biohacking-Standard.",
  image:
  "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/67e6aec0ba1857a826d1e636_Marvin%20Alberg%20(1).webp"
},
{
  name: "Sabine Vierneisel",
  role: "Erlebnispädagogin & Gesundheits-Enthusiastin",
  quote:
  "AWAKE ist mein morgendliches Ritual geworden. Klarer Kopf, mehr Energie – und das ganz natürlich. Ich möchte es nicht mehr missen.",
  image:
  "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69c117ee281f92db5f1d27eb_sabine-awake.avif"
},
{
  name: "Arne Derricks",
  role: "Fitnessexperte & Personal Trainer",
  quote:
  "Ich nutze AWAKE vor und nach dem Training für maximale Power und Regeneration. Der Unterschied ist im Workout und am nächsten Tag deutlich spürbar.",
  image: "/images/arne-derricks.avif"
}];


function AmbassadorCard({
  ambassador,
}: {ambassador: Ambassador;index: number;}) {
  return (
    <div className="group relative flex h-full cursor-default flex-col overflow-hidden rounded-2xl border border-navy/10 bg-off-white transition-colors duration-300 hover:border-cta-yellow hover:shadow-[0_24px_60px_-24px_rgba(23,58,87,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          alt={`${ambassador.name} – ${ambassador.role}`}
          src={ambassador.image}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <p className="font-gothic text-[16px] font-bold uppercase leading-tight tracking-tight text-white sm:text-[18px]">
            {ambassador.name}
          </p>
          <p className="mt-1 font-gothic text-[11px] font-bold uppercase tracking-[0.18em] text-cta-yellow">
            {ambassador.role}
          </p>
        </div>
      </div>

      <div className="relative flex-1 p-6 sm:p-7">
        <Quote
          className="absolute right-5 top-4 h-7 w-7 text-cta-yellow/30"
          strokeWidth={2} />
        
        <p className="font-gothic text-[14px] italic leading-[1.7] text-navy/85 sm:text-[15px]">
          &bdquo;{ambassador.quote}&ldquo;
        </p>
      </div>
    </div>
  );
}

export function AmbassadorsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <SectionBadge className="mb-6 self-center mx-auto">Sie trinken AWAKE</SectionBadge>

          <h2 className="font-gothic text-[26px] font-bold uppercase leading-[1.05] text-navy sm:text-[34px] lg:text-[42px]">
            Biohacker. Ärzte.{" "}
            Sportler.
          </h2>

          <p className="homenew-subheading mx-auto max-w-[520px] font-gothic text-navy/60 sm:text-[16px] text-base font-normal leading-none normal rounded-none mt-4">
            Sie alle trinken AWAKE.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ambassadors.map((ambassador, index) =>
          <AmbassadorCard
            key={ambassador.name}
            ambassador={ambassador}
            index={index} />

          )}
        </div>
      </div>
    </section>);

}
