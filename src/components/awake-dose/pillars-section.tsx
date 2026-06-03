"use client";

import Image from "next/image";
import { FadeUp, FadeLeft, FadeRight, PopIn, TextReveal, ParallaxFloat } from "./animations";

// Numbered icon components matching the live site
function NumberIcon({ number }: { number: string }) {
  const getPath = () => {
    switch (number) {
      case "1":
        return "M22.2227 17.2617H27.1328V34.5H23.875V20.3438H20.3242L22.2227 17.2617Z";
      case "2":
        return "M22.457 22.8164H19.2578C19.3438 20.957 19.9258 19.4961 21.0039 18.4336C22.0898 17.3633 23.4805 16.8281 25.1758 16.8281C26.2227 16.8281 27.1445 17.0508 27.9414 17.4961C28.7461 17.9336 29.3867 18.5703 29.8633 19.4062C30.3477 20.2344 30.5898 21.0781 30.5898 21.9375C30.5898 22.9609 30.2969 24.0625 29.7109 25.2422C29.1328 26.4219 28.0703 27.8164 26.5234 29.4258L24.5898 31.4648H30.7305V34.5H18.7891V32.9297L24.1211 27.4922C25.4102 26.1875 26.2656 25.1406 26.6875 24.3516C27.1172 23.5547 27.332 22.8359 27.332 22.1953C27.332 21.5312 27.1094 20.9844 26.6641 20.5547C26.2266 20.1172 25.6602 19.8984 24.9648 19.8984C24.2617 19.8984 23.6758 20.1602 23.207 20.6836C22.7383 21.207 22.4883 21.918 22.457 22.8164Z";
      case "3":
        return "M22.832 21.5156H19.6797C19.8438 20.2422 20.3008 19.2188 21.0508 18.4453C22.0977 17.3672 23.4141 16.8281 25 16.8281C26.4141 16.8281 27.5977 17.2773 28.5508 18.1758C29.5117 19.0742 29.9922 20.1406 29.9922 21.375C29.9922 22.1406 29.7812 22.8398 29.3594 23.4727C28.9453 24.1055 28.3398 24.6172 27.543 25.0078C28.5898 25.3203 29.4062 25.8672 29.9922 26.6484C30.5859 27.4219 30.8828 28.3359 30.8828 29.3906C30.8828 30.9375 30.3125 32.25 29.1719 33.3281C28.0312 34.3984 26.5781 34.9336 24.8125 34.9336C23.1406 34.9336 21.7773 34.4297 20.7227 33.4219C19.668 32.4062 19.0898 31.0273 18.9883 29.2852H22.2344C22.375 30.1758 22.6836 30.8398 23.1602 31.2773C23.6445 31.707 24.2539 31.9219 24.9883 31.9219C25.7539 31.9219 26.3867 31.6758 26.8867 31.1836C27.3945 30.6914 27.6484 30.0898 27.6484 29.3789C27.6484 28.5977 27.3086 27.9375 26.6289 27.3984C25.9492 26.8594 24.9688 26.582 23.6875 26.5664V23.7539C24.4766 23.6914 25.0625 23.5703 25.4453 23.3906C25.8359 23.2031 26.1367 22.9492 26.3477 22.6289C26.5664 22.3086 26.6758 21.9688 26.6758 21.6094C26.6758 21.1406 26.5117 20.7539 26.1836 20.4492C25.8555 20.1367 25.4258 19.9805 24.8945 19.9805C24.4258 19.9805 24 20.125 23.6172 20.4141C23.2344 20.6953 22.9727 21.0625 22.832 21.5156Z";
      case "4":
        return "M26.2188 16.8281H29.5V27.9258H31.0352V30.9609H29.5V34.5H26.2891V30.9609H18.7656V27.9258L26.2188 16.8281ZM26.2891 27.9258V22.1484L22.3516 27.9258H26.2891Z";
      case "5":
        return "M22.2812 17.2617H30.3555V20.2852H24.7305L24.0273 23.4258C24.2227 23.3711 24.4141 23.332 24.6016 23.3086C24.7891 23.2773 24.9688 23.2617 25.1406 23.2617C26.7031 23.2617 28 23.7969 29.0312 24.8672C30.0703 25.9297 30.5898 27.293 30.5898 28.957C30.5898 30.6367 30.0156 32.0547 28.8672 33.2109C27.7266 34.3594 26.3359 34.9336 24.6953 34.9336C23.2266 34.9336 21.9648 34.5156 20.9102 33.6797C19.8555 32.8438 19.1641 31.6992 18.8359 30.2461H22.2812C22.5469 30.7852 22.8945 31.1953 23.3242 31.4766C23.7617 31.75 24.2422 31.8867 24.7656 31.8867C25.4922 31.8867 26.1094 31.625 26.6172 31.1016C27.125 30.5781 27.3789 29.9062 27.3789 29.0859C27.3789 28.2891 27.1406 27.6367 26.6641 27.1289C26.1953 26.6133 25.625 26.3555 24.9531 26.3555C24.5938 26.3555 24.2383 26.4453 23.8867 26.625C23.543 26.8047 23.2031 27.0742 22.8672 27.4336L20.1953 26.8359L22.2812 17.2617Z";
      default:
        return "";
    }
  };

  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="50" rx="25" fill="#173A57"></rect>
      <path d={getPath()} fill="white"></path>
    </svg>
  );
}

