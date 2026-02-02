"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { set, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";
import { OnboardingTemplate } from "../_components/OnboardingTemplate";
import { Button } from "@/components/Button";
import { getInterviewChallenges } from "@/utils/data";
import { Option } from "@/utils/types";
import { rest } from "@/lib/rest";

import ChallengeButton from "@/components/Button/ChallengeButton";

export default function InterviewChallenges() {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const router = useRouter();
  const [challenges, setChallenges] = useState<Option[]>([]);
  const { user, fetchMe } = useAuth();
  const [isAll, setIsAll] = useState(true);
  const t = useTranslations("onboarding.interviewChallenge");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<{
    challenges: string[];
  }>({
    defaultValues: {
      challenges: [],
    },
  });

  const handleChallengeToggle = (challenge: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(challenge)
        ? prev.filter((c) => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleSelectAll = () => {
    if (isAll) {
      setSelectedChallenges(challenges.map((c) => c.id));
      setIsAll(false);
    } else {
      setSelectedChallenges([]);
      setIsAll(true);
    }
  };

  const handleBackClick = () => {
    router.push("/onboarding/shareexperience");
  };

  const onSubmit = useCallback(async () => {
    try {
      const req = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
        {
          onboarding: {
            challenge: selectedChallenges,
          },
        },
        {
          method: "POST",
        }
      );

      await fetchMe();
      // router.push("/onboarding/trainingpath");
      router.push("/onboarding/allset");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error(tError("requestRuntimeError"));
      }
    }
  }, [selectedChallenges, fetchMe, router]);

  useEffect(() => {
    selectedChallenges.length === 11 ? setIsAll(false) : setIsAll(true);
  }, [selectedChallenges]);

  useEffect(() => {
    if (user?.onboarding?.challenge) {
      const challenge = user.onboarding.challenge as unknown as Option[];
      setSelectedChallenges(challenge.map((c) => c.id));
    } else {
      setSelectedChallenges([]);
    }
  }, [user]);

  useEffect(() => {
    getInterviewChallenges().then((challenges) => {
      setChallenges(
        challenges.reverse().map((challenge) => ({
          ...challenge,
        }))
      );
    });
  }, []);

  return (
    <OnboardingTemplate
      headerTitle={t("title")}
      headerSubTitle={t("subtitle")}
      bodyTitle={t("bodyTitle")}
      bodyTitleClassName="lg:mt-[171px] md:mt-[100px] mt-[100px]"
      handleBackClick={handleBackClick}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-full font-bold pt-14"
      >
        <div className="flex flex-wrap justify-center lg:w-[1273px] md:max-w-full gap-14">
          <ChallengeButton
            challenges={challenges}
            selectedChallenges={selectedChallenges}
            isAllSelected={isAll}
            onChallengeToggle={handleChallengeToggle}
            onSelectAll={handleSelectAll}
          />
          <Button type="submit" variant="default" className="w-60">
            {tCommon("continue")}
          </Button>
        </div>
      </form>
    </OnboardingTemplate>
  );
}
