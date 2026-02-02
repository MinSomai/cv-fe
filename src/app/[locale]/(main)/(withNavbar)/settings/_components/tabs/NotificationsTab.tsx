import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Separator from "@/components/Separator";
import NotificationSettings from "../NotificationSettings";

export default function NotficationsTab() {
  const t = useTranslations("settings.notificationsTab");
  
  return (
    <div className="flex flex-col gap-6 px-[6px]">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-[#181D27]">
          {t("title")}
        </span>
        <span className="text-sm text-[#535862]">
          {t("description")}
        </span>
      </div>
      <Separator />
      <div className="flex flex-row gap-8">
        <div className="flex flex-col w-[280px]">
          <span className="text-sm font-semibold text-[#414651]">
            {t("notificationSettings")}
          </span>
          <span className="text-sm text-[#535862] w-full">
            {t("notificationSettingsDescription")}
          </span>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {/* <NotificationSettings description="You've been invited to an interview" />
          <Separator /> */}
          <NotificationSettings description={t("interviewResultsAvailable")} />
          {/* <Separator />
          <NotificationSettings description="Upcoming interview reminder (e.g., 24 hours before)" />
          <Separator />
          <NotificationSettings description="Interview feedback is ready for review" />
          <Separator />
          <NotificationSettings description="Your weekly progress summary is ready" /> */}
        </div>
      </div>
      <Separator />
      <div className="flex flex-row gap-8">
        <div className="flex flex-col w-[280px]">
          <span className="text-sm font-semibold text-[#414651]">
            {t("summaryNotifications")}
          </span>
          <span className="text-sm text-[#535862] w-full">
            {t("summaryNotificationsDescription")}
          </span>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {/* <NotificationSettings description={t("weeklySummary")} />
          <Separator />
          <NotificationSettings description={t("monthlySummary")} />
          <Separator />
          <NotificationSettings description={t("quarterlySummary")} /> */}
        </div>
      </div>
    </div>
  );
}
