"use client";

import React, { Suspense } from "react";
import CareerCounsellingCreate from "../_components/Create/CareerCounsellingCreate";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { toast } from "sonner";
import { BillingPlan } from "@/payload-types";
import { useTranslations } from "next-intl";

export default function InterviewSetupCreatePage() {
  const { user } = useAuth();
  const tError = useTranslations("errors");

  if (!user) {
    return <></>;
  }

  // Check if user has Explorer plan - only block Explorer users
  const isExplorerPlan =
    user.interviewPlan &&
    (user.interviewPlan as BillingPlan).name.toLowerCase().includes("explorer");

  if (!user.interviewPlan || isExplorerPlan) {
    toast.info(tError("upgradePlan"));
    redirect("/settings?value=Plans");
  }

  return (
    <Suspense fallback={<Loading />}>
      <CareerCounsellingCreate />
    </Suspense>
  );
}
