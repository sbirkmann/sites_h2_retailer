"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, Star, Stethoscope } from "lucide-react";
import { TextReveal, FadeUp, BlurIn, GlowButton, FloatingElement } from "@/components/home/animations";
import { useScrollParallax } from "@/hooks/use-gsap-scroll";

const slideOneImage = "/images/hero-slide-1.avif";

const slideTwoImage = "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/e0404161-0015-4ed3-8eff-8f97c005a472-awake-bottle.png";

const slides = [
{
  ctaLabel: "Entdecke AWAKE aus der Dose",
  ctaHref: "/awake-dose",
  imageSrc: slideOneImage,
  imageAlt: "AWAKE Wasserstoff Getränkedosen"
},
{
  ctaLabel: "Entdecke AWAKE aus der Flasche",
  ctaHref: "/glasflasche",
  imageSrc: slideTwoImage,
  imageAlt: "AWAKE Wasserstoff Flaschen"
}];


const stars = [0, 1, 2, 3, 4];

const trustFeatures = [
"Made in Germany",
"0 Zucker · 0 Koffein · 0 Kalorien",
"Lieferung in 2-3 Tagen"];


interface CssBubble {
  id: number;
  x: string;
  startY: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  wobbleAmp: number;
  highlightAngle: number;
  riseDistance: number;
  peakOpacity: number;
  gradient: string;
  border: string;
}

function generateBubbles(count: number): CssBubble[] {
  const bubbles: CssBubble[] = [];
  for (let i = 0; i < count; i++) {
    const size = i < 6 ?
    36 + Math.random() * 28 :
    i < 20 ?
    14 + Math.random() * 22 :
    4 + Math.random() * 14;
    const isLarge = size > 30;
    const isMedium = size > 14;
    const ha = 20 + Math.random() * 25;
    const baseOpacity = isLarge ? 0.18 : isMedium ? 0.25 : 0.35;

    const gradient = isLarge ?
    `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 20%, rgba(23,58,87,${baseOpacity}) 50%, rgba(23,58,87,${baseOpacity * 0.6}) 75%, rgba(23,58,87,${baseOpacity * 0.3}) 100%)` :
    isMedium ?
    `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.45) 0%, rgba(23,58,87,${baseOpacity}) 45%, rgba(23,58,87,${baseOpacity * 0.5}) 80%, transparent 100%)` :
    `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.6) 0%, rgba(23,58,87,${baseOpacity}) 60%, transparent 100%)`;

    const border = isLarge ?
    "1px solid rgba(255,255,255,0.2)" :
    `1px solid rgba(23,58,87,${isMedium ? 0.18 : 0.12})`;

    bubbles.push({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      startY: `${70 + Math.random() * 35}%`,
      size,
      duration: size > 30 ? 10 + Math.random() * 6 : 6 + Math.random() * 5,
      delay: Math.random() * 14,
      driftX: (Math.random() - 0.5) * 50,
      wobbleAmp: 8 + Math.random() * 20,
      highlightAngle: ha,
      riseDistance: -(700 + size * 6),
      peakOpacity: baseOpacity * 4,
      gradient,
      border
    });
  }
  return bubbles;
}

interface CssParticle {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  riseY: number;
  color: string;
  glow: string;
}

function generateParticles(count: number): CssParticle[] {
  const particles: CssParticle[] = [];
  const colors = [
  { bg: "rgba(23,58,87,0.8)", glow: "0 0 10px 3px rgba(23,58,87,0.5)" },
  { bg: "rgba(23,58,87,0.8)", glow: "0 0 10px 3px rgba(23,58,87,0.5)" },
  { bg: "rgba(23,58,87,0.9)", glow: "0 0 8px 3px rgba(23,58,87,0.4)" },
  { bg: "rgba(23,58,87,0.7)", glow: "0 0 8px 2px rgba(23,58,87,0.4)" }];

  for (let i = 0; i < count; i++) {
    const c = colors[i % colors.length];
    particles.push({
      id: i,
      x: `${35 + Math.random() * 45}%`,
      y: `${45 + Math.random() * 45}%`,
      size: 2 + Math.random() * 5,
      duration: 5 + Math.random() * 6,
      delay: Math.random() * 8,
      driftX: (Math.random() - 0.5) * 60,
      riseY: -(200 + Math.random() * 350),
      color: c.bg,
      glow: c.glow
    });
  }
  return particles;
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute w-[800px] h-[800px] md:w-[1100px] md:h-[1100px] rounded-full will-change-transform"
        style={{
          top: "-25%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(23,58,87,0.18) 0%, rgba(23,58,87,0.08) 40%, transparent 75%)",
          animation: "bg-drift-1 25s ease-in-out infinite"
        }} />
      
      <div
        className="absolute w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full will-change-transform"
        style={{
          bottom: "-20%",
          left: "-15%",
          background: "radial-gradient(circle, rgba(23,58,87,0.15) 0%, rgba(23,58,87,0.06) 45%, transparent 75%)",
          animation: "bg-drift-2 30s ease-in-out infinite 5s"
        }} />
      
      <div
        className="absolute w-[500px] h-[500px] md:w-[750px] md:h-[750px] rounded-full will-change-transform"
        style={{
          top: "15%",
          left: "20%",
          background: "radial-gradient(circle, rgba(253,242,119,0.08) 0%, rgba(23,58,87,0.04) 45%, transparent 70%)",
          animation: "bg-drift-3 28s ease-in-out infinite 10s"
        }} />
      
    </div>);

}

function AuroraWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <div
        className="absolute w-[220%] h-[50%] md:h-[60%] will-change-transform"
        style={{
          top: "8%",
          left: "-60%",
          background: "linear-gradient(180deg, transparent 0%, rgba(23,58,87,0.06) 30%, rgba(23,58,87,0.1) 50%, rgba(23,58,87,0.05) 70%, transparent 100%)",
          borderRadius: "50%",
          animation: "aurora-sway-1 20s ease-in-out infinite"
        }} />
      
      <div
        className="absolute w-[200%] h-[45%] md:h-[55%] will-change-transform"
        style={{
          bottom: "5%",
          left: "-40%",
          background: "linear-gradient(180deg, transparent 0%, rgba(23,58,87,0.04) 30%, rgba(23,58,87,0.07) 50%, rgba(23,58,87,0.04) 70%, transparent 100%)",
          borderRadius: "50%",
          animation: "aurora-sway-2 24s ease-in-out infinite 6s"
        }} />
      
    </div>);

}

function HydrogenBubbles({ bubbles }: {bubbles: CssBubble[];}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {bubbles.map((b) =>
      <div
        key={b.id}
        className="absolute rounded-full will-change-transform"
        style={{
          left: b.x,
          top: b.startY,
          width: b.size,
          height: b.size,
          background: b.gradient,
          border: b.border,
          "--b-rise": `${b.riseDistance}px`,
          "--b-wobble": `${b.wobbleAmp}px`,
          "--b-drift": `${b.driftX}px`,
          "--b-peak-opacity": `${b.peakOpacity}`,
          animation: `bubble-rise ${b.duration}s ease-in-out ${b.delay}s infinite`
        } as React.CSSProperties} />

      )}
    </div>);

}

function ProductHalo() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3]">
      <div
        className="w-[380px] h-[380px] md:w-[560px] md:h-[560px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(23,58,87,0.2) 0%, rgba(23,58,87,0.1) 35%, rgba(23,58,87,0.04) 60%, transparent 80%)",
          animation: "halo-pulse 6s ease-in-out infinite"
        }} />
      
      <div
        className="absolute inset-[-40%] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(253,242,119,0.05) 0%, rgba(23,58,87,0.03) 45%, transparent 70%)",
          animation: "halo-outer 8s ease-in-out infinite 2s"
        }} />
      
    </div>);

}

function EnergyParticles({ particles }: {particles: CssParticle[];}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) =>
      <div
        key={p.id}
        className="absolute rounded-full will-change-transform"
        style={{
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          boxShadow: p.glow,
          "--p-rise": `${p.riseY}px`,
          "--p-drift": `${p.driftX}px`,
          animation: `particle-rise ${p.duration}s ease-out ${p.delay}s infinite`
        } as React.CSSProperties} />

      )}
    </div>);

}

function WaterRipples() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2] hidden md:block">
      {[0, 2, 4].map((delay, i) =>
      <div
        key={i}
        className="absolute top-1/2 right-[25%] w-[500px] h-[500px] rounded-full border border-awake-blue/[0.08] will-change-transform"
        style={{
          animation: `hero-ripple 5.5s ease-out ${delay}s infinite`
        }} />

      )}
    </div>);

}

function ProgressDots({
  activeSlide,
  totalSlides,
  progress,
  onGoTo





}: {activeSlide: number;totalSlides: number;progress: number;onGoTo: (i: number) => void;}) {
  return (
    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
      {Array.from({ length: totalSlides }).map((_, i) =>
      <button
        key={i}
        onClick={() => onGoTo(i)}
        className="relative flex h-8 cursor-pointer items-center justify-center"
        aria-label={`Slide ${i + 1}`}>
        
          <div className="relative h-[3px] w-8 overflow-hidden rounded-full bg-awake-blue/20">
            {activeSlide === i &&
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-awake-blue"
            initial={{ width: "0%" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1, ease: "linear" }} />

          }
          </div>
        </button>
      )}
    </div>);

}

