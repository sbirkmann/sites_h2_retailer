"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  Play,
  Sparkles,
  Heart,
  Mail,
  Phone,
  ArrowRight,
  Star,
  Gift,
  Info,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export type StickyActionVariant = "primary" | "highlight" | "secondary";

export type StickyActionIcon =
  | "shopping-bag"
  | "users"
  | "play"
  | "sparkles"
  | "heart"
  | "mail"
  | "phone"
  | "arrow-right"
  | "star"
  | "gift"
  | "info"
  | "calendar";

const ICON_REGISTRY: Record<StickyActionIcon, LucideIcon> = {
  "shopping-bag": ShoppingBag,
  users: Users,
  play: Play,
  sparkles: Sparkles,
  heart: Heart,
  mail: Mail,
  phone: Phone,
  "arrow-right": ArrowRight,
  star: Star,
  gift: Gift,
  info: Info,
  calendar: Calendar,
};

export interface StickyActionItem {
  label: string;
  href: string;
  icon?: StickyActionIcon;
  variant?: StickyActionVariant;
  external?: boolean;
}

interface StickyActionBarProps {
  actions: StickyActionItem[];
  showAfterScroll?: number;
  ariaLabel?: string;
}

const VARIANT_CLASSES: Record<StickyActionVariant, string> = {
  primary:
    "bg-awake-blue border border-awake-blue text-white hover:bg-awake-blue/90 hover:shadow-lg",
  highlight:
    "bg-awake-yellow border border-awake-yellow text-awake-blue hover:bg-awake-yellow/85 hover:shadow-lg",
  secondary:
    "bg-off-white border border-awake-blue/25 text-awake-blue hover:border-awake-blue hover:bg-awake-blue hover:text-white",
};

export function StickyActionBar({
  actions,
  showAfterScroll = 600,
  ariaLabel = "Schnellzugriff",
}: StickyActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  if (actions.length === 0) {
    return null;
  }

  const gridColsClass =
    actions.length === 1
      ? "grid-cols-1"
      : actions.length === 2
        ? "grid-cols-2"
        : actions.length === 3
          ? "grid-cols-3"
          : "grid-cols-4";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      role="navigation"
      aria-label={ariaLabel}
    >
      <div className="mx-auto max-w-[1200px] px-3 pb-3 sm:px-6 sm:pb-5">
        <div className="rounded-2xl border border-awake-blue/15 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_-12px_rgba(23,58,87,0.25)]">
          <div className={`grid ${gridColsClass} gap-1.5 p-1.5 sm:gap-2 sm:p-2`}>
            {actions.map((action) => {
              const variantClass = VARIANT_CLASSES[action.variant ?? "secondary"];
              const externalProps = action.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};
              const IconComponent = action.icon ? ICON_REGISTRY[action.icon] : null;

              return (
                <a
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  {...externalProps}
                  className={`group flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider transition-all duration-300 sm:gap-2 sm:px-4 sm:py-3.5 sm:text-xs ${variantClass}`}
                >
                  {IconComponent ? (
                    <IconComponent
                      className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="leading-tight">{action.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
