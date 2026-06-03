"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck, CheckCircle2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";
import { FadeUp, FadeRight, ScaleIn, PopIn, TextReveal, BlurIn } from "./animations";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { useAwakeCheckout } from "@/components/awake/use-awake-checkout";
import { DoseUpgradePopup } from "@/components/awake-dose/dose-upgrade-popup";
import type { AwakeFlowContext, AwakePlanConfig } from "@/components/awake/types";

const communityVideos = [
  {
    thumbnail: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bbc05551425c2a48c4132c_eike.avif",
    embedUrl: "https://streamable.com/e/q9so7t?",
  },
  {
    thumbnail: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bbc0a4e094fa3fb0ca0203_calmly.avif",
    embedUrl: "https://streamable.com/e/hi49s9?",
  },
  {
    thumbnail: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bbc27e8b0d5c643f7944c8_rewe.avif",
    embedUrl: "https://streamable.com/e/tdj76x",
  },
];

function formatPrice(amount: number) {
  return `${(amount / 100).toFixed(2).replace(".", ",")}€`;
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: AwakePlanConfig;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isTopPlan = !!plan.highlight;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      className={`relative rounded-lg p-5 lg:p-6 bg-white cursor-pointer transition-colors h-full flex flex-col ${
        isSelected
          ? "border-2 border-[#173A57]"
          : "border border-gray-200 hover:border-[#173A57]"
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3 right-6">
          <SectionBadge variant="bordered" className="py-1">
            {plan.highlight}
          </SectionBadge>
        </div>
      )}
      <div className={isTopPlan ? "flex justify-between items-start mb-5" : ""}>
        <div>
          <SectionBadge variant="navy" size="sm" className="mb-2">
            {plan.badge?.toUpperCase()}
          </SectionBadge>
          <h3 className="font-gothic font-bold text-[18px] text-[#173A57]">{plan.label}</h3>
          {!isTopPlan && (
            <>
              <div className="font-bold text-[26px] text-[#173A57] mt-2 mb-1">
                {formatPrice(plan.displayPrice)}
                <span className="text-[16px] font-bold">/mtl.</span>
              </div>
              <div className="text-[12px] text-gray-500 mb-4">inkl. 19% MwSt., exkl. Pfand</div>
            </>
          )}
        </div>
        {isTopPlan && (
          <div className="text-right shrink-0">
            <div className="font-bold text-[26px] text-[#173A57]">
              {formatPrice(plan.displayPrice)}
              <span className="text-[16px] font-bold">/mtl.</span>
            </div>
            <div className="text-[12px] text-gray-500 mt-1">inkl. 19% MwSt., exkl. Pfand</div>
          </div>
        )}
      </div>
      <div className={`flex-col gap-3 text-[14px] text-[#173A57] flex-1 ${isSelected ? "flex" : "hidden md:flex"}`}>
        {isTopPlan ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#173A57] fill-[#173A57] text-white shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        ) : (
          plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#173A57] fill-[#173A57] text-white shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))
        )}
      </div>
      <div className={`mt-3 ${isSelected ? "block" : "hidden md:block"}`}>
        <p className="text-[10px] text-[#173A57] text-left font-gothic">
          zzgl. 0,25 € Pfand je Dose
        </p>
      </div>
    </div>
  );
}

// Icon components matching the live site
function GlassIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3 L7.5 21 L16.5 21 L18 3 Z" stroke="#173a57" strokeWidth="1.5" strokeLinejoin="round" fill="none"></path>
      <line x1="6" y1="3" x2="18" y2="3" stroke="#173a57" strokeWidth="1.5" strokeLinecap="round"></line>
      <path d="M8.5 14 Q10.5 12.5 12 14 Q13.5 15.5 15.5 14" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round" fill="none"></path>
    </svg>
  );
}

function CanIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="7" y="5" width="10" height="15" rx="2" ry="2" stroke="#173a57" strokeWidth="1.5" fill="none"></rect>
      <ellipse cx="12" cy="5" rx="5" ry="1.5" stroke="#173a57" strokeWidth="1.5" fill="none"></ellipse>
      <ellipse cx="12" cy="20" rx="5" ry="1.5" stroke="#173a57" strokeWidth="1.5" fill="none"></ellipse>
      <line x1="12" y1="3.5" x2="12" y2="5" stroke="#173a57" strokeWidth="1.5" strokeLinecap="round"></line>
      <circle cx="12" cy="3" r="1" stroke="#173a57" strokeWidth="1.2" fill="none"></circle>
    </svg>
  );
}

