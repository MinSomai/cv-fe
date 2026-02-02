"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { AuthTemplate } from "./AuthTemplate";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Checkbox } from "@/components/Checkbox";
import { useAuth } from "@/providers/Auth";

interface InviteSignUpFormData {
  name: string;
  email: string;
  password: string;
}

export default function InviteSignUpForm({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";
  const redirect = useRef(searchParams.get("redirect"));
  const router = useRouter();
  const { create } = useAuth();
  const t = useTranslations("auth.signup");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InviteSignUpFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onSubmit = useCallback(
    async (data: InviteSignUpFormData) => {
      try {
        if (isChecked) {
          await create(data, token);
          if (redirect?.current)
            router.push(
              (process.env.NEXT_PUBLIC_SITE_URL +
                "/" +
                redirect.current) as string
            );
          else router.push("/individualwelcome");
        } else {
          toast.info(tError("acceptTerms"));
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          toast.error(tError("requestRuntimeError"));
        }
      }
    },
    [router, token, isChecked, create]
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invites/token/${token}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await req.json();
        if (req.ok) {
          setUserName(data.to.name);
          setUserEmail(data.to.email);
          setValue("name", data.to.name);
          setValue("email", data.to.email);
        } else if (data.errors) {
          toast.error(data.errors[0].message);
        } else {
          toast.error(tError("somethingWentWrong"));
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchUser();
  }, [token, setValue]);

  return (
    <AuthTemplate
      title={
        <div className="self-start text-3xl font-semibold leading-10 text-accent-foreground">
          <p>Welcome to ReCV.ai, </p>
          <p>{userName}</p>
        </div>
      }
      description="You've been invited by your institution to join our platform. Let's finish setting up your account."
      body={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full mt-6 gap-1.5">
            <span className="text-sm font-medium text-[#0E131D]">
              Full Name*
            </span>
            <Input
              name="name"
              type="text"
              value={userName}
              required={true}
              register={register}
              disabled={true}
              error={errors.password}
            />
          </div>
          <div className="flex flex-col w-full mt-6 gap-1.5">
            <span className="text-sm font-medium text-[#0E131D]">Email*</span>
            <Input
              name="email"
              type="email"
              value={userEmail}
              required={true}
              register={register}
              disabled={true}
              error={errors.password}
            />
          </div>
          <div className="flex flex-col w-full mt-6 gap-1.5">
            <span className="text-sm font-medium text-[#0E131D]">
              Password*
            </span>
            <Input
              name="password"
              type="password"
              placeholder={t("createPasswordPlaceholder")}
              register={register}
              required={true}
              error={errors.password}
            />
          </div>
          <div className="flex flex-col w-full mt-2">
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
                  I agree to the{" "}
                  <a href="#" className="underline text-[#0E1221]">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline text-[#0E1221]">
                    Privacy Policy
                  </a>
                </label>
              }
            />
          </div>
          <div className="flex flex-col gap-2 mt-6 w-full font-semibold">
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </div>
          <div className="flex gap-1 justify-center mt-4 w-full text-sm">
            <p className="text-secondary-foreground">
              Already have an account?{" "}
            </p>
            <Link href="/login" className="text-primary">
              Log in
            </Link>
          </div>
        </form>
      }
    />
  );
}
