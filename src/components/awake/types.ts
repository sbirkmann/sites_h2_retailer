export type AwakePlanConfig = {
  bundleId: number;
  planId: number;
  price: number;
  displayPrice: number;
  depositVariantId: number;
  depositQuantity: number;
  label: string;
  badge: string;
  commitment?: string;
  savings?: string;
  highlight?: string;
  features: string[];
  ctaLabel: string;
  variant: string;
};

export type AwakeUnitCopy = {
  singularDe: string;
  pluralDe: string;
  pluralEn: string;
  pluralEnLower: string;
};

export type AwakeFlowContext = {
  standardPlans: AwakePlanConfig[];
  upgradePlans: AwakePlanConfig[];
  unit: AwakeUnitCopy;
  baseQuantity: number;
  upgradeQuantity: number;
  periodLabel: string;
  perUnitLabel: string;
};
