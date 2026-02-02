"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { Mail, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Button, LinkButton } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { getInstitutionTypes } from "@/utils/data";
import { Option } from "@/utils/types";
import { useAuth } from "@/providers/Auth";
import { toast } from "sonner";
import { rest } from "@/lib/rest";
import { InstitutionType, Tenant } from "@/payload-types";

export default function Welcome() {
  const { user } = useAuth();
  const [institutionName, setInstitutionName] = useState<string>("");
  const [institutionTypeOptions, setInstitutionTypeOptions] = useState<
    Option[]
  >([]);
  const [institutionType, setInstitutionType] = useState<Option | string>("");
  const router = useRouter();
  const t = useTranslations("auth.entityWelcome");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        toast.error(tError("pleaseLogin"));
        return;
      }
      if (!institutionName || !institutionType) {
        toast.error(tError("fillAllFields"));
        return;
      }
      try {
        if (user.entity?.tenant) {
          let tenant = user.entity?.tenant as Tenant;
          await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/tenants/${tenant.id}`,
            {
              name: institutionName,
              type:
                typeof institutionType === "object"
                  ? institutionType.id
                  : institutionTypeOptions.find(
                      (option) =>
                        option.label.toLowerCase() ===
                        institutionType.toLocaleLowerCase()
                    )?.id,
            },
            {
              method: "PATCH",
            }
          );
          toast.success(t("successfullyUpdated"));
        } else {
          await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/register-entity`,
            {
              name: institutionName,
              type:
                typeof institutionType === "object"
                  ? institutionType.id
                  : institutionType,
            },
            {
              method: "POST",
            }
          );
          toast.success(t("successfullyCreated"));
        }
        router.push("/onboardingvideo");
      } catch (error) {
        toast.error(tError("somethingWentWrong"));
      }
    },
    [user, institutionName, institutionType, router, institutionTypeOptions]
  );

  useEffect(() => {
    let tenant = user?.entity?.tenant as Tenant;
    let institution = tenant?.type as InstitutionType;
    if (tenant) {
      setInstitutionName(tenant.name);
      setInstitutionType(institution.label);
    }
  }, [user]);

  useEffect(() => {
    getInstitutionTypes().then((options) => {
      setInstitutionTypeOptions(options);
    });
  }, []);

  return (
    <div className="flex bg-primary-foreground">
      <div className="flex w-full bg-primary-foreground min-h-[960px] max-md:max-w-full">
        <div className="flex flex-col flex-1 justify-between w-full basis-0 min-w-[240px] max-md:max-w-full">
          <Header />
          <main className="flex items-center justify-center bg-primary-foreground">
            <div className="flex flex-col p-4 max-w-full bg-accent rounded-[32px] w-[448px]">
              <div className="flex flex-col w-full text-center">
                <p className="flex flex-col w-full text-3xl font-semibold leading-10 text-accent-foreground">
                  {t("welcomeAbroad")}
                </p>
                <p className="flex flex-col w-full text-3xl font-semibold leading-10 text-accent-foreground">
                  {user?.name}! 🎉
                </p>
                <div className="flex gap-2 items-center self-center mt-4 text-base font-medium leading-none whitespace-nowrap text-accent-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col mt-8 w-full"
              >
                <div className="flex flex-col w-full mb-4">
                  <label className="text-sm font-medium leading-none text-accent-foreground mb-1.5">
                    {t("institutionName")}
                  </label>
                  <Dropdown
                    type="text"
                    name="institutionname"
                    options={[]}
                    selectedOption={institutionName}
                    onChange={(option) => setInstitutionName(option)}
                    icon={
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    }
                    isShowIcon={false}
                    placeholder={t("institutionNamePlaceholder")}
                    containerClassName="mt-0"
                    className="flex pl-11 text-base leading-[44px] text-secondary-foreground bg-primary-foreground rounded-lg border border-gray-300 placeholder-[#667085] border-solid shadow-sm"
                  />
                </div>
                <div className="flex flex-col w-full mb-4">
                  <label className="text-sm font-medium leading-none text-accent-foreground mb-1.5">
                    {t("institutionType")}
                  </label>
                  <Dropdown
                    type="text"
                    name="institutiontype"
                    options={institutionTypeOptions}
                    selectedOption={
                      typeof institutionType === "string"
                        ? institutionType
                        : institutionType?.label
                    }
                    onSelect={(option) => setInstitutionType(option)}
                    onChange={(option) => setInstitutionType(option)}
                    placeholder={t("institutionTypePlaceholder")}
                    containerClassName="mt-0"
                    className="flex pl-3.5 text-base leading-[44px] text-secondary-foreground bg-primary-foreground rounded-lg border border-gray-300 placeholder-[#667085] border-solid shadow-sm"
                  />
                </div>
                <div className="flex flex-col mt-4 w-full text-base font-semibold">
                  <Button type="submit">{tCommon("continue")}</Button>
                  <LinkButton href="/signup" className="bg-transparent">
                    {tCommon("back")}
                  </LinkButton>
                </div>
              </form>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
