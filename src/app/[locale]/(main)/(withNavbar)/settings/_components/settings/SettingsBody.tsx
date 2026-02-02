"use client";

import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";
import MyDetailsTab from "../tabs/MyDetailsTab";
import ProfileTab from "../tabs/ProfileTab";
import PasswordTab from "../tabs/PasswordTab";
import BillingTab from "../tabs/BillingTab";
import NotficationsTab from "../tabs/NotificationsTab";
import Chip from "@/components/Chip";
import PriceTab from "../tabs/PlansTab";

export default function SettingsBody({
  defaultTab,
}: {
  defaultTab: string | null;
}) {
  const t = useTranslations("settings");
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<number>(2);
  const [defaultValue, setDefaultValue] = useState<string | null>(t("myDetails"));

  const handleTabClick = (value: string) => {
    router.push(`/settings?value=${value}`);
  };

  useEffect(() => {
    if (defaultTab) {
      setDefaultValue(defaultTab);
    }
  }, [defaultTab]);

  const myDetailsLabel = t("myDetails");
  const profileLabel = t("profile");
  const passwordLabel = t("password");
  const billingLabel = t("billing");
  const plansLabel = t("plans");
  const notificationsLabel = t("notifications");

  return (
    <Tabs.Root
      className="w-full px-8 scrollbar overflow-y-auto"
      value={defaultValue ? defaultValue : myDetailsLabel}
    >
      <Tabs.List
        className="flex bg-[#FAFAFA] h-11 rounded-[10px] p-1 gap-1 sticky top-0 z-10"
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          value={myDetailsLabel}
          onClick={() => handleTabClick(myDetailsLabel)}
          className="px-3 py-2 text-sm font-semibold text-[#717680] hover:text-[#0E131D] data-[state=active]:rounded-md data-[state=active]:bg-white data-[state=active]:text-[#0E131D] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]"
        >
          {myDetailsLabel}
        </Tabs.Trigger>
        {user?.entity?.role === "staff" && (
          <Tabs.Trigger
            value={profileLabel}
            onClick={() => handleTabClick(profileLabel)}
            className="px-3 py-2 text-sm font-semibold text-[#717680] hover:text-[#0E131D] data-[state=active]:rounded-md data-[state=active]:bg-white data-[state=active]:text-[#0E131D] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]"
          >
            {profileLabel}
          </Tabs.Trigger>
        )}
        <Tabs.Trigger
          value={passwordLabel}
          onClick={() => handleTabClick(passwordLabel)}
          className="px-3 py-2 text-sm font-semibold text-[#717680] hover:text-[#0E131D] data-[state=active]:rounded-md data-[state=active]:bg-white data-[state=active]:text-[#0E131D] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]"
        >
          {passwordLabel}
        </Tabs.Trigger>
        <Tabs.Trigger
          value={billingLabel}
          onClick={() => handleTabClick(billingLabel)}
          className="px-3 py-2 text-sm font-semibold text-[#717680] hover:text-[#0E131D] data-[state=active]:rounded-md data-[state=active]:bg-white data-[state=active]:text-[#0E131D] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]"
        >
          {billingLabel}
        </Tabs.Trigger>
        <Tabs.Trigger
          value={plansLabel}
          onClick={() => handleTabClick(plansLabel)}
          className="px-3 py-2 text-sm font-semibold text-[#717680] hover:text-[#0E131D] data-[state=active]:rounded-md data-[state=active]:bg-white data-[state=active]:text-[#0E131D] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]"
        >
          {plansLabel}
        </Tabs.Trigger>
        <Tabs.Trigger
          value={notificationsLabel}
          onClick={() => handleTabClick(notificationsLabel)}
          className="flex flex-row items-center gap-2 px-3 py-2 text-sm font-semibold text-[#717680] hover:text-[#0E131D] data-[state=active]:rounded-md data-[state=active]:bg-white data-[state=active]:text-[#0E131D] data-[state=active]:shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]"
        >
          {notificationsLabel}{" "}
          {notifications > 0 && (
            <Chip
              label={notifications}
              className="rounded-full border border-[#E9EAEB] bg-[#FAFAFA]"
            />
          )}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value={myDetailsLabel} className="py-4">
        <MyDetailsTab />
      </Tabs.Content>
      <Tabs.Content value={profileLabel}>
        <ProfileTab />
      </Tabs.Content>
      <Tabs.Content value={passwordLabel} className="py-4">
        <PasswordTab />
      </Tabs.Content>
      <Tabs.Content value={billingLabel} className="py-4">
        <BillingTab />
      </Tabs.Content>
      <Tabs.Content value={plansLabel} className="py-4">
        <PriceTab />
      </Tabs.Content>
      <Tabs.Content value={notificationsLabel} className="py-4">
        <NotficationsTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}
