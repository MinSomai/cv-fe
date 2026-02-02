"use client";

import { useState } from "react";
import { AuthTemplate } from "./AuthTemplate";
import { useForm, FieldValues } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LinkButton } from "@/components/Button";
import { useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import { rest } from "@/lib/rest";
import { useTranslations } from "next-intl";

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function PasswordForm({ token }: { token: string }) {
  const [changed, setChanged] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("auth.resetPassword");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FieldValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error(tError("passwordsDoNotMatch"));
      return;
    }

    const req = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/reset-password`,
      {
        password: data.password,
        token,
      },
      {
        method: "POST",
      }
    );

    if (req.user) setChanged(true);
  };

  const onClick = () => {
    router.push("/login");
  };

  return changed ? (
    <AuthTemplate
      emoji={{ symbol: "🚀" }}
      title={t("passwordChangedTitle")}
      description={
        <span className="text-sm leading-none text-center text-secondary-foreground">
          {t("passwordChangedDescription")}
        </span>
      }
      body={
        <div className="flex flex-col mt-6 w-full rounded-xl">
          <div className="flex flex-col w-full">
            <LinkButton
              href="/login"
              className="bg-primary text-primary-foreground"
            >
              {tCommon("login")}
            </LinkButton>
          </div>
        </div>
      }
    />
  ) : (
    <AuthTemplate
      emoji={{ symbol: "🔒" }}
      title={t("title")}
      description={
        <span className="text-sm leading-none text-center text-secondary-foreground">
          {t("description")}
        </span>
      }
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-6 w-full rounded-xl"
        >
          <div className="flex flex-col w-full gap-1.5">
            <span className="text-sm font-medium text-[#0E131D]">
              {t("newPasswordLabel")}
            </span>
            <Input
              name="password"
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              register={register}
              required={true}
              error={errors.password}
            />
          </div>
          <div className="flex flex-col w-full mt-7 gap-1.5">
            <span className="text-sm font-medium text-[#0E131D]">
              {t("confirmNewPasswordLabel")}
            </span>
            <Input
              name="confirmPassword"
              type="password"
              placeholder={t("confirmNewPasswordPlaceholder")}
              register={register}
              required={true}
              error={errors.confirmPassword}
            />
          </div>
          <div className="flex flex-col gap-2 mt-7 w-full font-semibold">
            <Button type="submit" className="w-full">
              {tCommon("continue")}
            </Button>
            <LinkButton href="/login" className="w-full">
              {tCommon("back")}
            </LinkButton>
          </div>
        </form>
      }
    />
  );
}
