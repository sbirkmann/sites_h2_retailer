import type { ProductSubscription } from "@subbly/react";
import type { AwakeFlowContext, AwakePlanConfig } from "./types";

const GERMAN_VAT_RATE = 0.19;

function withVat(amount: number): number {
  return Math.round(amount * (1 + GERMAN_VAT_RATE));
}

function formatPrice(amount: number) {
  return `${(amount / 100).toFixed(2).replace(".", ",")}€`;
}

const DOSE_UNIT = {
  singularDe: "Dose",
  pluralDe: "Dosen",
  pluralEn: "Cans",
  pluralEnLower: "cans",
};

const FLASCHE_UNIT = {
  singularDe: "Flasche",
  pluralDe: "Flaschen",
  pluralEn: "Bottles",
  pluralEnLower: "bottles",
};

const DOSE_DEPOSIT_VARIANT_ID = 420375;
const FLASCHE_DEPOSIT_VARIANT_ID = 420373;

type DoseVariant = "monthly" | "quarterly" | "halfYear";

function buildDosePlan(
  product: ProductSubscription,
  variant: DoseVariant,
  isUpgrade: boolean
): AwakePlanConfig {
  const plan = product.plans[0];
  if (!plan) {
    throw new Error(`No plan found for product ${product.id}`);
  }

  const apiPrice = plan.price;
  const qty = isUpgrade ? 60 : 30;
  const depositAmount = isUpgrade ? 1500 : 750;
  const grossProductPrice = withVat(apiPrice);
  const price = grossProductPrice + depositAmount;
  const displayPrice = grossProductPrice;
  const pricePerCan = formatPrice(Math.round(displayPrice / qty));
  const deliveryText = isUpgrade
    ? `${qty} Dosen pro Lieferung`
    : "30 Dosen pro Lieferung";

  if (variant === "halfYear") {
    return {
      bundleId: product.id,
      planId: plan.id,
      price,
      displayPrice,
      depositVariantId: DOSE_DEPOSIT_VARIANT_ID,
      depositQuantity: isUpgrade ? 2 : 1,
      label: isUpgrade ? "6-Monats-Abo 2X" : "6-Monats-Abo",
      badge: "Maximale Ersparnis",
      commitment: "Bindung an 6 Lieferungen",
      savings: "Mehr als 108€ gespart",
      highlight: "Bestes Angebot",
      features: [
        `${pricePerCan} pro Dose`,
        deliveryText,
        "6 Monate Mindestlaufzeit",
        "Mehr als 108€ gespart",
      ],
      ctaLabel: isUpgrade ? "6-Monats-Abo 2X" : "6-Monats-Abo",
      variant,
    };
  }
  if (variant === "quarterly") {
    return {
      bundleId: product.id,
      planId: plan.id,
      price,
      displayPrice,
      depositVariantId: DOSE_DEPOSIT_VARIANT_ID,
      depositQuantity: isUpgrade ? 2 : 1,
      label: isUpgrade ? "3-Monats-Abo 2X" : "3-Monats-Abo",
      badge: "Unsere Empfehlung",
      commitment: "Bindung an 3 Lieferungen",
      savings: "Mehr als 27€ gespart",
      features: [
        `${pricePerCan} pro Dose`,
        deliveryText,
        "3 Monate Mindestlaufzeit",
        "Mehr als 27€ gespart",
      ],
      ctaLabel: isUpgrade ? "3-Monats-Abo 2X" : "3-Monats-Abo",
      variant,
    };
  }
  return {
    bundleId: product.id,
    planId: plan.id,
    price,
    displayPrice,
    depositVariantId: DOSE_DEPOSIT_VARIANT_ID,
    depositQuantity: isUpgrade ? 2 : 1,
    label: isUpgrade ? "1-Monats-Abo 2X" : "1-Monats-Abo",
    badge: "100% flexibel",
    commitment: "Monatlich kündbar",
    features: [
      `${pricePerCan} pro Dose`,
      deliveryText,
      "Monatlich kündbar",
    ],
    ctaLabel: isUpgrade ? "1-Monats-Abo 2X" : "1-Monats-Abo",
    variant,
  };
}

type FlascheVariant = "flex" | "smart" | "vorteils";

