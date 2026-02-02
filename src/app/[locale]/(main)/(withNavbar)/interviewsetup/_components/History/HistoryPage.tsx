import React from "react";

import { useAuth } from "@/providers/Auth";
import { Interview } from "../../page";
import Header from "../InterviewSetupHeader";
import HistoryComponent from "./HistoryComponent";

export default function InterviewHistoryPage({
  interviews,
  pageRender,
}: {
  interviews?: Interview[];
  pageRender: () => void;
}) {
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <div className="flex flex-col h-full w-full">
      <Header userName={user.name} isExistInterview={true} />
      <div className="flex flex-col px-8 gap-4 overflow-auto custom-scrollbar">
        {interviews?.map((interview, index) => (
          <HistoryComponent
            key={index}
            id={interview.id}
            position={interview.position}
            interviewer={interview.interviewer}
            level={interview.level}
            categories={interview.categories}
            date={interview.date}
            status={interview.status}
            reportReady={interview.reportReady}
            keyStrengths={interview.keyStrengths}
            growthOpportunities={interview.growthOpportunities}
            pageRender={pageRender}
          />
        ))}
      </div>
    </div>
  );
}
