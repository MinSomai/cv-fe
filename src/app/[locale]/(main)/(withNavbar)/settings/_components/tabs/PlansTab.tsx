"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { BillingPlan } from "@/payload-types";
import {
  UpgradePlanComponent,
  PricingToggle,
  PlanExplainer,
} from "../billingPriceSettings/Components";
import { getPlansByPeriod } from "@/lib/utils";
import { GroupedPlans } from "@/utils/types";
import { getBillingPlans } from "@/utils/data";

export default function PriceTab() {
  const t = useTranslations("settings.plansTab");
  const [period, setPeriod] = useState<"monthly" | "multiMonthly">("monthly");
  const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([]);
  const [showingPlans, setShowingPlans] = useState<GroupedPlans[]>([]);

  useEffect(() => {
    setShowingPlans(getPlansByPeriod(billingPlans, period));
  }, [period, billingPlans]);

  useEffect(() => {
    getBillingPlans().then((res) => {
      if (res) {
        setBillingPlans(res);
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 px-[6px]">
        <div className="flex flex-row justify-between items-center">
          <span className="flex flex-col">
            <span className="text-[#181D27] text-2xl font-semibold">
              {t("choosePlan")}
            </span>
            <span className="text-[#535862] text-lg">
              {t("choosePlanDescription")}
            </span>
          </span>
          <PricingToggle period={period} setPeriod={setPeriod} />
        </div>
        {/* Top row: three pricing cards (interview plans) */}
        <div className="grid grid-cols-3 gap-6">
          {showingPlans
            .filter(
              (p) => !(p.consultationPlan && p.consultationPlan.name === "Career Pathfinder")
            )
            .map((plan, index) => (
              <UpgradePlanComponent
                key={index}
                interviewPlan={plan.interviewPlan}
                consultationPlan={plan.consultationPlan}
              />
            ))}
        </div>

        {/* Career Pathfinder standalone full-width below */}
        {showingPlans.some((p) => p.consultationPlan && p.consultationPlan.name === "Career Pathfinder") && (
          <div className="w-full mt-4">
            {showingPlans
              .filter((p) => p.consultationPlan && p.consultationPlan.name === "Career Pathfinder")
              .map((plan, idx) => (
                <UpgradePlanComponent
                  key={`career-${idx}`}
                  consultationPlan={plan.consultationPlan}
                />
              ))}
          </div>
        )}
      </div>
      <PlanExplainer />
    </div>
  );
}
