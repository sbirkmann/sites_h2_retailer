"use client";

import { useCallback, useEffect, useState } from "react";
import { useSubblyCart } from "@subbly/react";
import { sendCapiEvent } from "@/lib/capi";
import type { AwakePlanConfig } from "./types";

export function useAwakeCheckout() {
  const { getWidget } = useSubblyCart();
  const [activePlan, setActivePlan] = useState<AwakePlanConfig | null>(null);
  const [activeUpgradePlan, setActiveUpgradePlan] = useState<AwakePlanConfig | null>(null);
  const [pending, setPending] = useState(false);

  const disableCartSummary = useCallback(() => {
    const widget = getWidget();
    if (widget) widget.setSettings({ disableSummaryView: true });
  }, [getWidget]);

  const enableCartSummary = useCallback(() => {
    const widget = getWidget();
    if (widget) widget.setSettings({ disableSummaryView: false });
  }, [getWidget]);

  useEffect(() => {
    return () => {
      enableCartSummary();
    };
  }, [enableCartSummary]);

  const addPlanToCart = useCallback(
    async (plan: AwakePlanConfig) => {
      const widget = getWidget();
      if (!widget) return;
      widget.setSettings({ afterItemAdded: "close" });
      try {
        await widget.addItem({
          productId: plan.planId,
          quantity: 1,
        });
        await widget.addItem({
          productId: plan.depositVariantId,
          quantity: plan.depositQuantity,
          addon: true,
        });
      } finally {
        widget.setSettings({ afterItemAdded: null });
      }
    },
    [getWidget]
  );

  const startCheckout = useCallback(
    async (standardPlan: AwakePlanConfig, upgradePlan: AwakePlanConfig) => {
      if (pending) return;
      setPending(true);
      try {
        const widget = getWidget();
        if (!widget) return;
        disableCartSummary();
        await widget.resetCart();
        await addPlanToCart(standardPlan);
        sendCapiEvent("AddToCart", {
          product_id: standardPlan.bundleId,
          value: standardPlan.price,
          currency: "EUR",
        });
        setActivePlan(standardPlan);
        setActiveUpgradePlan(upgradePlan);
      } finally {
        setPending(false);
      }
    },
    [getWidget, pending, addPlanToCart, disableCartSummary]
  );

  const confirmUpgrade = useCallback(async () => {
    if (!activeUpgradePlan || pending) return;
    setPending(true);
    try {
      const widget = getWidget();
      if (!widget) return;
      disableCartSummary();
      await widget.resetCart();
      await addPlanToCart(activeUpgradePlan);
      sendCapiEvent("AddToCart", {
        product_id: activeUpgradePlan.bundleId,
        value: activeUpgradePlan.price,
        currency: "EUR",
      });
      sendCapiEvent("InitiateCheckout", {
        value: activeUpgradePlan.price,
        currency: "EUR",
      });
      setActivePlan(null);
      setActiveUpgradePlan(null);
      widget.open("checkout");
    } finally {
      setPending(false);
    }
  }, [activeUpgradePlan, getWidget, pending, addPlanToCart, disableCartSummary]);

  const declineUpgrade = useCallback(async () => {
    if (!activePlan) return;
    const widget = getWidget();
    const plan = activePlan;
    setActivePlan(null);
    setActiveUpgradePlan(null);
    if (!widget) return;
    sendCapiEvent("InitiateCheckout", {
      value: plan.price,
      currency: "EUR",
    });
    widget.open("checkout");
  }, [activePlan, getWidget]);

  const dismissPopup = useCallback(() => {
    const widget = getWidget();
    setActivePlan(null);
    setActiveUpgradePlan(null);
    if (widget) {
      widget.resetCart();
    }
    enableCartSummary();
  }, [getWidget, enableCartSummary]);

  return {
    startCheckout,
    confirmUpgrade,
    declineUpgrade,
    dismissPopup,
    activePlan,
    activeUpgradePlan,
    pending,
  };
}
