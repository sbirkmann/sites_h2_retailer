"use client";

import { useEffect } from "react";
import { X, Users, CheckCircle2, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/shared/section-badge";
import type { AwakePlanConfig } from "@/components/awake/types";

const PLAN_CONTENT: Record<
  string,
  {
    headline: string;
    subline: string;
  }
> = {
  flex: {
    headline: "Nur 65,28€ statt 76,80€ monatlich",
    subline:
      "2,72 € pro Flasche, inkl. MwSt., exkl. 0,08€ Pfand",
  },
  smart: {
    headline: "Nur 59,16€ statt 69,60€ monatlich",
    subline:
      "2,46 € pro Flasche, inkl. MwSt., exkl. 0,08€ Pfand",
  },
  vorteils: {
    headline: "Nur 53,04€ statt 62,40€ monatlich",
    subline:
      "2,21 € pro Flasche, inkl. MwSt., exkl. 0,08€ Pfand",
  },
};

const BODY_TEXT =
  "Erhöhe deine Ration AWAKE und erhalte insgesamt 24 Flaschen AWAKE pro Lieferung extra. Perfekt für Menschen mit hohem Leistungsanspruch, Familien oder Sportler.";

const BENEFITS = [
  "2 Tagesrationen AWAKE pro Tag",
  "das Upgrade ist unabhängig vom regulären Abo monatlich kündbar",
  "Attraktiver Preisvorteil",
];

const SOCIAL_PROOF = "32% unserer Kunden wählten dieses Angebot auch.";

const PRODUCT_IMAGE_URL =
  "https://subbly-production-builder.nyc3.cdn.digitaloceanspaces.com/projects/01KKKA91702C19QGM77B03DASV/uploads/3c372f6e-615c-48c0-84d5-27d4d9634e79-image.png";

type FlascheUpgradePopupProps = {
  standardPlan: AwakePlanConfig | null;
  upgradePlan: AwakePlanConfig | null;
  pending: boolean;
  onConfirm: () => void;
  onDecline: () => void;
  onDismiss: () => void;
};

export function FlascheUpgradePopup({
  standardPlan,
  upgradePlan,
  pending,
  onConfirm,
  onDecline,
  onDismiss,
}: FlascheUpgradePopupProps) {
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

  const planContent =
    PLAN_CONTENT[standardPlan.variant] ?? PLAN_CONTENT.flex;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flasche-upgrade-title"
      aria-describedby="flasche-upgrade-desc"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Dialog schließen"
        disabled={pending}
        onClick={onDismiss}
        className="absolute inset-0 bg-[#173A57]/80 backdrop-blur-sm cursor-default"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(23,58,87,0.5)] font-gothic md:max-h-none md:overflow-visible max-h-[calc(100vh-2rem)] overflow-y-auto">
        <button
          type="button"
          aria-label="Dialog schließen"
          onClick={onDismiss}
          disabled={pending}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#173A57]/10 text-[#173A57] transition-colors hover:bg-[#173A57]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173A57] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="px-5 pt-5 pb-5 md:px-8 md:pt-6 md:pb-6">
          <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
            <img alt="AWAKE Glasflasche"
              src={PRODUCT_IMAGE_URL}
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
            />
            <span className="text-2xl md:text-3xl font-bold text-[#173A57]">
              +
            </span>
            <img alt="AWAKE Glasflasche"
              src={PRODUCT_IMAGE_URL}
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
            />
          </div>

          <div className="flex justify-center mb-3 md:mb-4">
            <SectionBadge size="sm">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              SPECIAL OFFER
            </SectionBadge>
          </div>

          <h2
            id="flasche-upgrade-title"
            className="text-center text-[20px] md:text-[22px] font-bold leading-tight text-[#173A57] mb-1"
          >
            {planContent.headline}
          </h2>
          <p className="text-center text-[12px] md:text-[13px] text-gray-500 mb-3 md:mb-4">
            {planContent.subline}
          </p>

          <p
            id="flasche-upgrade-desc"
            className="text-[13px] md:text-[14px] text-[#173A57] leading-relaxed text-center mb-3 md:mb-4"
          >
            {BODY_TEXT}
          </p>

          <div className="bg-[#f0f4f8] rounded-xl p-3 md:p-4 mb-3 md:mb-4">
            <p className="text-[11px] md:text-[12px] font-bold text-[#173A57] uppercase tracking-wider mb-2">
              Deine Vorteile:
            </p>
            <ul className="flex flex-col gap-1.5 md:gap-2">
              {BENEFITS.map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-[13px] md:text-[14px] text-[#173A57]"
                >
                  <CheckCircle2
                    className="w-4 h-4 md:w-5 md:h-5 text-[#173A57] shrink-0 mt-0"
                    strokeWidth={2}
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px] md:text-[13px] text-[#173A57] mb-4 md:mb-5">
            <Users className="w-4 h-4 shrink-0" />
            <span>{SOCIAL_PROOF}</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={pending}
              className="w-full bg-[#FDF277] hover:bg-[#f5e751] text-[#173A57] font-bold text-[15px] md:text-[16px] py-3 rounded-full transition-all duration-300 cursor-pointer active:scale-[0.98] hover:shadow-[0_0_30px_rgba(253,242,119,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
            >
              {pending ? "Bitte warten…" : "Jetzt upgraden"}
            </button>
            <button
              type="button"
              onClick={onDecline}
              disabled={pending}
              className="w-full bg-transparent border border-[#173A57]/20 hover:border-[#173A57] text-[#173A57] font-bold text-[13px] py-2.5 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Nein danke, Standard-Abo behalten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
