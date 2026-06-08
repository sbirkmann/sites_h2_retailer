"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight, Check, Plus, Minus, ShoppingCart,
  Package, TrendingDown, Download, MapPin, Users,
  HeadphonesIcon, Image as ImageIcon, Share2, FileText,
  Printer, Monitor, BookOpen, FlaskConical, Award, Lock,
  TrendingUp, Dumbbell, Heart, Stethoscope, Hotel, Gift,
  Mail, Truck, BarChart3, MessageSquare, Quote,
  ChevronLeft, ChevronRight, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import CartDrawer from "../components/CartDrawer";
import ContactWidget from "../components/ContactWidget";
import { fetchProducts, getPublicDownloads, type ApiProduct, type MarketingDownload } from "../lib/api";
import { SectionBadge } from "@/components/shared/section-badge";
import { TextReveal, FadeUp, BlurIn, GlowButton, FloatingElement } from "@/components/home/animations";
import { useScrollParallax } from "@/hooks/use-gsap-scroll";

// ──────────────────────────────────────────────────────────────────────────────
// HERO SECTION – Website-Stil, Retailer-Inhalte
// ──────────────────────────────────────────────────────────────────────────────

const slideOneImage = "/images/hero-slide-1.avif";
const slideTwoImage = "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/e0404161-0015-4ed3-8eff-8f97c005a472-awake-bottle.png";

const heroSlides = [
  { ctaLabel: "Jetzt Dosen bestellen", ctaHref: "#produkte", imageSrc: slideOneImage, imageAlt: "AWAKE Wasserstoff Getränkedosen" },
  { ctaLabel: "Jetzt Flaschen bestellen", ctaHref: "#produkte", imageSrc: slideTwoImage, imageAlt: "AWAKE Wasserstoff Flaschen" },
];


const heroStars = [0, 1, 2, 3, 4];

interface CssBubble {
  id: number; x: string; startY: string; size: number; duration: number; delay: number;
  driftX: number; wobbleAmp: number; riseDistance: number; peakOpacity: number;
  gradient: string; border: string;
}

function generateBubbles(count: number): CssBubble[] {
  const bubbles: CssBubble[] = [];
  for (let i = 0; i < count; i++) {
    const size = i < 6 ? 36 + Math.random() * 28 : i < 20 ? 14 + Math.random() * 22 : 4 + Math.random() * 14;
    const isLarge = size > 30; const isMedium = size > 14;
    const ha = 20 + Math.random() * 25;
    const baseOpacity = isLarge ? 0.18 : isMedium ? 0.25 : 0.35;
    const gradient = isLarge
      ? `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 20%, rgba(23,58,87,${baseOpacity}) 50%, rgba(23,58,87,${baseOpacity * 0.6}) 75%, rgba(23,58,87,${baseOpacity * 0.3}) 100%)`
      : isMedium
      ? `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.45) 0%, rgba(23,58,87,${baseOpacity}) 45%, rgba(23,58,87,${baseOpacity * 0.5}) 80%, transparent 100%)`
      : `radial-gradient(circle at ${ha}% ${ha}%, rgba(255,255,255,0.6) 0%, rgba(23,58,87,${baseOpacity}) 60%, transparent 100%)`;
    const border = isLarge ? "1px solid rgba(255,255,255,0.2)" : `1px solid rgba(23,58,87,${isMedium ? 0.18 : 0.12})`;
    bubbles.push({
      id: i, x: `${5 + Math.random() * 90}%`, startY: `${70 + Math.random() * 35}%`,
      size, duration: size > 30 ? 10 + Math.random() * 6 : 6 + Math.random() * 5,
      delay: Math.random() * 14, driftX: (Math.random() - 0.5) * 50,
      wobbleAmp: 8 + Math.random() * 20, riseDistance: -(700 + size * 6),
      peakOpacity: baseOpacity * 4, gradient, border,
    });
  }
  return bubbles;
}

interface CssParticle {
  id: number; x: string; y: string; size: number; duration: number;
  delay: number; driftX: number; riseY: number; color: string; glow: string;
}

function generateParticles(count: number): CssParticle[] {
  const particles: CssParticle[] = [];
  const colors = [
    { bg: "rgba(23,58,87,0.8)", glow: "0 0 10px 3px rgba(23,58,87,0.5)" },
    { bg: "rgba(23,58,87,0.9)", glow: "0 0 8px 3px rgba(23,58,87,0.4)" },
  ];
  for (let i = 0; i < count; i++) {
    const c = colors[i % colors.length];
    particles.push({
      id: i, x: `${35 + Math.random() * 45}%`, y: `${45 + Math.random() * 45}%`,
      size: 2 + Math.random() * 5, duration: 5 + Math.random() * 6,
      delay: Math.random() * 8, driftX: (Math.random() - 0.5) * 60,
      riseY: -(200 + Math.random() * 350), color: c.bg, glow: c.glow,
    });
  }
  return particles;
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-[800px] h-[800px] md:w-[1100px] md:h-[1100px] rounded-full will-change-transform"
        style={{ top: "-25%", right: "-15%", background: "radial-gradient(circle, rgba(23,58,87,0.18) 0%, rgba(23,58,87,0.08) 40%, transparent 75%)", animation: "bg-drift-1 25s ease-in-out infinite" }} />
      <div className="absolute w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full will-change-transform"
        style={{ bottom: "-20%", left: "-15%", background: "radial-gradient(circle, rgba(23,58,87,0.15) 0%, rgba(23,58,87,0.06) 45%, transparent 75%)", animation: "bg-drift-2 30s ease-in-out infinite 5s" }} />
      <div className="absolute w-[500px] h-[500px] md:w-[750px] md:h-[750px] rounded-full will-change-transform"
        style={{ top: "15%", left: "20%", background: "radial-gradient(circle, rgba(253,242,119,0.08) 0%, rgba(23,58,87,0.04) 45%, transparent 70%)", animation: "bg-drift-3 28s ease-in-out infinite 10s" }} />
    </div>
  );
}

function AuroraWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <div className="absolute w-[220%] h-[50%] md:h-[60%] will-change-transform"
        style={{ top: "8%", left: "-60%", background: "linear-gradient(180deg, transparent 0%, rgba(23,58,87,0.06) 30%, rgba(23,58,87,0.1) 50%, rgba(23,58,87,0.05) 70%, transparent 100%)", borderRadius: "50%", animation: "aurora-sway-1 20s ease-in-out infinite" }} />
      <div className="absolute w-[200%] h-[45%] md:h-[55%] will-change-transform"
        style={{ bottom: "5%", left: "-40%", background: "linear-gradient(180deg, transparent 0%, rgba(23,58,87,0.04) 30%, rgba(23,58,87,0.07) 50%, rgba(23,58,87,0.04) 70%, transparent 100%)", borderRadius: "50%", animation: "aurora-sway-2 24s ease-in-out infinite 6s" }} />
    </div>
  );
}

function HydrogenBubbles({ bubbles }: { bubbles: CssBubble[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {bubbles.map((b) => (
        <div key={b.id} className="absolute rounded-full will-change-transform"
          style={{ left: b.x, top: b.startY, width: b.size, height: b.size, background: b.gradient, border: b.border,
            "--b-rise": `${b.riseDistance}px`, "--b-wobble": `${b.wobbleAmp}px`, "--b-drift": `${b.driftX}px`, "--b-peak-opacity": `${b.peakOpacity}`,
            animation: `bubble-rise ${b.duration}s ease-in-out ${b.delay}s infinite` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function ProductHalo() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3]">
      <div className="w-[380px] h-[380px] md:w-[560px] md:h-[560px] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(23,58,87,0.2) 0%, rgba(23,58,87,0.1) 35%, rgba(23,58,87,0.04) 60%, transparent 80%)", animation: "halo-pulse 6s ease-in-out infinite" }} />
      <div className="absolute inset-[-40%] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(253,242,119,0.05) 0%, rgba(23,58,87,0.03) 45%, transparent 70%)", animation: "halo-outer 8s ease-in-out infinite 2s" }} />
    </div>
  );
}

function EnergyParticles({ particles }: { particles: CssParticle[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full will-change-transform"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, backgroundColor: p.color, boxShadow: p.glow,
            "--p-rise": `${p.riseY}px`, "--p-drift": `${p.driftX}px`,
            animation: `particle-rise ${p.duration}s ease-out ${p.delay}s infinite` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function WaterRipples() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2] hidden md:block">
      {[0, 2, 4].map((delay, i) => (
        <div key={i} className="absolute top-1/2 right-[25%] w-[500px] h-[500px] rounded-full border border-awake-blue/[0.08] will-change-transform"
          style={{ animation: `hero-ripple 5.5s ease-out ${delay}s infinite` }} />
      ))}
    </div>
  );
}

const AUTO_PLAY_MS = 5000;

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const totalSlides = heroSlides.length;
  const progressRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const startTimeRef = useRef(0);
  const heroTextParallax = useScrollParallax<HTMLDivElement>(0.08);
  const heroImageParallax = useScrollParallax<HTMLDivElement>(0.12);
  const [particles, setParticles] = useState<CssParticle[]>([]);
  const [bubbles, setBubbles] = useState<CssBubble[]>([]);

  // Client-only: generate random values after hydration to avoid SSR mismatch
  useEffect(() => {
    setParticles(generateParticles(8));
    setBubbles(generateBubbles(20));
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / AUTO_PLAY_MS, 1);
      setProgress(p);
      if (p < 1) { progressRef.current = requestAnimationFrame(animateProgress); }
    };
    progressRef.current = requestAnimationFrame(animateProgress);
    const timer = setInterval(() => {
      setDirection(1); setActiveSlide((prev) => (prev + 1) % totalSlides);
      startTimeRef.current = Date.now(); setProgress(0);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      progressRef.current = requestAnimationFrame(animateProgress);
    }, AUTO_PLAY_MS);
    return () => { clearInterval(timer); if (progressRef.current) cancelAnimationFrame(progressRef.current); };
  }, [totalSlides, epoch]);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeSlide ? 1 : -1); setActiveSlide(index); setProgress(0); setEpoch((e) => e + 1);
  }, [activeSlide]);
  const nextSlide = useCallback(() => { setDirection(1); goTo((activeSlide + 1) % totalSlides); }, [activeSlide, goTo, totalSlides]);
  const prevSlide = useCallback(() => { setDirection(-1); goTo((activeSlide - 1 + totalSlides) % totalSlides); }, [activeSlide, goTo, totalSlides]);
  const currentSlide = heroSlides[activeSlide];

  return (
    <>
      <section id="hero" className="relative overflow-hidden bg-secondary film-grain vignette">
        <AnimatedBackground />
        <AuroraWaves />
        {bubbles.length > 0 && <HydrogenBubbles bubbles={bubbles} />}
        <WaterRipples />

        <div className="relative mx-auto max-w-[1350px] px-4 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24">
          <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">

            <div ref={heroTextParallax} className="relative z-20 w-full text-center md:text-left">
              <BlurIn delay={50}>
                <SectionBadge variant="navy" className="mb-5 mx-auto md:mx-0" size="sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cta-yellow animate-pulse mr-1" />
                  Exklusiver Partnerbereich
                </SectionBadge>
              </BlurIn>

              <TextReveal delay={150}>
                <h1 className="mt-5 font-gothic font-bold uppercase leading-[0.95] tracking-tight text-hero-text text-[40px] sm:text-[56px] lg:text-[68px]">
                  Willkommen im{" "}
                  <span className="text-awake-blue">AWAKE</span>{" "}
                  Partnernetzwerk.
                </h1>
              </TextReveal>

              <FadeUp delay={250}>
                <p className="mx-auto max-w-xl font-gothic text-hero-text/80 sm:text-[16px] md:mx-0 lg:text-[17px] text-base leading-relaxed font-normal mt-5">
                  Du bist nicht einfach Händler. Du bist Teil einer Bewegung, die die Zukunft funktioneller Getränke in Europa gestaltet.
                </p>
              </FadeUp>

              <FadeUp delay={350}>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:justify-start">
                  <GlowButton className="rounded-full">
                    <a href="#haendler-werden"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-cta-yellow px-7 py-3.5 text-center font-gothic text-[14px] font-bold uppercase tracking-wide text-hero-text sm:px-9 sm:py-4 sm:text-[16px]">
                      Jetzt Händler werden <ArrowRight className="h-4 w-4" />
                    </a>
                  </GlowButton>
                  <a href="/portal"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-navy/25 bg-white/60 backdrop-blur-sm px-7 py-3.5 font-gothic text-[14px] font-bold uppercase tracking-wide text-navy hover:border-navy/50 hover:bg-white transition-all sm:px-9 sm:py-4 sm:text-[16px]">
                    Partner Dashboard
                  </a>
                </div>
              </FadeUp>

              {/* Mobile product image */}
              <div className="relative mt-6 flex h-[280px] w-full items-end justify-center md:hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div key={activeSlide} custom={direction} className="absolute inset-0 flex items-end justify-center"
                    initial={{ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.8 }}>
                    <FloatingElement amplitude={8} duration={4.5}>
                      <Image alt={currentSlide.imageAlt} src={currentSlide.imageSrc} width={600} height={600}
                        sizes="320px" className="h-[280px] w-auto object-contain object-bottom drop-shadow-2xl" fetchPriority="high" priority />
                    </FloatingElement>
                  </motion.div>
                </AnimatePresence>
              </div>

              <FadeUp delay={550}>
                <div className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold text-hero-text/80 sm:text-[13px]">
                  <Stethoscope className="h-4 w-4 text-awake-blue" strokeWidth={2.2} />
                  Empfohlen von Ärzten &amp; Therapeuten
                </div>
              </FadeUp>

              <BlurIn delay={600}>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-hero-text sm:text-[13px] md:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {heroStars.map((i) => (
                        <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.7 + i * 0.06 }}>
                          <Star className="w-4 h-4 fill-awake-yellow text-awake-yellow" />
                        </motion.span>
                      ))}
                    </div>
                    <span className="font-bold">4,8 / 5</span>
                  </div>
                  <span className="hidden h-3 w-px bg-hero-text/25 sm:inline-block" aria-hidden />
                  <span className="text-hero-text/75">437 verifizierte Bewertungen</span>
                  <span className="hidden h-3 w-px bg-hero-text/25 sm:inline-block" aria-hidden />
                  <span className="text-hero-text/75">300.000+ AWAKE getrunken</span>
                </div>
              </BlurIn>

              {/* Stats */}
              <FadeUp delay={700}>
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto md:mx-0">
                  {[{ value: "11+", label: "ppm H₂" }, { value: "100%", label: "Trinkfertig" }, { value: "EU", label: "Europas Erstes" }].map((s) => (
                    <div key={s.label} className="text-center md:text-left">
                      <div className="font-gothic text-2xl font-bold text-navy">{s.value}</div>
                      <div className="font-gothic text-[11px] uppercase tracking-widest text-navy/50 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Desktop product image */}
            <div ref={heroImageParallax} className="relative mx-auto hidden h-[320px] w-full max-w-[400px] items-end justify-center md:flex md:h-[560px] md:max-w-none lg:h-[620px]">
              <ProductHalo />
              {particles.length > 0 && <EnergyParticles particles={particles} />}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={activeSlide} custom={direction} className="absolute inset-0 flex items-end justify-center md:items-center"
                  initial={{ opacity: 0, x: direction > 0 ? 80 : -80, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: direction > 0 ? -80 : 80, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.8 }}>
                  <FloatingElement amplitude={8} duration={4.5}>
                    <Image alt={currentSlide.imageAlt} src={currentSlide.imageSrc} width={600} height={600}
                      sizes="(min-width: 1024px) 560px, (min-width: 768px) 500px, 320px"
                      className="h-[320px] w-auto object-contain object-bottom drop-shadow-2xl md:h-[520px] md:object-center lg:h-[600px]"
                      fetchPriority="high" priority />
                  </FloatingElement>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <motion.button onClick={prevSlide}
          className="absolute right-20 top-6 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-hero-text shadow-md sm:flex hover:bg-white transition-colors md:right-24 md:top-auto md:bottom-6"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-label="Vorheriger Slide"><ChevronLeft className="h-5 w-5" /></motion.button>
        <motion.button onClick={nextSlide}
          className="absolute right-6 top-6 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/80 text-hero-text shadow-md sm:flex hover:bg-white transition-colors md:right-8 md:top-auto md:bottom-6"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-label="Nächster Slide"><ChevronRight className="h-5 w-5" /></motion.button>

        {/* Progress dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="relative flex h-8 cursor-pointer items-center justify-center" aria-label={`Slide ${i + 1}`}>
              <div className="relative h-[3px] w-8 overflow-hidden rounded-full bg-awake-blue/20">
                {activeSlide === i && <motion.div className="absolute inset-y-0 left-0 rounded-full bg-awake-blue"
                  initial={{ width: "0%" }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.1, ease: "linear" }} />}
              </div>
            </button>
          ))}
        </div>
      </section>

    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DASHBOARD SECTION
// ──────────────────────────────────────────────────────────────────────────────

const dashboardCards = [
  { icon: ShoppingCart, title: "Produkte bestellen", description: "Dosen, Flaschen und Quetschbeutel – einfach und schnell nachbestellen.", cta: "Zur Bestellung", href: "#produkte", highlight: true },
  { icon: Download, title: "Marketing Center", description: "Produktbilder, Social Media Vorlagen, Flyer, Poster und mehr.", cta: "Materialien laden", href: "#marketing", highlight: false },
  { icon: MapPin, title: "Retailer Locator", description: "Verwalte deinen Eintrag auf der AWAKE Händlerkarte.", cta: "Eintrag verwalten", href: "#retailer-locator", highlight: false },
  { icon: Users, title: "Partnerprogramm", description: "Empfehle AWAKE weiter und sichere dir attraktive Provisionen.", cta: "Mehr erfahren", href: "#partnerprogramm", highlight: false },
  { icon: HeadphonesIcon, title: "Support", description: "Direkter Kontakt zu deinem persönlichen AWAKE Ansprechpartner.", cta: "Kontakt aufnehmen", href: "mailto:support@h2-awake.de", highlight: false },
];

function DashboardCard({ card, delay }: { card: (typeof dashboardCards)[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, delay); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, [delay]);

  const Icon = card.icon;
  return (
    <div ref={ref} onClick={() => { 
      if (card.href.startsWith("#")) { 
        document.querySelector(card.href)?.scrollIntoView({ behavior: "smooth" }); 
      } else {
        window.location.href = card.href;
      }
    }}
      className={`group rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.highlight ? "bg-navy text-white shadow-[0_8px_30px_-12px_rgba(23,58,87,0.4)]" : "bg-white border border-navy/10 shadow-sm hover:border-navy/25"}`}
      style={{ opacity: 0, transform: "translateY(24px)", transition: `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms, box-shadow 0.3s ease-out` }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.highlight ? "bg-cta-yellow" : "bg-[#f5f4ef]"}`}>
        <Icon size={22} className={card.highlight ? "text-navy" : "text-navy"} />
      </div>
      <div className="flex-1">
        <h3 className={`font-gothic text-lg font-bold mb-2 ${card.highlight ? "text-white" : "text-navy"}`}>{card.title}</h3>
        <p className={`font-gothic text-sm leading-relaxed ${card.highlight ? "text-white/70" : "text-navy/60"}`}>{card.description}</p>
      </div>
      <div className={`flex items-center gap-1.5 text-sm font-bold font-gothic ${card.highlight ? "text-cta-yellow" : "text-navy"}`}>
        {card.cta} <ArrowRight size={14} />
      </div>
    </div>
  );
}

function DashboardSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headingRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  return (
    <section id="dashboard" className="py-16 lg:py-24 bg-[#f5f4ef]">
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <div ref={headingRef} className="mb-12" style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
          <SectionBadge className="mb-4">Partner Dashboard</SectionBadge>
          <h2 className="font-gothic text-[28px] font-bold uppercase leading-[1.05] text-navy sm:text-[36px] lg:text-[44px] mt-3">
            Dein exklusiver <span className="text-awake-blue">Zugang</span>
          </h2>
          <p className="font-gothic text-[15px] leading-relaxed text-navy/65 mt-3 max-w-xl sm:text-[17px]">
            Als AWAKE Partner hast du Zugang zu allen Ressourcen, die du benötigst, um dein Geschäft erfolgreich auszubauen.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dashboardCards.map((card, i) => <DashboardCard key={card.title} card={card} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PRODUCTS SECTION
// ──────────────────────────────────────────────────────────────────────────────

function ProductCard({ product, delay }: { product: ApiProduct; delay: number }) {
  const [activeTab, setActiveTab] = useState<"benefits" | "usecases" | "targets">("benefits");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, delay); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, [delay]);

  const unitsPerBox = product.units_per_item ?? 1;
  const tabItems = activeTab === "benefits" ? product.benefits ?? [] : activeTab === "usecases" ? product.use_cases ?? [] : product.targets ?? [];

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden flex flex-col bg-white border border-navy/10 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ opacity: 0, transform: "translateY(32px)", transition: `opacity 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}>

      {/* Produktbild */}
      <div className="relative h-56 flex items-center justify-center overflow-hidden flex-shrink-0 bg-[#f5f4ef]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" style={{ objectPosition: "center top" }} />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Package size={56} className="text-navy/20" />
            <span className="font-gothic text-xs font-medium uppercase tracking-widest text-navy/30">Produktbild folgt</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 50%)" }} />
        {unitsPerBox > 1 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold font-gothic bg-cta-yellow text-navy">
            {unitsPerBox} Stk. / Karton
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          {product.subtitle && (
            <p className="font-gothic text-xs font-bold uppercase tracking-widest mb-0.5 text-navy/50">{product.subtitle}</p>
          )}
          <h3 className="font-gothic text-xl font-bold uppercase text-navy">{product.name}</h3>
        </div>

        {product.description && (
          <p className="font-gothic text-sm leading-relaxed mb-4 text-navy/65">{product.description}</p>
        )}

        {/* Tabs */}
        {(product.benefits?.length || product.use_cases?.length || product.targets?.length) ? (
          <div className="mb-4">
            <div className="flex gap-1 p-1 rounded-xl mb-3 bg-[#f5f4ef]">
              {(["benefits", "usecases", "targets"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-gothic text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${activeTab === tab ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy"}`}>
                  {tab === "benefits" ? "Vorteile" : tab === "usecases" ? "Einsatz" : "Zielgruppe"}
                </button>
              ))}
            </div>
            {tabItems.length > 0 && (
              <ul className="space-y-1.5">
                {tabItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 font-gothic text-sm text-navy/70">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cta-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <div className="flex-1" />
        <hr className="my-4 border-navy/10" />

        {/* Action Button */}
        <div className="space-y-3">
          <a href="#haendler-werden"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-gothic text-sm font-bold uppercase tracking-wide bg-cta-yellow text-navy hover:bg-[#f5e751] hover:shadow-[0_12px_30px_-12px_rgba(253,242,119,0.7)] transition-all duration-200 cursor-pointer">
            Jetzt Händler werden
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ apiProducts, loading, error }: { apiProducts: ApiProduct[]; loading: boolean; error: string | null }) {
  const headingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headingRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  return (
    <section id="produkte" className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <hr className="border-navy/10 mb-16" />
        <div ref={headingRef} className="mb-12" style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
          <SectionBadge className="mb-4">Produktkatalog</SectionBadge>
          <h2 className="font-gothic text-[28px] font-bold uppercase leading-[1.05] text-navy sm:text-[36px] lg:text-[44px] mt-3">
            Unser <span className="text-awake-blue">Sortiment</span>
          </h2>
          <p className="font-gothic text-[15px] leading-relaxed text-navy/65 mt-3 max-w-xl sm:text-[17px]">
            Entdecke das exklusive AWAKE Produktsortiment. Werde jetzt Händler, um Zugriff auf B2B-Konditionen, Staffelpreise und direkte Bestellungen zu erhalten.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin border-navy/30" style={{ borderTopColor: "#173A57" }} />
              <p className="font-gothic text-sm text-navy/50">Produkte werden geladen…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-24">
            <div className="rounded-2xl p-8 text-center bg-[#f5f4ef] border border-navy/10">
              <p className="font-gothic text-base mb-2 text-navy font-bold">Fehler beim Laden</p>
              <p className="font-gothic text-sm text-navy/60">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiProducts.map((product, i) => <ProductCard key={product.id} product={product} delay={i * 100} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MARKETING SECTION
// ──────────────────────────────────────────────────────────────────────────────

const marketingCategories = [
  { key: "produktbilder", icon: ImageIcon, title: "Produktbilder", description: "Hochauflösende Produktfotos für alle Kanäle – Dosen, Flaschen und Quetschbeutel.", items: ["PNG transparent", "JPG Studio", "3D Renders", "Freisteller"], available: true },
  { key: "social_media", icon: Share2, title: "Social Media", description: "Fertige Vorlagen für Instagram, Facebook und LinkedIn – Stories, Posts und Reels.", items: ["Instagram Stories", "Feed Posts", "LinkedIn Banner", "Reels Vorlagen"], available: true },
  { key: "flyer", icon: FileText, title: "Flyer & Broschüren", description: "Druckfertige Materialien für deinen Point of Sale und Beratungsgespräche.", items: ["A5 Flyer", "A4 Broschüre", "Produktdatenblatt", "Preisliste"], available: true },
  { key: "poster", icon: Printer, title: "Poster & Roll-Ups", description: "Großformatige Druckmaterialien für Messen, Studios und Praxen.", items: ["A1 Poster", "A0 Poster", "Roll-Up 85×200", "Aufsteller"], available: false },
  { key: "logos", icon: Monitor, title: "Logos & Brand Assets", description: "Alle AWAKE Logos und Markenelemente in verschiedenen Formaten und Farben.", items: ["SVG Vektoren", "PNG transparent", "Dark Version", "Light Version"], available: true },
  { key: "product_info", icon: BookOpen, title: "Produktinformationen", description: "Detaillierte Produktbeschreibungen, Inhaltsstoffe und Anwendungsempfehlungen.", items: ["Produktpass", "Inhaltsstoffe", "FAQ Dokument", "Anwendungsguide"], available: true },
  { key: "studies", icon: FlaskConical, title: "Studienübersicht", description: "Wissenschaftliche Grundlagen zu molekularem Wasserstoff – für deine Beratungsgespräche.", items: ["Studienübersicht", "Forschungsstand", "Wirkungsmechanismen", "Zitierbare Quellen"], available: true },
  { key: "lifestyle", icon: Award, title: "Lifestyle Bilder", description: "Premium Lifestyle-Fotografie für eine authentische Markenkommunikation.", items: ["Fitness & Sport", "Wellness & Spa", "Business & Longevity", "Outdoor"], available: false },
];

function MarketingCard({ cat, delay, downloads }: { cat: (typeof marketingCategories)[0]; delay: number; downloads: MarketingDownload[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = cat.icon;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, delay); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, [delay]);

  const catDownloads = downloads.filter(d => d.category === cat.key && d.file_url);
  const isAvailable = cat.available || catDownloads.length > 0;

  const handleDownload = () => {
    if (catDownloads.length > 0 && catDownloads[0].file_url) {
      window.open(catDownloads[0].file_url, '_blank');
    }
  };

  return (
    <div ref={ref} className="rounded-2xl p-5 flex flex-col gap-4 bg-white border border-navy/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
      style={{ opacity: 0, transform: "translateY(24px)", transition: `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms, box-shadow 0.3s ease-out` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#f5f4ef]">
          <Icon size={20} className="text-navy" />
        </div>
        {!isAvailable && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-gothic text-xs font-bold uppercase tracking-wide bg-[#f5f4ef] text-navy/40 border border-navy/10">
            <Lock size={10} /> Bald
          </span>
        )}
      </div>
      <div>
        <h3 className="font-gothic text-base font-bold uppercase mb-2 text-navy">{cat.title}</h3>
        <p className="font-gothic text-sm leading-relaxed mb-3 text-navy/60">{cat.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {cat.items.map((item) => (
            <span key={item} className="font-gothic text-xs px-2 py-0.5 rounded-md bg-[#f5f4ef] text-navy/55">{item}</span>
          ))}
        </div>
      </div>
      <button 
        onClick={handleDownload}
        disabled={!isAvailable || catDownloads.length === 0}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-full font-gothic text-sm font-bold uppercase tracking-wide transition-all duration-200 mt-auto cursor-pointer w-full ${isAvailable && catDownloads.length > 0 ? "bg-cta-yellow text-navy hover:bg-[#f5e751]" : "bg-[#f5f4ef] text-navy/30 border border-navy/10 cursor-not-allowed"}`}
      >
        {isAvailable && catDownloads.length > 0 ? <Download size={15} /> : <Lock size={15} />}
        {isAvailable && catDownloads.length > 0 ? "Herunterladen" : "Bald verfügbar"}
      </button>
    </div>
  );
}

function MarketingSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [downloads, setDownloads] = useState<MarketingDownload[]>([]);

  useEffect(() => {
    const el = headingRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  useEffect(() => {
    getPublicDownloads()
      .then((data) => {
        setDownloads(data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der öffentlichen Downloads:", err);
      });
  }, []);

  return (
    <section id="marketing" className="py-16 lg:py-24 bg-[#f5f4ef]">
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <hr className="border-navy/10 mb-16" />
        <div ref={headingRef} className="mb-12" style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
          <SectionBadge className="mb-4">Marketing Center</SectionBadge>
          <h2 className="font-gothic text-[28px] font-bold uppercase leading-[1.05] text-navy sm:text-[36px] lg:text-[44px] mt-3">
            Alles, was du für deinen <span className="text-awake-blue">Erfolg</span> brauchst
          </h2>
          <p className="font-gothic text-[15px] leading-relaxed text-navy/65 mt-3 max-w-xl sm:text-[17px]">
            Professionelle Marketingmaterialien, die deine Kunden überzeugen – fertig gestaltet, sofort einsatzbereit.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {marketingCategories.map((cat, i) => <MarketingCard key={cat.key} cat={cat} delay={i * 60} downloads={downloads} />)}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// RETAILER REVENUE SECTION
// ──────────────────────────────────────────────────────────────────────────────

const revenueExamples = [
  { icon: Dumbbell, type: "Fitnessstudio", integrations: [{ label: "Einzelverkauf an der Theke", detail: "2–4 Dosen pro Mitglied/Woche", potential: "Mittel" }, { label: "Mitgliedschafts-Bundle", detail: "AWAKE inklusive in Premium-Abo", potential: "Hoch" }, { label: "Personal Training Add-on", detail: "Empfehlung durch Trainer", potential: "Mittel" }, { label: "Kühlschrank-Platzierung", detail: "Impulskauf nach dem Training", potential: "Hoch" }] },
  { icon: Heart, type: "Longevity Center", integrations: [{ label: "Therapiebegleitend", detail: "Teil von Longevity-Protokollen", potential: "Sehr hoch" }, { label: "Produktverkauf", detail: "Kartons an Klienten", potential: "Hoch" }, { label: "Welcome Drink", detail: "AWAKE als Begrüßungsgetränk", potential: "Mittel" }, { label: "Empfehlungsprogramm", detail: "Klienten empfehlen weiter", potential: "Hoch" }] },
  { icon: Stethoscope, type: "Therapeut / Arzt", integrations: [{ label: "Praxisverkauf", detail: "Direktverkauf an Patienten", potential: "Mittel" }, { label: "Behandlungsbegleitung", detail: "Empfehlung als Ergänzung", potential: "Hoch" }, { label: "Schulungen & Webinare", detail: "Fachlicher Austausch", potential: "Mittel" }, { label: "Online-Shop Integration", detail: "Affiliate-Link für Patienten", potential: "Mittel" }] },
  { icon: Hotel, type: "Hotel / Wellness", integrations: [{ label: "Welcome Drink", detail: "AWAKE beim Check-in", potential: "Hoch" }, { label: "Minibar & Restaurant", detail: "Premium-Getränkekarte", potential: "Sehr hoch" }, { label: "Spa-Bereich", detail: "Teil des Wellness-Erlebnisses", potential: "Hoch" }, { label: "Zimmer-Service", detail: "Auf Anfrage der Gäste", potential: "Mittel" }] },
];

const potentialColors: Record<string, string> = { "Sehr hoch": "bg-cta-yellow text-navy", "Hoch": "bg-navy/10 text-navy font-semibold", "Mittel": "bg-navy/5 text-navy/60" };

const RetailerMap = dynamic(() => import("../components/RetailerMap"), { ssr: false });

function RetailerRevenueSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const locatorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    [headingRef, locatorRef].forEach((ref) => {
      const el = ref.current; if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); }
      }, { threshold: 0.1 });
      observer.observe(el);
    });
  }, []);

  return (
    <>
      {/* Retailer Locator */}
      <section id="retailer-locator" className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
          <hr className="border-navy/10 mb-16" />
          <div ref={locatorRef} className="rounded-3xl overflow-hidden border border-navy/10 shadow-sm"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 bg-white">
                <SectionBadge className="mb-6"><MapPin size={12} className="mr-1" /> Retailer Locator</SectionBadge>
                <h2 className="font-gothic text-[26px] font-bold uppercase leading-[1.05] text-navy sm:text-[32px] mt-3 mb-4">
                  Werde auf der <span className="text-awake-blue">AWAKE Karte</span> sichtbar
                </h2>
                <p className="font-gothic text-[15px] leading-relaxed text-navy/65 mb-8">
                  Alle AWAKE Partner werden auf unserer interaktiven Händlerkarte gelistet. Kunden, die AWAKE suchen, finden direkt deinen Standort.
                </p>
                <div className="space-y-4 mb-8">
                  {[{ icon: MapPin, text: "Dein Standort auf der offiziellen AWAKE Karte" }, { icon: Users, text: "Neue Kunden durch organische Suche gewinnen" }, { icon: TrendingUp, text: "Erhöhte Sichtbarkeit in deiner Region" }, { icon: Gift, text: "Kostenlos für alle registrierten Partner" }].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-cta-yellow">
                          <ItemIcon size={15} className="text-navy" />
                        </div>
                        <span className="font-gothic text-sm text-navy/75">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-gothic text-sm font-bold bg-[#f5f4ef] text-navy/40 border border-navy/10">
                  <span className="px-2 py-0.5 rounded-full font-gothic text-xs font-bold bg-cta-yellow text-navy">Coming Soon</span>
                  Demnächst verfügbar
                </div>
              </div>
              <div className="relative min-h-[400px] lg:min-h-0 w-full h-full">
                <RetailerMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Umsatzpotenziale */}
      <section id="umsatz" className="py-16 lg:py-24 bg-[#f5f4ef]">
        <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
          <hr className="border-navy/10 mb-16" />
          <div ref={headingRef} className="mb-12" style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
            <SectionBadge className="mb-4"><TrendingUp size={12} className="mr-1" /> Umsatzpotenziale</SectionBadge>
            <h2 className="font-gothic text-[28px] font-bold uppercase leading-[1.05] text-navy sm:text-[36px] lg:text-[44px] mt-3">
              Wie AWAKE in dein <span className="text-awake-blue">Geschäft</span> passt
            </h2>
            <p className="font-gothic text-[15px] leading-relaxed text-navy/65 mt-3 max-w-xl sm:text-[17px]">
              Entdecke, wie andere Partner AWAKE erfolgreich integrieren – von Einzelverkauf bis zu strategischen Bundles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revenueExamples.map((example) => {
              const Icon = example.icon;
              return (
                <div key={example.type} className="rounded-2xl p-6 bg-white border border-navy/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cta-yellow">
                      <Icon size={20} className="text-navy" />
                    </div>
                    <h3 className="font-gothic text-lg font-bold uppercase text-navy">{example.type}</h3>
                  </div>
                  <div className="space-y-3">
                    {example.integrations.map((integration) => (
                      <div key={integration.label} className="flex items-start justify-between gap-3 py-2.5 px-3 rounded-xl bg-[#f5f4ef]">
                        <div>
                          <div className="font-gothic text-sm font-bold text-navy">{integration.label}</div>
                          <div className="font-gothic text-xs text-navy/55 mt-0.5">{integration.detail}</div>
                        </div>
                        <span className={`font-gothic text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${potentialColors[integration.potential] ?? "bg-navy/5 text-navy/50"}`}>
                          {integration.potential}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMING SOON + PARTNER PROGRAM + SUCCESS STORIES
// ──────────────────────────────────────────────────────────────────────────────

const successStories = [
  { type: "Fitnessstudio", name: "Premium Gym München", quote: "Unsere Mitglieder fragen aktiv nach AWAKE. Es ist zum festen Bestandteil unseres Angebots geworden.", metric: "★★★★★", metricLabel: "Partnerbewertung", avatar: "F" },
  { type: "Longevity Center", name: "Longevity Lab Berlin", quote: "AWAKE ergänzt unsere Protokolle perfekt. Klienten schätzen die Qualität und die Wissenschaft dahinter.", metric: "★★★★★", metricLabel: "Partnerbewertung", avatar: "L" },
  { type: "Biohacking Lab", name: "BioHack Studio Hamburg", quote: "Als Biohacking-Enthusiasten war AWAKE die logische Wahl. Trinkfertig, stabil, wissenschaftlich fundiert.", metric: "★★★★★", metricLabel: "Partnerbewertung", avatar: "B" },
  { type: "Gesundheitszentrum", name: "Vitality Center Wien", quote: "Die Zusammenarbeit mit AWAKE is unkompliziert und professionell. Genau das, was wir uns wünschen.", metric: "★★★★★", metricLabel: "Partnerbewertung", avatar: "G" },
];

function ComingSoonSection() {
  const heading2Ref = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    [heading2Ref, partnerRef].forEach((ref) => {
      const el = ref.current; if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); }
      }, { threshold: 0.1 });
      observer.observe(el);
    });
  }, []);

  return (
    <>
      {/* Partnerprogramm */}
      <section id="partnerprogramm" className="py-16 lg:py-24 bg-navy">
        <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
          <div ref={partnerRef} className="rounded-3xl overflow-hidden bg-white/5 border border-white/15 backdrop-blur-sm"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <SectionBadge variant="outline" className="mb-6"><Users size={12} className="mr-1" /> Partnerprogramm</SectionBadge>
                <h2 className="font-gothic text-[26px] font-bold uppercase leading-[1.05] text-white sm:text-[32px] mt-3 mb-4">
                  Empfehlen und <span className="text-cta-yellow">verdienen</span>
                </h2>
                <p className="font-gothic text-[15px] leading-relaxed text-white/70 mb-8">
                  Als AWAKE Partner kannst du das Netzwerk aktiv mitgestalten. Empfehle neue Geschäftskunden oder Privatkunden und profitiere von attraktiven Provisionen.
                </p>
                {[{ title: "Geschäftskunden empfehlen (B2B)", icon: Users, text: "Empfehle einen Retailer, der bei AWAKE bestellt, und erhalte einmalig", value: "10 %", unit: "des Bestellwertes" }, { title: "Privatkunden empfehlen (B2C)", icon: Gift, text: "Teile deinen Empfehlungslink und verdiene auf jeden Kauf", value: "20 %", unit: "Provision" }].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl p-5 mb-4 bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-cta-yellow/15">
                          <Icon size={16} className="text-cta-yellow" />
                        </div>
                        <div className="font-gothic text-sm font-bold text-white">{item.title}</div>
                      </div>
                      <p className="font-gothic text-sm mb-3 text-white/60">{item.text}</p>
                      <div className="inline-flex items-baseline gap-1 px-3 py-1.5 rounded-lg bg-cta-yellow/15 border border-cta-yellow/25">
                        <span className="font-gothic text-2xl font-bold text-cta-yellow">{item.value}</span>
                        <span className="font-gothic text-xs text-white/60">{item.unit}</span>
                      </div>
                    </div>
                  );
                })}
                <a href="mailto:support@h2-awake.de"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-gothic text-sm font-bold uppercase tracking-wide bg-cta-yellow text-navy hover:bg-[#f5e751] transition-all">
                  Jetzt teilnehmen
                </a>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-white/5">
                <div className="space-y-3">
                  {[{ label: "B2B – Einmalige Provision", value: "10 % des Bestellwertes" }, { label: "B2C – Provision je Kauf", value: "20 %" }, { label: "B2C – Weitere Stufen", value: "5 Stufen" }, { label: "Auszahlung", value: "Monatlich, transparent" }, { label: "Tracking", value: "Dashboard (bald)" }].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/5 border border-white/8">
                      <span className="font-gothic text-sm text-white/60">{item.label}</span>
                      <span className="font-gothic text-sm font-semibold text-cta-yellow">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Erfolgsstories */}
      <section id="stories" className="py-16 lg:py-24 bg-[#f5f4ef]">
        <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
          <hr className="border-navy/10 mb-16" />
          <div ref={heading2Ref} className="mb-12" style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
            <SectionBadge className="mb-4">Erfolgsstories</SectionBadge>
            <h2 className="font-gothic text-[28px] font-bold uppercase leading-[1.05] text-navy sm:text-[36px] lg:text-[44px] mt-3">
              Was unsere <span className="text-awake-blue">Partner</span> sagen
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {successStories.map((story) => (
              <div key={story.name} className="rounded-2xl p-6 bg-white border border-navy/10 shadow-sm">
                <Quote size={24} className="text-cta-yellow mb-4" />
                <p className="font-gothic text-base leading-relaxed mb-6 italic text-navy/75">„{story.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-gothic text-sm font-bold bg-cta-yellow text-navy">{story.avatar}</div>
                    <div>
                      <div className="font-gothic text-sm font-bold text-navy">{story.name}</div>
                      <div className="font-gothic text-xs text-navy/50">{story.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-gothic text-sm font-bold text-cta-yellow">{story.metric}</div>
                    <div className="font-gothic text-xs text-navy/45">{story.metricLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// RETAILER REGISTRATION FORM
// ──────────────────────────────────────────────────────────────────────────────

function RetailerRegistrationSection() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        message: "",
      });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="haendler-werden" className="py-16 lg:py-24 bg-[#f5f4ef] border-t border-navy/10">
      <div className="mx-auto max-w-[1350px] px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Text block */}
          <div className="lg:col-span-5 space-y-6">
            <SectionBadge className="mb-2">Händler werden</SectionBadge>
            <h2 className="font-gothic text-[32px] font-bold uppercase leading-[1.05] text-navy sm:text-[40px] lg:text-[48px]">
              Werde Teil der <span className="text-awake-blue">AWAKE</span> Bewegung
            </h2>
            <p className="font-gothic text-base leading-relaxed text-navy/70">
              Profitiere von attraktiven Händlerkonditionen, schnellen Lieferzeiten und exzellentem Support. Fülle einfach das Formular aus und wir setzen uns in Kürze mit dir in Verbindung.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cta-yellow flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-gothic text-sm font-bold text-navy uppercase">Attraktive Margen</h4>
                  <p className="font-gothic text-xs text-navy/60">Profitable Staffelpreise für alle Bestellmengen.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cta-yellow flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-gothic text-sm font-bold text-navy uppercase">Marketing-Support</h4>
                  <p className="font-gothic text-xs text-navy/60">Kostenloses Werbematerial und transparente Marken-Assets.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cta-yellow flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-gothic text-sm font-bold text-navy uppercase">Schnelle Lieferung</h4>
                  <p className="font-gothic text-xs text-navy/60">B2B-Bestellungen werden prioritär innerhalb von 48h versendet.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-navy/10 shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy to-cta-yellow" />
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-gothic text-xl font-bold uppercase mb-2 text-navy">Händlerzugang anfragen</h3>
                  <p className="font-gothic text-xs text-navy/60 mb-6">
                    Fülle das Formular aus. Wir prüfen deine Angaben und richten deinen Händlerzugang ein.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="companyName" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                          Firmenname *
                        </label>
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Muster GmbH"
                          className="w-full px-4 py-3 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm font-gothic text-navy placeholder:text-navy/35"
                        />
                      </div>
                      <div>
                        <label htmlFor="contactName" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                          Ansprechpartner *
                        </label>
                        <input
                          id="contactName"
                          name="contactName"
                          type="text"
                          required
                          value={formData.contactName}
                          onChange={handleChange}
                          placeholder="Max Mustermann"
                          className="w-full px-4 py-3 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm font-gothic text-navy placeholder:text-navy/35"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                          E-Mail-Adresse *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="partner@beispiel.de"
                          className="w-full px-4 py-3 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm font-gothic text-navy placeholder:text-navy/35"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                          Telefonnummer *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+49 123 456789"
                          className="w-full px-4 py-3 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm font-gothic text-navy placeholder:text-navy/35"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                        Nachricht / Anmerkungen (optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Wie bist du auf uns aufmerksam geworden oder welche Produkte interessieren dich besonders?"
                        className="w-full px-4 py-3 bg-[#f5f4ef]/30 border border-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm font-gothic text-navy placeholder:text-navy/35 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#173A57] hover:bg-[#173A57]/90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide font-gothic border-none"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Jetzt registrieren</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-gothic text-2xl font-bold uppercase text-navy mb-3">Vielen Dank für deine Anfrage!</h3>
                  <p className="font-gothic text-sm text-navy/70 max-w-md mx-auto leading-relaxed">
                    Wir haben deine Daten erhalten und prüfen deine Anfrage. Ein persönlicher AWAKE Ansprechpartner wird sich in Kürze telefonisch oder per E-Mail bei dir melden.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 px-6 py-2.5 rounded-full border border-navy/20 text-navy hover:bg-[#f5f4ef] font-bold text-xs uppercase tracking-wide transition-all cursor-pointer bg-transparent"
                  >
                    Neues Formular senden
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// VISION + CLOSING CTA
// ──────────────────────────────────────────────────────────────────────────────

function VisionSupportSection() {
  const closingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = closingRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); }
    }, { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Closing CTA */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-navy">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(253,242,119,0.08) 0%, transparent 70%)" }} />
        <div className="mx-auto max-w-[1350px] px-4 lg:px-8 relative z-10 text-center">
          <div ref={closingRef} style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
            <SectionBadge variant="outline" className="mb-8 mx-auto">AWAKE Partner</SectionBadge>
            <h2 className="font-gothic text-[28px] font-bold uppercase leading-[1.05] text-white sm:text-[40px] lg:text-[52px] mb-6 max-w-3xl mx-auto">
              Du bist nicht einfach Händler.{" "}
              <span className="text-cta-yellow">Du bist Teil der Bewegung.</span>
            </h2>
            <p className="font-gothic text-[15px] leading-relaxed text-white/65 max-w-xl mx-auto mb-10 sm:text-[17px]">
              Gemeinsam bringen wir Wasserstoffwasser nach Europa. Danke, dass du früh dabei bist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#produkte"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-gothic text-base font-bold uppercase tracking-wide bg-cta-yellow text-navy hover:bg-[#f5e751] hover:shadow-[0_12px_30px_-12px_rgba(253,242,119,0.5)] transition-all">
                Jetzt bestellen <ArrowRight size={18} />
              </a>
              <a href="mailto:support@h2-awake.de"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-gothic text-base font-semibold border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all">
                Support kontaktieren
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGE CONTENT
// ──────────────────────────────────────────────────────────────────────────────

function PageContent() {
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts("DE")
      .then((products) => { setApiProducts(products); setLoading(false); })
      .catch((err) => { setError(err.message || "Produkte konnten nicht geladen werden."); setLoading(false); });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <DashboardSection />
      <ProductsSection apiProducts={apiProducts} loading={loading} error={error} />
      <MarketingSection />
      <RetailerRevenueSection />
      <ComingSoonSection />
      <RetailerRegistrationSection />
      <VisionSupportSection />
      <CartDrawer />
      <ContactWidget />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ──────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return <PageContent />;
}
