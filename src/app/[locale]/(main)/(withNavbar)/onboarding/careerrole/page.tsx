"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { OnboardingTemplate } from "../_components/OnboardingTemplate";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/Dropdown";
import { Button } from "@/components/Button";
import { getLevelOptions, getRoleOptions } from "@/utils/data";
import { useAuth } from "@/providers/Auth";
import { Option } from "@/utils/types";
import { rest } from "@/lib/rest";

import DecorateButton from "../_components/DecorateButton/DecorateButton";

export default function RoleForm() {
  const router = useRouter();
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Option | string>("");
  const [selectedRole, setSelectedRole] = useState<Option | string>("");
  const { user, fetchMe } = useAuth();
  const t = useTranslations("onboarding.careerRole");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<{ level: String; role: string }>({
    defaultValues: {
      level: "",
      role: "",
    },
  });

  const handleBackClick = () => {
    router.push("/onboarding/careerindustry");
  };

  const onSubmit = useCallback(async () => {
    try {
      let level = "";
      let role = "";

      // Validate selectedLevel
      if (
        typeof selectedLevel !== "string" ||
        (typeof selectedLevel === "string" &&
          levelOptions.some(
            (option) =>
              option.label.toLowerCase() === selectedLevel.toLocaleLowerCase()
          ))
      ) {
        level =
          typeof selectedLevel !== "string"
            ? selectedLevel?.id
            : levelOptions.find(
                (option) =>
                  option.label.toLowerCase() ===
                  selectedLevel.toLocaleLowerCase()
              )?.id || "";
      } else if (
        (typeof selectedLevel === "string" &&
          levelOptions.some(
            (option) =>
              option.label.toLowerCase() === selectedLevel.toLocaleLowerCase()
          )) === false
      ) {
        if (selectedLevel === "") {
          toast.error(t("errorLevel"));
          return;
        } else {
          const customLevel = await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/levels`,
            {
              label: selectedLevel,
              type: "custom",
            },
            {
              method: "POST",
            }
          );

          level = customLevel.doc.id;
        }
      }

      // Validate selectedRole
      if (
        typeof selectedRole !== "string" ||
        (typeof selectedRole === "string" &&
          roleOptions.some(
            (option) =>
              option.label.toLowerCase() === selectedRole.toLocaleLowerCase()
          ))
      ) {
        role =
          typeof selectedRole !== "string"
            ? selectedRole?.id
            : roleOptions.find(
                (option) =>
                  option.label.toLowerCase() ===
                  selectedRole.toLocaleLowerCase()
              )?.id || "";
      } else if (
        (typeof selectedRole === "string" &&
          roleOptions.some(
            (option) =>
              option.label.toLowerCase() === selectedRole.toLocaleLowerCase()
          )) === false
      ) {
        if (selectedRole === "") {
          toast.error(t("errorRole"));
          return;
        } else {
          const customRole = await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/roles`,
            {
              label: selectedRole,
              type: "custom",
            },
            {
              method: "POST",
            }
          );

          role = customRole.doc.id;
        }
      }

      // Update targetRole in user settings
      await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
        {
          onboarding: {
            targetRole: {
              level: level,
              role: role,
            },
          },
        },
        {
          method: "POST",
        }
      );
      await fetchMe();
      router.push("/onboarding/shareexperience");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error(tError("requestRuntimeError"));
      }
    }
  }, [selectedLevel, selectedRole, router, fetchMe, levelOptions, roleOptions]);

  useEffect(() => {
    let level = user?.onboarding?.targetRole?.level!;
    let role = user?.onboarding?.targetRole?.role!;
    if (level && role) {
      setSelectedLevel(level);
      setSelectedRole(role);
    } else {
      setSelectedLevel("");
      setSelectedRole("");
    }
  }, [user]);

  useEffect(() => {
    getLevelOptions().then((options) => {
      setLevelOptions(options);
    });
    getRoleOptions().then((options) => {
      setRoleOptions(options);
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
          icon="🔥"
          name="Whoa, You're on Fire!"
          className={cn(
            "-top-12 -left-0 -rotate-[0.18rad] md:-top-20 md:left-0 transition-all",
            ((typeof selectedLevel === "string" &&
              levelOptions.some(
                (option) =>
                  option.label.toLowerCase() === selectedLevel.toLowerCase()
              )) ||
              (typeof selectedLevel === "object" &&
                levelOptions.some(
                  (option) => option.label === selectedLevel.label
                ))) &&
              ((typeof selectedRole === "string" &&
                roleOptions.some(
                  (option) =>
                    option.label.toLowerCase() === selectedRole.toLowerCase()
                )) ||
                (typeof selectedRole === "object" &&
                  roleOptions.some(
                    (option) => option.label === selectedRole.label
                  )))
              ? "opacity-100 translate-y-0 duration-700"
              : "opacity-0 translate-y-4 duration-700"
          )}
        />
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full pt-14"
      >
        <div className="flex flex-col justify-center gap-14 lg:w-[1020px] md:w-[750px] font-bold">
          <div className="flex flex-col md:flex-row gap-8">
            <Dropdown
              name="level"
              type="text"
              options={levelOptions}
              selectedOption={
                typeof selectedLevel === "string"
                  ? selectedLevel
                  : selectedLevel?.label
              }
              where="onboarding"
              onChange={(option) => setSelectedLevel(option)}
              onSelect={(option) => setSelectedLevel(option)}
              placeholder={t("levelPlaceholder")}
              containerClassName="lg:max-w-[275px] md:max-w-[200px]"
              className="leading-[77px]"
            />
            <Dropdown
              name="role"
              type="text"
              options={roleOptions}
              selectedOption={
                typeof selectedRole === "string"
                  ? selectedRole
                  : selectedRole?.label
              }
              where="onboarding"
              onChange={(option) => setSelectedRole(option)}
              onSelect={(option) => setSelectedRole(option)}
              placeholder={t("rolePlaceholder")}
              className="leading-[77px]"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button type="submit" variant="default" className="w-40">
              {tCommon("continue")}
            </Button>
          </div>
        </div>
      </form>
    </OnboardingTemplate>
  );
}