function buildFlaschePlan(
  product: ProductSubscription,
  variant: FlascheVariant,
  isUpgrade: boolean
): AwakePlanConfig {
  const plan = product.plans[0];
  if (!plan) {
    throw new Error(`No plan found for product ${product.id}`);
  }

  const apiPrice = plan.price;
  const qty = isUpgrade ? 48 : 24;
  const depositAmount = isUpgrade ? 384 : 192;
  const grossProductPrice = withVat(apiPrice);
  const price = grossProductPrice + depositAmount;
  const displayPrice = grossProductPrice;
  const pricePerBottle = formatPrice(Math.round(displayPrice / qty));
  const deliveryText = isUpgrade
    ? `${qty} Flaschen pro Lieferung`
    : "24 Flaschen pro Lieferung";

  if (variant === "vorteils") {
    return {
      bundleId: product.id,
      planId: plan.id,
      price,
      displayPrice,
      depositVariantId: FLASCHE_DEPOSIT_VARIANT_ID,
      depositQuantity: isUpgrade ? 2 : 1,
      label: isUpgrade ? "Vorteils Abo 2X" : "Vorteils Abo",
      badge: "Maximale Ersparnis",
      commitment: "Bindung an 6 Lieferungen",
      savings: "Mehr als 86€ gespart",
      highlight: "Bestes Angebot",
      features: [
        `${pricePerBottle} pro Flasche`,
        deliveryText,
        "Mindestlaufzeit 6 Lieferungen",
        "mehr als 86€ Ersparnis",
      ],
      ctaLabel: isUpgrade ? "Vorteils Abo 2X" : "Vorteils Abo",
      variant,
    };
  }
  if (variant === "smart") {
    return {
      bundleId: product.id,
      planId: plan.id,
      price,
      displayPrice,
      depositVariantId: FLASCHE_DEPOSIT_VARIANT_ID,
      depositQuantity: isUpgrade ? 2 : 1,
      label: isUpgrade ? "Smart Abo 2X" : "Smart Abo",
      badge: "Unsere Empfehlung",
      commitment: "Bindung an 3 Lieferungen",
      savings: "Mehr als 21€ gespart",
      features: [
        `${pricePerBottle} pro Flasche`,
        deliveryText,
        "Mindestlaufzeit 3 Lieferungen",
        "mehr als 21€ Ersparnis",
      ],
      ctaLabel: isUpgrade ? "Smart Abo 2X" : "Smart Abo",
      variant,
    };
  }
  return {
    bundleId: product.id,
    planId: plan.id,
    price,
    displayPrice,
    depositVariantId: FLASCHE_DEPOSIT_VARIANT_ID,
    depositQuantity: isUpgrade ? 2 : 1,
    label: isUpgrade ? "Flex Abo 2X" : "Flex Abo",
    badge: "100% flexibel",
    commitment: "Monatlich kündbar",
    features: [
      `${pricePerBottle} pro Flasche`,
      deliveryText,
    ],
    ctaLabel: isUpgrade ? "Flex Abo 2X" : "Flex Abo",
    variant,
  };
}

export function buildDoseBundleFlow(args: {
  monthlyStandard: ProductSubscription;
  quarterlyStandard: ProductSubscription;
  halfYearStandard: ProductSubscription;
  monthlyUpgrade: ProductSubscription;
  quarterlyUpgrade: ProductSubscription;
  halfYearUpgrade: ProductSubscription;
}): AwakeFlowContext {
  const halfYear = buildDosePlan(args.halfYearStandard, "halfYear", false);
  const quarterly = buildDosePlan(args.quarterlyStandard, "quarterly", false);
  const monthly = buildDosePlan(args.monthlyStandard, "monthly", false);
  const halfYearUp = buildDosePlan(args.halfYearUpgrade, "halfYear", true);
  const quarterlyUp = buildDosePlan(args.quarterlyUpgrade, "quarterly", true);
  const monthlyUp = buildDosePlan(args.monthlyUpgrade, "monthly", true);

  return {
    standardPlans: [halfYear, quarterly, monthly],
    upgradePlans: [halfYearUp, quarterlyUp, monthlyUp],
    unit: DOSE_UNIT,
    baseQuantity: 30,
    upgradeQuantity: 60,
    periodLabel: "/mtl.",
    perUnitLabel: "pro Dose",
  };
}

export function buildFlascheBundleFlow(args: {
  flexStandard: ProductSubscription;
  smartStandard: ProductSubscription;
  vorteilsStandard: ProductSubscription;
  flexUpgrade: ProductSubscription;
  smartUpgrade: ProductSubscription;
  vorteilsUpgrade: ProductSubscription;
}): AwakeFlowContext {
  const vorteils = buildFlaschePlan(args.vorteilsStandard, "vorteils", false);
  const smart = buildFlaschePlan(args.smartStandard, "smart", false);
  const flex = buildFlaschePlan(args.flexStandard, "flex", false);
  const vorteilsUp = buildFlaschePlan(args.vorteilsUpgrade, "vorteils", true);
  const smartUp = buildFlaschePlan(args.smartUpgrade, "smart", true);
  const flexUp = buildFlaschePlan(args.flexUpgrade, "flex", true);

  return {
    standardPlans: [vorteils, smart, flex],
    upgradePlans: [vorteilsUp, smartUp, flexUp],
    unit: FLASCHE_UNIT,
    baseQuantity: 24,
    upgradeQuantity: 48,
    periodLabel: "/alle 24 Tage",
    perUnitLabel: "pro Flasche",
  };
}