const leftPillars = [
  {
    number: "1",
    title: "~ 11 ppm Wasserstoff",
    desc: "Molekularer Wasserstoff ist das Kernelement von AWAKE. Mit bis zu 11 ppm bietet es eine wissenschaftlich fundierte Dosierung für dein Wohlbefinden.",
  },
  {
    number: "2",
    title: "Sofort trinkfertig",
    desc: "Kein Mischen, kein Warten. Einfach öffnen und trinken – genau dann, wenn du es brauchst.",
  },
  {
    number: "3",
    title: "Qualität & Kontrolle",
    desc: "Jede Charge wird streng laborgeprüft – für garantierte Reinheit und eine sichere, hochwertige Anwendung.",
  },
];

const rightPillars = [
  {
    number: "4",
    title: "Tägliches Ritual",
    desc: "Konsistenz ist der Schlüssel. AWAKE lässt sich nahtlos in deinen Alltag integrieren – für langfristige Unterstützung und ein stabiles Energielevel.",
  },
  {
    number: "5",
    title: "Hergestellt in Deutschland",
    desc: "Höchste Standards. AWAKE wird unter strengsten Qualitätsrichtlinien in Deutschland gefertigt.",
  },
];

export function PillarsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 lg:px-8 bg-[#F5F5F5] relative overflow-hidden">
      <div className="mx-auto max-w-[1350px]">
        <div className="text-center mb-10 sm:mb-16 relative z-10">
          <TextReveal>
            <h2 className="font-gothic text-[26px] font-bold text-[#173A57] mb-4 uppercase sm:text-[30px] lg:text-[36px]">
              5 Säulen von AWAKE
            </h2>
          </TextReveal>
          <FadeUp delay={100}>
            <p className="text-[14px] text-[#173A57] max-w-lg mx-auto">
              Was AWAKE ausmacht - 5 zentrale Säulen, die Qualität, Innovation und Alltag miteinander verbinden.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-[35%] z-10">
            {leftPillars.map((pillar, idx) => (
              <FadeLeft key={pillar.number} delay={idx * 150} className="flex justify-center">
                <div className="relative bg-white border border-[#C3C9CD] rounded-lg p-5 sm:p-6 lg:p-8 text-center z-10 sm:hover:-translate-y-2 sm:hover:shadow-lg transition-all duration-300 w-full max-w-[376px] min-h-[180px] lg:h-[206px] flex flex-col items-center justify-center">
                  <PopIn delay={idx * 200} className="absolute -left-4 -top-4 z-20 sm:-left-5 sm:-top-5">
                    <NumberIcon number={pillar.number} />
                  </PopIn>
                  <h3 className="font-gothic font-bold text-[24px] text-[#173A57] mb-2 sm:mb-3">{pillar.title}</h3>
                  <p className="text-[13px] text-[#173A57] leading-relaxed sm:text-[14px]">
                    {pillar.desc}
                  </p>
                </div>
              </FadeLeft>
            ))}
          </div>

          <PopIn delay={200} className="hidden w-full max-w-[360px] lg:block lg:w-[30%] relative z-0">
            <ParallaxFloat speed={0.12}>
              <div className="relative aspect-[3/5] w-full">
                <Image alt="AWAKE Wasserstoffgetränk Dose und Glasflasche"
                  src="/pillars-bottle.avif"
                  fill
                  sizes="(min-width: 1024px) 30vw, 80vw"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </ParallaxFloat>
          </PopIn>

          <div className="flex flex-col justify-center gap-6 lg:gap-8 w-full lg:w-[35%] z-10">
            {rightPillars.map((pillar, idx) => (
              <FadeRight key={pillar.number} delay={idx * 150} className="flex justify-center">
                <div className="relative bg-white border border-[#C3C9CD] rounded-lg p-5 sm:p-6 lg:p-8 text-center z-10 sm:hover:-translate-y-2 sm:hover:shadow-lg transition-all duration-300 w-full max-w-[376px] min-h-[180px] lg:h-[206px] flex flex-col items-center justify-center">
                  <PopIn delay={300 + idx * 200} className="absolute -left-4 -top-4 z-20 sm:-left-5 sm:-top-5">
                    <NumberIcon number={pillar.number} />
                  </PopIn>
                  <h3 className="font-gothic font-bold text-[24px] text-[#173A57] mb-2 sm:mb-3">{pillar.title}</h3>
                  <p className="text-[14px] text-[#173A57] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </FadeRight>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
