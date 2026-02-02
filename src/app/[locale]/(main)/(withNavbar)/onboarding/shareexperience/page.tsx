"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { OnboardingTemplate } from "../_components/OnboardingTemplate";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { useAuth } from "@/providers/Auth";
import { rest } from "@/lib/rest";

import FileUpload from "@/components/FileUpload";

const UploadExperience: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existedFile, setExistedFile] = useState<Object | null>(null);
  const [fileName, setFileName] = useState<string | undefined | null>("");
  const router = useRouter();
  const { user, fetchMe } = useAuth();
  const t = useTranslations("onboarding.shareExperience");
  const tError = useTranslations("errors");
  const tCommon = useTranslations("common");

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<{
    cv: File | null;
  }>({
    defaultValues: {
      cv: null,
    },
  });

  const handleFileUpload = (file: File) => {
    if (file.size <= 25 * 1024 * 1024) {
      // 25MB in bytes
      setUploadedFile(file);
      setFileName(file.name);
    } else {
      toast.message(t("fileSizeExceeded"));
    }
  };

  const handleBackClick = () => {
    router.push("/onboarding/careerrole");
  };

  const handleSkipClick = useCallback(() => {
    router.push("/onboarding/interviewchallenge");
  }, [router]);

  const onSubmit = useCallback(async () => {
    try {
      if (existedFile && !uploadedFile) {
        handleSkipClick();
      } else {
        if (!uploadedFile) {
          toast.error(t("uploadFile"));
          return;
        }

        const formData = new FormData();
        formData.append("file", uploadedFile);

        const fileUploadReq = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/documents`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const uploadedFileId = await fileUploadReq.json();

        if (fileUploadReq.ok) {
          const req = await rest(
            `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
            {
              onboarding: {
                cv: uploadedFileId.doc.id,
              },
            },
            {
              method: "POST",
            }
          );

          toast.success(t("uploadSuccess"));
          await fetchMe();
          router.push("/onboarding/interviewchallenge");
        } else if (uploadedFileId.errors) {
          toast.error(uploadedFileId.errors[0].message);
        } else {
          toast.error(t("somethingWentWrong"));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error(tError("requestRuntimeError"));
      }
    }
  }, [uploadedFile, existedFile, fetchMe, handleSkipClick, router]);

  useEffect(() => {
    let cvField = user?.onboarding?.cv;
    if (cvField && typeof cvField === "object" && "filename" in cvField) {
      setExistedFile(cvField);
      setFileName(cvField.displayName);
    }
  }, [user?.onboarding?.cv]);
  return (
    <OnboardingTemplate
      headerTitle={t("title")}
      headerSubTitle={t("subtitle")}
      bodyTitle={t("bodyTitle")}
      bodyTitleClassName="lg:mt-[171px] md:mt-[100px] mt-[100px]"
      handleBackClick={handleBackClick}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-full"
      >
        <div className="flex flex-col justify-center w-full gap-12">
          <FileUpload
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            existedFile={existedFile}
            fileName={fileName}
            acceptFileTypes="application/pdf"
            description={t("maxSize")}
            className="md:px-5 md:mt-10 min-h-[290px] w-[594px]"
          />
          <div className="flex gap-4 items-center justify-center font-semibold">
            <Button type="submit" variant="default">
              {tCommon("continue")}
            </Button>
            <Button
              type="button"
              onClick={handleSkipClick}
              variant="secondary"
              className="bg-gray-300 bg-opacity-20 text-accent-foreground"
            >
              {t("skipForNow")}
            </Button>
          </div>
        </div>
      </form>
    </OnboardingTemplate>
  );
};
export default UploadExperience;
