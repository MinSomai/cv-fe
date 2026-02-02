"use client";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import Image from "next/image";
import { Trash2, Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/Button";
import { PDFDownloadButton } from "./PDFViewer";
import CircularProgress from "./CircularProgress";
import InterviewGeneral from "./InterviewGeneral";
import InterviewDetailed from "./InterviewDetailed";
import { useAuth } from "@/providers/Auth";
import { rest } from "@/lib/rest";
import { InterviewReport } from "@/utils/types";

import { format, parseISO } from "date-fns";
import Loading from "@/components/Loading";
import { getPlanStatus } from "@/lib/utils";
import { User } from "@/payload-types";
import { toast } from "sonner";

export default function InterviewSummary({
  interviewId,
}: {
  interviewId: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const tError = useTranslations("errors");
  const [activeTab, setActiveTab] = useState<"general" | "detailed">("general");
  const [interviewReport, setInterview] = useState<InterviewReport | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleClickDetailed = () => {
    if (getPlanStatus(user as User).includes("free")) {
      toast.info(tError("upgradePlanDetailedReports"));
    } else {
      setActiveTab("detailed");
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/analytics/${interviewId}`,
          {},
          { method: "GET" }
        );
        setInterview(response);
      } catch (error) {
        console.error("Failed to fetch interview analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [interviewId]);

  if (isLoading) return <Loading />;
  if (!interviewReport) return <></>;

  const interviewDate = parseISO(interviewReport.interview.createdAt as string);

  const formattedDate = format(interviewDate, "MMMM d, yyyy");

  const formattedTime = format(interviewDate, "h:mm a");

  return (
    <div className="flex h-full">
      <div className="px-6 py-6 overflow-auto custom-scrollbar">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <CircularProgress
              value={interviewReport.analytics?.summary?.overallScore as number}
            />
            <div>
              <h1 className="text-2xl font-semibold text-[#344054]">
                Interview summary
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#667085]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 stroke-blue-600" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 stroke-blue-600" />
                  <span>{formattedTime}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="rounded-full bg-gray-50 px-2 py-1 border flex flex-row gap-1 items-center border-gray-200 text-[#344054]">
                  <div className="w-4 h-4">
                    <Image
                      className="w-full h-full rounded-full border border-black border-opacity-[8%]"
                      src={
                        interviewReport.interviewee.avatar || "/users/user.png"
                      }
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <span>{interviewReport.interviewee.name}</span>
                </span>
                <span className="rounded-full bg-gray-50 px-2 py-1 border border-gray-200 text-[#344054]">
                  <span className="mr-1">🏅</span>
                  {interviewReport.interview.level}
                </span>
                {(interviewReport.interview.focus?.length as number) > 0 && (
                  <span className="rounded-full bg-gray-50 px-2 py-1 border border-gray-200 text-[#344054]">
                    <span className="mr-1">💬</span>
                    {interviewReport.interview.focus?.[0]}
                    {(interviewReport.interview.focus?.length as number) >
                      1 && (
                      <span className="rounded-full bg-gray-50 border border-gray-200 text-[#344054] px-2 py-1 ml-1">
                        {`+${
                          (interviewReport.interview.focus?.length as number) -
                          1
                        }`}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="flex justify-center items-center h-10 w-10 p-0"
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <PDFDownloadButton />
            <Button
              type="button"
              onClick={() => router.push("/interviewsetup/create")}
            >
              + New Interview
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-start gap-2 px-3 py-2">
            <button
              className={`w-24 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-white text-[#344054] shadow-sm"
                  : "text-[#667085] hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`w-24 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "detailed"
                  ? "bg-white text-[#344054] shadow-sm"
                  : "text-[#667085] hover:bg-gray-50"
              }`}
              onClick={handleClickDetailed}
            >
              Detailed
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "general" ? (
            <InterviewGeneral interviewReport={interviewReport} />
          ) : (
            <InterviewDetailed
              interviewReport={interviewReport}
              interviewId={interviewId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
