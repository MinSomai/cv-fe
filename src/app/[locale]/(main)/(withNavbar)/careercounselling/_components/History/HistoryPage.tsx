import React from "react";

import { useAuth } from "@/providers/Auth";
import { Consultation } from "../../page";
import Header from "../CareerCounsellingHeader";
import HistoryComponent from "./HistoryComponent";

export default function CareerCounsellingHistoryPage({
  consultations,
  pageRender,
}: {
  consultations?: Consultation[];
  pageRender: () => void;
}) {
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <div className="flex flex-col h-full w-full">
      <Header isExistInterview={true} />
      <div className="flex flex-col px-8 gap-4 overflow-auto custom-scrollbar">
        {consultations?.map((c, index) => (
          <HistoryComponent
            id={c.id}
            title={c.title}
            interviewStatus={c.interviewStatus}
            reportStatus={c.reportStatus}
            interviewer={c.interviewer}
            interviewDate={c.interviewDate}
            careerStage={c.careerStage}
            educationLevel={c.educationLevel}
            recommendations={c.recommendations}
            careerPathways={c.careerPathways}
            key={index}
            pageRender={pageRender}
          />
        ))}
      </div>
    </div>
  );
}
