"use client";

import { useCallback, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button, LinkButton } from "@/components/Button";
import { AuthTemplate } from "./AuthTemplate";
import { rest } from "@/lib/rest";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type forgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState<boolean>(false);
  const t = useTranslations("auth.forgotPassword");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (data: forgotPasswordFormData) => {
    try {
      const req = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/forgot-password`,
        data,
        {
          method: "POST",
        }
      );

      if (req.status === 200) {
        setSent(true);
      }
    } catch (error) {
      toast.error(tError("tryAgain"));
    }
  }, []);

  return sent ? (
    <AuthTemplate
      emoji={{ symbol: "📧", label: "Email icon" }}
      title={t("checkInboxTitle")}
      description={
        <>
          {t("checkInboxDescription")}
          <br />
          {t("checkSpamFolder")}
        </>
      }
      body={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center mt-6 max-w-full w-[416px]">
            <p className="text-sm leading-none text-center text-secondary-foreground">
              {t("didntGetEmail")}
            </p>
            <div className="flex flex-col items-end mt-2 w-full text-base font-semibold max-w-[416px]">
              <Button type="submit" className="w-full">
                {t("resendEmail")}
              </Button>
              <Button
                variant="link"
                className="w-full"
                onClick={() => setSent(false)}
              >
                {tCommon("back")}
              </Button>
            </div>
          </div>
        </form>
      }
    />
  ) : (
    <AuthTemplate
      emoji={{ symbol: "🤷", label: "Confused emoji" }}
      title={t("title")}
      description={t("description")}
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-6 w-full rounded-xl"
        >
          <div className="flex flex-col w-full gap-1.5">
            <span className="text-sm font-medium text-[#0E131D]">
              {tCommon("email")}*
            </span>
            <Input
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              register={register}
              required={true}
              error={errors.email}
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
