import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/navigation";
import { CircleUser } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/Auth";
import { cn } from "@/lib/utils";
import { BriefCase, Passport } from "@/components/Icons/Icons";
import { rest } from "@/lib/rest";
import { Interview } from "../../page";
import { toast } from "sonner";
import Chip from "@/components/Chip";
import {
  LeafIcon,
  StarIcon,
  CrownIcon,
  NiAward,
  NiCheckHand,
  NiComment,
  NiLaptopFill,
  NiRanking,
  NiScaleStars,
} from "@/components/Icons/Icons";

import HistoryComopnentHeader from "../../../careercounselling/_components/History/HistoryComponentHeader";
import DeleteInterviewModal from "../Create/Modal/DeleteInterviewModal";

export default function HistoryComponent({
  id,
  position,
  interviewer,
  level,
  categories,
  date,
  status,
  reportReady,
  keyStrengths,
  growthOpportunities,
  pageRender,
}: Interview & { pageRender: () => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const tError = useTranslations("errors");
  const t = useTranslations("history");
  const [isDeleteInterviewModalOpen, setIsDeleteInterviewModalOpen] =
    useState(false);
  const [deleteInterview, setDeleteInterview] = useState<string>("");
  const [reportStatus, setReportStatus] = useState(reportReady);

  const handleContinueClick = () => {
    router.push(`/interviewsetup/create?id=${id}&type=interview`);
  };

  const handleRegenerateReportClick = async () => {
    try {
      setReportStatus("Generating");
      const res = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${id}`,
        {
          status: "Completed",
        },
        {
          method: "PATCH",
        }
      );
      setReportStatus(res.reportReady);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(tError("somethingWentWrong"));
      }
    }
  };

  const handleDeleteInterviewModal = async () => {
    let localData = localStorage.getItem(user?.id || "");
    let parsedData = localData ? JSON.parse(localData) : null;
    let isDeleteInterviewModalOpen = parsedData?.deleteInterviewModalOpen;
    if (
      isDeleteInterviewModalOpen !== undefined &&
      !isDeleteInterviewModalOpen
    ) {
      try {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${id}`,
          {},
          {
            method: "DELETE",
          }
        );
        pageRender();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(tError("unknownError"));
        }
      }
    } else {
      setDeleteInterview(id);
      setTimeout(() => {
        setIsDeleteInterviewModalOpen(true);
      }, 0);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-6 border border-[#F2F2F2] rounded-xl">
      <div className="flex flex-col gap-4">
        <HistoryComopnentHeader
          id={id}
          title={position.level + " " + position.role}
          interviewStatus={status}
          reportStatus={reportStatus}
          interviewDate={date}
          interviewType="interview"
          handleContinueClick={handleContinueClick}
          handleRegenerateReport={handleRegenerateReportClick}
          handleDeleteModal={handleDeleteInterviewModal}
        />
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <CircleUser size={16} className="text-primary" strokeWidth={1} />
            <span className="text-[#535862] text-sm suisse-intl-regular">
              {t("aiInterviewer")}
            </span>
            <span className="flex flex-row gap-3 text-[#181D27] font-medium text-sm items-center">
              {interviewer && interviewer.photo !== "" && (
                <div className="flex items-center justify-center w-10 h-10 rounded-full">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_PAYLOAD_URL + interviewer.photo
                    }
                    alt={t("interviewerAvatar")}
                    className="w-full h-full rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
              )}
              {interviewer?.name}
            </span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4">
              <BriefCase colorful={true} />
            </div>
            <span className="text-[#535862] text-sm suisse-intl-regular">
              {t("level")}{" "}
            </span>
            <span className="flex items-center text-sm text-[#535862]">
              {level === "Newcomer" ? (
                <div className="flex flex-row gap-1 items-center">
                  <div className="w-5 h-5">
                    <LeafIcon />
                  </div>
                  <span>{level}</span>
                </div>
              ) : level === "Rising Star" ? (
                <div className="flex flex-row gap-1 items-center">
                  <div className="w-5 h-5">
                    <StarIcon />
                  </div>
                  <span>{level}</span>
                </div>
              ) : (
                <div className="flex flex-row gap-1 items-center">
                  <div className="w-5 h-5">
                    <CrownIcon />
                  </div>
                  <span>{level}</span>
                </div>
              )}
            </span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4">
              <Passport colorful={true} />
            </div>
            <span className="text-[#535862] text-sm suisse-intl-regular">
              {t("categories")}{" "}
            </span>
            <div className="flex flex-row gap-1">
              <Chip
                icon={
                  categories[0] === "Standard" ? (
                    <div className="w-4 h-4">
                      <NiRanking />
                    </div>
                  ) : categories[0] === "Behavioral" ? (
                    <div className="w-4 h-4">
                      <NiComment />
                    </div>
                  ) : categories[0] === "Leadership" ? (
                    <div className="w-4 h-4">
                      <NiAward />
                    </div>
                  ) : categories[0] === "Situational" ? (
                    <div className="w-4 h-4">
                      <NiCheckHand />
                    </div>
                  ) : categories[0] === "Salary Negotiation" ? (
                    <div className="w-4 h-4">
                      <NiScaleStars />
                    </div>
                  ) : (
                    <div className="w-4 h-4">
                      <NiLaptopFill />
                    </div>
                  )
                }
                label={categories[0]}
                className="bg-[#FAFAFA] border border-[#F2F4F7] rounded-full"
              />
              {categories.length > 1 && (
                <div title={categories.slice(1).join(", ")}>
                  <Chip
                    label={`+` + (categories.length - 1)}
                    className="bg-[#FAFAFA] border border-[#F2F4F7] rounded-full cursor-pointer hover:bg-[#F2F4F7]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteInterviewModal
        isModalOpen={isDeleteInterviewModalOpen}
        setIsModalOpen={setIsDeleteInterviewModalOpen}
        deleteInterview={deleteInterview}
        pageRenderOperation={pageRender}
      />
    </div>
  );
}
