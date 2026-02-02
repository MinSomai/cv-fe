"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import OverviewCard from "./Card/OverviewCard";
import Chart from "@/components/Chart";
import UserInterviewTable from "./Table/UserInterviewTable";
import UserConsultationTable from "./Table/UserConsultationTable";
import { useAuth } from "@/providers/Auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { rest } from "@/lib/rest";

interface ChartData {
  month: string;
  avgscore: number;
}

// const data = [
//   { month: "Jan", avgscore: 40 },
//   { month: "Feb", avgscore: 25 },
//   { month: "Mar", avgscore: 50 },
//   { month: "Apr", avgscore: 35 },
//   { month: "May", avgscore: 60 },
//   { month: "Jun", avgscore: 65 },
//   { month: "Jul", avgscore: 63 },
//   { month: "Aug", avgscore: 60 },
//   { month: "Sep", avgscore: 65 },
//   { month: "Oct", avgscore: 63 },
//   { month: "Nov", avgscore: 60 },
//   { month: "Dec", avgscore: 65 },
// ];

export default function UserDashboard() {
  const [interviewType, setInterviewType] = useState("Interviews");
  const { user } = useAuth();
  const t = useTranslations("dashboard");
  const [completedInterviews, setCompletedInterviews] = useState(0);
  const [avgInterviewScore, setAvgInterviewScore] = useState(0);
  const [avgInterviewMin, setAvgInterviewMin] = useState(0);
  const [avgInterviewSec, setAvgInterviewSec] = useState(0);
  const [graphData, setGraphData] = useState<ChartData[]>([]);
  const [avtInterviewScoreImprovement, setAvtInterviewScoreImprovement] =
    useState(0);
  const [avgInterviewTimeImprovement, setAvgInterviewTimeImprovement] =
    useState(0);

  const handleInterviewType = (interviewType: string) => {
    setInterviewType(interviewType);
  };

  const handlePeriodClick = async (period: string) => {
    const res = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/overview?period=${period}`,
      {},
      {
        method: "GET",
      }
    );

    setGraphData(res.graphData || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/overview?period=12 months`,
        {},
        {
          method: "GET",
        }
      );

      if (!res) return;
      setCompletedInterviews(res.completedInterviews || 0);
      setAvgInterviewScore(res.avgInterviewScore || 0);
      setAvgInterviewMin(res.avgInterviewTime.minutes || 0);
      setAvgInterviewSec(res.avgInterviewTime.seconds || 0);
      setGraphData(res.graphData || []);
      setAvgInterviewTimeImprovement(res.avgInterviewTimeImprovement || 0);
      setAvtInterviewScoreImprovement(res.avgInterviewScoreImprovement || 0);
    };
    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col gap-8 scrollbar overflow-y-auto">
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-6 w-[307px]">
          <OverviewCard
            title="Completed Interviews"
            value={
              <span className="font-semibold text-[30px] text-[#181D27] flex-1">
                {completedInterviews}
              </span>
            }
          />
          <OverviewCard
            title={t("avgInterviewScore")}
            value={
              <span className="font-semibold text-[30px] text-[#181D27] flex-1">
                {avgInterviewScore}%
              </span>
            }
            chipValue={avtInterviewScoreImprovement}
          />
          <OverviewCard
            title={t("avgInterviewTime")}
            value={
              <span className="font-semibold text-[30px] text-[#181D27] flex-1">
                {avgInterviewMin}m {avgInterviewSec}s
              </span>
            }
            chipValue={avgInterviewTimeImprovement}
          />
        </div>
        <div className="flex-1 flex flex-col bg-white rounded-[16px] p-5 pb-0 border border-[#F2F4F7]">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-[#181D27]">
              Avg Score over time
            </span>
            <div className="flex flex-row gap-1">
              <Button
                variant="ghost"
                className="text-sm text-[#717680] font-semibold border-none hover:text-[#414651] hover:bg-[#FAFAFA] shadow-none h-9 px-3 py-2"
                onClick={() => handlePeriodClick("12 months")}
              >
                12 months
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-[#717680] font-semibold border-none hover:text-[#414651] hover:bg-[#FAFAFA] shadow-none h-9 px-3 py-2"
                onClick={() => handlePeriodClick("3 months")}
              >
                3 months
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-[#717680] font-semibold border-none hover:text-[#414651] hover:bg-[#FAFAFA] shadow-none h-9 px-3 py-2"
                onClick={() => handlePeriodClick("30 days")}
              >
                30 days
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-[#717680] font-semibold border-none hover:text-[#414651] hover:bg-[#FAFAFA] shadow-none h-9 px-3 py-2"
                onClick={() => handlePeriodClick("7 days")}
              >
                7 days
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-[#717680] font-semibold border-none hover:text-[#414651] hover:bg-[#FAFAFA] shadow-none h-9 px-3 py-2"
                onClick={() => handlePeriodClick("24 hours")}
              >
                24 hours
              </Button>
            </div>
          </div>
          <Chart data={graphData} />
        </div>
      </div>
      <div className="flex flex-col border border-[#F2F4F7] rounded-2xl">
        <div className="flex flex-row py-5 px-6 justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-[#181D27]">
              Recent Activity
            </span>
            <span className="text-sm text-[#535862]">
              Keep track of your progress.
            </span>
          </div>
          <div className="flex flex-row border border-[#F2F4F7] rounded-lg">
            <Button
              className={cn(
                "rounded-r-none border-r h-full",
                interviewType === "Interviews" && "bg-[#F2F4F7]"
              )}
              variant="ghost"
              onClick={() => handleInterviewType("Interviews")}
            >
              <span
                className={cn(
                  "text-[#414651] text-sm font-semibold",
                  interviewType === "Interviews" && "text-[#252B37]"
                )}
              >
                Interviews
              </span>
            </Button>
            <Button
              className={cn(
                "rounded-l-none h-full",
                interviewType === "Consultations" && "bg-[#F2F4F7]"
              )}
              variant="ghost"
              onClick={() => handleInterviewType("Consultations")}
            >
              <span
                className={cn(
                  "text-[#414651] text-sm font-semibold",
                  interviewType === "Consultations" && "text-[#252B37]"
                )}
              >
                Consultations
              </span>
            </Button>
          </div>
        </div>
        {interviewType === "Interviews" ? (
          <UserInterviewTable />
        ) : (
          <UserConsultationTable />
        )}
      </div>
    </div>
  );
}
