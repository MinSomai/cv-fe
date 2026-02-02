"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { OnboardingTemplate } from "../_components/OnboardingTemplate";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/Dropdown";
import { Button } from "@/components/Button";
import { getIndustryOptions } from "@/utils/data";
import { useAuth } from "@/providers/Auth";
import { Option } from "@/utils/types";
import { rest } from "@/lib/rest";

import DecorateButton from "../_components/DecorateButton/DecorateButton";

export default function IndustryForm() {
  const router = useRouter();
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<Option | string>("");
  const { user, fetchMe } = useAuth();
  const t = useTranslations("onboarding.careerIndustry");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<{ industry: string }>({
    defaultValues: {
      industry: "",
    },
  });

  const handleBackClick = () => {
    router.push("/onboarding/chooseexperience");
  };

  const onSubmit = useCallback(async () => {
    try {
      if (
        typeof selectedIndustry !== "string" ||
        (typeof selectedIndustry === "string" &&
          options.some(
            (option) =>
              option.label.toLowerCase() ===
              selectedIndustry.toLocaleLowerCase()
          ))
      ) {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
          {
            onboarding: {
              industry:
                typeof selectedIndustry !== "string"
                  ? selectedIndustry?.id
                  : options.find(
                      (option) =>
                        option.label.toLowerCase() ===
                        selectedIndustry.toLocaleLowerCase()
                    )?.id,
            },
          },
          {
            method: "POST",
          }
        );

        await fetchMe();
        router.push("/onboarding/careerrole");
      } else if (
        typeof selectedIndustry === "string" &&
        options.some(
          (option) =>
            option.label.toLowerCase() === selectedIndustry.toLocaleLowerCase()
        ) === false
      ) {
        if (selectedIndustry === "") {
          toast.error(t("errorSelect"));
        } else {
          const customIndustry = await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/industries`,
            {
              label: selectedIndustry,
              type: "custom",
            },
            {
              method: "POST",
            }
          );

          await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
            {
              onboarding: {
                industry: customIndustry.doc.id,
              },
            },
            {
              method: "POST",
            }
          );

          await fetchMe();
          router.push("/onboarding/careerrole");
        }
      } else {
        toast.error(t("errorDropdown"));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error(tError("requestRuntimeError"));
      }
    }
  }, [selectedIndustry, router, fetchMe, options]);

  useEffect(() => {
    if (user?.onboarding?.industry) {
      const industry =
        (user.onboarding.industry as unknown as Option) || undefined;
      setSelectedIndustry(industry);
    } else {
      setSelectedIndustry("");
    }
  }, [user]);

  useEffect(() => {
    getIndustryOptions().then((options) => {
      setOptions(options);
    });
  }, []);

  return (
    <OnboardingTemplate
      headerTitle={t("title")}
      headerSubTitle={t("subtitle")}
      bodyTitle={t("bodyTitle")}
      bodyTitleClassName="lg:mt-[171px] md:mt-[100px] mt-[100px]"
      handleBackClick={handleBackClick}
      decorateChildren={
        <DecorateButton
          icon="👀"
          name="Ooolala"
          className={cn(
            "-top-12 -right-4 -rotate-[0.18rad] md:-top-6 md:-right-32 transition-all",
            (typeof selectedIndustry === "string" &&
              options.some(
                (option) =>
                  option.label.toLowerCase() === selectedIndustry.toLowerCase()
              )) ||
              (typeof selectedIndustry === "object" &&
                options.some(
                  (option) => option.label === selectedIndustry.label
                ))
              ? "opacity-100 translate-y-0 duration-700"
              : "opacity-0 translate-y-4 duration-700"
          )}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-14">
        <div className="flex flex-wrap justify-center gap-14 font-bold">
          <Dropdown
            name="industry"
            type="text"
            options={options}
            selectedOption={
              typeof selectedIndustry === "string"
                ? selectedIndustry
                : selectedIndustry?.label
            }
            where="onboarding"
            onChange={(option) => setSelectedIndustry(option)}
            onSelect={(option) => setSelectedIndustry(option)}
            placeholder={t("placeholder")}
            className="leading-[77px]"
          />
          <Button type="submit" variant="default" className="w-40">
            {tCommon("continue")}
          </Button>
        </div>
      </form>
    </OnboardingTemplate>
  );
}
