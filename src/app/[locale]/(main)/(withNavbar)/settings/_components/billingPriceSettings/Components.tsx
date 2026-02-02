import React, { useState } from "react";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Modal/Dialog";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { ArrowUpRight, CircleCheck, Trash2, AlertCircle } from "lucide-react";
import { FAQSections, PlansOverview, ImportantNotes } from "@/utils/data";
import { BillingPlan } from "@/payload-types";
import { rest } from "@/lib/rest";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FAQItem {
  title: string;
  description: string;
}

interface FAQSection {
  id: number;
  title: string;
  items: FAQItem[];
}

interface ImportantNote {
  plan: string;
  features: string[];
}

export const BodyComponent = ({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-col w-[280px]">
        <span className="text-sm text-[#0E131D] font-semibold">{title}</span>
        <span className="text-sm text-secondary-foreground">{description}</span>
      </div>
      <div className="flex flex-col py-6 gap-6 border border-[#E9EAEB] rounded-xl flex-1">
        {children}
      </div>
    </div>
  );
};

export const Feature = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-row gap-3">
      <div className="w-5 h-5">
        <CircleCheck size={20} className="text-primary" />
      </div>
      <div className="text-base text-secondary-foreground">
        {title.includes(":") ? (
          <>
            <span className="font-semibold">{title.split(":")[0]}</span>
            <span>:{title.split(":")[1]}</span>
          </>
        ) : (
          <span>{title}</span>
        )}
      </div>
    </div>
  );
};

