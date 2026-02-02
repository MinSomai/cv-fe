"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";
import { OnboardingTemplate } from "../_components/OnboardingTemplate";
import { rest } from "@/lib/rest";
import { onboardingCareerSelect } from "@/utils/data";

import Card from "@/components/Card";

interface ChooseWorkProps {}

export default function ChooseWork({}: ChooseWorkProps) {
  const router = useRouter();
  const { user, fetchMe } = useAuth();
  const [selected, setSelected] = useState<number>();
  const t = useTranslations("onboarding.chooseExperience");
  const tError = useTranslations("errors");

  const handleBackClick = () => {
    router.push("/onboarding");
  };

  const handleCardClick = async (value: string) => {
    try {
      const req = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
        {
          onboarding: {
            persona: value,
          },
        },
        {
          method: "POST",
        }
      );

      await fetchMe();
      router.push("/onboarding/careerindustry");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error(tError("requestRuntimeError"));
      }
    }
  };

  useEffect(() => {
    let persona = user?.onboarding?.persona!;
    if (persona === "student") setSelected(0);
    if (persona === "professional") setSelected(1);
    if (persona === "free") setSelected(2);
  }, [user]);

  return (
    <OnboardingTemplate
      headerTitle={t("title")}
      headerSubTitle={t("subtitle")}
      bodyTitle={t("bodyTitle")}
      bodyTitleClassName="text-4xl md:text-7xl lg:mt-[171px] md:mt-[100px] mt-[100px]"
      handleBackClick={handleBackClick}
    >
      <div className="flex flex-wrap gap-6 mt-12 lg:w-[1020px] max-md:mt-10 max-md:max-w-full">
        {onboardingCareerSelect.map((career, index) => (
          <Card
            key={index}
            isSelected={selected === index}
            {...career}
            handleClick={handleCardClick}
          />
        ))}
      </div>
    </OnboardingTemplate>
  );
}
