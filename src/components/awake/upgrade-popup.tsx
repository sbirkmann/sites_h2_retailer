"use client";

import { useEffect } from "react";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";
import type { AwakePlanConfig, AwakeUnitCopy } from "./types";

function formatPrice(amount: number) {
  return `${(amount / 100).toFixed(2).replace(".", ",")}€`;
}

type AwakeUpgradePopupProps = {
  standardPlan: AwakePlanConfig | null;
  upgradePlan: AwakePlanConfig | null;
  unit: AwakeUnitCopy;
  baseQuantity: number;
  upgradeQuantity: number;
  periodLabel: string;
  pending: boolean;
  onConfirm: () => void;
  onDecline: () => void;
  onDismiss: () => void;
};

export function AwakeUpgradePopup({
  standardPlan,
  upgradePlan,
  unit,
  baseQuantity,
  upgradeQuantity,
  periodLabel,
  pending,
  onConfirm,
  onDecline,
  onDismiss,
}: AwakeUpgradePopupProps) {
  const isOpen = standardPlan !== null && upgradePlan !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onDismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onDismiss, pending]);

  if (!standardPlan || !upgradePlan) return null;

  const baselineComparison = standardPlan.price * 2;
  const upgradeTotal = upgradePlan.price;
  const savings = Math.max(baselineComparison - upgradeTotal, 0);

  const primaryLabel = "Yes, Upgrade Me";
  const secondaryLabel = `No thanks, keep ${baseQuantity} ${unit.pluralEnLower}`;
  const headline = `Upgrade to ${upgradeQuantity} ${unit.pluralEn}`;
  const description = `Double your monthly supply and save! Get ${upgradeQuantity} ${unit.pluralEnLower} of Awake delivered every month.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="awake-upgrade-title"
      aria-describedby="awake-upgrade-desc"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Dialog schließen"
        disabled={pending}
        onClick={onDismiss}
        className="absolute inset-0 bg-[#173A57]/80 backdrop-blur-sm cursor-default"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(23,58,87,0.5)] max-h-[calc(100vh-2rem)] overflow-y-auto font-gothic">
        <div className="relative bg-gradient-to-br from-[#173A57] to-[#0f2a40] text-white px-6 pt-6 pb-7 sm:px-8 sm:pt-8 sm:pb-10">
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FDF277]/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#FDF277]/10 blur-3xl" aria-hidden="true" />

          <button
            type="button"
            aria-label="Dialog schließen"
            onClick={onDismiss}
            disabled={pending}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDF277] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <div className="relative flex items-center gap-2 mb-4">
            <SectionBadge size="sm">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              SPECIAL OFFER
            </SectionBadge>
          </div>

          <h2
            id="awake-upgrade-title"
            className="relative text-[24px] sm:text-[28px] font-bold uppercase leading-tight text-white mb-3"
          >
            {headline}
          </h2>
          <p
            id="awake-upgrade-desc"
            className="relative text-[14px] text-white/80 leading-relaxed"
          >
            {description}
          </p>
        </div>

        <div className="px-6 pt-6 pb-6 sm:px-8 sm:pt-7 sm:pb-8 flex flex-col gap-5">
          <div className="rounded-lg bg-[#FFFDEA] border border-[#FDF277] px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#173A57]/60 mb-0.5">
                  Mit Upgrade
                </p>
                <p className="text-[15px] font-bold text-[#173A57]">
                  {upgradeQuantity} {unit.pluralDe} pro Lieferung
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[22px] sm:text-[26px] font-bold text-[#173A57] leading-none">
                  {formatPrice(upgradePlan.price)}
                </div>
                <div className="text-[11px] text-[#173A57]/70 mt-1">
                  {periodLabel} (inkl. 19% MwSt.)
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#FDF277]">
              <div className="flex items-center justify-between text-[13px] text-[#173A57]">
                <span>Preisvergleich (2× {standardPlan.label})</span>
                <span className="font-bold">{formatPrice(baselineComparison)}</span>
              </div>
              <div className="flex items-center justify-between text-[14px] font-bold text-[#173A57] pt-2 border-t border-[#FDF277]/70">
                <span>Summe {periodLabel}</span>
                <span>{formatPrice(upgradeTotal)}</span>
              </div>
            </div>

            {savings > 0 && (
              <div className="mt-4 flex items-center gap-2 bg-[#173A57] text-[#FDF277] rounded-full px-3 py-1.5 text-[12px] font-bold w-fit uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                {formatPrice(savings)} gespart gegenüber 2× {standardPlan.label}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onConfirm}
              disabled={pending}
              className="w-full bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[16px] sm:text-[18px] py-3.5 rounded-full transition-all duration-300 cursor-pointer active:scale-[0.98] hover:shadow-[0_0_30px_rgba(253,242,119,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
            >
              {pending ? "Bitte warten…" : primaryLabel}
            </button>
            <button
              type="button"
              onClick={onDecline}
              disabled={pending}
              className="w-full bg-transparent border border-[#173A57]/20 hover:border-[#173A57] text-[#173A57] font-bold text-[14px] py-3 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {secondaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
