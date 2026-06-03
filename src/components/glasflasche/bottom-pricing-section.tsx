"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";
import { FadeUp, FadeLeft, FadeRight } from "./animations";
import { useAwakeCheckout } from "@/components/awake/use-awake-checkout";
import { FlascheUpgradePopup } from "@/components/glasflasche/flasche-upgrade-popup";
import type { AwakeFlowContext, AwakePlanConfig } from "@/components/awake/types";

function formatPrice(amount: number) {
  return `${(amount / 100).toFixed(2).replace(".", ",")}€`;
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`w-5 h-5 rounded-full bg-[#173A57] flex items-center justify-center shrink-0 ${className}`}>
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </span>
  );
}

function WhiteCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 ${className}`}>
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </span>
  );
}

function BottleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#173A57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <path d="M10 2 L14 2 L14 5 L15 6 L15 9 L14 11 L14 21 C14 21.55 13.55 22 13 22 L11 22 C10.45 22 10 21.55 10 21 L10 11 L9 9 L9 6 L10 5 Z" fill="none" />
      <line x1="9" y1="6" x2="15" y2="6" />
      <line x1="10" y1="13" x2="14" y2="13" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#173A57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <rect x="3" y="12" width="18" height="9" rx="1.5" />
      <rect x="2" y="8" width="20" height="4" rx="1.5" />
      <line x1="12" y1="8" x2="12" y2="21" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M12 8 C11 6 8 5.5 8 4 C8 3 9 2.5 10 3 C11 3.5 12 8 12 8" fill="none" />
      <path d="M12 8 C13 6 16 5.5 16 4 C16 3 15 2.5 14 3 C13 3.5 12 8 12 8" fill="none" />
    </svg>
  );
}

function TopPlanCard({
  plan,
  isSelected,
  onSelect,
  periodLabel,
}: {
  plan: AwakePlanConfig;
  isSelected: boolean;
  onSelect: () => void;
  periodLabel: string;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-lg p-5 lg:p-6 cursor-pointer transition-all ${
        isSelected
          ? "bg-white border-2 border-[#FDF277]"
          : "bg-white/10 border border-white/30 hover:bg-white/20"
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3 right-4 sm:right-6">
          <SectionBadge className="py-1">
            {plan.highlight}
          </SectionBadge>
        </div>
      )}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <span className={`inline-block mb-2 text-[13px] font-bold px-3 py-1 rounded-full transition-colors ${isSelected ? "border-2 border-[#173A57] text-[#173A57]" : "border border-white/40 text-white"}`}>
            {plan.badge}
          </span>
          <h3 className={`font-gothic font-bold text-[18px] transition-colors ${isSelected ? "text-[#173A57]" : "text-white"}`}>{plan.label}</h3>
        </div>
        <div className="sm:text-right">
          <div className={`font-bold text-[26px] leading-tight transition-colors ${isSelected ? "text-[#173A57]" : "text-white"}`}>
            {formatPrice(plan.displayPrice)}<span className="text-[16px]">{periodLabel}</span>
          </div>
          <div className={`text-[12px] transition-colors ${isSelected ? "text-gray-500" : "text-gray-300"}`}>inkl. 19% MwSt., exkl. Pfand</div>
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-y-3 text-[14px] transition-colors ${isSelected ? "text-[#173A57]" : "text-white"}`}>
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {isSelected ? <CheckIcon className="mt-0.5" /> : <WhiteCheckIcon className="mt-0.5" />}
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactPlanCard({
  plan,
  isSelected,
  onSelect,
  periodLabel,
}: {
  plan: AwakePlanConfig;
  isSelected: boolean;
  onSelect: () => void;
  periodLabel: string;
}) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-lg p-5 cursor-pointer transition-all ${
        isSelected
          ? "bg-white border-2 border-[#FDF277]"
          : "bg-white/10 border border-white/30 hover:bg-white/20"
      }`}
    >
      <span className={`inline-block mb-2 text-[13px] font-bold px-3 py-1 rounded-full transition-colors ${isSelected ? "border-2 border-[#173A57] text-[#173A57]" : "border border-white/40 text-white"}`}>
        {plan.badge}
      </span>
      <h3 className={`font-gothic font-bold text-[18px] mb-1 transition-colors ${isSelected ? "text-[#173A57]" : "text-white"}`}>{plan.label}</h3>
      <div className={`font-bold text-[26px] leading-tight mb-0.5 transition-colors ${isSelected ? "text-[#173A57]" : "text-white"}`}>
        {formatPrice(plan.displayPrice)}<span className="text-[16px]">{periodLabel}</span>
      </div>
      <div className={`text-[12px] mb-4 transition-colors ${isSelected ? "text-gray-500" : "text-gray-300"}`}>inkl. 19% MwSt., exkl. Pfand</div>
      <div className={`flex flex-col gap-2 text-[14px] transition-colors ${isSelected ? "text-[#173A57]" : "text-white"}`}>
        {plan.features.map((feature, fIdx) => (
          <div key={fIdx} className="flex items-start gap-2">
            {isSelected ? <CheckIcon className="mt-0.5" /> : <WhiteCheckIcon className="mt-0.5" />}
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BottomPricingSection({ flow }: { flow: AwakeFlowContext }) {
  const { standardPlans, upgradePlans, periodLabel } = flow;

  const sortedPlans = [...standardPlans].sort((a, b) => a.price - b.price);
  const topPlan = sortedPlans[0];
  const bottomPlans = sortedPlans.slice(1);

  const [selectedPlanId, setSelectedPlanId] = useState<number>(topPlan?.planId ?? 0);
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

  const handleAddToCart = () => {
    if (!selectedPlan) return;
    const matchingUpgrade = upgradePlans.find((p) => p.variant === selectedPlan.variant);
    if (!matchingUpgrade) return;
    startCheckout(selectedPlan, matchingUpgrade);
  };

  return (
    <section id="angebot" className="bg-[#173A57] py-12 sm:py-16 lg:py-24 px-4 lg:px-8 text-white">
      <div className="mx-auto max-w-[1350px]">

        <div className="flex flex-col gap-8 sm:gap-12 lg:flex-row lg:gap-16 justify-center">
          <FadeLeft delay={150} className="flex flex-col gap-4 w-full lg:max-w-[592px]">
            <div className="mb-4">
              <FadeUp>
                <SectionBadge className="mb-3">
                  Exklusiv für unsere Kunden
                </SectionBadge>
              </FadeUp>
              <FadeUp delay={50}>
                <h2 className="font-gothic text-[26px] font-bold mb-2 text-white sm:text-[30px] lg:text-[36px]">
                  HYPER-INFUSED H2-WASSER
                </h2>
              </FadeUp>
              <FadeUp delay={100}>
                <p className="text-white max-w-lg text-[14px]">
                  Profitiere ab sofort von der revolutionären Kraft des Wasserstoffs. Einfach, alltagstauglich, rein. Direkt zu dir nach Hause geliefert.
                </p>
              </FadeUp>
            </div>
            <div className="border border-white/30 rounded-lg p-5 lg:p-6 flex flex-col gap-3">
              {topPlan && (
                <TopPlanCard
                  plan={topPlan}
                  isSelected={selectedPlanId === topPlan.planId}
                  onSelect={() => setSelectedPlanId(topPlan.planId)}
                  periodLabel={periodLabel}
                />
              )}

              {bottomPlans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bottomPlans.map((plan) => (
                    <CompactPlanCard
                      key={plan.planId}
                      plan={plan}
                      isSelected={selectedPlanId === plan.planId}
                      onSelect={() => setSelectedPlanId(plan.planId)}
                      periodLabel={periodLabel}
                    />
                  ))}
                </div>
              )}

              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={pending}
                  className="block w-full bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[15px] py-3 rounded-full transition-all duration-300 mb-1 cursor-pointer active:scale-95 text-center sm:text-[21px] sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(253,242,119,0.4)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {pending ? "Bitte warten…" : `Jetzt ${selectedPlan?.ctaLabel ?? "Vorteils Abo"} bestellen`}
                </button>
                <div className="text-center text-[14px] text-gray-300 mb-2">
                  Schnelle Lieferung - innerhalb 2-3 Werktagen (DE)
                </div>
                <div className="border-t border-white/30 -mx-5 lg:-mx-6 my-3"></div>
                <div className="flex items-center justify-center gap-2 text-[14px] font-bold text-white">
                  <ShieldCheck className="w-5 h-5 text-white shrink-0" />
                  <span className="text-white">Bezahle bequem per Paypal, Kreditkarte oder SEPA-Lastschrift</span>
                </div>
              </div>
            </div>
          </FadeLeft>

          <FadeRight delay={300} className="flex flex-col gap-6 w-full lg:max-w-[494px] lg:mt-14">
            <div className="w-full">
              <img alt="AWAKE Glasflasche"
                src="https://cdn.prod.website-files.com/6719e8a01505503c09134c42/69db4ee6aacae90345263545_flasche-awake-h%C3%A4nde.avif"
                className="w-full h-auto rounded-lg border border-white"
              />
            </div>
            <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-10 text-[#173A57]">
              <h3 className="font-gothic font-bold text-[20px] mb-4 sm:text-[24px] sm:mb-6">Erhalte in jedem Abo:</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <BottleIcon />
                  <span className="font-medium text-[15px] leading-snug">Deine monatliche Ration AWAKE</span>
                </div>
                <div className="flex items-start gap-3">
                  <GiftIcon />
                  <span className="font-medium text-[15px] leading-snug">H2-Guide mit 26 Seiten exklusivem Wissen und Anwendungstipps</span>
                </div>
                <div className="flex items-start gap-3">
                  <GiftIcon />
                  <span className="font-medium text-[15px] leading-snug">Zugang zu monatlichen Live Meetings mit unserem medizinischen Berater &amp; Wasserstoff-Experten</span>
                </div>
              </div>
            </div>
          </FadeRight>
        </div>

      </div>

      <FlascheUpgradePopup
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
