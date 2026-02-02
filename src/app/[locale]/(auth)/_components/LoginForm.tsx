"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import { AuthTemplate } from "./AuthTemplate";
import { useAuth } from "@/providers/Auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Checkbox } from "@/components/Checkbox";
import SocialButtons from "./SocialButtons/SocialButtons";

type loginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const t = useTranslations("auth.loginPage");
  const searchParams = useSearchParams();
  const redirect = useRef<string>(searchParams.get("redirect"));
  const router = useRouter();

  const { user, login } = useAuth();

  const [accountType, setAccountType] = useState("individual");
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCheckboxChange = () => {
    setIsRememberChecked(!isRememberChecked);
  };

  const onSubmit = useCallback(
    async (data: loginFormData) => {
      try {
        await login(data);
      } catch (_) {
        throw new Error(t("loginError"));
      }
    },
    [login, t]
  );

  useEffect(() => {
    if (user) {
      if (redirect?.current)
        router.push(
          "/" +
            (redirect.current.startsWith("/")
              ? redirect.current.slice(1)
              : redirect.current)
        );
      else {
        if (user.entity?.role === "staff") {
          if (!user.onboarding?.persona) {
            router.push("/onboarding?start=true");
          } else if (!user.onboarding?.industry) {
            router.push("/onboarding/careerindustry");
          } else if (!user.onboarding?.targetRole) {
            router.push("/onboarding/careererole");
          } else if (!user.onboarding?.challenge) {
            router.push("/onboarding/interviewchallenge");
          } else router.push("/interviewsetup");
        } else {
          if (user?.entity?.tenant) router.push("/dashboard");
          else router.push("/entitywelcome");
        }
      }
    }
  }, [user, router]);

  return (
    <AuthTemplate
      title={t("title")}
      description={t("description")}
      body={
        <div>
          <div className="flex gap-2 items-center p-1.5 mt-6 w-full text-base font-semibold bg-gray-50 rounded-lg border border-gray-100 border-solid">
            <Button
              onClick={() => setAccountType("individual")}
              className={cn(
                "flex-1 py-2.5 my-auto rounded-lg bg-transparent shadow-none hover:bg-primary hover:text-primary-foreground font-normal",
                {
                  "bg-primary text-primary-foreground":
                    accountType === "individual",
                  "text-accent-foreground": accountType !== "individual",
                }
              )}
            >
              {t("forMe")}
            </Button>
            <Button
              onClick={() => setAccountType("entity")}
              className={cn(
                "flex-1 py-2.5 my-auto rounded-lg bg-transparent shadow-none hover:bg-primary hover:text-primary-foreground font-normal",
                {
                  "bg-primary text-primary-foreground":
                    accountType === "entity",
                  "text-accent-foreground": accountType !== "entity",
                }
              )}
            >
              {t("forMyOrganization")}
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full mt-6 gap-1.5">
              <span className="text-sm font-medium text-[#0E131D]">
                {accountType === "individual" ? t("emailLabel") : t("workEmailLabel")}
              </span>
              <Input
                name="email"
                type="email"
                placeholder={
                  accountType === "individual"
                    ? t("emailPlaceholder")
                    : t("workEmailPlaceholder")
                }
                register={register}
                required={true}
                error={errors.email}
              />
            </div>
            <div className="flex flex-col w-full mt-6 gap-1.5">
              <span className="text-sm font-medium text-[#0E131D]">
                {t("passwordLabel")}
              </span>
              <Input
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                register={register}
                required={true}
                error={errors.password}
              />
            </div>
            <div className="flex text-sm justify-between w-full mt-6">
              <Checkbox
                size="default"
                text={t("rememberMe")}
                isChecked={isRememberChecked}
                handleCheckbox={handleCheckboxChange}
              />
              <Link href="/forgotpassword" className="text-primary">
                {t("forgotPasswordLink")}
              </Link>
            </div>
            <div className="flex flex-col gap-2 mt-6 w-full font-semibold">
              <Button type="submit" className="w-full">
                {t("signIn")}
              </Button>
            </div>
          </form>
          <div className="flex flex-col w-full">
            <div className="flex gap-4 items-center mt-4 w-full text-sm text-center text-gray-500">
              <div className="flex-1 h-px border border-gray-100 border-solid basis-0 w-[150px]" />
              <div>{t("orLoginWith")}</div>
              <div className="flex-1 h-px border border-gray-100 border-solid basis-0 w-[150px]" />
            </div>
          </div>
          <SocialButtons accountType={accountType} />
          <div className="flex gap-1 justify-center mt-4 w-full text-sm">
            <p className="text-secondary-foreground">
              {t("noAccount")}{" "}
            </p>
            <Link href="/signup" className="text-primary">
              {t("register")}
            </Link>
          </div>
        </div>
      }
    />
  );
}
