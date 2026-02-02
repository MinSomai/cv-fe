"use client";

import { useState, useRef, useCallback } from "react";
import { AuthTemplate } from "./AuthTemplate";
import { useForm } from "react-hook-form";
import { Link, useRouter, usePathname } from "@/lib/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { rest } from "@/lib/rest";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Checkbox } from "@/components/Checkbox";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import SocialButtons from "./SocialButtons/SocialButtons";

type singupFormData = {
  name: string;
  email: string;
  password: string;
};

const SignUpForm: React.FC<{ token?: string }> = ({ token }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const t = useTranslations("auth.signup");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");

  const { create } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("individual");
  const [isChecked, setIsChecked] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<singupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePrivacyModal = () => {
    setIsPrivacyModalOpen(true);
  };

  const onSubmit = useCallback(
    async (data: singupFormData) => {
      try {
        if (isChecked) {
          if (accountType === "individual") {
            await create(data, token);
            // router.push("/individualwelcome");
          } else if (accountType === "entity") {
            await rest(
              `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/create-owner`,
              data,
              {
                method: "POST",
              }
            );
            // router.push("/entitywelcome");
          }
          router.push("/verify");
        } else {
          toast.info(tError("acceptTerms"));
        }
      } catch (_) {
        throw new Error(
          "There was an error with the credentials provided. Please try again."
        );
      }
    },
    [create, router, accountType, isChecked, token]
  );

  return (
    <AuthTemplate
      title={t("createAccountTitle")}
      description={t("createAccountDescription")}
      body={
        <>
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
                disabled={currentPath !== "/signup"}
              >
                {t("forMyOrganization")}
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full mt-6 gap-1.5">
                <span className="text-sm font-medium text-[#0E131D]">
                  {t("fullNameLabel")}
                </span>
                <Input
                  name="name"
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  register={register}
                  required={true}
                  error={errors.email}
                />
              </div>
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
                  type={showPassword ? "text" : "password"}
                  placeholder={t("createPasswordPlaceholder")}
                  register={register}
                  required={true}
                  error={errors.password}
                  icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  onIconClick={togglePasswordVisibility}
                />
              </div>
              <div className="flex flex-col w-full mt-2 text-secondary-foreground">
                {t("passwordHint")}
              </div>
              <div className="flex justify-between w-full mt-6">
                <Checkbox
                  size="default"
                  isChecked={isChecked}
                  handleCheckbox={handleCheckboxChange}
                  text={
                    <label
                      htmlFor="terms"
                      className="flex-1 text-sm text-[#667085]"
                    >
                      {t("agreeToTerms")}{" "}
                      <a
                        className="underline text-[#0E1221] hover:text-[#0E1221]/80 cursor-pointer"
                        onClick={handlePrivacyModal}
                      >
                        {t("termsOfUse")}
                      </a>{" "}
                      {t("and")}{" "}
                      <a
                        className="underline text-[#0E1221] hover:text-[#0E1221]/80 cursor-pointer"
                        onClick={handlePrivacyModal}
                      >
                        {t("privacyPolicy")}
                      </a>
                    </label>
                  }
                />
              </div>
              <div className="flex flex-col gap-2 mt-6 w-full font-semibold">
                <Button type="submit" className="w-full">
                  {t("createAccount")}
                </Button>
              </div>
            </form>
            <div className="flex flex-col w-full">
              <div className="flex gap-4 items-center mt-4 w-full text-sm text-center text-gray-500">
                <div className="flex-1 h-px border border-gray-100 border-solid basis-0 w-[150px]" />
                <div>Or Sign Up with</div>
                <div className="flex-1 h-px border border-gray-100 border-solid basis-0 w-[150px]" />
              </div>
            </div>
            <SocialButtons accountType={accountType} />
            <div className="flex gap-1 justify-center mt-4 w-full text-sm">
              <p className="text-secondary-foreground">
                Already have an account?{" "}
              </p>
              <Link href="/login" className="text-primary">
                Log in
              </Link>
            </div>
          </div>
          <PrivacyPolicyModal
            isModalOpen={isPrivacyModalOpen}
            setIsModalOpen={setIsPrivacyModalOpen}
          />
        </>
      }
    />
  );
};

export default SignUpForm;
