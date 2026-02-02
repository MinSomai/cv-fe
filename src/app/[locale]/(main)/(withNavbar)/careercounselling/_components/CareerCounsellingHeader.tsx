"use client";

import React from "react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { Plus } from "lucide-react";
import { rest } from "@/lib/rest";
import { toast } from "sonner";

export default function Header({
  isExistInterview,
}: {
  isExistInterview: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("careerCounselling");

  const handleButtonClick = async () => {
    const res = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/check-plan-status?interviewType=careercounselling`,
      {},
      { method: "GET" }
    );

    console.log("👍👍👍res", res);

    if (res.status === "success") {
      router.push("/careercounselling/create");
    } else {
      toast.error(res.message);
      router.push("/settings?value=Plans");
    }
  };

  return (
    <div className="flex flex-row p-8 justify-between items-center">
      <div className="flex flex-col gap-1">
        <span className="text-[#0E131D] font-semibold text-[30px]">
          {isExistInterview ? t("historyTitle") : t("title")}
        </span>
        <span className="text-[#475467] text-base">
          {t("description")}
        </span>
      </div>
      {isExistInterview && (
        <Button type="button" variant="defaultRing" onClick={handleButtonClick}>
          <span className="flex flex-row items-center">
            <Plus className="mr-2" size={20} />
            <span className="text-sm text-center">
              {t("startConsultation")}
            </span>
          </span>
        </Button>
      )}
    </div>
  );
}
