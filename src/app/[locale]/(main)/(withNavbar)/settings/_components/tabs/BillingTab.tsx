import { useEffect, useState } from "react";
import InvoiceTable from "../InvoiceTable";
import Image from "next/image";
import { ChevronRight, Mail } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import Separator from "@/components/Separator";
import { useAuth } from "@/providers/Auth";
import { Button, LinkButton } from "@/components/Button";
import {
  BodyComponent,
  CancelSubscriptionModal,
} from "../billingPriceSettings/Components";
import Chip from "@/components/Chip";
import { BillingPlan } from "@/payload-types";
import { cn } from "@/lib/utils";
import { rest } from "@/lib/rest";

declare global {
  interface Window {
    createLemonSqueezy: () => void;
  }
}

export type Invoice = {
  invoice_url: string;
  billing_date: string;
  status: string;
  amount: string;
  plan: string;
};

type CardInfo = {
  card_brand: string;
  card_last_four: string;
  renews_at: string | Date;
  user_email: string;
  update_payment_method: string;
};

export default function BillingMainTab() {
  const t = useTranslations("settings.billingTab");
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const changeTimeFormat = (time: string | Date) => {
    return new Date(time || "").toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isFreeTrialEnded = (trial: string | Date) => {
    return new Date(trial) < new Date();
  };

  const handleUpgradeClick = () => {
    router.push("/settings?value=Plans");
  };

  const handleCancelClick = async () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (user?.interviewPlan) {
      const getCardInfo = async () => {
        const res = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/billingPlans/get-card-info`,
          {},
          {
            method: "GET",
          }
        );

        setCardInfo(res);
      };

      const getInvoices = async () => {
        const res = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invoices/getinvoices`,
          {},
          { method: "GET" }
        );

        res.invoices.map((invoice: Invoice) => {
          setInvoices((prevInvoices) => [
            ...prevInvoices,
            {
              invoice_url: invoice.invoice_url,
              billing_date: invoice.billing_date,
              status: invoice.status,
              amount: invoice.amount,
              plan: invoice.plan,
            },
          ]);
        });
      };

      getCardInfo();
      getInvoices();
    }
  }, [user]);

  useEffect(() => {
    window.createLemonSqueezy();
  }, []);

  if (!user) return null;
  const interviewPlan = user?.interviewPlan as BillingPlan;

  return (
    <>
      <div className="flex flex-col gap-6 px-[6px]">
        <div className="flex flex-col">
          <span className="text-2xl text-[#181D27] font-semibold leading-8">
            {t("title")}
          </span>
          <span className="text-base text-[#535862]">
            {t("description")}
          </span>
        </div>
        <Separator />
        <BodyComponent
          title={t("subscription")}
          description={
            <span>
              {t("subscriptionDescription")}{" "}
              <a className="text-primary">support@recv.ai</a>
            </span>
          }
        >
          <div className="flex flex-row w-full gap-8 px-6 justify-between">
            <span className="flex flex-col w-[70%]">
              <span className="flex flex-row gap-2 font-semibold items-center">
                {!interviewPlan
                  ? t("freePlan")
                  : interviewPlan.name.split(" ")[0] + " " + t("plan")}
                {interviewPlan && (
                  <Chip
                    label={
                      interviewPlan.name.toLowerCase().includes("multiMonthly")
                        ? t("multiMonthly")
                        : t("monthly")
                    }
                    className="border rounded-full border-[#D5D7DA] text-sm text-[#414651] font-medium"
                  />
                )}
              </span>
              <span className="text-sm text-[#535862]">
                {t("popularPlanDescription")}
              </span>
            </span>
            {interviewPlan && (
              <span className="flex flex-row gap-0.5 items-end">
                <span className="flex flex-row items-center">
                  <span className="text-4xl text-primary font-semibold">$</span>
                  <span className="text-5xl text-primary font-semibold">
                    {parseInt(
                      interviewPlan.price_formatted
                        .split("/")[0]
                        .replace(/[^\d.]/g, ""),
                      10
                    )}
                  </span>
                </span>
                <span className="text-base text-[#535862]">
                  {t("per")} {interviewPlan.price_formatted.split("/")[1]}
                </span>
              </span>
            )}
          </div>
          <div className="flex flex-row gap-1 text-sm text-[#535862] px-6">
            {/* You are currently training until 24 Jan, 2025.{" "} */}
            {!interviewPlan ? (
              isFreeTrialEnded(user.freeTrialExpiresAt || "") ? (
                <span className="text-red-500">
                  {t("freeTrialFinished", { date: changeTimeFormat(user.freeTrialExpiresAt || "") })}
                </span>
              ) : (
                <span className="text-primary">
                  {t("currentlyTrainingUntil", { date: changeTimeFormat(user.freeTrialExpiresAt || "") })}
                </span>
              )
            ) : user.interviewSubscriptionStatus === "expired" ? (
              <span className="text-red-500">
                {t("planExpired", { status: t("expired"), date: changeTimeFormat(user.interviewSubscriptionExpiresAt || "") })}
              </span>
            ) : user.interviewSubscriptionStatus === "cancelled" ? (
              <span className="text-red-500">
                {t("planCancelled", { status: t("cancelled"), date: changeTimeFormat(user.interviewSubscriptionExpiresAt || "") })}
              </span>
            ) : (
              <span className="text-primary">
                {t("currentlyTrainingUntil", { date: changeTimeFormat(user.interviewSubscriptionExpiresAt || "") })}
              </span>
            )}
            <span className="font-semibold">
              {t("upgradeWarning")}
            </span>
          </div>
          <Separator />
          <div
            className={cn("flex flex-row px-6 items-center", {
              "justify-between": interviewPlan,
              "justify-end": !interviewPlan,
            })}
          >
            {interviewPlan && (
              <span
                className="font-semibold text-[#535862] cursor-pointer hover:text-[#7f838b]"
                onClick={handleCancelClick}
              >
                {t("cancelSubscription")}
              </span>
            )}
            <Button
              type="button"
              className="flex flex-row gap-2 font-semibold items-center"
              variant="defaultRing"
              onClick={handleUpgradeClick}
            >
              {t("upgradePlan")}
              <ChevronRight size={20} />
            </Button>
          </div>
        </BodyComponent>
        {interviewPlan && (
          <BodyComponent
            title={t("billingDetails")}
            description={
              <span>
                {t("billingDetailsDescription")}
              </span>
            }
          >
            <div className="flex flex-row gap-8 px-6">
              <span className="flex flex-col w-[70%]">
                <span className="gap-2 font-semibold">{t("paymentMethod")}</span>
                <span className="text-sm text-[#535862]">
                  {t("changePaymentMethod")}
                </span>
              </span>
            </div>
            <div className="px-6">
              <div className="flex flex-row border border-[#E9EAEB] rounded-xl w-full">
                <div className="flex flex-row p-5 gap-4 w-full">
                  {(cardInfo?.card_brand === "mastercard" ||
                    cardInfo?.card_brand === "amex" ||
                    cardInfo?.card_brand === "visa") && (
                    <div>
                      <Image
                        src={`/Icons/${cardInfo?.card_brand}.svg`}
                        alt={cardInfo?.card_brand || ""}
                        width={58}
                        height={40}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-4 w-full ">
                    <div className="flex flex-row justify-between w-full font-medium text-[#414651]">
                      <div className="flex flex-col text-[#535862]">
                        <span>
                          {cardInfo?.card_brand.charAt(0).toUpperCase() +
                            "" +
                            cardInfo?.card_brand.slice(1)}{" "}
                          {t("endingIn")} {cardInfo?.card_last_four}
                        </span>
                        <span>
                          {t("expiry")} {changeTimeFormat(cardInfo?.renews_at || "")}
                        </span>
                      </div>
                      <div>
                        <LinkButton
                          href={cardInfo?.update_payment_method}
                          className="border lemonsqueezy-button"
                        >
                          {t("edit")}
                        </LinkButton>
                      </div>
                    </div>
                    <div className="flex">
                      <span className="flex flex-row gap-2 items-center text-[#535862]">
                        <Mail size={15} />
                        {cardInfo?.user_email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col px-6">
              <span className="font-semibold">{t("nextBillingDate")}</span>
              <span className="text-secondary-foreground">
                {t("planRenewsOn", { date: changeTimeFormat(cardInfo?.renews_at || "") })}
              </span>
            </div>
          </BodyComponent>
        )}
        {interviewPlan && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold">
                  {t("billingAndInvoicing")}
                </span>
                <span className="text-sm text-[#535862]">
                  {t("billingDescription")}
                </span>
              </div>
            </div>
          </div>
        )}
        {interviewPlan && <InvoiceTable invoiceData={invoices} />}
        <CancelSubscriptionModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </>
  );
}