export const UpgradePlanComponent = ({
  interviewPlan,
  consultationPlan,
}: {
  interviewPlan?: BillingPlan;
  consultationPlan?: BillingPlan;
}) => {
  const { user } = useAuth();
  const t = useTranslations("settings.billingPriceSettings");
  const selectedPlan = interviewPlan ?? consultationPlan;
  const descriptionText = (selectedPlan?.description as string) ?? "";
  const [firstDesc, secondDesc] = descriptionText
    .split("---")
    .map((s) => s.trim());

  const isCareerPathfinder =
    consultationPlan?.name === "Career Pathfinder" ||
    interviewPlan?.name === "Career Pathfinder";

  if (isCareerPathfinder) {
    // Render the Career Pathfinder in a two-column layout: left = price/button/info, right = features
    return (
      <div
        className={cn("border rounded-xl p-6 w-full", {
          "border-primary": user?.interviewPlan
            ? typeof user?.interviewPlan === "string" ||
              user?.interviewPlan.name === interviewPlan?.name
            : user?.consultationPlan &&
              (typeof user?.consultationPlan === "string" ||
                user?.consultationPlan.name === consultationPlan?.name),
        })}
      >
        <div className="flex flex-row items-end gap-5">
          <span className="text-[#181D27] text-xl font-semibold">
            {consultationPlan?.name || "Career Pathfinder"}
          </span>
          <span className="text-base">
            Your professional North Star - discover your true calling and lock
            in the roadmap to get there.
          </span>
        </div>

        <div className="flex flex-row gap-8 items-start">
          <div className="w-[33%]">
            <div className="mt-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl text-primary font-semibold">
                  ${((consultationPlan?.price ?? 0) / 100 || 0).toString()}
                </span>
                <span className="text-base text-[#535862] mt-2">
                  {consultationPlan?.price_formatted?.split("/")[1]
                    ? "/" + consultationPlan.price_formatted.split("/")[1]
                    : "/ One-Time Purchase"}
                </span>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <span className="text-sm text-[#475467]">
                  <span className="font-semibold">{firstDesc}</span>
                  {secondDesc && (
                    <span className="block mt-2">{secondDesc}</span>
                  )}
                </span>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="defaultRing"
                  className="w-full flex items-center justify-center"
                >
                  <Link
                    href={consultationPlan?.buy_now_url || ""}
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Get Career Pathfinder
                    <ArrowUpRight size={16} />
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-[#94A3B8] mt-4">
                Note: Interview practice not included.
              </div>
            </div>
          </div>

          <div className="flex-1 mt-6">
            <div className="text-lg font-semibold mb-4">{t("planIncludes")}</div>
            <div className="flex flex-col gap-4">
              {consultationPlan?.features?.map((feature, index) => (
                <div key={index} className="flex flex-row gap-4 items-start">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <CircleCheck size={20} className="text-primary" />
                  </div>
                  <div className="text-base text-[#475467]">
                    {feature.feature?.includes(":") ? (
                      <>
                        <span className="font-semibold">
                          {feature.feature.split(":")[0]}
                        </span>
                        <span>:{feature.feature.split(":")[1]}</span>
                      </>
                    ) : (
                      <span>{feature.feature || ""}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col border rounded-xl gap-6 p-6 w-full", {
        "border-primary": user?.interviewPlan
          ? typeof user?.interviewPlan === "string" ||
            user?.interviewPlan.name === interviewPlan?.name
          : user?.consultationPlan &&
            (typeof user?.consultationPlan === "string" ||
              user?.consultationPlan.name === consultationPlan?.name),
      })}
    >
      <div className="flex flex-col gap-8">
        <span className="text-[#181D27] text-lg font-semibold">
          {consultationPlan?.name !== "Career Pathfinder"
            ? interviewPlan?.name.split(" ")[0]
            : "Career Pathfinder (Standalone Purchase)"}
        </span>
        <span className="flex flex-row gap-0.5 items-end">
          <span className="flex flex-row items-center">
            <span className="text-4xl text-primary font-semibold">$</span>
            <span className="text-5xl text-primary font-semibold">
              {(
                ((interviewPlan ? interviewPlan : consultationPlan)?.price ??
                  0) / 100
              ).toString()}
            </span>
          </span>
          <span className="text-base text-[#535862]">
            {(interviewPlan
              ? interviewPlan
              : consultationPlan
            )?.price_formatted.split("/")[1] &&
              "/" +
                (interviewPlan
                  ? interviewPlan
                  : consultationPlan
                )?.price_formatted.split("/")[1]}
          </span>
        </span>
      </div>
      <div className="text-sm text-[#475467]">
        <span className="font-semibold">{firstDesc}</span>
        {secondDesc && <span className="block mt-2">{secondDesc}</span>}
      </div>
      <Button
        type="button"
        className={cn("flex flex-row gap-2 items-center justify-center")}
        variant="defaultRing"
      >
        <Link
          href={
            (interviewPlan ? interviewPlan : consultationPlan)?.buy_now_url ||
            ""
          }
          rel="noopener noreferrer"
          className="flex flex-row gap-2 items-center justify-center w-full h-full"
        >
          {t("upgradeTo") + " " + interviewPlan?.name.split(" ")[0]}
          <ArrowUpRight size={20} />
        </Link>
      </Button>
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-left">
          {interviewPlan?.name.split(" ")[0] === "Explorer" && t("planIncludes")}
          {interviewPlan?.name.split(" ")[0] === "Achiever" &&
            t("everythingFromExplorerPlus")}
          {interviewPlan?.name.split(" ")[0] === "Pro" &&
            t("everythingFromAchieverPlus")}
        </div>
        <div className="flex flex-col gap-3">
          {(interviewPlan ? interviewPlan : consultationPlan)?.features?.map(
            (feature, index) => (
              <Feature title={feature.feature || ""} key={index} />
            )
          )}

          {/* If the plan does NOT include Career Pathfinder, show warning (Explorer plan) */}
          {!(interviewPlan ? interviewPlan : consultationPlan)?.features?.some(
            (f) => (f.feature || "").toLowerCase().includes("career pathfinder")
          ) && (
            <div className="flex flex-row gap-3 items-start text-[#475467] mt-2">
              <div className="w-6 h-6 flex items-center justify-center text-[#D92D20]">
                <AlertCircle size={18} />
              </div>
              <div className="text-base">
                <span className="font-semibold text-[#0E131D]">
                  Career Pathfinder:
                </span>{" "}
                <span className="text-[#6B7280]">
                  Not included - upgrade for personalized career guidance.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PricingToggle = ({
  period,
  setPeriod,
}: {
  period: "monthly" | "multiMonthly";
  setPeriod: React.Dispatch<React.SetStateAction<"monthly" | "multiMonthly">>;
}) => {
  return (
    <div className="flex h-10 rounded-lg border border-gray-300">
      <button
        className={`flex px-2.5 items-center text-center rounded-l-lg text-sm ${
          period === "multiMonthly"
            ? "bg-primary text-white"
            : "bg-white text-black"
        }`}
        onClick={() => setPeriod("multiMonthly")}
      >
        Pay Upfront (One Time)
      </button>
      <button
        className={`flex px-2 items-center text-center rounded-r-lg text-sm ${
          period === "monthly" ? "bg-primary text-white" : "bg-white text-black"
        }`}
        onClick={() => setPeriod("monthly")}
      >
        Pay in 3 installments
      </button>
    </div>
  );
};

export const PlanExplainer = () => {
  const t = useTranslations("settings.billingPriceSettings");
  return (
    <div className="flex flex-col px-8 gap-8">
      <span className="text-center text-2xl font-semibold">{t("plansOverview")}</span>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 bg-gray-50 cursor-pointer">
          <tr>
            {[
              { text: t("planName"), width: "w-[15%]" },
              { text: t("price"), width: "w-[15%]" },
              { text: t("interviewMinutes"), width: "w-[25%]" },
              { text: t("careerConsultation"), width: "w-[20%]" },
              { text: t("notes"), width: "w-[25%]" },
            ].map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-5 ${column.width} ${
                  column.text === "Notes" ? "text-center" : "text-center"
                }`}
              >
                {column.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PlansOverview.map((plan, index) => (
            <tr
              key={index}
              className="bg-white border-b cursor-pointer hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-[15%] text-center">
                {plan.name}
              </td>
              <td className="px-6 py-4 w-[15%] text-center">
                {plan.upfront}
                {plan.installments !== "-" && (
                  <div className="text-xs text-gray-500 text-center">
                    {plan.installments}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 w-[25%] text-center">
                {plan.includedMinutes}
              </td>
              <td className="px-6 py-4 w-[20%] text-center">
                {plan.careerConsultation}
              </td>
              <td className="px-6 py-4 w-[25%]">{plan.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Important Notes section */}
      {/* <div className="flex flex-col gap-8">
        <span className="text-4xl font-semibold">Important Notes</span>
        <div className="grid grid-cols-2 gap-8">
          {ImportantNotes.map((note: ImportantNote, index: number) => (
            <div key={index} className="flex flex-col gap-2">
              <span className="text-2xl font-semibold">{note.plan}</span>
              {note.features.map((feature: string, index: number) => (
                <ul
                  key={index}
                  className="flex flex-row gap-2 list-disc text-gray-700 ml-5"
                >
                  <li className="text-base">{feature}</li>
                </ul>
              ))}
            </div>
          ))}
        </div>
      </div> */}

      {/* FAQ section */}
      <div className="flex flex-col gap-8 mt-12 mb-16">
        <h2 className="text-4xl font-semibold text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-2 gap-8">
          {[...FAQSections]
            .sort((a, b) => a.id - b.id)
            .map((section: FAQSection) => (
              <div
                key={section.id}
                className={cn("flex flex-col gap-4", {
                  "col-start-1": section.id % 2 !== 0, // Odd numbers start from left
                  "col-start-2": section.id % 2 === 0, // Even numbers start from right
                })}
              >
                <h3 className="text-xl font-semibold">
                  {section.id === 4
                    ? section.title
                    : `${section.id}. ${section.title}`}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((item: FAQItem, index: number) => (
                    <li key={index}>
                      <p className="text-gray-700">
                        <span className="font-semibold">{item.title}:</span>{" "}
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const CancelSubscriptionModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isModalOpen, setIsModalOpen }) => {
  const tError = useTranslations("errors");
  
  const handleYesClick = async () => {
    try {
      const req = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/billingPlans/cancel-billing-plan`,
        {},
        {
          method: "GET",
        }
      );

      setIsModalOpen(false);
      toast.info(req.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(tError("unknownError"));
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-[544px] inter">
        <DialogHeader>
          <span className="flex flex-row rounded-full bg-[#D92D20] bg-opacity-10 w-12 h-12 items-center justify-center">
            <Trash2 color="#D92D20" size={24} />
          </span>
          <DialogTitle className="text-[#0E131D] text-lg">
            Cancel subscription
          </DialogTitle>
          <DialogDescription className="text-[#475467]">
            Are you sure you want to cancel the current subscription?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row pt-4 items-center sm:justify-end">
          <div className="flex flex-row gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-[#F2F4F7] shadow-none"
              onClick={() => setIsModalOpen(false)}
            >
              No
            </Button>
            <Button
              type="button"
              variant="defaultRing"
              className="shadow-[inset_0_1.5px_0_0px_#FFFFFF4D,inset_0_0_0_1px_#D92D20] bg-red-600 hover:bg-red-700"
              onClick={handleYesClick}
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
