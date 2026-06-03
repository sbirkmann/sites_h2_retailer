"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Droplet,
  Sparkles,
  Star } from
"lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";
import { useAwakeCheckout } from "@/components/awake/use-awake-checkout";
import { DoseUpgradePopup } from "@/components/awake-dose/dose-upgrade-popup";
import { FlascheUpgradePopup } from "@/components/glasflasche/flasche-upgrade-popup";
import type {
  AwakeFlowContext,
  AwakePlanConfig } from
"@/components/awake/types";

function formatPrice(amount: number) {
  return `${(amount / 100).toFixed(2).replace(".", ",")} €`;
}

function StarRating({ score, count }: {score: string;count: string;}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) =>
        <Star
          key={i}
          className="h-4 w-4 fill-cta-yellow text-cta-yellow"
          strokeWidth={1.5} />

        )}
      </div>
      <span className="font-gothic text-[13px] text-navy/70">
        {score} ({count} Bewertungen)
      </span>
    </div>);

}

function FeatureRow({ feature }: {feature: string;}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta-yellow">
        <Check className="h-3 w-3 text-navy" strokeWidth={3} />
      </span>
      <span className="font-gothic text-[12px] sm:text-[13px] text-navy/80 font-normal rounded-none leading-snug">
        {feature}
      </span>
    </div>);

}

function PlanRow({
  plan,
  isSelected,
  isRecommended,
  onSelect,
  periodLabel






}: {plan: AwakePlanConfig;isSelected: boolean;isRecommended: boolean;onSelect: () => void;periodLabel: string;}) {
  const perUnitFeature = plan.features[0] ?? "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all sm:gap-3 sm:p-3 ${
      isSelected ?
      "border-navy bg-navy text-white shadow-[0_8px_24px_-12px_rgba(23,58,87,0.4)]" :
      "border-navy/15 bg-white text-navy hover:border-navy/40"}`
      }>
      
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        isSelected ?
        "border-cta-yellow bg-cta-yellow" :
        "border-navy/30 bg-white"}`
        }>
        
        {isSelected && <span className="h-2 w-2 rounded-full bg-navy" />}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`font-gothic text-[14px] font-bold leading-tight sm:text-[15px] ${
              isSelected ? "text-white" : "text-navy"}`
              }>
              
              {plan.label}
            </p>
            {isRecommended &&
            <span className="rounded-full bg-cta-yellow px-2 py-0.5 font-gothic text-[10px] font-bold uppercase tracking-[0.12em] text-navy">
                Empfohlen
              </span>
            }
          </div>
          {plan.commitment &&
            <p
              className={`mt-1 font-gothic text-[11px] sm:text-[12px] ${
              isSelected ? "text-white/60" : "text-navy/55"}`
              }>

              {plan.commitment}
            </p>
          }
          {plan.savings &&
            <p
              className={`mt-0.5 font-gothic text-[11px] font-bold sm:text-[12px] ${
              isSelected ? "text-cta-yellow" : "text-navy/80"}`
              }>

              {plan.savings}
            </p>
          }
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`whitespace-nowrap font-gothic text-[15px] font-bold leading-tight sm:text-[16px] ${
            isSelected ? "text-white" : "text-navy"}`
            }>
            
            {formatPrice(plan.displayPrice)}
            <span
              className={`ml-1 font-normal text-[12px] ${
              isSelected ? "text-white/65" : "text-navy/55"}`
              }>
              
              {periodLabel}
            </span>
          </p>
          <p
            className={`mt-0.5 whitespace-nowrap font-gothic text-[11px] sm:text-[12px] ${
            isSelected ? "text-white/60" : "text-navy/50"}`
            }>
            
            {perUnitFeature}
          </p>
        </div>
      </div>
    </button>);

}

function PaymentChip({ label }: {label: string;}) {
  return (
    <span className="rounded-full border border-navy/15 bg-white px-3 py-1 font-gothic text-[11px] font-bold uppercase tracking-[0.1em] text-navy/70">
      {label}
    </span>);

}

interface ProductCardProps {
  flow: AwakeFlowContext;
  badge: {label: string;icon: React.ReactNode;tone: "yellow" | "navy";};
  title: string;
  description: string;
  image: {src: string;alt: string;};
  rating: {score: string;count: string;};
  features: string[];
  pfandHint: string;
  ctaTone: "yellow" | "navy";
  fallbackCtaLabel: string;
  popup: "dose" | "flasche";
}

