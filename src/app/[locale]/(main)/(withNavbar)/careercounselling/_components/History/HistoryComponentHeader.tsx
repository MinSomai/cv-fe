import React from "react";
import { useRouter } from "@/lib/navigation";
import {
  CircleCheck,
  Calendar,
  Clock,
  AudioLines,
  Play,
  RefreshCw,
  EllipsisVertical,
  CircleAlert,
  Trash2,
  Loader2,
  BookOpen,
} from "lucide-react";
import { rest } from "@/lib/rest";

import { Button } from "@/components/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/Dropdown/DropdownMenu";
import Chip from "@/components/Chip";
import { useTranslations } from "next-intl";

export default function HistoryComopnentHeader({
  id,
  title,
  interviewStatus,
  reportStatus,
  interviewDate,
  interviewType,
  handleContinueClick,
  handleRegenerateReport,
  handleDeleteModal,
}: {
  id: string;
  title: string;
  interviewStatus: string;
  reportStatus: string;
  interviewDate: string;
  interviewType: string;
  handleContinueClick: () => void;
  handleRegenerateReport: () => void;
  handleDeleteModal: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("history");
  const tCommon = useTranslations("common");
  const handleViewReportClick = () => {
    if (interviewType === "careercounselling") {
      router.push(`/careerreport?id=${id}`);
    } else {
      router.push(`/interviewreport?id=${id}`);
    }
  };

  const handleRetakeClick = async () => {
    const res = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/check-plan-status?interviewType=${interviewType}`,
      {},
      { method: "GET" }
    );

    if (res.status === "success") {
      router.push(`/interview/${id}?type=${interviewType}`);
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-row gap-4">
          <span className="text-[#414651] font-semibold text-base">
            {title}
          </span>
          <div className="flex">
            <Chip
              icon={
                interviewStatus === "Completed" ? (
                  <CircleCheck className="text-[#00A37F]" size={14} />
                ) : interviewStatus === "In Progress" ? (
                  <AudioLines className="text-primary" size={14} />
                ) : interviewStatus === "Not Started" ? (
                  <Play className="text-[#B14608]" size={14} />
                ) : (
                  <CircleAlert className="text-[#B42318]" size={14} />
                )
              }
              label={interviewStatus}
              variant={
                interviewStatus === "Completed"
                  ? "secondary"
                  : interviewStatus === "Not Started"
                  ? "destructive"
                  : interviewStatus === "In Progress"
                  ? "primary"
                  : "accent"
              }
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-1 items-center text-[#414651] text-xs">
            <Calendar size={12} className="text-primary" />
            {interviewDate &&
              new Date(interviewDate).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
          </div>
          <div className="flex flex-row gap-1 items-center text-[#414651] text-xs">
            <Clock size={12} className="text-primary" />
            {interviewDate &&
              new Date(interviewDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
          </div>
        </div>
      </div>
      {interviewStatus !== "In Progress" && (
        <div className="flex flex-row gap-4 items-center">
          {interviewStatus === "Completed" && (
            <div
              className="flex flex-row gap-2 items-center text-secondary-foreground text-sm font-semibold hover:text-accent-foreground cursor-pointer"
              onClick={handleRetakeClick}
            >
              <RefreshCw size={20} />
              {interviewType === "careercounselling"
                ? t("retakeConsultation")
                : t("retakeInterview")}
            </div>
          )}
          {interviewStatus !== "Completed" ? (
            <Button
              variant="outline"
              className="text-[#344054] text-sm font-semibold shadow-none border-[#D0D5DD]"
              onClick={handleContinueClick}
            >
              {interviewType === "careercounselling"
                ? t("continueToConsultation")
                : t("continueToInterview")}
            </Button>
          ) : reportStatus === "Completed" ? (
            <Button
              variant="outline"
              className="text-[#344054] text-sm font-semibold shadow-none border-[#D0D5DD]"
              onClick={handleViewReportClick}
            >
              {t("viewReport")}
            </Button>
          ) : (
            <span className="flex flex-row gap-1 text-[#344054] text-sm font-semibold items-center">
              {reportStatus === "Failed" ? (
                <CircleAlert className="text-[#B42318]" size={20} />
              ) : reportStatus === "Generating" ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                ""
              )}
              {t("report") + " " + reportStatus}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row items-center">
              <EllipsisVertical
                color="#A4A7AE"
                className="hover:bg-gray-100 rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="inter">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent DropdownMenu from intercepting the click event
                  handleRegenerateReport();
                }}
              >
                <span className="flex flex-row gap-2 justify-center items-center">
                  <BookOpen size={16} />
                  {t("regenerateReport")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent DropdownMenu from intercepting the click event
                  handleDeleteModal(); // Trigger the modal open
                }}
              >
                <span className="flex flex-row gap-2 justify-center items-center text-[#D92D20]">
                  <Trash2 size={16} color="#D92D20" />
                  {tCommon("delete")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
