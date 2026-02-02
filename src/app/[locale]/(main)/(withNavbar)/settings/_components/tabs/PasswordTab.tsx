import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Monitor, EllipsisVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import { rest } from "@/lib/rest";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { toast } from "sonner";

import Seperator from "@/components/Separator";
import Chip from "@/components/Chip";

interface FormData {
  currentpassword: string;
  newpassword: string;
  confirmpassword: string;
}

export default function PasswordTab() {
  const t = useTranslations("settings.passwordTab");
  const tCommon = useTranslations("common");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});
  const { user, login } = useAuth();

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        if (user?.email) {
          await login({ email: user.email, password: data.currentpassword });
          const res = await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/change-password`,
            {
              currentPassword: data.currentpassword,
              newPassword: data.newpassword,
              confirmNewPassword: data.confirmpassword,
            },
            {
              method: "POST",
            }
          );
          if (res.status === 200) {
            toast.success(t("passwordChangedSuccess"));
          } else {
            toast.error(t("passwordChangeFailed"));
          }
        } else {
          throw new Error("User email is undefined");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [user, login, t]
  );
  return (
    <div className="flex flex-col gap-8 px-[6px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-5 justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{t("title")}</span>
              <span className="text-sm text-[#535862]">
                {t("description")}
              </span>
            </div>
            <div className="flex flex-row gap-3">
              <Button
                type="button"
                variant="secondary"
                className="text-secondary-foreground font-semibold bg-white border hover:bg-[#FAFAFA] hover:text-secondary-foreground"
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" className="font-semibold">
                {t("updatePassword")}
              </Button>
            </div>
          </div>
          <Seperator />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-8 w-[75%]">
            <span className="w-[30%] text-sm font-semibold text-[#414651]">
              {t("currentPassword")} <span className="text-primary">*</span>
            </span>
            <div className="flex-1">
              <Input
                name="currentpassword"
                type="password"
                required={true}
                register={register}
                error={errors.currentpassword}
              />
            </div>
          </div>
          <Seperator />
          <div className="flex flex-row gap-8 w-[75%]">
            <span className="w-[30%] text-sm font-semibold text-[#414651]">
              {t("newPassword")} <span className="text-primary">*</span>
            </span>
            <div className="flex-1 gap-1.5">
              <Input
                name="newpassword"
                type="password"
                required={true}
                register={register}
                error={errors.newpassword}
              />
              <span className="text-sm text-[#535862]">
                {t("newPasswordHint")}
              </span>
            </div>
          </div>
          <Seperator />
          <div className="flex flex-row gap-8 w-[75%]">
            <span className="w-[30%] text-sm font-semibold text-[#414651]">
              {t("confirmNewPassword")} <span className="text-primary">*</span>
            </span>
            <div className="flex-1">
              <Input
                name="confirmpassword"
                type="password"
                required={true}
                register={register}
                error={errors.confirmpassword}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <span className="text-lg font-semibold text-[#181D27]">
              {t("whereLoggedIn")}
            </span>
            <EllipsisVertical
              className="hover:bg-gray-100 rounded-full cursor-pointer"
              color="#A4A7AE"
            />
          </div>
          <span className="text-sm text-[#535862]">
            {t("securityAlert", { email: user?.email || "" })}
          </span>
        </div>
        <Seperator />
        {/* <div className="flex flex-row gap-[22px] px-[18px]">
          <Monitor size={20} className="text-[#717680]" />
          <div className="flex flex-col gap-1">
            <span className="flex flex-row gap-2 text-sm font-semibold text-[#414651]">
              2024 MacBook Pro 14-inch
              <Chip
                className="px-2 h-[22px] rounded-md bg-white border border-[#D5D7DA] font-medium font-[#414651]"
                label={
                  <div className="flex flex-row items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    <span>Active now</span>
                  </div>
                }
              />
            </span>
            <span className="text-sm text-[#535862]">
              Melbourne, Australia • 22 Jan at 10:40am
            </span>
          </div>
        </div>
        <Seperator />
        <div className="flex flex-row gap-[22px] px-[18px]">
          <Monitor size={20} className="text-[#717680]" />
          <div className="flex flex-col gap-1">
            <span className="flex flex-row gap-2 text-sm font-semibold text-[#414651]">
              2024 MacBook Pro 14-inch
            </span>
            <span className="text-sm text-[#535862]">
              Melbourne, Australia • 22 Jan at 10:40am
            </span>
          </div>
        </div>
        <Seperator /> */}
      </div>
    </div>
  );
}
