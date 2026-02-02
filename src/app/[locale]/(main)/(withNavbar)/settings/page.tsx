"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";
import Header from "./_components/settings/SettingsHeader";
import Body from "./_components/settings/SettingsBody";
import Loading from "@/components/Loading";

function SettingsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get("value") || "";

  return (
    <>
      {user ? (
        <div className="flex flex-col pt-2 pr-2 gap-8 h-full inter">
          <Header />
          <Body defaultTab={defaultValue} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default function Settings() {
  const t = useTranslations("common");
  
  return (
    <Suspense fallback={<Loading text={t("loading")} />}>
      <SettingsContent />
    </Suspense>
  );
}
