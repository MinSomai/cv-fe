import React, { useState } from "react";
import { useRouter } from "@/lib/navigation";
import Image from "next/image";

import { useAuth } from "@/providers/Auth";
import Chip from "@/components/Chip";
import { CircleUser } from "lucide-react";

import { cn } from "@/lib/utils";
import { BriefCase, Passport } from "@/components/Icons/Icons";
import { Consultation } from "../../page";
import { rest } from "@/lib/rest";
import { toast } from "sonner";

import HistoryComopnentHeader from "./HistoryComponentHeader";
import DeleteConsultationModal from "../Create/Modal/DeleteConsultationModal";
import { useTranslations } from "next-intl";

export default function HistoryComponent({
  id,
  title,
  interviewStatus,
  reportStatus,
  interviewDate,
  interviewer,
  careerStage,
  educationLevel,
  recommendations,
  careerPathways,
  pageRender,
}: Consultation & { pageRender: () => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const tError = useTranslations("errors");
  const t = useTranslations("history");
  const [isDeleteConsultationModalOpen, setIsDeleteConsultationModalOpen] =
    useState(false);
  const [deleteConsultation, setDeleteConsulation] = useState<string>("");
  const [consultationReportStatus, setConsultationReportStatus] =
    useState(reportStatus);

  const handleContinueClick = () => {
    router.push(`/careercounselling/create?id=${id}&type=careercounselling`);
  };

  const handleRegenerateReportClick = async () => {
    try {
      setConsultationReportStatus("Generating");
      const res = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${id}`,
        {
          status: "Completed",
        },
        {
          method: "PATCH",
        }
      );
      setConsultationReportStatus(res.reportReady);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(tError("somethingWentWrong"));
      }
    }
  };

  const handleDeleteConsultationModal = async () => {
    let localData = localStorage.getItem(user?.id || "");
    let parsedData = localData ? JSON.parse(localData) : null;
    let isDeleteConsulationModalOpen = parsedData?.deleteConsultationModalOpen;
    if (
      isDeleteConsulationModalOpen !== undefined &&
      !isDeleteConsulationModalOpen
    ) {
      try {
        await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${id}`,
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
      setDeleteConsulation(id);
      setTimeout(() => {
        setIsDeleteConsultationModalOpen(true);
      }, 0);
    }
  };

  const CareerPathwayChip = ({ value }: { value: number }) => {
    return (
      <Chip
        variant={
          value >= 75
            ? "secondary"
            : value >= 50 && value < 75
            ? "destructive"
            : "accent"
        }
        label={value + "%"}
        className={cn(
          "rounded-full",
          { "border border-[#ABEFC6]": value >= 75 },
          {
            "border border-[#FEDF89]": value >= 50 && value < 75,
          },
          { "border border-[#FECDCA]": value < 50 }
        )}
      />
    );
  };

  return (
    <div className="flex flex-col p-4 gap-6 border border-[#F2F2F2] rounded-xl">
      <div className="flex flex-col gap-4">
        <HistoryComopnentHeader
          id={id}
          title={title}
          interviewStatus={interviewStatus}
          reportStatus={consultationReportStatus}
          interviewDate={interviewDate}
          interviewType="careercounselling"
          handleContinueClick={handleContinueClick}
          handleRegenerateReport={handleRegenerateReportClick}
          handleDeleteModal={handleDeleteConsultationModal}
        />
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <CircleUser size={16} className="text-primary" strokeWidth={1} />
            <span className="text-[#535862] text-sm suisse-intl-regular">
              {t("aiConsultant")}
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
              {interviewer?.name} {/* Replace with interviewer's name */}
            </span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4">
              <BriefCase colorful={true} />
            </div>
            <span className="text-[#535862] text-sm suisse-intl-regular">
              {t("careerStage")}
            </span>
            <span className="flex flex-row gap-3 text-[#181D27] font-medium text-sm">
              {careerStage}
            </span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4">
              <Passport colorful={true} />
            </div>
            <span className="text-[#535862] text-sm suisse-intl-regular">
              {t("highestLevelOfEducation")}
            </span>
            <span className="flex flex-row gap-3 text-[#181D27] font-medium text-sm items-center">
              {educationLevel}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[70%_28%] gap-[2%]">
        <div className="flex flex-col gap-2">
          <span className="text-black text-sm font-medium">
            {t("recommendations")}
          </span>
          {typeof recommendations === "string" ? (
            <span className="text-[#535862] text-sm">{recommendations}</span>
          ) : (
            recommendations.map((rec, index) => (
              <span key={index} className="text-[#535862] text-sm">
                {rec}
              </span>
            ))
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm text-secondary-foreground">
          <span className="text-black text-sm font-medium">
            {t("careerPathwaysMatch")}
          </span>
          {typeof careerPathways === "object" ? (
            <div className="flex flex-col gap-1.5">
              <span className="flex flex-row justify-between items-center">
                <span>{t("organizationalDevelopmentConsultant")}</span>
                {careerPathways?.org && (
                  <CareerPathwayChip value={careerPathways.org} />
                )}
              </span>
              <span className="flex flex-row justify-between items-center">
                <span>{t("hrBusinessPartner")}</span>
                {careerPathways?.hr && (
                  <CareerPathwayChip value={careerPathways.hr} />
                )}
              </span>
              <span className="flex flex-row justify-between items-center">
                <span>{t("learningDevelopmentManager")}</span>
                {careerPathways?.manager && (
                  <CareerPathwayChip value={careerPathways.manager} />
                )}
              </span>
            </div>
          ) : (
            careerPathways
          )}
        </div>
      </div>
      <DeleteConsultationModal
        isModalOpen={isDeleteConsultationModalOpen}
        setIsModalOpen={setIsDeleteConsultationModalOpen}
        deleteConsultation={deleteConsultation}
        pageRenderOperation={pageRender}
      />
    </div>
  );
}
