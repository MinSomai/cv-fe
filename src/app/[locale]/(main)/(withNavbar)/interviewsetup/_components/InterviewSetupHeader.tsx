import React from "react";
import { useRouter } from "@/lib/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { useTranslations } from "next-intl";

export default function Header({
  userName,
  isExistInterview,
}: {
  userName?: string;
  isExistInterview: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("interview");
  const handleButtonClick = () => {
    router.push("/interviewsetup/create");
  };
  return (
    <div className="flex flex-row p-8 justify-between items-center">
      <div className="flex flex-col gap-1">
        <span className="text-[#0E131D] font-semibold text-[30px]">
          {!isExistInterview
            ? `${t("welcome")}, ${userName && userName}`
            : t("history")}
        </span>
        <span className="text-[#475467] text-base">
          {t("description")}
        </span>
      </div>
      {isExistInterview && (
        <Button type="button" variant="defaultRing" onClick={handleButtonClick}>
          <span className="flex flex-row items-center">
            <Plus className="mr-2" size={20} />
            <span className="text-sm text-center">{t("start")}</span>
          </span>
        </Button>
      )}
    </div>
  );
}