function H2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="7" cy="12" r="3.5" stroke="#173a57" strokeWidth="1.5" fill="none"></circle>
      <circle cx="17" cy="12" r="3.5" stroke="#173a57" strokeWidth="1.5" fill="none"></circle>
      <line x1="10.5" y1="12" x2="13.5" y2="12" stroke="#173a57" strokeWidth="1.5" strokeLinecap="round"></line>
      <line x1="5.5" y1="10.5" x2="5.5" y2="13.5" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round"></line>
      <line x1="8.5" y1="10.5" x2="8.5" y2="13.5" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round"></line>
      <line x1="5.5" y1="12" x2="8.5" y2="12" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round"></line>
      <line x1="15.5" y1="10.5" x2="15.5" y2="13.5" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round"></line>
      <line x1="18.5" y1="10.5" x2="18.5" y2="13.5" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round"></line>
      <line x1="15.5" y1="12" x2="18.5" y2="12" stroke="#173a57" strokeWidth="1.2" strokeLinecap="round"></line>
    </svg>
  );
}

function ZeroIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="#173a57" strokeWidth="1.5" fill="none"></circle>
      <ellipse cx="12" cy="12" rx="3.5" ry="5" stroke="#173a57" strokeWidth="1.5" fill="none"></ellipse>
      <line x1="9" y1="16.5" x2="15" y2="7.5" stroke="#173a57" strokeWidth="1.5" strokeLinecap="round"></line>
    </svg>
  );
}

const benefitsList = [
  {
    Icon: GlassIcon,
    text: "Direkt trinkfertig für deinen Alltag. Ohne Vorbereitung, ohne Warten.",
  },
  {
    Icon: CanIcon,
    text: "Eine Dose deckt deinen Bedarf. Maximale Wirkung mit minimalem Aufwand.",
  },
  {
    Icon: H2Icon,
    text: "H2 als selektives Antioxidant: Präzise Wirkung auf zellulärer Ebene.",
  },
  {
    Icon: ZeroIcon,
    text: "Keine Kompromisse bei den Inhaltsstoffen. Null Kalorien, null Zucker. Reinheit, die man spürt.",
  },
];

