import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { rest } from "@/lib/rest";
import { Language } from "@/utils/types";
import { LanguageSelector } from "@/components/Dropdown/LanguageSelector";
import { getLanguageOptions } from "@/utils/data";

import FileUpload from "@/components/FileUpload";
import { LocaleSwitcher } from "@/components/Dropdown";

interface FormData {
  name: string;
  email: string;
  phoneNumber?: string | null;
  avatar?: File | null;
  language?: Language;
}

export default function MyDetailsTab() {
  const t = useTranslations("settings.myDetailsTab");
  const tCommon = useTranslations("common");
  const tError = useTranslations("errors");
  const { user, fetchMe } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existedFile, setExistedFile] = useState<Object | null>(null);
  const [fileName, setFileName] = useState<string | undefined | null>("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>("");
  const [isSaved, setIsSaved] = useState(false);
  const [defaultPhoneLocation, setDefaultPhoneLocation] = useState("");
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [language, setLanguage] = useState<Language>({
    id: "",
    label: "en",
    key: "gb",
    value: "English",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const handleCancel = () => {
    setIsSaved((prev) => !prev);
  };

  const handleFileUpload = (file: File) => {
    if (file.size <= 25 * 1024 * 1024) {
      // 25MB in bytes
      setUploadedFile(file);
      setFileName(file.name);
    } else {
      toast.message(tError("fileSizeExceeded"));
    }
  };

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  };

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const requestBody: {
          name: string;
          email: string;
          phone?: string;
          picture?: string;
          language?: string;
        } = {
          name: data.name,
          email: data.email,
        };

        if (data.phoneNumber) {
          requestBody.phone = data.phoneNumber;
        }

        if (data.avatar) {
          const formData = new FormData();
          formData.append("file", data.avatar);
          const fileUploadReq = await fetch(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/images`,
            {
              method: "POST",
              credentials: "include",
              body: formData,
            }
          );
          const fileUploadRes = await fileUploadReq.json();
          requestBody.picture =
            process.env.NEXT_PUBLIC_PAYLOAD_URL +
            "/api/images/file/" +
            fileUploadRes.doc.filename;
        }

        if (data.language) {
          requestBody.language = data.language.label;
        }

        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
          requestBody,
          {
            method: "POST",
          }
        );
        await fetchMe();
        toast.success(t("userInfoUpdated"));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          toast.error(t("requestError"));
        }
      }
    },
    [fetchMe, t]
  );

  useEffect(() => {
    setValue("phoneNumber", phoneNumber);
    setValue("avatar", uploadedFile);
    setValue("language", language);
  }, [phoneNumber, uploadedFile, language, setValue]);

  useEffect(() => {
    if (user) {
      const userLanguage = languageOptions.find(
        (l) => l.label === user.language
      );

      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phoneNumber", user.phone);
      setValue("language", userLanguage);

      if (userLanguage) {
        setLanguage(userLanguage);
      }
      setUploadedFile(null);
      if (user.phone) setPhoneNumber(user.phone);
      else setDefaultPhoneLocation("us");
    }
  }, [user, isSaved, languageOptions, setValue]);

  useEffect(() => {
    getLanguageOptions().then((options) => {
      setLanguageOptions(options);
    });
  }, []);

  return (
    <div className="flex flex-row gap-8 px-[6px]">
      <div className="flex flex-col w-[400px]">
        <span className="font-semibold text-sm leading-5 text-[#0E131D]">
          {t("personalInfo")}
        </span>
        <span className="text-sm leading-5 text-secondary-foreground">
          {t("personalInfoDescription")}
        </span>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="border rounded-t-xl p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[#0E131D]">
                {t("fullName")} <span className="text-primary">*</span>
              </span>
              <Input
                name="name"
                type="text"
                register={register}
                required={true}
                error={errors.name}
              />
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col flex-1 gap-1.5">
                <span className="text-sm font-medium text-[#0E131D]">
                  {t("emailAddress")} <span className="text-primary">*</span>
                </span>
                <Input
                  name="email"
                  type="email"
                  register={register}
                  required={true}
                  icon={<Mail size={20} className="text-[#717680]" />}
                  error={errors.email}
                  iconPosition="left"
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col flex-1 gap-1.5">
                <label className="text-sm font-medium text-[#0E131D]">
                  {t("phoneNumber")}
                </label>
                <div className="w-full">
                  <PhoneInput
                    placeholder={t("phoneNumber")}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    country={defaultPhoneLocation}
                    inputStyle={{
                      width: "100%",
                      height: "44px",
                      borderRadius: "8px",
                      boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    }}
                    buttonStyle={{
                      height: "44px",
                      boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    }}
                  />
                </div>
                <span className="text-sm leading-5 text-secondary-foreground">
                  {t("phoneNumberHint")}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-6">
              <div className="w-20 h-20">
                <Image
                  src={user?.picture || "/users/user.png"}
                  alt="User Avatar"
                  className="w-full h-full rounded-full border border-black border-opacity-[8%]"
                  width={80}
                  height={80}
                  unoptimized
                />
              </div>
              <FileUpload
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                existedFile={existedFile}
                acceptFileTypes="image/*"
                fileName={fileName}
                description={t("fileUploadDescription")}
                className="flex-1 w-full h-[120px] border rounded-xl bg-white"
              />
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-sm font-medium text-[#0E131D]">
                  {t("websiteLanguage")}
                </span>
                <LocaleSwitcher />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-sm font-medium text-[#0E131D]">
                  {t("interviewLanguage")}
                </span>
                <LanguageSelector
                  language={language}
                  languageOptions={languageOptions}
                  onSelectLanguage={handleLanguageSelect}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-b-xl py-4">
          <div className="flex flex-row px-6 items-end justify-end">
            <div className="flex flex-row gap-3">
              <Button
                type="button"
                variant="secondary"
                className="text-secondary-foreground font-semibold bg-white border hover:bg-[#FAFAFA] hover:text-secondary-foreground"
                onClick={handleCancel}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" className="font-semibold">
                {t("saveChanges")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
