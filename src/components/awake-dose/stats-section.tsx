"use client";

import { FadeUp, FadeLeft, FadeRight, CountUp, BlurIn } from "./animations";

export function StatsSection() {
  const stats = [
    {
      value: 81,
      suffix: "+",
      title: "Klinische Studien am Menschen",
      desc: "Mit überzeugenden Hinweisen auf das breite Potenzial von molekularem Wasserstoff beim Menschen.",
    },
    {
      value: 92,
      suffix: "%",
      title: "Verbessertes Lebensgefühl",
      desc: "In Anwenderstudien berichteten über 92% der Teilnehmer von signifikant besserer Stimmung und weniger Anspannung nach 4 Wochen.",
    },
    {
      value: 42,
      suffix: "%",
      title: "Weniger Laktat-Stau",
      desc: "H2-Wasser unterstützt den Körper dabei, Stoffwechselprodukte während hoher Belastung effizienter zu regulieren.",
    },
  ];

  return (
    <section className="bg-[#173A57] pb-12 sm:pb-16 lg:pb-24 text-white px-4 lg:px-8">
      <div className="mx-auto max-w-[1350px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <FadeLeft className="lg:col-span-4">
            <BlurIn>
              <h2 className="font-gothic text-[20px] font-bold mb-4 tracking-wide text-white sm:text-[26px] lg:text-[30px]">
                STUDIENBASIERT.<br />UNABHÄNGIG GEPRÜFT.
              </h2>
            </BlurIn>
            <FadeUp delay={150}>
              <p className="text-[14px] text-white leading-relaxed">
                Über 3.000 Publikationen weltweit.<br />
                AWAKE basiert auf dieser Forschung.
              </p>
            </FadeUp>
          </FadeLeft>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <FadeRight key={stat.title} delay={idx * 150} className="flex flex-col border-l border-[#173A57]/30 pl-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-full bg-[#FDF277] flex items-center justify-center shrink-0">
                      <CountUp
                        end={stat.value}
                        suffix={stat.suffix}
                        duration={2000}
                        delay={300 + idx * 200}
                        className="font-bold text-[24px] text-black"
                      />
                    </div>
                    <h3 className="font-gothic font-bold text-[22px] sm:text-[24px] text-white">{stat.title}</h3>
                  </div>
                  <p className="text-[14px] text-gray-300 leading-snug">
                    {stat.desc}
                  </p>
                </FadeRight>
              ))}
            </div>
          </div>
        </div>

        <FadeUp delay={300} className="mt-16 flex justify-center">
          <a href="#angebot" className="bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[15px] py-3.5 px-6 rounded-full transition-all duration-300 w-full cursor-pointer active:scale-95 sm:py-4 sm:px-8 sm:text-[21px] sm:w-auto sm:min-w-[320px] sm:px-12 sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(253,242,119,0.4)] text-center inline-block">
            JETZT ABO WÄHLEN
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