const AUTO_PLAY_MS = 5000;

const logos = [
  {
    src: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/41c060af-4a75-4333-a6be-ca305645fc20-FIBO_LOGO.png",
    alt: "FIBO"
  },
  {
    src: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/cf73bf67-7937-4722-9629-0d2f396fa7ee-SPAWORLD_LOGO.png",
    alt: "Spa World"
  },
  {
    src: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/9afe995f-39a4-4884-9b8c-7b744583702f-REWE_LOGO.png",
    alt: "REWE"
  },
  {
    src: "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/9ace620f-df74-4e31-a628-05474ccc6a3f-FOREVER_YOUNG_SUMMIT_LOGO.png",
    alt: "Forever Young Summit"
  }
];

function LogoSlider() {
  return (
    <div className="w-full bg-white pt-10 pb-8 md:pt-14 md:pb-10 border-t border-border/40">
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <p className="mx-auto mb-5 block w-full text-center font-gothic text-[15px] font-medium uppercase tracking-[0.2em] text-gray-400 opacity-70 md:mb-6">
          Bekannt aus
        </p>
        <div className="flex flex-nowrap items-center justify-center gap-x-4 overflow-x-auto scrollbar-hide sm:gap-x-8 md:gap-x-16">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex h-14 w-auto flex-shrink-0 items-center justify-center sm:h-20 md:h-24"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full w-auto max-w-[100px] object-contain grayscale opacity-70 sm:max-w-[180px] md:max-w-[260px]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const totalSlides = slides.length;
  const progressRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const startTimeRef = useRef(0);
  const heroTextParallax = useScrollParallax<HTMLDivElement>(0.08);
  const heroImageParallax = useScrollParallax<HTMLDivElement>(0.12);

  const initialParticles = useMemo(() => generateParticles(8), []);
  const initialBubbles = useMemo(() => generateBubbles(20), []);
  const [particles] = useState<CssParticle[]>(initialParticles);
  const [bubbles] = useState<CssBubble[]>(initialBubbles);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / AUTO_PLAY_MS, 1);
      setProgress(p);
      if (p < 1) {
        progressRef.current = requestAnimationFrame(animateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(animateProgress);

    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % totalSlides);
      startTimeRef.current = Date.now();
      setProgress(0);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      progressRef.current = requestAnimationFrame(animateProgress);
    }, AUTO_PLAY_MS);

    return () => {
      clearInterval(timer);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [totalSlides, epoch]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeSlide ? 1 : -1);
      setActiveSlide(index);
      setProgress(0);
      setEpoch((e) => e + 1);
    },
    [activeSlide]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    goTo((activeSlide + 1) % totalSlides);
  }, [activeSlide, goTo, totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    goTo((activeSlide - 1 + totalSlides) % totalSlides);
  }, [activeSlide, goTo, totalSlides]);

  const currentSlide = slides[activeSlide];

  return (
    <>
    <section className="relative overflow-hidden bg-secondary film-grain vignette">
      <AnimatedBackground />
      <AuroraWaves />
      {bubbles.length > 0 && <HydrogenBubbles bubbles={bubbles} />}
      <WaterRipples />

      <div className="relative mx-auto max-w-[1350px] px-4 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24">
        <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">

          <div ref={heroTextParallax} className="relative z-20 w-full text-center md:text-left">

            <BlurIn delay={50}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy/90 backdrop-blur-sm px-4 py-1.5 font-gothic text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-sm sm:text-[12px]">
                <span
                  className="animate-gradient-text"
                  style={{
                    backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, #ffffff 25%, #FDF277 50%, #ffffff 75%, #ffffff 100%)"
                  }}>
                  
                  Europas Nr. 1 Wasserstoff-Wasser
                </span>
              </span>
            </BlurIn>

            <TextReveal delay={150}>
              <h1 className="mt-5 font-gothic font-bold uppercase leading-[0.95] tracking-tight text-hero-text text-[40px] sm:text-[56px] lg:text-[68px]">
                Nutze die antioxidative Kraft von Wasserstoff Wasser
              </h1>
            </TextReveal>

            <FadeUp delay={250}>
              <p className="mx-auto max-w-xl font-gothic text-hero-text/85 sm:text-[16px] md:mx-0 lg:text-[17px] text-base rounded-none leading-relaxed font-normal mt-5">
                Das weltweit erste Wasserstoff-Wasser mit 11+ ppm H₂ – stabil dosiert, ohne Koffein, ohne Zucker, sofort trinkfertig.
              
              </p>
            </FadeUp>

            <FadeUp delay={350}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}>

                    <GlowButton className="rounded-full">
                      <a
                        href={currentSlide.ctaHref}
                        className="inline-flex cursor-pointer items-center rounded-full bg-cta-yellow px-7 py-3.5 text-center font-gothic text-[14px] font-bold uppercase tracking-wide text-hero-text sm:px-9 sm:py-4 sm:text-[16px]">

                        {currentSlide.ctaLabel}
                      </a>
                    </GlowButton>
                  </motion.div>
                </AnimatePresence>
              </div>
            </FadeUp>

            <div className="relative mt-6 flex h-[280px] w-full items-end justify-center md:hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeSlide}
                  custom={direction}
                  className="absolute inset-0 flex items-end justify-center"
                  initial={{ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.92 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 24,
                    mass: 0.8
                  }}>
                  <FloatingElement amplitude={8} duration={4.5}>
                    <Image alt={currentSlide.imageAlt}
                    src={currentSlide.imageSrc}
                    width={600}
                    height={600}
                    title={currentSlide.imageAlt}
                    sizes="320px"
                    className="h-[280px] w-auto object-contain object-bottom drop-shadow-2xl"
                    fetchPriority="high" priority />
                  </FloatingElement>
                </motion.div>
              </AnimatePresence>
            </div>

            <FadeUp delay={550}>
              <div className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold text-hero-text/80 sm:text-[13px]">
                <Stethoscope className="h-4 w-4 text-awake-blue" strokeWidth={2.2} />
                Empfohlen von Ärzten
              </div>
            </FadeUp>

            <BlurIn delay={600}>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-hero-text sm:text-[13px] md:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {stars.map((i) =>
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 12,
                        delay: 0.7 + i * 0.06
                      }}>

                        <Star className="w-4 h-4 fill-awake-yellow text-awake-yellow" />
                      </motion.span>
                    )}
                  </div>
                  <span className="font-bold">4,8 / 5</span>
                </div>
                <span className="hidden h-3 w-px bg-hero-text/25 sm:inline-block" aria-hidden />
                <span className="text-hero-text/75">437 verifizierte Bewertungen</span>
                <span className="hidden h-3 w-px bg-hero-text/25 sm:inline-block" aria-hidden />
                <span className="text-hero-text/75">300.000+ AWAKE getrunken</span>
              </div>
            </BlurIn>

          </div>

          <div ref={heroImageParallax} className="relative mx-auto hidden h-[320px] w-full max-w-[400px] items-end justify-center md:flex md:h-[560px] md:max-w-none lg:h-[620px]">

            <ProductHalo />

            {particles.length > 0 && <EnergyParticles particles={particles} />}

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeSlide}
                custom={direction}
                className="absolute inset-0 flex items-end justify-center md:items-center"
                initial={{ opacity: 0, x: direction > 0 ? 80 : -80, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction > 0 ? -80 : 80, scale: 0.92 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8
                }}>
                
                <FloatingElement amplitude={8} duration={4.5}>
                  <Image alt={currentSlide.imageAlt}
                  src={currentSlide.imageSrc}
                  width={600}
                  height={600}
                  title={currentSlide.imageAlt}
                  sizes="(min-width: 1024px) 560px, (min-width: 768px) 500px, 320px"
                  className="h-[320px] w-auto object-contain object-bottom drop-shadow-2xl md:h-[520px] md:object-center lg:h-[600px]"
                  fetchPriority="high" priority />
                  
                </FloatingElement>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.button
        onClick={prevSlide}
        className="absolute right-20 top-6 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-hero-text shadow-md sm:flex hover:bg-white transition-colors md:right-24 md:top-auto md:bottom-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        aria-label="Vorheriger Slide">
        
        <ChevronLeft className="h-5 w-5" />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className="absolute right-6 top-6 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-hero-text shadow-md sm:flex hover:bg-white transition-colors md:right-8 md:top-auto md:bottom-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        aria-label="Nächster Slide">
        
        <ChevronRight className="h-5 w-5" />
      </motion.button>

      <ProgressDots
        activeSlide={activeSlide}
        totalSlides={totalSlides}
        progress={progress}
        onGoTo={goTo} />
      
    </section>
    <LogoSlider />
    </>
  );

}