function ProductCard({
  flow,
  badge,
  title,
  description,
  image,
  rating,
  features,
  pfandHint,
  ctaTone,
  fallbackCtaLabel,
  popup
}: ProductCardProps) {
  const orderedPlans = [...flow.standardPlans].reverse();
  const recommendedPlan =
  orderedPlans.find((p) => !!p.highlight) ??
  orderedPlans[orderedPlans.length - 1];
  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    recommendedPlan.planId
  );
  const selectedPlan =
  orderedPlans.find((p) => p.planId === selectedPlanId) ?? recommendedPlan;

  const checkout = useAwakeCheckout();
  const handleCheckout = () => {
    if (!selectedPlan) return;
    const matchingUpgrade = flow.upgradePlans.find(
      (p) => p.variant === selectedPlan.variant
    );
    if (!matchingUpgrade) return;
    checkout.startCheckout(selectedPlan, matchingUpgrade);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_8px_30px_-12px_rgba(23,58,87,0.15)]">
      <div className="absolute left-5 top-5 z-10">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-gothic text-[11px] font-bold uppercase tracking-[0.14em] sm:text-[12px] ${
          badge.tone === "yellow" ?
          "bg-cta-yellow text-navy" :
          "bg-navy text-white"}`
          }>
          
          {badge.icon}
          {badge.label}
        </span>
      </div>

      <div className="relative bg-gradient-to-b from-off-white to-white px-4 pt-12 pb-4 sm:px-6 sm:pt-14 sm:pb-5">
        <div className="relative mx-auto aspect-[5/4] max-w-[220px] sm:max-w-[240px]">
          <Image alt={image.alt}
            src={image.src}
            fill
            sizes="(min-width: 1024px) 240px, 55vw"
            className="object-contain" />

        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-navy/10 p-4 sm:p-5">
        <div>
          <h3 className="font-gothic text-[18px] font-bold uppercase tracking-tight text-navy sm:text-[20px]">
            {title}
          </h3>
          <p className="mt-1 font-gothic text-[12px] leading-relaxed text-navy/65 sm:text-[13px]">
            {description}
          </p>
        </div>

        <StarRating {...rating} />

        <div className="flex flex-col gap-1.5">
          {features.map((feature) =>
          <FeatureRow key={feature} feature={feature} />
          )}
        </div>

        <div>
          <p className="font-gothic text-[11px] font-bold uppercase tracking-[0.14em] text-navy/55">
            Wähle deinen Plan
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {orderedPlans.map((plan) =>
            <PlanRow
              key={plan.planId}
              plan={plan}
              isSelected={selectedPlanId === plan.planId}
              isRecommended={plan.planId === recommendedPlan.planId}
              onSelect={() => setSelectedPlanId(plan.planId)}
              periodLabel={flow.periodLabel} />

            )}
          </div>
        </div>

        <div className="rounded-xl border border-cta-yellow/35 bg-cta-yellow/[0.10] p-3">
          <p className="font-gothic text-[10px] font-bold uppercase tracking-[0.14em] text-navy">
            Zusätzlich enthalten
          </p>
          <p className="mt-1 font-gothic text-[12px] leading-snug text-navy/80 sm:text-[13px]">
            26-Seiten H₂-Guide + monatliche Live-Q&amp;A mit Dr. Spiekermann.
          </p>
        </div>

        <p className="font-gothic text-[11px] text-navy/55">{pfandHint}</p>

        <button
          onClick={handleCheckout}
          disabled={checkout.pending}
          className={`mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-4 font-gothic text-[15px] font-bold uppercase tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-70 sm:py-4 sm:text-[16px] ${
          ctaTone === "yellow" ?
          "bg-cta-yellow text-navy hover:bg-[#f5e751] hover:shadow-[0_12px_30px_-12px_rgba(253,242,119,0.7)]" :
          "bg-navy text-white hover:bg-[#0f2c44] hover:shadow-[0_12px_30px_-12px_rgba(23,58,87,0.5)]"}`
          }>
          
          {checkout.pending ?
          "Bitte warten…" :
          `Jetzt ${selectedPlan?.ctaLabel ?? fallbackCtaLabel} bestellen`}
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <PaymentChip label="PayPal" />
          <PaymentChip label="Kreditkarte" />
          <PaymentChip label="Überweisung" />
        </div>
      </div>

      {popup === "dose" &&
      <DoseUpgradePopup
        standardPlan={checkout.activePlan}
        upgradePlan={checkout.activeUpgradePlan}
        pending={checkout.pending}
        onConfirm={checkout.confirmUpgrade}
        onDecline={checkout.declineUpgrade}
        onDismiss={checkout.dismissPopup} />

      }
      {popup === "flasche" &&
      <FlascheUpgradePopup
        standardPlan={checkout.activePlan}
        upgradePlan={checkout.activeUpgradePlan}
        pending={checkout.pending}
        onConfirm={checkout.confirmUpgrade}
        onDecline={checkout.declineUpgrade}
        onDismiss={checkout.dismissPopup} />

      }
    </div>);

}

export function AbosSection({
  doseFlow,
  flascheFlow



}: {doseFlow: AwakeFlowContext;flascheFlow: AwakeFlowContext;}) {
  return (
    <section id="angebot" className="relative overflow-hidden bg-awake-blue py-10 sm:py-12 lg:py-16 scroll-mt-24">
      <div
        className="pointer-events-none absolute -left-[15%] top-1/4 h-[600px] w-[600px] rounded-full opacity-40"
        style={{
          background:
          "radial-gradient(circle, rgba(253,242,119,0.18) 0%, rgba(253,242,119,0) 70%)"
        }}
        aria-hidden />
      
      <div
        className="pointer-events-none absolute -right-[10%] bottom-1/4 h-[500px] w-[500px] rounded-full opacity-40"
        style={{
          background:
          "radial-gradient(circle, rgba(23,58,87,0.10) 0%, rgba(23,58,87,0) 70%)"
        }}
        aria-hidden />
      

      <div className="relative mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-8 lg:mb-10">
          <SectionBadge className="mb-3 self-center mx-auto">Deine Wahl</SectionBadge>
          <h2 className="font-gothic text-[26px] font-bold uppercase leading-[1.05] text-white sm:text-[34px] lg:text-[42px]">
            Wähle dein{" "}
            AWAKE
          </h2>
          <p className="homenew-subheading mx-auto mt-4 max-w-[640px] font-gothic text-[14px] leading-[1.6] text-white/70 sm:text-[16px]">
            Mit Geschmack oder pur. Monatlich flexibel oder langfristig sparen. Beide Produkte enthalten 11+ ppm molekularen Wasserstoff. Made in Germany.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <ProductCard
            flow={doseFlow}
            badge={{
              label: "Bestseller",
              icon: <Sparkles className="h-3 w-3" strokeWidth={2.5} />,
              tone: "yellow"
            }}
            title="AWAKE Dose"
            description="Mit Geschmack – Zitronen-Limette aus echten Bio-Zitrusfrüchten."
            image={{
              src: "/images/product-dose.avif",
              alt: "AWAKE 30er Dosen Pack"
            }}
            rating={{ score: "4,8", count: "437" }}
            features={[
            "30 Dosen pro Lieferung",
            "0 Zucker · 0 Koffein · 0 Kalorien",
            "BPA-freie Dose"]
            }
            pfandHint="Hinweis: zzgl. 0,25 € Pfand je Dose"
            ctaTone="yellow"
            fallbackCtaLabel="6-Monats-Abo"
            popup="dose" />

          <ProductCard
            flow={flascheFlow}
            badge={{
              label: "Pur & Unverfälscht",
              icon: <Droplet className="h-3 w-3" strokeWidth={2.5} />,
              tone: "navy"
            }}
            title="AWAKE Flasche"
            description="Geschmacksneutral – nur Wasser und molekularer Wasserstoff."
            image={{
              src: "/images/product-flasche.avif",
              alt: "AWAKE 24er Flaschen Pack"
            }}
            rating={{ score: "4,8", count: "437" }}
            features={[
            "24 Flaschen alle 24 Tage",
            "Reines H₂-Wasser ohne Aroma",
            "Nachhaltige Glasflasche"]
            }
            pfandHint="Hinweis: zzgl. 0,08 € Pfand je Flasche"
            ctaTone="navy"
            fallbackCtaLabel="Vorteils-Abo"
            popup="flasche" />
        </div>
      </div>
    </section>);

}