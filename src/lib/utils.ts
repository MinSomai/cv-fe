import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BillingPlan, User } from "@/payload-types";
import { GroupedPlans } from "@/utils/types";
import { rest } from "./rest";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserFreePlanStatus(user: User | null | undefined) {
  if (!user) return "freeTrial_inactive";
  if (user.freeTrialExpiresAt) {
    if (new Date(user.freeTrialExpiresAt) < new Date()) {
      return "freeTrial_expired";
    }
    return "freeTrial_active";
  }

  return "freeTrial_inactive";
}

export function getUserInterviewPlanStatus(user: User) {
  const interviewPlan = user?.interviewPlan;

  if (interviewPlan) {
    if (
      user.interviewSubscriptionExpiresAt &&
      new Date(user.interviewSubscriptionExpiresAt) < new Date()
    ) {
      return "subscription_expired";
    }
    return "subscription_active";
  }

  return "susbscription_inactive";
}

export const getPlanStatus = (user: User | null | undefined) => {
  if (!user) return "freeTrial_inactive";
  const planStatus = getUserInterviewPlanStatus(user);
  if (planStatus !== "susbscription_inactive") {
    return planStatus;
  } else {
    const freePlanStatus = getUserFreePlanStatus(user);
    return freePlanStatus;
  }
};

export function getPlansByPeriod(
  plans: BillingPlan[],
  period: "monthly" | "multiMonthly"
): GroupedPlans[] {
  const isMulti = period === "multiMonthly";

  // Helper to find a plan by partial name
  const findPlan = (namePart: string): BillingPlan | undefined =>
    plans.find((plan) => plan.name.toLowerCase() === namePart.toLowerCase());

  const explorer = findPlan("Explorer");
  const achiever = findPlan(
    `Achiever (${isMulti ? "multiMonthly" : "monthly"})`
  );
  const pro = findPlan(`Pro (${isMulti ? "multiMonthly" : "monthly"})`);
  const career = findPlan("Career Pathfinder");

  const result: GroupedPlans[] = [];

  if (explorer) {
    result.push({
      interviewPlan: explorer,
    });
  }

  if (achiever) {
    result.push({
      interviewPlan: achiever,
    });
  }

  if (pro) {
    result.push({ interviewPlan: pro });
  }

  if (career) {
    result.push({ consultationPlan: career });
  }

  return result;
}

export async function getIntercomId(): Promise<string | null> {
  try {
    const res = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/intercom`,
      {},
      {
        method: "GET",
      }
    );

    if (res.totalDocs > 0) {
      return res.docs[0].intercom_id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Intercom ID:", error);
    return null;
  }
}