function BenefitsDescriptionSection() {
  const [activeTab, setActiveTab] = useState<"benefits" | "description">("benefits");

  return (
    <div className="rounded-lg bg-[#F5F5F5] p-4 mb-8 sm:p-6">
      <div role="tablist" aria-label="Produktinformationen" className="flex bg-white rounded-full p-1 mb-6">
        <button
          role="tab"
          aria-selected={activeTab === "benefits"}
          aria-controls="tabpanel-benefits"
          id="tab-benefits"
          onClick={() => setActiveTab("benefits")}
          className={`flex-1 py-3 rounded-full font-bold text-[14px] text-center cursor-pointer transition-colors sm:text-[15px] ${
            activeTab === "benefits"
              ? "bg-[#173A57] text-white shadow-sm"
              : "text-[#173A57]/70 hover:text-[#173A57]"
          }`}
        >
          Vorteile
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "description"}
          aria-controls="tabpanel-description"
          id="tab-description"
          onClick={() => setActiveTab("description")}
          className={`flex-1 py-3 rounded-full font-bold text-[14px] text-center cursor-pointer transition-colors sm:text-[15px] ${
            activeTab === "description"
              ? "bg-[#173A57] text-white shadow-sm"
              : "text-[#173A57]/70 hover:text-[#173A57]"
          }`}
        >
          Produktdetails
        </button>
      </div>

      {activeTab === "benefits" ? (
        <ul id="tabpanel-benefits" role="tabpanel" aria-labelledby="tab-benefits" className="space-y-5 text-[15px] text-[#173A57]">
          {benefitsList.map((benefit, idx) => {
            const IconComponent = benefit.Icon;
            return (
              <li key={idx} className="flex gap-3 items-start">
                <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{benefit.text}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div id="tabpanel-description" role="tabpanel" aria-labelledby="tab-description" className="text-[15px] text-[#173A57] leading-relaxed space-y-4">
          <p>Wasserstoffangereichertes, stilles Wasser mit Zitronen-Limetten Geschmack</p>
          <p><span className="font-bold">Zutaten:</span> Gefiltertes Wasser, molekularer Wasserstoff (PPM), natürliches Zitronen-Limetten-Aroma</p>
          <div>
            <p className="mb-2">Nährwerte pro 100 ml:</p>
            <ul className="space-y-1">
              <li>Brennwert 0 kJ/kcal</li>
              <li>Fett 0g, davon gesättigte Fettsäuren 0g</li>
              <li>Kohlenhydrate 0g, davon Zucker 0g</li>
              <li>Eiweiß 0g</li>
              <li>Salz 0g</li>
            </ul>
          </div>
          <p><span className="font-bold">Füllmenge:</span> 250 ml</p>
        </div>
      )}
    </div>
  );
}

function ThumbnailGallery({
  images,
  activeIndex,
  onSelect,
  onMainClick,
  productName,
}: {
  images: { url: string; alt: string }[];
  activeIndex: number;
  onSelect: (idx: number) => void;
  onMainClick: () => void;
  productName: string;
}) {
  const thumbsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const rafId = useRef<number>(0);

  const checkScrollability = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      const el = thumbsContainerRef.current;
      if (!el) return;
      setCanScrollUp(el.scrollTop > 0);
      setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    });
  }, []);

  useEffect(() => {
    const el = thumbsContainerRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      resizeObserver.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [checkScrollability, images.length]);

  const scrollThumbs = (direction: "up" | "down") => {
    const el = thumbsContainerRef.current;
    if (!el) return;
    if (direction === "up") {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ top: 120, behavior: "smooth" });
    }
  };

  const canScroll = canScrollUp || canScrollDown;
  const scrollDirection: "up" | "down" = canScrollDown ? "down" : "up";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
      <div className="order-2 lg:order-1 flex flex-row lg:flex-col items-center gap-2 shrink-0">
        <div
          ref={thumbsContainerRef}
          className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto lg:max-h-[500px] scrollbar-hide"
        >
          {images.map((image, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(idx)}
              aria-label={`Bild ${idx + 1} anzeigen`}
              aria-pressed={idx === activeIndex}
              className={`shrink-0 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px] cursor-pointer transition-all p-[2px] m-0 border-0 bg-transparent shadow-none ${
                idx === activeIndex
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                borderRadius: "0.75rem",
                outline: idx === activeIndex ? "1px solid #173A57" : "none",
                outlineOffset: "-1px",
              }}
            >
              <img alt={image.alt}
                src={image.url}
                className="w-full h-full object-cover"
                style={{ display: "block", borderRadius: "calc(0.75rem - 2px)" }}
              />
            </button>
          ))}
        </div>
        {canScroll && (
          <button
            type="button"
            onClick={() => scrollThumbs(scrollDirection)}
            aria-label={scrollDirection === "down" ? "Weitere Bilder anzeigen" : "Zurück zum Anfang scrollen"}
            className="hidden lg:flex w-8 h-8 items-center justify-center cursor-pointer text-[#173A57] hover:text-[#173A57]/70 transition-colors focus:outline-none"
          >
            {scrollDirection === "down" ? (
              <ChevronDown className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <ChevronUp className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onMainClick}
        aria-label={`${productName} – Bild in voller Größe öffnen`}
        className="order-1 lg:order-2 flex-1 cursor-zoom-in rounded-lg overflow-hidden block p-0 m-0 border-0 bg-transparent shadow-none outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173A57] focus-visible:ring-offset-2 self-start"
        style={{ WebkitAppearance: "none", appearance: "none" }}
      >
        <img alt={productName}
          src={images[activeIndex]?.url}
          title={productName}
          className="w-full h-auto rounded-lg"
          style={{ display: "block", aspectRatio: "1/1" }}
          width={800}
          height={800}
        />
      </button>
    </div>
  );
}

export function HeroSection({ flow }: { flow: AwakeFlowContext }) {
  const { standardPlans, upgradePlans } = flow;

  const galleryImages = [
    { id: 1, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc0f369f55fbedc6c6cffb_vs-awake-dose%20(4).avif" },
    { id: 2, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc0cfb1d24b5a7c134d921_awake_shop_fresh.avif" },
    { id: 3, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69ba5eb1eff0be254636eb16_mountain-awake-dose.avif" },
    { id: 4, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc0eef8f7fe3cc353588af_vs-awake-dose%20(3).avif" },
    { id: 5, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69ba5e5836b8d69c68563e41_ice-bad-awake-dose.avif" },
    { id: 6, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc0cc7cd2b49e3e2a7b18b_timeline-awake-dose.avif" },
    { id: 7, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc01c3bd675a8aa2034b95_ice-awake-dose.avif" },
    { id: 8, url: "https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bc0ce0becf26679ce22079_vs-awake-dose%20(1).avif" },
  ];

  const sortedPlans = [...standardPlans].sort((a, b) => a.price - b.price);
  const topPlan = sortedPlans[0];
  const bottomPlans = sortedPlans.slice(1);

  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    topPlan?.planId ?? 0,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedPlan = sortedPlans.find((p) => p.planId === selectedPlanId) ?? topPlan;

  const {
    startCheckout,
    confirmUpgrade,
    declineUpgrade,
    dismissPopup,
    activePlan,
    activeUpgradePlan,
    pending,
  } = useAwakeCheckout();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const closeVideoModal = useCallback(() => setActiveVideoUrl(null), [setActiveVideoUrl]);

  useEffect(() => {
    if (!activeVideoUrl) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideoModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideoUrl, closeVideoModal]);

  const productName = "AWAKE Dose";

  const allGalleryImages = galleryImages.map((img, idx) => ({
    url: img.url,
    alt: `${productName} - ${idx + 1}`,
  }));

  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId);
  };

  const handleAddToCart = () => {
    if (!selectedPlan) return;
    const matchingUpgrade = upgradePlans.find((p) => p.variant === selectedPlan.variant);
    if (!matchingUpgrade) return;
    startCheckout(selectedPlan, matchingUpgrade);
  };

  return (
    <section className="mx-auto max-w-[1350px] px-4 py-6 sm:py-8 lg:py-12 lg:px-8">
      {lightboxIndex !== null && (
        <ImageLightbox
          images={allGalleryImages}
          initialIndex={lightboxIndex}
          onIndexChange={setActiveImageIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-[120px]">
          <ThumbnailGallery
            images={allGalleryImages}
            activeIndex={activeImageIndex}
            onSelect={setActiveImageIndex}
            onMainClick={() => setLightboxIndex(activeImageIndex)}
            productName={productName}
          />
        </div>

        <FadeRight className="flex flex-col font-gothic">
          <BlurIn delay={0}>
            <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold text-[#173A57] mb-3 sm:gap-2 sm:text-[14px] sm:mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FDF277] text-[#FDF277]" />
                ))}
              </div>
              <span>4.8 von + 437 Bewertungen</span>
              <span className="text-gray-300">|</span>
              <span>300k+ Dosen getrunken</span>
            </div>
          </BlurIn>

          <TextReveal delay={100}>
            <h1 className="font-gothic text-[26px] font-bold leading-tight text-navy mb-4 uppercase sm:text-[32px] lg:text-[36px]">
              Wasserstoff-Wasser in der Dose
            </h1>
          </TextReveal>

          <FadeUp delay={150}>
            <p className="text-[14px] text-[#173A57] mb-6 leading-relaxed">
              AWAKE ist mehr als nur ein Getränk &ndash; es ist dein tägliches Ritual für mehr
              Energie, Fokus und Regeneration auf zellulärer Ebene. Spüre den Unterschied von
              hochdosiertem Wasserstoff.
            </p>
          </FadeUp>

          <FadeUp delay={200}>
            <div id="abo" className="rounded-md bg-[#F4F5F7] overflow-hidden mb-8">
              <div className="bg-[#173A57] text-white p-2.5 flex items-center justify-center gap-2 font-bold text-[12px] sm:p-3.5 sm:text-[16px]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>GRATIS: Der große AWAKE H2-GUIDE mit exklusivem Wissen &amp; Anwendungs-Tipps</span>
              </div>

              <div className="flex flex-col gap-4 mb-6 px-5 lg:px-6 mt-6">
                {topPlan && (
                  <PlanCard
                    plan={topPlan}
                    isSelected={selectedPlanId === topPlan.planId}
                    onSelect={() => handleSelectPlan(topPlan.planId)}
                  />
                )}

                {bottomPlans.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    {bottomPlans.map((plan, idx) => (
                      <div key={plan.planId} className="h-full" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                        <PlanCard
                          plan={plan}
                          isSelected={selectedPlanId === plan.planId}
                          onSelect={() => handleSelectPlan(plan.planId)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={pending}
                  className="w-full bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[15px] py-3.5 rounded-full transition-all duration-300 mb-3 cursor-pointer active:scale-95 sm:py-4 sm:text-[21px] sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(253,242,119,0.4)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {pending ? "Bitte warten…" : `Jetzt ${selectedPlan?.ctaLabel ?? "6-Monats-Abo"} bestellen`}
                </button>
                <div className="text-center text-[14px] text-gray-600 mb-5">
                  Schnelle Lieferung - innerhalb 2-3 Werktagen (DE)
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex items-center justify-center gap-2 text-[12px] font-bold text-gray-700 sm:text-[14px]">
                    <ShieldCheck className="w-4 h-4 text-gray-600 shrink-0" />
                    <span>
                      Bezahle bequem per Paypal, Kreditkarte oder SEPA-Lastschrift
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={250}>
            <BenefitsDescriptionSection />
          </FadeUp>

          <FadeUp delay={300}>
            <div className="bg-[#F5F5F5] rounded-lg p-4 lg:p-5">
              <div className="text-center mb-4">
                <SectionBadge className="mb-2">
                  Exklusiv für unsere Community
                </SectionBadge>
                <h3 className="font-gothic text-[24px] font-bold text-[#173A57] mb-2">
                  Monatliche Live-Meetings
                </h3>
                <p className="text-[14px] text-gray-600 max-w-sm mx-auto">
                  Jeden Monat bekommst du als Teil der AWAKE Community Zugang zu einem exklusiven
                  Live-Talk mit Dr. med. Sedat Spiekermann.
                </p>
              </div>

              <div className="bg-[#FFF799] rounded-md p-3 flex flex-col gap-3 items-center sm:flex-row">
                <ScaleIn className="w-full h-[140px] shrink-0 rounded-lg overflow-hidden relative sm:w-[120px] sm:h-[100px] md:w-[140px] md:h-[120px]">
                  <img alt="Dr. med. Sedat Spiekermann"
                    src="https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69bce68239e16d45f61fab33_dr.%20sedat%20spiekermann.avif"
                    className="object-cover w-full h-full"
                  />
                </ScaleIn>
                <div>
                  <span className="text-[14px] font-bold text-[#173A57] block">
                    Dr. med. Spiekermann
                  </span>
                  <span className="text-[12px] text-gray-600">
                    Arzt für Medizinische Osteopathie &amp; Integrative Schmerztherapie
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={350}>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {communityVideos.map((video, idx) => (
                <PopIn
                  key={idx}
                  delay={idx * 100}
                  className="cursor-pointer group"
                  onClick={() => setActiveVideoUrl(video.embedUrl)}
                >
                  <div className="relative rounded-lg overflow-hidden isolate">
                    <img alt={`Kundenstimme ${idx + 1}`}
                      src={video.thumbnail}
                      className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#FDF277] rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="ml-0.5">
                        <path d="M0 0L10 6L0 12V0Z" fill="#173A57" />
                      </svg>
                    </div>
                  </div>
                </PopIn>
              ))}
            </div>
          </FadeUp>
        </FadeRight>
      </div>

      {activeVideoUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kundenstimme Video"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={closeVideoModal}
        >
          <div className="absolute inset-0 bg-[#173A57]/90 backdrop-blur-sm" />
          <button
            type="button"
            onClick={closeVideoModal}
            aria-label="Video schließen"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="relative z-10 w-full max-w-3xl mx-4 aspect-video rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${activeVideoUrl}${activeVideoUrl.includes("?") ? "" : "?"}autoplay=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Kundenstimme Video"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      <DoseUpgradePopup
        standardPlan={activePlan}
        upgradePlan={activeUpgradePlan}
        pending={pending}
        onConfirm={confirmUpgrade}
        onDecline={declineUpgrade}
        onDismiss={dismissPopup}
      />
    </section>
  );
}
